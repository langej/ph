import { Base } from '@utils/Base'
import { createContextMethod } from '@utils/Utils'
import { ADD_CONST, Context, CONTEXT } from './Context'
import { effect } from '@preact/signals-core'
import { processImports } from './Component'

export const //
    READY = Symbol('ready')

export class PhStore extends Base {
    #shadowroot = this.attachShadow({ mode: 'open' })
    #context = new Context()
    get [CONTEXT]() {
        return this.#context
    }

    async mount() {
        this.#context[ADD_CONST](
            READY,
            new Promise(async (resolve, reject) => {
                try {
                    this.style.display = 'none'
                    const //
                        name = this.getAttribute('name'),
                        template = this.querySelector('template'),
                        // @ts-ignore
                        clonedTemplate = template.cloneNode(true).content as DocumentFragment,
                        watcher: ReturnType<typeof effect>[] = []

                    // @ts-ignore
                    document[CONTEXT][`$${name}`] = this[CONTEXT]

                    let initFn: (() => void | Promise<void>) | undefined
                    for (const script of clonedTemplate.querySelectorAll('script')) {
                        script.setAttribute('type', 'javascript/blocked')
                        if (script.hasAttribute('init')) initFn = createContextMethod(this[CONTEXT], script.textContent)
                        if (script.hasAttribute('watch')) watcher.push(createContextMethod(this[CONTEXT], script.textContent))
                        if (script.parentElement?.tagName !== 'PH-METHOD') script.remove()
                    }

                    const imports = await processImports(clonedTemplate)
                    for (const [key, value] of imports) {
                        this[CONTEXT][ADD_CONST](key, value)
                    }

                    this.#shadowroot.append(clonedTemplate)

                    await initFn?.()
                    Object.seal(this[CONTEXT])
                    for (const fn of watcher) {
                        effect(() => {
                            fn()
                        })
                    }
                    resolve(true)
                } catch (error) {
                    console.error(error)
                    reject(error)
                }
            }),
        )
    }
}
