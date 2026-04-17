import { effect, signal } from '@preact/signals-core'
import { CONTEXT, Context, ADD_SIGNAL } from '@elements/declarations/Context'
import { Base } from '@utils/Base'
import { createContextComputed, phSlotSyntax } from '@utils/Utils'
import { processAttributes, processAttributesForChildrenElements, renameShortcutAttributesInTemplate } from '@utils/Attributes'

const createElement = (content: HTMLElement) => {
    const el = content.cloneNode(true) as HTMLElement
    el.innerHTML = phSlotSyntax(el.innerHTML)
    return el
}

export class PhFor extends Base {
    mount() {
        this.style.display = 'contents'
        const //
            templateElement = this.firstElementChild,
            phEach = this.getAttribute('ph:each'),
            phKey = this.getAttribute('ph:key')
        if (templateElement?.tagName === 'TEMPLATE') {
            if (phEach) templateElement.setAttribute('ph:each', phEach)
            if (phKey) templateElement.setAttribute('ph:key', phKey)
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
            endComment = template.nextSibling,
            root = template.getRootNode() as ShadowRoot,
            context = (root.host ?? root)[CONTEXT],
            [definition, collection] = eachAttribute?.split(' in ') ?? [],
            [itemName, indexName] = definition.split(',').map((it) => it.trim())

        if (context && itemName && collection && template) {
            const computed = createContextComputed<Array<unknown>>(context, collection)
            let renderedNodes = new Map<any, { el: HTMLElement; context: Context; indexSignal: any }>()

            effect(() => {
                const //
                    currentArray: any[] = computed.value || [],
                    newRenderedNodes = new Map<any, { el: HTMLElement; context: Context; indexSignal: any }>()
                let insertBeforeNode = endComment

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
                            created = createElement(content),
                            idxSignal = signal(index)

                        Object.setPrototypeOf(childContext, context)
                        childContext[ADD_SIGNAL](itemName, signal(item))

                        if (indexName) childContext[ADD_SIGNAL](indexName, idxSignal)

                        created[CONTEXT] = childContext
                        created.disposes = [...processAttributesForChildrenElements(created, childContext), ...processAttributes(created, childContext)]
                        nodeData = { el: created, context: childContext, indexSignal: idxSignal }
                    }
                    endComment?.parentNode?.insertBefore(nodeData.el, insertBeforeNode)
                    newRenderedNodes.set(keyValue, nodeData)
                }

                renderedNodes.forEach((nodeData) => {
                    nodeData.el.disposes?.forEach((d) => d())
                    nodeData.el.remove()
                })

                renderedNodes = newRenderedNodes
            })
        }
        template.remove()
    }
}
