import { effect } from '@preact/signals-core'
import { Base } from '@utils/Base'
import { createContextComputed } from '@utils/Utils'
import { CONTEXT } from './declarations/Context'

export class PhSlot extends Base {
        #dispose
        mount() {
                setTimeout(() => {
                        this.style.display = 'contents'
                        const value = this.getAttribute('value')
                        const context = this.getHost()?.[CONTEXT]

                        if (value && context) {
                                const computed = createContextComputed(context, value)
                                this.#dispose = effect(() => {
                                        this.innerHTML = computed.value as string
                                })
                        }
                })
        }

        unmount() {
                this.#dispose?.()
        }
}
