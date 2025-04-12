import { signal, effect } from '@preact/signals-core'
import { PhFor } from '@elements/control-flow/For'
import { Base } from '@utils/Base'
import { createContextMethod, noTemplateTreeWalker, defineComponent, phSlotSyntax } from '@utils/Utils'
import { processAttributesForChildrenElements, renameShortcutAttributesInTemplate } from '@utils/Attributes'
import { ADD_CONST, ADD_SIGNAL, CONTEXT, Context } from './Context'

const toCamelCase = (name: string): string => name.replace(/-[a-z]/g, (m: string) => m[1].toUpperCase())

export class PhComponent extends Base {
        mount() {
                const templateElement = this.firstElementChild as HTMLTemplateElement
                if (templateElement?.tagName === 'TEMPLATE') fromTemplate(templateElement)
                else throw Error('no template element provided')
        }
}

export function fromString(template: string) {
        const templateElement = document.createElement('template')
        templateElement.outerHTML = template
        fromTemplate(templateElement)
}

export function fromTemplate(template: HTMLTemplateElement) {
        const tag = template.getAttribute('tag')
        const openShadow = template.getAttribute('open')
        const closedShadow = template.getAttribute('closed')

        if (!tag) throw Error('no tag attribute was provided')

        // @ts-ignore
        const observedAttributes = [] as string[]
        for (const a of template.content.querySelectorAll('attribute')) {
                const attribute = a.getAttribute('name')
                if (attribute !== 'null') {
                        observedAttributes.push(attribute)
                        a.remove()
                }
        }

        const ComponentClass = class extends Base {
                #shadowRoot: ShadowRoot
                #context: Context
                #disposes: any[] = []
                #onRemoveFn: () => void
                get [CONTEXT]() {
                        return this.#context
                }

                static observedAttributes = observedAttributes

                attributeChangedCallback(name, oldV, newV) {
                        const camelCased = toCamelCase(name)
                        if (this[CONTEXT] && oldV !== newV) {
                                this[CONTEXT][camelCased] = newV
                        }
                }

                constructor() {
                        super()
                        const mode = closedShadow !== null ? 'closed' : 'open'
                        this.#shadowRoot = this.attachShadow({ mode: mode })
                }

                async mount() {
                        // create context
                        if (!this[CONTEXT]) {
                                const parentContext = this.getHost()?.[CONTEXT]
                                this.#context = Context.from(parentContext)
                                this[CONTEXT][ADD_CONST]('self', this)
                        }
                        // set initial signals for attributes
                        for (const attribute of observedAttributes) {
                                const camelCased = toCamelCase(attribute)
                                this[CONTEXT][ADD_SIGNAL](camelCased, signal(this.getAttribute(attribute)))
                                this.#disposes.push(
                                        effect(() => {
                                                const value = this[CONTEXT][camelCased]
                                                if (value !== undefined && value !== null) this.setAttribute(attribute, value)
                                                else this.removeAttribute(attribute)
                                        }),
                                )
                        }

                        // @ts-ignore
                        const clonedTemplate = template.cloneNode(true).content as DocumentFragment
                        renameShortcutAttributesInTemplate(clonedTemplate)

                        // processing lifecycle and watch elements
                        const onMountElement = clonedTemplate.querySelector('script[on-mount]')
                        const onRemoveElement = clonedTemplate.querySelector('script[on-remove]')
                        const watchElements = clonedTemplate.querySelectorAll('script[watch]')
                        const onMountFunction = onMountElement
                                ? //@ts-ignore
                                  createContextMethod(this[CONTEXT], onMountElement.textContent)
                                : undefined
                        const onRemoveFunction = onRemoveElement
                                ? //@ts-ignore
                                  createContextMethod(this[CONTEXT], onRemoveElement.textContent)
                                : undefined
                        const watcherFunctions = Array.from(watchElements).map((watchElement) => {
                                const watchFn = createContextMethod(this[CONTEXT], watchElement.textContent)
                                watchElement.remove()
                                return watchFn
                        })
                        this.#onRemoveFn = onRemoveFunction
                        onMountElement?.remove()
                        onRemoveElement?.remove()

                        // replacing mustache syntax with placeholders
                        processTemplateSyntax(clonedTemplate)

                        // mount template to element
                        const root = this.#shadowRoot
                        root.append(clonedTemplate)
                        processSlots(this.#shadowRoot, this[CONTEXT])

                        // process <template each="...">
                        processForElements(root)

                        // process imports
                        await processImports(root, this[CONTEXT])

                        // run on mount function if exists
                        await onMountFunction?.()

                        // query all children for replacing functional attributes
                        const childrenDisposes = processAttributesForChildrenElements(root, this[CONTEXT])
                        this.#disposes.push(...childrenDisposes)

                        // freeze context
                        Object.freeze(this[CONTEXT])

                        for (const fn of watcherFunctions) {
                                this.#disposes.push(
                                        effect(() => {
                                                fn()
                                        }),
                                )
                        }

                        // create stylesheets
                        createStyles(root)
                }

                unmount(): void {
                        this.#onRemoveFn?.()
                        for (const d of this.#disposes) {
                                d()
                        }
                }
        }
        defineComponent(tag, ComponentClass)
}

