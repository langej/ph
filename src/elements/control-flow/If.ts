import { effect } from '@preact/signals-core'
import { resolveContext } from '@elements/declarations/Context'
import { Base } from '@utils/Base'
import { createContextComputed, Dispose } from '@utils/Utils'
import { processAttributes, processAttributesForChildrenElements } from '@utils/Attributes'

export class PhIf extends Base {
    #disposes: Dispose[] = []
    #children: ChildNode[] = []
    #initialized = false

    mount() {
        if (!this.#initialized) {
            this.#children = Array.from(this.childNodes)
            this.#initialized = true
        }
        this.style.display = 'inline flow'
        const //
            value = this.getAttribute('value'),
            context = resolveContext(this)
        if (value && context) {
            const computed = createContextComputed(context, value)
            this.#disposes.push(...processAttributesForChildrenElements(this, context))
            this.#disposes.push(...processAttributes(this, context))
            this.#disposes.push(
                effect(() => {
                    const isTruthy = Boolean(computed.value)
                    if (isTruthy) {
                        if (this.childNodes.length === 0) this.append(...this.#children)
                    } else {
                        if (this.childNodes.length > 0) {
                            for (const child of this.#children) {
                                child.remove()
                            }
                        }
                    }
                }),
            )
        }
    }

    unmount() {
        for (const dispose of this.#disposes) {
            dispose()
        }
        this.#disposes = []
    }
}
