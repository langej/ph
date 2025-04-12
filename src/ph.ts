import { PhSlot } from '@elements/Slot'
import { Context, CONTEXT, PhComputed, PhMethod, PhSignal, PhConst } from '@elements/declarations/Context'
import { PhComponent, processForElements, processTemplateSyntax } from '@elements/declarations/Component'
import { PhIf } from '@elements/control-flow/If'
import { PhShow } from '@elements/control-flow/Show'
import { PhEither } from '@elements/control-flow/Either'
import { PhFor } from '@elements/control-flow/For'
import { PhDynamic } from '@elements/Dynamic'
import { PhStore } from '@elements/declarations/Store'
import { defineComponent, noTemplateTreeWalker } from '@utils/Utils'
import { renameShortcutAttributes, processAttributesForChildrenElements } from '@utils/Attributes'

const init = () => {
        console.group('ph init')

        !document[CONTEXT] &&
                Object.defineProperty(document, CONTEXT, {
                        value: new Context(),
                        writable: false,
                })

        defineComponent('ph-signal', PhSignal)
        defineComponent('ph-computed', PhComputed)
        defineComponent('ph-const', PhConst)
        defineComponent('ph-method', PhMethod)
        defineComponent('ph-for', PhFor)
        defineComponent('ph-either', PhEither)
        defineComponent('ph-show', PhShow)
        defineComponent('ph-if', PhIf)
        defineComponent('ph-slot', PhSlot)
        defineComponent('ph-dynamic', PhDynamic)
        defineComponent('ph-component', PhComponent)
        defineComponent('ph-store', PhStore)

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

window.init = init

document.addEventListener('DOMContentLoaded', () => {
        init()
})

declare global {
        interface Document {
                [CONTEXT]: Context
        }
        interface Element {
                [CONTEXT]?: Context
                disposes?: (() => void)[]
        }
        interface Window {
                init: typeof init
        }
}
