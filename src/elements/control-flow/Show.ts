import { CONTEXT } from '@elements/declarations/Context'
import { effect } from '@preact/signals-core'
import { Base } from '@utils/Base'
import { createContextComputed } from '@utils/Utils'

export class PhShow extends Base {
    #dispose
    mount() {
        this.style.display = 'inline flow'
        const value = this.getAttribute('value')
        const context = this.getHost()?.[CONTEXT]
        if (value && context) {
            const val = createContextComputed(context, value)
            this.#dispose = effect(() => {
                if (val.value) {
                    this.style.display = 'inline flow'
                } else {
                    this.style.display = 'none'
                }
            })
        }
    }

    unmount() {
        this.#dispose?.()
    }
}
