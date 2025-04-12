import { effect } from '@preact/signals-core'
import { ADD_CONST, CONTEXT, type Context } from '@elements/declarations/Context'
import { allElementsTreeWalker, createContextComputed, createContextMethod, noTemplateTreeWalker } from './Utils'

export function renameShortcutAttributesInTemplate(template: DocumentFragment) {
        const tw = allElementsTreeWalker(template)
        while (tw.nextNode()) {
                renameShortcutAttributes(tw.currentNode as Element)
        }
}

export function processAttributesForChildrenElements(root: Document | HTMLElement | ShadowRoot, context: Context) {
        const disposes = []
        const tw = noTemplateTreeWalker(root)
        while (tw.nextNode()) {
                const element = tw.currentNode as Element
                disposes.push(...processAttributes(element, context))
        }
        return disposes
}

export function renameShortcutAttributes(element: Element) {
        for (const attributeName of element.getAttributeNames()) {
                const name = attributeName
                const replacedAttributeName = AttributeMapping[name.slice(0, 3)]?.(name) ?? AttributeMapping[name[0]]?.(name)
                if (replacedAttributeName) {
                        element.setAttribute(replacedAttributeName, element.getAttribute(name))
                        element.removeAttribute(name)
                }
        }
}

export const Directives = {
        'bind:': 'bind:',
        'bool:': 'bool:',
        'on:': 'on:',
        'prop:': 'prop:',
        'spread:': 'spread:',
} as const

export const AttributeMapping = {
        '...': (name: string) => name.replace('...', 'spread:'),
        '@': (name: string) => name.replace('@', 'on:'),
        '.': (name: string) => name.replace('.', 'prop:'),
        '?': (name: string) => name.replace('?', 'bool:'),
        ':': (name: string) => name.replace(':', 'bind:'),
} as const

export function processAttributes(element: Element, context: Context) {
        const disposes: ReturnType<typeof effect>[] = []
        const attributeNames = element.getAttributeNames()
        for (const attributeName of attributeNames) {
                const attributeValue = element.getAttribute(attributeName)
                // attaching events
                const attributeExists = attributeValue && attributeValue !== ''

                if (attributeExists) {
                        // binding events
                        if (attributeName.startsWith(Directives['on:'])) {
                                const eventName = attributeName.replace(Directives['on:'], '')
                                const eventListener = createContextMethod(context, attributeValue, '$e')
                                setTimeout(() => {
                                        element.addEventListener(eventName, eventListener)
                                })
                                element.removeAttribute(attributeName)
                        }

                        // binding properties
                        if (attributeName.startsWith(Directives['bind:'])) {
                                const computed = createContextComputed(context, attributeValue)
                                const name = attributeName.replace(Directives['bind:'], '')
                                disposes.push(
                                        effect(() => {
                                                if (computed.value !== undefined && computed.value !== null)
                                                        element.setAttribute(name, computed.value as string)
                                                else element.removeAttribute(name)
                                        }),
                                )
                                element.removeAttribute(attributeName)
                        }

                        // set object as property
                        if (attributeName.startsWith(Directives['prop:'])) {
                                const name = attributeName.replace(Directives['prop:'], '')
                                const computed = createContextComputed(context, attributeValue)
                                const target = element[CONTEXT] ?? element
                                disposes.push(
                                        effect(() => {
                                                target[name] = computed.value
                                        }),
                                )
                                element.removeAttribute(attributeName)
                        }

                        // spread object as dataset
                        if (attributeName.startsWith(Directives['spread:'])) {
                                const computed = createContextComputed(context, attributeValue)
                                if (typeof computed.value === 'object') {
                                        disposes.push(
                                                effect(() => {
                                                        for (const [k, v] of Object.entries(computed.value)) {
                                                                // @ts-ignore
                                                                element.dataset[k] = v
                                                        }
                                                }),
                                        )
                                        element.removeAttribute(attributeName)
                                } else {
                                        throw Error(`the value of "${attributeValue}" is no object`)
                                }
                                element.removeAttribute(attributeName)
                        }

                        // binding of bool attributes
                        if (attributeName.startsWith(Directives['bool:'])) {
                                const name = attributeName.replace(Directives['bool:'], '')
                                const computed = createContextComputed(context, attributeValue)
                                disposes.push(
                                        effect(() => {
                                                if (computed.value) element.toggleAttribute(name, true)
                                                else element.toggleAttribute(name, false)
                                        }),
                                )
                                element.removeAttribute(attributeName)
                        }

                        // creating element refs
                        if (attributeName === 'ref') {
                                const name = attributeValue
                                context[ADD_CONST](name, element)
                                element.removeAttribute(attributeName)
                        }
                }
        }
        return disposes
}
