import { computed, type ReadonlySignal } from '@preact/signals-core'
import type { Context } from '@elements/declarations/Context'

export type Dispose = () => void

const //
    replaceHandlebars = (input: string, fn: (content: string) => string) => input.replace(/{{[^{}]*}}/g, (result: string) => fn(result.replace(/[{}]/g, ''))),
    TW = document.createTreeWalker.bind(document)

export const //
    defineComponent = (tag: string, spec: CustomElementConstructor) => !customElements.get(tag) && customElements.define(tag, spec),
    toCamelCase = (name: string): string => name.replace(/-[a-z]/g, (m: string) => m[1].toUpperCase()),
    phSlotSyntax = (input: string, replaceContent?: (x: string) => string) => {
        return replaceHandlebars(input, (m: string) => {
            let content = m.replace(/[{}]/g, ' ')
            if (replaceContent) content = replaceContent(content)
            return `<ph-slot value="${content}"></ph-slot>`
        })
    },
    createContextComputed = <T>(context: Context, statement: string | null): ReadonlySignal<T> => {
        const body = statement
        return Function('context', 'computed', `with(context){return computed(() => ${body})}`)(context, computed)
    },
    createContextMethod = (context: Context, statement: string | null, parameterList = '') => {
        const body = statement ?? ''
        const isAsync = statement?.includes('await')
        return Function('context', `return ${isAsync ? 'async' : ''} function(${parameterList}){with (context) {${body}}}`)(context)
    },
    noTemplateTreeWalker = (root: Node | Element) => {
        return TW(root, NodeFilter.SHOW_ELEMENT, (node: Node) =>
            node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName !== 'TEMPLATE' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
        )
    },
    allElementsTreeWalker = (root: Node | Element, filter?: NodeFilter) => {
        return TW(root, NodeFilter.SHOW_ELEMENT, filter)
    },
    delayProcessing = (callback: () => void) => {
        queueMicrotask(callback)
    },
    executeDeferredUnmount = (element: Element, onRemove: () => void) => {
        if (!(element instanceof HTMLElement)) {
            onRemove()
            return
        }

        let isDeferred = false
        const event = new CustomEvent('beforeremove', {
            detail: {
                defer: (promise: Promise<void>) => {
                    isDeferred = true
                    promise.then(onRemove)
                },
            },
            cancelable: true,
        })
        element.dispatchEvent(event)

        if (isDeferred) return

        const leaveClass = element.getAttribute('ph-leave-class')
        if (leaveClass) {
            element.classList.add(...leaveClass.split(' '))
        }

        const animations = element.getAnimations?.() || []
        if (animations.length > 0) {
            Promise.all(animations.map((a) => a.finished))
                .then(onRemove)
                .catch(onRemove)
        } else {
            onRemove()
        }
    }
