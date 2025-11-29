import test, { expect } from '@playwright/test'
import { createContent, debug } from './utils'

test('test ph-for element', async ({ page }) => {
        await page.setContent(
                createContent(/*html*/ `
                <ph-component tag="test-div">
                        <template>
                                <ph-signal name="items" value="[1, 2, 3]"></ph-signal>

                                <ph-for *each="item, idx in items">
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
                <ph-component tag="test-div">
                        <template>
                                <ph-signal name="items" value="[1, 2, 3]"></ph-signal>

                                <div>
                                        <template *each="item, idx in items">
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

test('test for template element without parent element', async ({ page }) => {
        await page.setContent(
                createContent(/*html*/ `
                <ph-component tag="test-div">
                        <template>
                                <ph-signal name="items" value="[1, 2, 3]"></ph-signal>

                                <template *each="item, idx in items">
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

test('for element should adapt to length changes', async ({ page }) => {
        await page.setContent(
                createContent(/*html*/ `
                <ph-component tag="test-div">
                        <template>
                                <ph-signal name="items" value="[1, 2, 3]"></ph-signal>

                                <template *each="item, idx in items">
                                        <div :id="'id' + '-' + idx">{{ item }}</div>
                                </template>

                                <button @click="items = [...items, items.length + 1]">+</button>
                                <button @click="items = items.slice(0, -1)">-</button>
                        </template>
                </ph-component>

                <test-div></test-div>
                `),
                { waitUntil: 'domcontentloaded' },
        )
        await expect(page.locator('#id-0')).toHaveText('1')
        await expect(page.locator('#id-1')).toHaveText('2')
        await expect(page.locator('#id-2')).toHaveText('3')

        const addButton = page.locator('button').nth(0)
        await addButton.click()
        await expect(page.locator('#id-3')).toHaveText('4')

        const removeButton = page.locator('button').nth(1)

        await removeButton.click()
        await expect(page.locator('#id-0')).toHaveText('1')
        await expect(page.locator('#id-1')).toHaveText('2')
        await expect(page.locator('#id-2')).toHaveText('3')
        await expect(page.locator('#id-3')).not.toBeAttached()

        await removeButton.click()
        await expect(page.locator('#id-0')).toHaveText('1')
        await expect(page.locator('#id-1')).toHaveText('2')
        await expect(page.locator('#id-2')).not.toBeAttached()
        await expect(page.locator('#id-3')).not.toBeAttached()

        await removeButton.click()
        await expect(page.locator('#id-0')).toHaveText('1')
        await expect(page.locator('#id-1')).not.toBeAttached()
        await expect(page.locator('#id-2')).not.toBeAttached()
        await expect(page.locator('#id-3')).not.toBeAttached()
})
