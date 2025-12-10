import { effect } from '@preact/signals-core'
import { ADD_CONST, CONTEXT, type Context } from '@elements/declarations/Context'
import { allElementsTreeWalker, createContextComputed, createContextMethod, noTemplateTreeWalker, toCamelCase } from './Utils'

export const //
    Directives = {
        'bind:': 'bind:',
        'bool:': 'bool:',
        'on:': 'on:',
        'prop:': 'prop:',
        'ph:': 'ph:',
    } as const,
    AttributeMapping = {
        '@': (name: string) => name.replace('@', Directives['on:']),
        '.': (name: string) => name.replace('.', Directives['prop:']),
        '?': (name: string) => name.replace('?', Directives['bool:']),
        ':': (name: string) => name.replace(':', Directives['bind:']),
        '*': (name: string) => name.replace('*', Directives['ph:']),
    } as const,
    renameShortcutAttributesInTemplate = (template: DocumentFragment) => {
        const tw = allElementsTreeWalker(template)
        while (tw.nextNode()) {
            renameShortcutAttributes(tw.currentNode as Element)
        }
    },
    processAttributesForChildrenElements = (root: Document | HTMLElement | ShadowRoot, context: Context) => {
        const //
            disposes = [],
            tw = noTemplateTreeWalker(root)
        while (tw.nextNode()) {
            const element = tw.currentNode as Element
            disposes.push(...processAttributes(element, context))
        }
        return disposes
    },
    renameShortcutAttributes = (element: Element) => {
        for (const attributeName of element.getAttributeNames()) {
            const //
                name = attributeName,
                replacedAttributeName = AttributeMapping[name[0]]?.(name)
            if (replacedAttributeName) {
                element.setAttribute(replacedAttributeName, element.getAttribute(name))
                element.removeAttribute(name)
            }
        }
    },
    processAttributes = (element: Element, context: Context) => {
        const //
            disposes: ReturnType<typeof effect>[] = [],
            attributeNames = element.getAttributeNames()
        for (const attributeName of attributeNames) {
            const //
                attributeValue = element.getAttribute(attributeName),
                attributeExists = attributeValue && attributeValue !== ''

            if (attributeExists) {
                // binding events
                if (attributeName.startsWith(Directives['on:'])) {
                    const //
                        eventName = attributeName.replace(Directives['on:'], ''),
                        eventListener = createContextMethod(context, attributeValue, '$e')
                    setTimeout(() => {
                        element.addEventListener(eventName, eventListener)
                    })
                    element.removeAttribute(attributeName)
                }

                // binding properties
                if (attributeName.startsWith(Directives['bind:'])) {
                    const //
                        computed = createContextComputed(context, attributeValue),
                        name = attributeName.replace(Directives['bind:'], '')
                    disposes.push(
                        effect(() => {
                            if (computed.value !== undefined && computed.value !== null) element.setAttribute(name, computed.value as string)
                            else element.removeAttribute(name)
                        }),
                    )
                    element.removeAttribute(attributeName)
                }

                // set object as property
                if (attributeName.startsWith(Directives['prop:'])) {
                    const //
                        name = toCamelCase(attributeName.replace(Directives['prop:'], '')),
                        computed = createContextComputed(context, attributeValue)
                    disposes.push(
                        effect(() => {
                            const target = element[CONTEXT] ?? element
                            if (target[name] !== computed.value) target[name] = computed.value
                        }),
                    )
                    element.removeAttribute(attributeName)
                }

                // binding of bool attributes
                if (attributeName.startsWith(Directives['bool:'])) {
                    const //
                        name = attributeName.replace(Directives['bool:'], ''),
                        computed = createContextComputed(context, attributeValue)
                    disposes.push(
                        effect(() => {
                            if (computed.value) element.toggleAttribute(name, true)
                            else element.toggleAttribute(name, false)
                        }),
                    )
                    element.removeAttribute(attributeName)
                }

                if (attributeName.startsWith(Directives['ph:'])) {
                    const name = attributeName.replace(Directives['ph:'], '')
                    if (name === 'if') {
                        const //
                            computed = createContextComputed(context, attributeValue),
                            comment = document.createComment('ph-if')
                        element.before(comment)
                        setTimeout(() => {
                            disposes.push(
                                effect(() => {
                                    if (computed.value) comment.after(element)
                                    else element.remove()
                                }),
                            )
                        })
                    } else if (name === 'show') {
                        const //
                            computed = createContextComputed(context, attributeValue),
                            displayValue = (element as HTMLElement).style.display
                        disposes.push(
                            effect(() => {
                                if (computed.value) (element as HTMLElement).style.display = displayValue
                                else (element as HTMLElement).style.display = 'none'
                            }),
                        )
                    }
                    element.removeAttribute(attributeName)
                }
            }
        }
        return disposes
    }
