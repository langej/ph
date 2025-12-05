import test, { expect } from '@playwright/test'
import { createContent, debug } from './utils'

test('should work with slots', async ({ page }) => {
    debug(page)
    await page.setContent(
        createContent(/*html*/ `
        <ph-component tag="test-div">
            <template>
                <article>
                    <header><slot name="header">HEADER</slot></header>
                    <slot></slot>
                    <footer><slot name="footer">FOOTER</slot></footer>
                </article>
            </template>
        </ph-component>
        
        <test-div>
            <h1 slot="header">Some Heading</h1>
            <p>Some Content</p>
            <div>Some more Content</div>
            <i slot="footer">Some Footer</i>
        </test-div>
        `),
        { waitUntil: 'domcontentloaded' },
    )
    await expect(page.locator('test-div h1')).toHaveText('Some Heading')
    await expect(page.locator('test-div h1')).toBeInViewport()
    await expect(page.locator('test-div i')).toHaveText('Some Footer')
    await expect(page.locator('test-div i')).toBeInViewport()
    await expect(page.locator('test-div p')).toHaveText('Some Content')
    await expect(page.locator('test-div p')).toBeInViewport()
    await expect(page.locator('test-div div')).toHaveText('Some more Content')
    await expect(page.locator('test-div div')).toBeInViewport()
})
