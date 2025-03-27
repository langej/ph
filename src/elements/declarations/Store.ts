import { Base } from '@utils/Base'
import { createContextMethod } from '@utils/Utils'
import { Context, CONTEXT } from './Context'

export class PhStore extends Base {
        #context: Context

        get context() {
                return this.#context
        }

        mount() {
                this.style.display = 'none'
                const root = this.attachShadow({ mode: 'open' })

                const documentContext = document[CONTEXT]
                this.#context = new Context()
                const name = this.getAttribute('name')

                let mountFn: () => void
                const template = this.querySelector('template')
                for (const script of template.content.querySelectorAll('script')) {
                        script.setAttribute('type', 'javascript/blocked')
                        if (script.hasAttribute('on-mount')) {
                                mountFn = createContextMethod(this.#context, script.textContent)
                        }
                }
                root.append((template.cloneNode(true) as HTMLTemplateElement).content)

                // @ts-ignore
                if (!documentContext.$store) documentContext.$store = {}
                // @ts-ignore
                documentContext.$store[name] = this.#context

                mountFn?.()
        }
}