export function processForElements(root: ShadowRoot | Element) {
        for (const template of root.querySelectorAll('template[each]')) {
                PhFor.fromTemplate(template as HTMLTemplateElement)
        }
}

export function processTemplateSyntax(root: DocumentFragment | Element) {
        const tw = noTemplateTreeWalker(root)
        while (tw.nextNode()) {
                const element = tw.currentNode as Element
                element.innerHTML = phSlotSyntax(element.innerHTML)
        }
}

export async function processImports(element: Element | DocumentFragment, context: Context) {
        await Promise.all(
                Array.from(element.querySelectorAll('import[src]')).map(async (lib) => {
                        const src = lib.getAttribute('src')
                        const imported = await import(src)
                        for (const name of lib.getAttributeNames()) {
                                const asName = lib.getAttribute(name)
                                const part = imported[toCamelCase(name)]
                                if (part) {
                                        context[ADD_CONST](asName, part)
                                }
                        }
                        return undefined
                }),
        )
}

function processSlots(root: ShadowRoot, context: Context) {
        const defaultSlot = root.querySelector('slot')
        const namedSlots = root.querySelectorAll('slot[name]') as NodeListOf<HTMLSlotElement>
        for (const slot of namedSlots) {
                const name = slot.getAttribute('name')
                context.slots[name] = signal([])
        }
        root.onslotchange = () => {
                context.slots.default.value = defaultSlot?.assignedElements()
                for (const slot of namedSlots) {
                        const name = slot.getAttribute('name')
                        if (context.slots) context.slots[name].value = slot.assignedElements()
                }
        }
}

const memoizedGlobalStylesheet = (() => {
        let cachedValue = null
        return () => {
                if (cachedValue === null) {
                        cachedValue = document.querySelector('style[global]')
                }
                return cachedValue
        }
})()

function createStyles(root: ShadowRoot) {
        const styleElement = root.querySelector('style') as HTMLStyleElement
        const globalStyle = new CSSStyleSheet()
        const baseStyle = new CSSStyleSheet()
        const customStyle = new CSSStyleSheet()
        if (!styleElement?.hasAttribute('isolated')) {
                globalStyle.replaceSync(memoizedGlobalStylesheet()?.innerHTML ?? '')
        }
        baseStyle.replaceSync(':host { display: inline-block; position: relative }')
        customStyle.replaceSync(styleElement?.textContent ?? '')
        styleElement?.remove()
        root.adoptedStyleSheets.push(globalStyle, baseStyle, customStyle)
}
