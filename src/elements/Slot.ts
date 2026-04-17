import { effect } from '@preact/signals-core'
import { Base } from '@utils/Base'
import { createContextComputed, delayProcessing, Dispose } from '@utils/Utils'
import { resolveContext } from './declarations/Context'

export class PhSlot extends Base {
    #dispose?: Dispose
    mount() {
        this.style.display = 'contents'
        const //
            value = this.getAttribute('value'),
            context = resolveContext(this)

        delayProcessing(() => {
            if (value && context) {
                const computed = createContextComputed(context, value)
                this.#dispose = effect(() => {
                    this.textContent = computed.value as string
                })
            }
        })
    }

    unmount() {
        this.#dispose?.()
    }
}
