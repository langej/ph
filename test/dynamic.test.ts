import test, { expect } from '@playwright/test'
import { createContent, debug } from './utils'

test.skip('test dynamic component', async ({ page }) => {
    debug(page)
    await page.setContent(
        createContent(/*html*/ `
            <ph-component tag="test-div">
                <template>
                    <article>
                        <div style="display: none">
                            <slot></slot>
                        </div>
                        <div class="dynamic">
                            <template *each="item, idx in slots.default">
                                <div :test-id="'id-' + idx">
                                    <span>{{idx}}</span>
                                    <ph-dynamic is="item"></ph-dynamic>
                                </div>
                            </template>
                        </div>
                    </article>
                    <style>
                        .dynamic > div {
                                display: flex;
                        }
                    </style>
                </template>
            </ph-component>
            
            <test-div>
                <p>first paragraph</p>
                <input value="some input">
                <div id="slotted">Some more Content</div>
                <i>Some Footer</i>
            </test-div>
        `),
        { waitUntil: 'domcontentloaded' },
    )
    // await page.waitForTimeout(100)
    await expect(page.locator('#id-0')).toHaveText('first paragraph')
    await expect(page.locator('#id-1')).toHaveValue('some input')
    await expect(page.locator('test-div #slotted')).toHaveText('Some more Content')
    await expect(page.locator('test-div i')).toHaveText('Some Footer')
})
