import { effect } from '@preact/signals-core'
import { Base } from '../utils/Base'
import { resolveContext } from './declarations/Context'
import { createContextComputed, delayProcessing } from '@utils/Utils'

export class PhDynamic extends Base {
    mount() {
        const //
            is = this.getAttribute('is'),
            context = resolveContext(this),
            computed = createContextComputed<Node>(context, is)
        if (is && context) {
            effect(() => {
                delayProcessing(() => {
                    this.replaceWith(computed.value)
                })
            })
        }
    }
}
