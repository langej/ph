import { effect } from '@preact/signals-core'
import { CONTEXT } from '@elements/declarations/Context'
import { Base } from '@utils/Base'
import { createContextComputed } from '@utils/Utils'
import { processAttributes, processAttributesForChildrenElements } from '@utils/Attributes'

export class PhEither extends Base {
        #disposes = []
        #trueChild: Node | HTMLElement
        #falseChild: Node | HTMLElement

        mount() {
                this.style.display = 'inline flow'
                const value = this.getAttribute('value')
                const context = this.getHost()?.[CONTEXT]
                if (value && context) {
                        this.#disposes.push(...processAttributesForChildrenElements(this, context))
                        this.#disposes.push(...processAttributes(this, context))

                        const [True, False] = this.children
                        this.#trueChild = True
                        this.#falseChild = False
                        this.innerHTML = ''

                        const computed = createContextComputed(context, value)
                        this.#disposes.push(
                                effect(() => {
                                        const v = computed.value
                                        if (v === true) {
                                                if (this.firstChild) this.#falseChild = this.removeChild(this.firstChild)
                                                this.append(this.#trueChild)
                                        } else {
                                                if (this.firstChild) this.#trueChild = this.removeChild(this.firstChild)
                                                this.append(this.#falseChild)
                                        }
                                }),
                        )
                }
        }

        unmount() {
                for (const dispose of this.#disposes) {
                        dispose()
                }
        }
}
