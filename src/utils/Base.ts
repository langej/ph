export class Base extends HTMLElement {
        log(...what) {
                const id = this.id ? ` #${this.id}` : ''
                const name = this.getAttribute('name') ? ` :${this.getAttribute('name')}` : ''
                console.log(`[${this.tagName}${name}${id}]`, ...what)
        }

        mount() {}
        unmount() {}

        connectedCallback() {
                this.mount()
        }

        disconnectedCallback() {
                this.unmount()
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
                const ev = !detail ? new Event(event) : new CustomEvent(event, { detail })
                this.dispatchEvent(ev)
        }
}
