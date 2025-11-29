import { effect } from '@preact/signals-core'
import { Base } from '../utils/Base'
import { CONTEXT } from './declarations/Context'
import { createContextComputed } from '@utils/Utils'

export class PhDynamic extends Base {
        mount() {
                const //
                        is = this.getAttribute('is'),
                        context = this.getHost()?.[CONTEXT] ?? document[CONTEXT],
                        computed = createContextComputed<Node>(context, is)
                if (is && context) {
                        effect(() => {
                                setTimeout(() => {
                                        this.replaceWith(computed.value)
                                })
                        })
                }
        }
}
