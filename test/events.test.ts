import test, { expect } from '@playwright/test'
import { createContent } from './utils'

test('test bubble up of events', async ({ page }) => {
    await page.setContent(
        createContent(/*html*/ `
            <ph-component tag="inner-div">
                <template>
                    <button @click="self.emit('custom-event', { message: 'Hello from inner-div' })">Click me</button>       
                </template>
            </ph-component>

            <ph-component tag="outer-div">
                <template>
                    <inner-div></inner-div>
                </template>
            </ph-component>


            <span id="result"></span>

            <outer-div></outer-div>

            <script>
                document.addEventListener('custom-event', (e) => {
                    document.getElementById('result').textContent = e.detail.message
                })
            </script>
        `),
        { waitUntil: 'domcontentloaded' },
    )
    await page.click('button')
    await expect(page.locator('#result')).toHaveText('Hello from inner-div')
})
