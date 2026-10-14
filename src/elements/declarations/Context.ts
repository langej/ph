import { createContextMethod, createContextComputed } from '@utils/Utils'
import { signal, type ReadonlySignal, effect } from '@preact/signals-core'

const //
    getTypedValue = ({ value, context }: { value: string; context: Context }) => {
        try {
            return createContextMethod(context, `return ${value}`)()
        } catch (error) {
            console.error(error)
        }
    }

export const //
    CONTEXT = Symbol(),
    ADD_SIGNAL = Symbol(),
    ADD_COMPUTED = Symbol(),
    ADD_METHOD = Symbol(),
    ADD_CONST = Symbol(),
    ADD_SLOT = Symbol(),
    resolveContext = (node: Node | null): Context => {
        let current = node
        while (current && current !== document) {
            if ((current as any)[CONTEXT]) return (current as any)[CONTEXT]
            if (current instanceof ShadowRoot) current = current.host
            else current = current.parentNode
        }
        return document[CONTEXT]
    }

export type RouterState = {
    pathname: string
    search: string
    hash: string
    params: Record<string, string>
    route?: HTMLElement
    push: (path: string) => void
    replace: (path: string) => void
    back: () => void
    forward: () => void
}

export class Context {
    [key: string]: any

    slots: Record<string, Element[]> = {}

    constructor() {
        this[ADD_SLOT]('default')
    }

    [ADD_SLOT](name: string) {
        const s = signal<Element[]>([])
        Object.defineProperty(this.slots, name, {
            get() {
                return s.value
            },
            set(v) {
                s.value = v
            },
        })
    }

    [ADD_SIGNAL]<T>(name: string, s: ReturnType<typeof signal<T>>) {
        Object.defineProperty(this, name, {
            get() {
                return s.value
            },
            set(v) {
                s.value = v
            },
            configurable: true,
            enumerable: true,
        })
    }

    [ADD_COMPUTED]<T>(name: string, c: ReadonlySignal<T>) {
        Object.defineProperty(this, name, {
            get() {
                return c.value
            },
            configurable: true,
            enumerable: true,
        })
    }

    [ADD_METHOD](name: string, m: <A, T>(...args: A[]) => T) {
        Object.defineProperty(this, name, {
            value: m,
            configurable: true,
            enumerable: true,
        })
    }

    [ADD_CONST]<T>(name: string | symbol, v: T) {
        Object.defineProperty(this, name, { value: v, writable: false, configurable: true, enumerable: true })
    }
}

export const processDeclarations = (root: DocumentFragment | Element, context: Context) => {
    const declarations = root.querySelectorAll('ph-signal, ph-computed, ph-const, ph-method')
    for (const el of declarations) {
        const tagName = el.tagName.toLowerCase()
        const name = el.getAttribute('name')
        if (tagName === 'ph-signal') {
            const value = el.getAttribute('value')
            if (name && value) {
                const typedValue = getTypedValue({ value, context })
                const localStorageAttribute = el.getAttribute('local-storage')
                context[ADD_SIGNAL](name, signal(typedValue))
                if (localStorageAttribute !== null) {
                    const localStoragePrefix = !!localStorageAttribute ? localStorageAttribute + '/' : ''
                    const key = localStoragePrefix + name
                    const localStorageValue = localStorage.getItem(key)
                    if (localStorageValue) context[name] = JSON.parse(localStorageValue)
                    effect(() => {
                        localStorage.setItem(key, JSON.stringify(context[name]))
                    })
                }
            }
        } else if (tagName === 'ph-computed') {
            const value = el.getAttribute('value')
            if (name && value) {
                const typedValue = createContextComputed(context, value)
                context[ADD_COMPUTED](name, typedValue)
            }
        } else if (tagName === 'ph-const') {
            const value = el.getAttribute('value')
            if (name && value) {
                const typedValue = getTypedValue({ value, context })
                context[ADD_CONST](name, typedValue)
            }
        } else if (tagName === 'ph-method') {
            const scriptElement = el.querySelector('script')
            const body = scriptElement?.textContent.trim() ?? ''
            const args = scriptElement
                ?.getAttribute('args')
                ?.split(',')
                ?.map((arg) => arg.split(':')[0].trim())
                .join(',')
            if (name && body) {
                const method = createContextMethod(context, body, args)
                context[ADD_METHOD](name, method)
            }
        }
        el.remove()
    }
}
