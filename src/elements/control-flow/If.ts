import { effect } from '@preact/signals-core'
import { resolveContext } from '@elements/declarations/Context'
import { Base } from '@utils/Base'
import { createContextComputed, Dispose } from '@utils/Utils'
import { processAttributes, processAttributesForChildrenElements } from '@utils/Attributes'

export class PhIf extends Base {
    #disposes: Dispose[] = []
    #children: ChildNode[]

    mount() {
        this.#children = Array.from(this.childNodes)
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
                    const v = computed.value
                    if (v === true) this.append(...this.#children)
                    else this.#children = Array.from(this.childNodes).map((e) => this.removeChild(e))
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
