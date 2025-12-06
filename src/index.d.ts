import { CONTEXT, Context } from '@elements/declarations/Context'
import { init } from './init'

declare global {
    interface Document {
        [CONTEXT]: Context
    }
    interface Element {
        [CONTEXT]?: Context
        disposes?: (() => void)[]
    }
    interface Window {
        ph: { init: typeof init }
    }
}
