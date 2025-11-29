export class Base extends HTMLElement {
        #disposes?: (() => void)[] = []

        log(...content) {
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
                return this.addEventListener(event, cb)
        }

        getHost(): Element {
                const root = this.getRootNode()
                // @ts-ignore
                return root.host ?? root
        }

        emit<T>(event: string, detail?: T) {
                const ev = !detail ? new Event(event, { composed: true }) : new CustomEvent(event, { detail, composed: true })
                this.dispatchEvent(ev)
        }

        defer(fn) {
                this.#disposes.push(fn)
        }
}
