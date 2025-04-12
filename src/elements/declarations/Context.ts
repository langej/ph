import { Base } from '@utils/Base'
import { createContextMethod } from '@utils/Utils'
import { createContextComputed } from '@utils/Utils'
import { signal, type Signal, type ReadonlySignal, effect } from '@preact/signals-core'

const //
        getTypedValue = ({ value, context }: { value: string; context: Context }) => {
                try {
                        return createContextMethod(context, `return ${value}`)()
                } catch (error) {
                        console.error(error)
                }
        },
        getAttributes = (element: Base) => {
                const context = element.getHost()?.[CONTEXT]
                const name = element.getAttribute('name')
                const value = element.getAttribute('value')
                return { context, name, value }
        }

export const //
        CONTEXT = Symbol(),
        ADD_SIGNAL = Symbol(),
        ADD_COMPUTED = Symbol(),
        ADD_METHOD = Symbol(),
        ADD_CONST = Symbol()

export class Context {
        static from(parentContext: Context | undefined) {
                if (parentContext instanceof Context) {
                        const context = Object.create(parentContext) as Context
                        Object.defineProperty(context, 'slots', { value: { default: signal([]) } })
                        return context
                }
                return new Context()
        }

        slots: Record<string, Signal<Element[]>> = { default: signal([]) };

        [ADD_SIGNAL]<T>(name: string, s: ReturnType<typeof signal<T>>) {
                Object.defineProperty(this, name, {
                        get() {
                                return s.value
                        },
                        set(v) {
                                s.value = v
                        },
                })
        }

        [ADD_COMPUTED]<T>(name: string, c: ReadonlySignal<T>) {
                Object.defineProperty(this, name, {
                        get() {
                                return c.value
                        },
                })
        }

        [ADD_METHOD](name: string, m: <A, T>(...args: A[]) => T) {
                Object.defineProperty(this, name, {
                        value: m,
                })
        }

        [ADD_CONST]<T>(name: string, v: T) {
                Object.defineProperty(this, name, { value: v, writable: false })
        }
}

export class PhSignal extends Base {
        mount() {
                const { context, name, value } = getAttributes(this)
                if (name && value && context) {
                        const typedValue = getTypedValue({ value, context })
                        context[ADD_SIGNAL](name, signal(typedValue))
                        const localStoragePrefix = this.getAttribute('local-storage')
                        // handle local-storage
                        handleLocalStorage(localStoragePrefix, name, context)
                }
                this.remove()
        }
}

export class PhComputed extends Base {
        mount() {
                const { context, name, value } = getAttributes(this)
                if (name && value && context) {
                        const typedValue = createContextComputed(context, value)
                        context[ADD_COMPUTED](name, typedValue)
                }
                this.remove()
        }
}

export class PhConst extends Base {
        mount() {
                const { context, name, value } = getAttributes(this)
                if (name && value && context) {
                        const typedValue = getTypedValue({ value, context })
                        context[ADD_CONST](name, typedValue)
                }
                this.remove()
        }
}

export class PhMethod extends Base {
        mount() {
                this.style.display = 'none'
                const { context, name } = getAttributes(this)
                const scriptElement = this.firstElementChild
                const args = scriptElement
                        .getAttribute('args')
                        ?.split(',')
                        ?.map((arg) => {
                                const [argName, argType] = arg.split(':').map((a) => a.trim())
                                return { name: argName, type: argType }
                        })
                const joined = args?.map((arg) => arg.name).join(',')
                const body = scriptElement?.textContent.replace(/&gt;/g, '>').replace(/&lt;/g, '<').trim() ?? ''
                if (context && body) {
                        const method = createContextMethod(context, body, joined)
                        context[ADD_METHOD](name, method)
                } else {
                        if (!context) this.log('no context provided!')
                        if (!body) this.log('no body provided!')
                }
                this.remove()
        }
}

function handleLocalStorage(localStoragePrefix: string, name: string, context: Context) {
        if (localStoragePrefix !== null) {
                const prefix = !!localStoragePrefix ? localStoragePrefix + '/' : ''
                const key = prefix + name
                const localStorageValue = localStorage.getItem(key)
                if (localStorageValue) context[name] = JSON.parse(localStorageValue)
                effect(() => {
                        localStorage.setItem(key, JSON.stringify(context[name]))
                })
        }
}
