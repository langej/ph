import { CONTEXT, Context } from '@elements/declarations/Context'
import { init } from '@/init'
import { Dispose } from '@utils/Utils'

declare global {
    interface Document {
        [CONTEXT]: Context
    }
    interface Element {
        [CONTEXT]?: Context
        disposes?: Dispose[]
    }
    interface Window {
        ph: { init: typeof init }
    }
}
