import { signal, effect, computed } from '@preact/signals-core'
import { PhFor } from '@elements/control-flow/For'
import { Base } from '@utils/Base'
import { createContextMethod, noTemplateTreeWalker, defineComponent, phSlotSyntax, toCamelCase } from '@utils/Utils'
import { processAttributesForChildrenElements, renameShortcutAttributesInTemplate } from '@utils/Attributes'
import { ADD_CONST, ADD_SIGNAL, ADD_SLOT, CONTEXT, Context } from './Context'
import { READY } from './Store'

type ImportMap = {
    default?: string
    '*'?: string | undefined
    named?: (string | [string, string])[]
}

const //
    processSlots = (root: ShadowRoot, context: Context) => {
        let defaultSlot: HTMLSlotElement | undefined = undefined,
            namedSlots: HTMLSlotElement[] = []
        root.querySelectorAll('slot').forEach((s) => {
            if (s.hasAttribute('name')) namedSlots.push(s)
            else defaultSlot ??= s
        })
        for (const slot of namedSlots) {
            const name = slot.getAttribute('name')
            context[ADD_SLOT](name)
        }
        root.onslotchange = () => {
            context.slots.default = defaultSlot?.assignedElements() ?? []
            for (const slot of namedSlots) {
                const name = slot.getAttribute('name')
                if (context.slots) context.slots[name] = slot.assignedElements()
            }
        }
    },
    processRefs = (root: DocumentFragment, context: Context) => {
        for (const element of root.querySelectorAll('[ph\\:ref]')) {
            const name = element.getAttribute('ph:ref')
            context[ADD_CONST](name, element)
            element.removeAttribute('ph:ref')
        }
    },
    memoizedGlobalStylesheet = (() => {
        let cachedValue = null
        return () => {
            if (cachedValue === null) {
                cachedValue = document.querySelector('style[global]')
            }
            return cachedValue
        }
    })(),
    createStyles = (root: ShadowRoot, isInline = false) => {
        const //
            styleElement = root.querySelector('style') as HTMLStyleElement,
            globalStyle = new CSSStyleSheet(),
            baseStyle = new CSSStyleSheet(),
            customStyle = new CSSStyleSheet()
        if (!styleElement?.hasAttribute('isolated')) {
            globalStyle.replaceSync(memoizedGlobalStylesheet()?.innerHTML ?? '')
        }
        baseStyle.replaceSync(`:host { display: ${isInline ? 'inline-block' : 'block'}; ${isInline ? 'position: relative' : ''} }`)
        customStyle.replaceSync(styleElement?.textContent ?? '')
        styleElement?.remove()
        root.adoptedStyleSheets.push(globalStyle, baseStyle, customStyle)
    },
    constructCustomElement = (
        tag: string,
        spec: {
            template: HTMLTemplateElement
            attributes?: string[]
            properties?: string[]
            inline?: boolean
            closedShadowRoot?: boolean
            stores?: string[]
        },
    ) => {
        if (!tag) throw Error('no tag attribute was provided')
        if (!spec.template) throw Error('no template provided for component ' + tag)

        const //
            template = spec.template.cloneNode(true) as HTMLTemplateElement,
            observedAttributes = spec.attributes ?? [],
            observedProperties = spec.properties ?? [],
            importPromises = processImports(template.content)

        const ComponentClass = class extends Base {
            #shadowRoot: ShadowRoot
            #disposes: any[] = []
            #onRemoveFn: () => void

            #context: Context
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
                const mode = spec.closedShadowRoot ? 'closed' : 'open'
                this.#shadowRoot = this.attachShadow({ mode: mode })
                // create context
                if (!this[CONTEXT]) {
                    this.#context = new Context()
                    Object.setPrototypeOf(this[CONTEXT], document[CONTEXT])
                    this[CONTEXT][ADD_CONST]('self', this)
                    this[CONTEXT][ADD_CONST]('root', this.#shadowRoot)
                }
                // set initial signals for properties
                for (const property of observedProperties) {
                    if (property) {
                        this[CONTEXT][ADD_SIGNAL](property, signal(undefined))
                    }
                }
            }

            async mount() {
                // set initial signals for attributes
                for (const attribute of observedAttributes) {
                    if (attribute) {
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
                }

                const //
                    // @ts-ignore
                    clonedTemplate = template.cloneNode(true).content as DocumentFragment,
                    // processing lifecycle and watch elements
                    onMountElement = clonedTemplate.querySelector('script[on-mount]'),
                    onRemoveElement = clonedTemplate.querySelector('script[on-remove]'),
                    watchElements = clonedTemplate.querySelectorAll('script[watch]'),
                    onMountFunction = onMountElement
                        ? //@ts-ignore
                          createContextMethod(this[CONTEXT], onMountElement.textContent)
                        : undefined,
                    onRemoveFunction = onRemoveElement
                        ? //@ts-ignore
                          createContextMethod(this[CONTEXT], onRemoveElement.textContent)
                        : undefined,
                    watcherFunctions = Array.from(watchElements).map((watchElement) => {
                        const watchFn = createContextMethod(this[CONTEXT], watchElement.textContent)
                        watchElement.remove()
                        return watchFn
                    })
                this.#onRemoveFn = onRemoveFunction
                onMountElement?.remove()
                onRemoveElement?.remove()

                renameShortcutAttributesInTemplate(clonedTemplate)

                // replacing mustache syntax with placeholders
                processTemplateSyntax(clonedTemplate)
                processRefs(clonedTemplate, this[CONTEXT])

                // check if used stores are ready
                const //
                    storePromises = spec.stores?.map((store) => document[CONTEXT][`$${store}`][READY])
                await Promise.all(storePromises)
                spec.stores.forEach((s) => {
                    this[CONTEXT][ADD_CONST](s, document[CONTEXT][`$${s}`])
                })

                const allImports = await importPromises
                for (const [key, value] of allImports) {
                    this[CONTEXT][ADD_CONST](key, value)
                }

                // mount template to element
                const root = this.#shadowRoot
                root.append(clonedTemplate)

                processSlots(this.#shadowRoot, this[CONTEXT])

                // process <template *each="...">
                processForElements(root)

                // run on mount function if exists
                await onMountFunction?.()

                // query all children for replacing functional attributes
                const childrenDisposes = processAttributesForChildrenElements(root, this[CONTEXT])
                this.#disposes.push(...childrenDisposes)

                Object.seal(this[CONTEXT])

                for (const fn of watcherFunctions) {
                    this.#disposes.push(
                        effect(() => {
                            fn()
                        }),
                    )
                }

                // create stylesheets
                createStyles(root, spec.inline)
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

export const //
    processForElements = (root: ShadowRoot | Element) => {
        for (const template of root.querySelectorAll('template[ph\\:each]')) {
            PhFor.fromTemplate(template as HTMLTemplateElement)
        }
    },
    processTemplateSyntax = (root: DocumentFragment | Element) => {
        const tw = noTemplateTreeWalker(root)
        while (tw.nextNode()) {
            const element = tw.currentNode as Element
            element.innerHTML = phSlotSyntax(element.innerHTML)
        }
    },
    parseImportAttribute = (importAttr: string): ImportMap | undefined => {
        if (!importAttr) return undefined

        const //
            result: ImportMap = {
                default: undefined,
                '*': undefined,
                named: [],
            },
            // e.g. importAttr = "defaultExport, * as name, { export1 , export2 as alias2 }"
            regular = /^(?<default>(\w+)\s*,?\s*)?(?<all>(\*\s+as\s+\w+)\s*,?\s*)?(?<named>\{[^}]+\})?$/,
            match = importAttr.match(regular),
            matchedGroups = match?.groups
        if (matchedGroups) {
            if (matchedGroups['default']) result.default = matchedGroups['default'].replace(',', '').trim()
            if (matchedGroups['all']) result['*'] = matchedGroups['all'].replace('* as ', '').replace(',', '').trim()
            if (matchedGroups['named']) {
                const //
                    namedContent = matchedGroups['named'].slice(1, -1),
                    namedParts = namedContent.split(',').map((s) => s.trim())
                for (const entry of namedParts) {
                    const asMatch = entry.match(/^(\w+)\s+as\s+(\w+)$/)
                    if (asMatch) {
                        result.named.push([asMatch[1], asMatch[2]])
                    } else {
                        result.named.push(entry)
                    }
                }
            }
        }
        return result
    },
    processImports = async (element: Element | DocumentFragment) => {
        return Promise.all(
            Array.from(element.querySelectorAll('import[src]')).map(async (lib) => {
                const //
                    src = new URL(lib.getAttribute('src')),
                    srcURL = src.origin !== location.origin ? src.toString() : `${location.origin}/${src.toString()}`,
                    importedModule = await import(srcURL),
                    addToContext: [string, any][] = [],
                    imports = parseImportAttribute(lib.getAttribute('import'))

                if (imports) {
                    if (imports.default) addToContext.push([imports.default, importedModule.default])
                    if (imports['*']) addToContext.push([imports['*'], importedModule])
                    for (const named of imports.named) {
                        if (typeof named == 'string') {
                            const part = importedModule[named]
                            if (part) addToContext.push([named, part])
                            else console.warn(`Import "${named}" not found in module ${srcURL}`)
                        } else {
                            const [originalName, asName] = named
                            const part = importedModule[originalName]
                            if (part) addToContext.push([asName, part])
                            else console.warn(`Import "${originalName}" not found in module ${srcURL}`)
                        }
                    }
                }
                lib.remove()
                return addToContext
            }),
        ).then((allImports) => allImports.flat())
    }

/**
 * @example
 *      <ph-component tag="x-example">
 *              <template attributes="a: Number, b: String"     properties="prop1: String"      use-stores="dataStore">
 *                      ...
 *              </template>
 *      </ph-component>
 */
export class PhComponent extends Base {
    mount() {
        const //
            template = this.querySelector('template'),
            tag = this.getAttribute('tag'),
            attributes = template
                .getAttribute('attributes')
                ?.split(',')
                ?.map((attribute) => attribute.split(':')[0].trim()),
            properties = template
                .getAttribute('properties')
                ?.split(',')
                ?.map((property) => property.split(':')[0].trim()),
            closedShadowRoot = template.hasAttribute('closed'),
            inline = template.hasAttribute('inline'),
            stores =
                template
                    .getAttribute('use-stores')
                    ?.split(',')
                    ?.map((s) => s.trim()) ?? []
        if (template?.tagName === 'TEMPLATE') constructCustomElement(tag, { template, attributes, properties, inline, closedShadowRoot, stores })
        else throw Error('no template element provided')

        this.remove()
    }
}
