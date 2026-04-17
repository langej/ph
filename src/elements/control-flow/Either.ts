import { effect } from '@preact/signals-core'
import { resolveContext } from '@elements/declarations/Context'
import { Base } from '@utils/Base'
import { createContextComputed, delayProcessing, Dispose } from '@utils/Utils'
import { processAttributes, processAttributesForChildrenElements } from '@utils/Attributes'

export class PhEither extends Base {
    #disposes: Dispose[] = []
    #trueChild?: Node | HTMLElement
    #falseChild?: Node | HTMLElement
    #initialized = false

    mount() {
        this.style.display = 'inline flow'
        const //
            value = this.getAttribute('value'),
            context = resolveContext(this)
        if (value && context) {
            if (!this.#initialized) {
                const [True, False] = this.children
                this.#trueChild = True
                this.#falseChild = False
                this.#initialized = true
            }

            this.#disposes.push(...processAttributes(this, context))

            if (this.#trueChild instanceof Element) {
                this.#disposes.push(...processAttributesForChildrenElements(this.#trueChild as HTMLElement, context))
                this.#disposes.push(...processAttributes(this.#trueChild as HTMLElement, context))
            }
            if (this.#falseChild instanceof Element) {
                this.#disposes.push(...processAttributesForChildrenElements(this.#falseChild as HTMLElement, context))
                this.#disposes.push(...processAttributes(this.#falseChild as HTMLElement, context))
            }
            delayProcessing(() => {
                this.innerHTML = ''
                const computed = createContextComputed(context, value)
                let lastState = !!computed.value
                if (lastState) {
                    if (this.#trueChild) this.append(this.#trueChild)
                } else {
                    if (this.#falseChild) this.append(this.#falseChild)
                }

                this.#disposes.push(
                    effect(() => {
                        const currentState = !!computed.value
                        if (currentState === lastState) return
                        lastState = currentState

                        if (currentState) {
                            if (this.firstChild && this.#trueChild) {
                                this.firstChild.replaceWith(this.#trueChild)
                            } else if (this.#trueChild) {
                                this.append(this.#trueChild)
                            }
                        } else {
                            if (this.firstChild && this.#falseChild) {
                                this.firstChild.replaceWith(this.#falseChild)
                            } else if (this.#falseChild) {
                                this.append(this.#falseChild)
                            }
                        }
                    }),
                )
            })
        }
    }

    unmount() {
        for (const dispose of this.#disposes) {
            dispose()
        }
    }
}
