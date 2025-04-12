import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'
import { Page } from 'playwright'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const phScript = readFileSync(join(__dirname, '../dist/ph.js'), 'utf-8')

export const createContent = (content: string) => `
        <script>${phScript}</script>
        ${content}
`

export const debug = (page: Page) => {
        page.on('console', (msg) => {
                console.debug(`[PH DEBUG] ${msg.type()}: ${msg.text()}`)
        })
}
