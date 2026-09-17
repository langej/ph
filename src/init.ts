import { ADD_SIGNAL, Context, CONTEXT, PhComputed, PhMethod, PhSignal, PhConst, type RouterState } from '@elements/declarations/Context'
import { PhComponent, processForElements, processTemplateSyntax } from '@elements/declarations/Component'
import { PhIf } from '@elements/control-flow/If'
import { PhShow } from '@elements/control-flow/Show'
import { PhEither } from '@elements/control-flow/Either'
import { PhFor } from '@elements/control-flow/For'
import { PhDynamic } from '@elements/Dynamic'
import { PhSlot } from '@elements/Slot'
import { PhRouter } from '@elements/Router'
import { PhStore } from '@elements/declarations/Store'
import { defineComponent, noTemplateTreeWalker } from '@utils/Utils'
import { renameShortcutAttributes, processAttributesForChildrenElements } from '@utils/Attributes'
import { signal } from '@preact/signals-core'

const navigate = (path: string, replace = false) => {
    document.dispatchEvent(new CustomEvent('ph:navigate', { detail: { path, replace } }))
}

const initialRouterState: RouterState = {
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    params: {},
    push: (path) => navigate(path),
    replace: (path) => navigate(path, true),
    back: () => window.history.back(),
    forward: () => window.history.forward(),
}

export const init = async () => {
    console.group('ph init')

    !document[CONTEXT] &&
        Object.defineProperty(document, CONTEXT, {
            value: new Context(),
            writable: false,
        })

    !document[CONTEXT].router && document[CONTEXT][ADD_SIGNAL]('router', signal(initialRouterState))

    defineComponent('ph-signal', PhSignal)
    defineComponent('ph-computed', PhComputed)
    defineComponent('ph-const', PhConst)
    defineComponent('ph-method', PhMethod)
    defineComponent('ph-store', PhStore)
    defineComponent('ph-for', PhFor)
    defineComponent('ph-either', PhEither)
    defineComponent('ph-show', PhShow)
    defineComponent('ph-if', PhIf)
    defineComponent('ph-slot', PhSlot)
    defineComponent('ph-router', PhRouter)
    defineComponent('ph-dynamic', PhDynamic)
    defineComponent('ph-component', PhComponent)

    const tw = noTemplateTreeWalker(document.body)
    while (tw.nextNode()) {
        const element = tw.currentNode as Element
        renameShortcutAttributes(element)
    }
    processTemplateSyntax(document.body)
    processAttributesForChildrenElements(document.body, document[CONTEXT])
    processForElements(document.body)

    console.groupEnd()
}
