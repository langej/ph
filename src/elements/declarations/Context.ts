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
                const //
                        context = element.getHost()?.[CONTEXT],
                        name = element.getAttribute('name'),
                        value = element.getAttribute('value')
                return { context, name, value }
        },
        handleLocalStorage = (localStoragePrefix: string, name: string, context: Context) => {
                if (localStoragePrefix !== null) {
                        const //
                                prefix = !!localStoragePrefix ? localStoragePrefix + '/' : '',
                                key = prefix + name,
                                localStorageValue = localStorage.getItem(key)
                        if (localStorageValue) context[name] = JSON.parse(localStorageValue)
                        effect(() => {
                                localStorage.setItem(key, JSON.stringify(context[name]))
                        })
                }
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
                const { name, value, context } = getAttributes(this)
                if (name && value && context) {
                        const //
                                typedValue = getTypedValue({ value, context }),
                                localStoragePrefix = this.getAttribute('local-storage')
                        context[ADD_SIGNAL](name, signal(typedValue))
                        handleLocalStorage(localStoragePrefix, name, context)
                }
                this.remove()
        }
}

export class PhComputed extends Base {
        mount() {
                const { name, value, context } = getAttributes(this)
                if (name && value && context) {
                        const typedValue = createContextComputed(context, value)
                        context[ADD_COMPUTED](name, typedValue)
                }
                this.remove()
        }
}

export class PhConst extends Base {
        mount() {
                const { name, value, context } = getAttributes(this)
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
                const //
                        { context, name } = getAttributes(this),
                        scriptElement = this.firstElementChild,
                        body = scriptElement?.textContent.replace(/&gt;/g, '>').replace(/&lt;/g, '<').trim() ?? '',
                        args = scriptElement
                                .getAttribute('args')
                                ?.split(',')
                                ?.map((arg) => {
                                        const [argName, argType] = arg.split(':').map((a) => a.trim())
                                        return { name: argName, type: argType }
                                }),
                        joined = args?.map((arg) => arg.name).join(',')
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
