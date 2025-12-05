import { effect } from '@preact/signals-core'
import { Base } from '@utils/Base'
import { createContextComputed } from '@utils/Utils'
import { CONTEXT } from './declarations/Context'

export class PhSlot extends Base {
    #dispose?: () => void
    mount() {
        setTimeout(() => {
            this.style.display = 'contents'
            const value = this.getAttribute('value')
            const context = this.getHost()?.[CONTEXT] ?? document[CONTEXT]

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
