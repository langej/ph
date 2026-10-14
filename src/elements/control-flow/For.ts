import { effect, signal } from '@preact/signals-core'
import { CONTEXT, Context, ADD_SIGNAL, resolveContext } from '@elements/declarations/Context'
import { Base } from '@utils/Base'
import { createContextComputed, phSlotSyntax, executeDeferredUnmount } from '@utils/Utils'
import { processAttributes, processAttributesForChildrenElements, renameShortcutAttributes, renameShortcutAttributesInTemplate } from '@utils/Attributes'

const createElement = (content: HTMLElement) => {
    const el = content.cloneNode(true) as HTMLElement
    el.innerHTML = phSlotSyntax(el.innerHTML)
    return el
}

export class PhFor extends Base {
    static processForElements(root: ShadowRoot | Element) {
        for (const template of root.querySelectorAll('template[ph\\:each]')) {
            PhFor.fromTemplate(template as HTMLTemplateElement)
        }
    }

    mount() {
        this.style.display = 'contents'
        renameShortcutAttributes(this)
        const //
            templateElement = this.firstElementChild,
            phEach = this.getAttribute('ph:each'),
            phKey = this.getAttribute('ph:key')
        if (templateElement?.tagName === 'TEMPLATE') {
            if (phEach) {
                templateElement.setAttribute('ph:each', phEach)
                this.removeAttribute('ph:each')
            }
            if (phKey) {
                templateElement.setAttribute('ph:key', phKey)
                this.removeAttribute('ph:key')
            }
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
            keyAttribute = template.getAttribute('ph:key'),
            beginComment = template.previousSibling,
            endComment = template.nextSibling,
            context = resolveContext(template),
            [definition, collection] = eachAttribute?.split(' in ') ?? [],
            [itemName, indexName] = definition.split(',').map((it) => it.trim())

        if (context && itemName && collection && template) {
            const computed = createContextComputed<Array<unknown>>(context, collection)
            let renderedNodes = new Map<any, { el: HTMLElement; context: Context; indexSignal: any }>()

            effect(() => {
                const //
                    currentArray: any[] = computed.value || [],
                    newRenderedNodes = new Map<any, { el: HTMLElement; context: Context; indexSignal: any }>()
                let currentDomNode = beginComment?.nextSibling

                for (let index = 0; index < currentArray.length; index++) {
                    const //
                        item = currentArray[index],
                        keyValue = (keyAttribute ? item[keyAttribute] : index) ?? index

                    let nodeData = renderedNodes.get(keyValue)

                    if (nodeData) {
                        nodeData.indexSignal.value = index
                        nodeData.context[itemName] = item
                        renderedNodes.delete(keyValue)
                    } else {
                        const //
                            childContext = new Context(),
                            content = template.content.firstElementChild as HTMLElement,
                            createdElement = createElement(content),
                            idxSignal = signal(index)

                        Object.setPrototypeOf(childContext, context)
                        childContext[ADD_SIGNAL](itemName, signal(item))

                        if (indexName) childContext[ADD_SIGNAL](indexName, idxSignal)

                        if (!customElements.get(createdElement.localName)) {
                            Object.defineProperty(createdElement, CONTEXT, { value: childContext, configurable: true })
                        }
                        PhFor.processForElements(createdElement)
                        createdElement.disposes = [
                            ...processAttributesForChildrenElements(createdElement, childContext),
                            ...processAttributes(createdElement, childContext),
                        ]
                        nodeData = { el: createdElement, context: childContext, indexSignal: idxSignal }
                    }

                    if (nodeData.el === currentDomNode) {
                        currentDomNode = currentDomNode.nextSibling
                    } else {
                        endComment?.parentNode?.insertBefore(nodeData.el, currentDomNode || endComment)
                    }

                    newRenderedNodes.set(keyValue, nodeData)
                }

                renderedNodes.forEach((nodeData) => {
                    nodeData.el.disposes?.forEach((d) => d())
                    executeDeferredUnmount(nodeData.el, () => {
                        nodeData.el.remove()
                    })
                })

                renderedNodes = newRenderedNodes
            })
        }
        template.remove()
    }
}
