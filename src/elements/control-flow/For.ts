import { effect } from '@preact/signals-core'
import { CONTEXT } from '@elements/declarations/Context'
import { Base } from '@utils/Base'
import { allElementsTreeWalker, createContextComputed, phSlotSyntax } from '@utils/Utils'
import { Directives, processAttributes, processAttributesForChildrenElements, renameShortcutAttributesInTemplate } from '@utils/Attributes'

const createElement = (content: HTMLElement, listname: string, itemName: string, index: number, indexName?: string) => {
        const el = content

        const replaceRegExp = (what) => new RegExp(`([^a-zA-Z0-9$_]${what}[^a-zA-Z0-9$_:])`, 'g')
        const replaceItemName = (x: string) => {
                const result = x.replace(replaceRegExp(itemName), (s) => `${s[0]}${listname}[${index}]?.valueOf()${s.at(-1)}`)
                if (indexName) return result.replace(replaceRegExp(indexName), (s) => `${s[0]}${index}${s.at(-1)}`)
                return result
        }

        const replaced = phSlotSyntax(el.innerHTML, replaceItemName)
        el.innerHTML = replaced
        const replaceAttributeValues = (element: Element): void => {
                for (const attribute of element.getAttributeNames()) {
                        if (Object.keys(Directives).some((it) => attribute.startsWith(it))) {
                                element.setAttribute(attribute, replaceItemName(` ${element.getAttribute(attribute)} `))
                        }
                }
        }
        replaceAttributeValues(el)
        const tw = allElementsTreeWalker(el)
        while (tw.nextNode()) {
                const currentNode = tw.currentNode as Element
                replaceAttributeValues(currentNode)
                const tagName = currentNode.tagName
                if (currentNode.hasAttribute('value') && (tagName === 'PH-IF' || tagName === 'PH-EITHER' || tagName === 'PH-SHOW' || tagName === 'PH-SLOT')) {
                        currentNode.setAttribute('value', replaceItemName(` ${currentNode.getAttribute('value')} `))
                }
        }
        return el
}

export class PhFor extends Base {
        mount() {
                this.style.display = 'contents'
                const templateElement = this.firstElementChild
                if (templateElement?.tagName === 'TEMPLATE') {
                        templateElement.setAttribute('each', this.getAttribute('each'))
                        PhFor.fromTemplate(templateElement as HTMLTemplateElement)
                } else throw Error('no template element provided')
        }

        static fromTemplate(template: HTMLTemplateElement) {
                renameShortcutAttributesInTemplate(template.content)
                const eachAttribute = template.getAttribute('each')
                const [definition, collection] = eachAttribute?.split(' in ') ?? []
                const [itemName, indexName] = definition.split(',').map((it) => it.trim())

                const root = template.getRootNode() as ShadowRoot
                const context = (root.host ?? root)[CONTEXT]
                const parentElement = template.parentElement

                if (context && itemName && collection && template) {
                        const computed = createContextComputed<Array<unknown>>(context, collection)
                        let oldLength = 0
                        effect(() => {
                                const currentLength = computed.value.length
                                if (currentLength !== oldLength) {
                                        if (currentLength > oldLength) {
                                                // add elements
                                                const startingIndex = oldLength
                                                computed.value.slice(startingIndex).forEach((_item, index) => {
                                                        const content = template.content.firstElementChild.cloneNode(true) as HTMLElement
                                                        const created = createElement(content, collection, itemName, index + startingIndex, indexName)
                                                        const disposes = processAttributesForChildrenElements(created, context)
                                                        disposes.push(...processAttributes(created, context))
                                                        created.disposes = disposes
                                                        parentElement.append(created)
                                                })
                                        } else {
                                                // remove elements
                                                const removingElements = Array.from(parentElement.children).slice(currentLength - oldLength)
                                                for (const child of removingElements) {
                                                        for (const d of child.disposes) {
                                                                d()
                                                        }
                                                        child.remove()
                                                }
                                                parentElement.remove
                                        }
                                        oldLength = computed.value.length
                                }
                        })
                }
                template.remove()
        }
}
