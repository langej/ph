import { Dispose } from './Utils'

export class Base extends HTMLElement {
    #disposes: Dispose[] = []

    log(...content: any[]) {
        const id = this.id ? ` #${this.id}` : ''
        const name = this.getAttribute('name') ? ` :${this.getAttribute('name')}` : ''
        console.log(`[${this.tagName}${name}${id}]`, ...content)
    }

    mount() {}
    unmount() {}

    connectedCallback() {
        this.mount()
    }

    disconnectedCallback() {
        this.unmount()
        this.#disposes?.forEach((d) => d())
        this.#disposes = []
    }

    on(event: string, cb: (ev: Event | CustomEvent) => void) {
        this.#disposes?.push(() => this.removeEventListener(event, cb))
        return this.addEventListener(event, cb)
    }

    getHost(): Element {
        const root = this.getRootNode()
        // @ts-ignore
        return root.host ?? root
    }

    emit<T>(event: string, detail?: T, options?: { composed?: boolean; bubbles?: boolean; cancelable?: boolean }) {
        const ev = !detail
            ? new Event(event, { composed: options?.composed ?? true, bubbles: options?.bubbles ?? true, cancelable: options?.cancelable ?? false })
            : new CustomEvent(event, {
                  detail,
                  composed: options?.composed ?? true,
                  bubbles: options?.bubbles ?? true,
                  cancelable: options?.cancelable ?? false,
              })
        this.dispatchEvent(ev)
    }

    onRemove(fn: () => void) {
        this.#disposes.push(fn)
    }
}
