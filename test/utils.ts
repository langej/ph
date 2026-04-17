import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'
import { type Page } from 'playwright'

const //
    __filename = fileURLToPath(import.meta.url),
    __dirname = dirname(__filename),
    phScript = readFileSync(join(__dirname, '../dist/ph.js'), 'utf-8')

export const //
    debug = (page: Page) => {
        page.on('console', (msg) => {
            // console.debug(`[PH DEBUG] ${msg.type()}: ${msg.text()}`)
        })
    },
    createContent = (content: string) => /* html */ `
<script type="module">
    const //
        moduleCode = ${JSON.stringify(phScript)},
        blob = new Blob([moduleCode], { type: 'application/javascript' }),
        url = URL.createObjectURL(blob);
    
    import(url).then(ph => {
        window.ph = ph;
        if (ph.init) {
            ph.init();
        } else if (ph.default && ph.default.init) {
            ph.default.init();
        }
    });
</script>
${content}
`
