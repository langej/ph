import test, { expect } from '@playwright/test'
import { createContent } from './utils'

test('test ph-for element', async ({ page }) => {
        await page.setContent(
                createContent(/*html*/ `
                <ph-component>
                        <template tag="test-div">
                                <ph-signal name="items" value="[1, 2, 3]"></ph-signal>

                                <ph-for each="item, idx in items">
                                        <template>
                                                <div :id="'id' + '-' + idx">{{ item }}</div>
                                        </template>
                                </ph-for>
                        </template>
                </ph-component>
                
                <test-div></test-div>
                `),
                { waitUntil: 'domcontentloaded' },
        )
        await expect(page.locator('#id-0')).toHaveText('1')
        await expect(page.locator('#id-1')).toHaveText('2')
        await expect(page.locator('#id-2')).toHaveText('3')
})

test('test for template element with parent element', async ({ page }) => {
        await page.setContent(
                createContent(/*html*/ `
                <ph-component>
                        <template tag="test-div">
                                <ph-signal name="items" value="[1, 2, 3]"></ph-signal>

                                <div>
                                        <template each="item, idx in items">
                                                <div :id="'id' + '-' + idx">{{ item }}</div>
                                        </template>
                                </div>
                        </template>
                </ph-component>

                <test-div></test-div>
                `),
                { waitUntil: 'domcontentloaded' },
        )
        await expect(page.locator('#id-0')).toHaveText('1')
        await expect(page.locator('#id-1')).toHaveText('2')
        await expect(page.locator('#id-2')).toHaveText('3')
})

test.skip('test for template element without parent element', async ({ page }) => {
        await page.setContent(
                createContent(/*html*/ `
                <ph-component>
                        <template tag="test-div">
                                <ph-signal name="items" value="[1, 2, 3]"></ph-signal>

                                <template each="item, idx in items">
                                        <div :id="'id' + '-' + idx">{{ item }}</div>
                                </template>
                        </template>
                </ph-component>

                <test-div></test-div>
                `),
                { waitUntil: 'domcontentloaded' },
        )
        await expect(page.locator('#id-0')).toHaveText('1')
        await expect(page.locator('#id-1')).toHaveText('2')
        await expect(page.locator('#id-2')).toHaveText('3')
})
