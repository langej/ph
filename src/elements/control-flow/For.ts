import { effect } from '@preact/signals-core'
import { CONTEXT } from '@elements/declarations/Context'
import { Base } from '@utils/Base'
import { allElementsTreeWalker, createContextComputed, phSlotSyntax } from '@utils/Utils'
import { Directives, processAttributes, processAttributesForChildrenElements, renameShortcutAttributesInTemplate } from '@utils/Attributes'

const createElement = (content: HTMLElement, listname: string, itemName: string, index: number, indexName?: string) => {
    const //
        el = content,
        replaceRegExp = (what) => new RegExp(`([^a-zA-Z0-9$_]${what}[^a-zA-Z0-9$_:])`, 'g'),
        replaceItemName = (x: string) => {
            const result = x.replace(replaceRegExp(itemName), (s) => `${s[0]}${listname}[${index}]?.valueOf()${s.at(-1)}`)
            if (indexName) return result.replace(replaceRegExp(indexName), (s) => `${s[0]}${index}${s.at(-1)}`)
            return result
        },
        replaceAttributeValues = (element: Element): void => {
            for (const attribute of element.getAttributeNames()) {
                if (Object.keys(Directives).some((it) => attribute.startsWith(it))) {
                    element.setAttribute(attribute, replaceItemName(` ${element.getAttribute(attribute)} `))
                }
            }
        },
        replaced = phSlotSyntax(el.innerHTML, replaceItemName)

    el.innerHTML = replaced
    replaceAttributeValues(el)

    const tw = allElementsTreeWalker(el)
    while (tw.nextNode()) {
        const //
            currentNode = tw.currentNode as Element,
            tagName = currentNode.tagName
        replaceAttributeValues(currentNode)
        if (currentNode.hasAttribute('value') && (tagName === 'PH-IF' || tagName === 'PH-EITHER' || tagName === 'PH-SHOW' || tagName === 'PH-SLOT')) {
            currentNode.setAttribute('value', replaceItemName(` ${currentNode.getAttribute('value')} `))
        }
        if (tagName === 'PH-DYNAMIC' && currentNode.hasAttribute('is')) {
            currentNode.setAttribute('is', replaceItemName(` ${currentNode.getAttribute('is')} `))
        }
    }
    return el
}

export class PhFor extends Base {
    mount() {
        this.style.display = 'contents'
        const templateElement = this.firstElementChild
        if (templateElement?.tagName === 'TEMPLATE') {
            templateElement.setAttribute('ph:each', this.getAttribute('ph:each'))
            PhFor.fromTemplate(templateElement as HTMLTemplateElement)
        } else {
            throw Error('no template element provided')
        }
    }

    static fromTemplate(template: HTMLTemplateElement) {
        renameShortcutAttributesInTemplate(template.content)

        template.before(document.createComment('ph-for begin'))
        template.after(document.createComment('ph-for end'))

        const //
            eachAttribute = template.getAttribute('ph:each'),
            beginComment = template.previousSibling,
            endComment = template.nextSibling,
            root = template.getRootNode() as ShadowRoot,
            context = (root.host ?? root)[CONTEXT],
            [definition, collection] = eachAttribute?.split(' in ') ?? [],
            [itemName, indexName] = definition.split(',').map((it) => it.trim())

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
                            const //
                                content = template.content.firstElementChild.cloneNode(true) as HTMLElement,
                                created = createElement(content, collection, itemName, index + startingIndex, indexName)
                            endComment.before(created)
                            created.disposes = [...processAttributesForChildrenElements(created, context), ...processAttributes(created, context)]
                        })
                    } else {
                        // remove elements
                        const removingElements: HTMLElement[] = []
                        let currentNode = beginComment.nextSibling
                        let i = 0
                        while (currentNode && currentNode !== endComment) {
                            if (i >= currentLength) removingElements.push(currentNode as HTMLElement)
                            i++
                            currentNode = currentNode.nextSibling
                        }
                        for (const child of removingElements) {
                            child.disposes?.forEach((d) => d())
                            child.remove?.()
                        }
                    }
                    oldLength = computed.value.length
                }
            })
        }
        template.remove()
    }
}
