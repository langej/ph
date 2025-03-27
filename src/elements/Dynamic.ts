import { Base } from '../utils/Base'
import { CONTEXT } from './declarations/Context'

export class PhDynamic extends Base {
        mount() {
                const is = this.getAttribute('is')
                const context = this.getHost()?.[CONTEXT]
                if (is && context) {
                        setTimeout(() => {
                                this.replaceWith(context[is].value)
                        })
                }
        }
}
