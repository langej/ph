import test, { expect } from '@playwright/test'
import { createContent } from './utils'

test('test basic component declaration', async ({ page }) => {
        await page.setContent(
                createContent(/*html*/ `
                <ph-component tag="test-div">
                        <template>
                                <div>Hello World</div>
                        </template>
                        <h1>hello</h1>
                </ph-component>

                <test-div></test-div>
                `),
                { waitUntil: 'domcontentloaded' },
        )
        await expect(page.locator('test-div')).toHaveText('Hello World')
})

test('test component with attributes', async ({ page }) => {
        await page.setContent(
                createContent(/*html*/ `
                <ph-component tag="test-div">
                        <template attributes="value">
                                <div>Hello {{ value }}</div>
                        </template>
                </ph-component>

                <test-div value="test"></test-div>
                `),
                { waitUntil: 'domcontentloaded' },
        )
        const testDiv = page.locator('test-div')
        await expect(testDiv).toHaveText(`Hello test`)
        page.evaluate(() => {
                document.querySelector('test-div').setAttribute('value', 'world')
        })
        await expect(testDiv).toHaveText(`Hello world`)
})

test('test component with events', async ({ page }) => {
        await page.setContent(
                createContent(/*html*/ `
                <ph-component tag="test-div">
                        <template>
                                <ph-signal name="count" value="0"></ph-signal>
                                <ph-computed name="doubled" value="count * 2"></ph-computed>

                                <div id="count">{{ count }}</div>
                                <div id="doubled">{{ doubled }}</div>
                                <button @click="count++">Click me</button>

                                <ph-signal name="name" value="'test'"></ph-signal>
                                <div id="name">Hello {{ name }}</div>
                                <input type="text" @input="name = $e.target.value">
                        </template>
                </ph-component>
                
                <test-div></test-div>
                `),
                { waitUntil: 'domcontentloaded' },
        )
        await expect(page.locator('#count')).toHaveText('0')
        await expect(page.locator('#doubled')).toHaveText('0')

        await page.locator('button').click()
        await expect(page.locator('#count')).toHaveText('1')
        await expect(page.locator('#doubled')).toHaveText('2')

        await page.locator('button').click()
        await expect(page.locator('#count')).toHaveText('2')
        await expect(page.locator('#doubled')).toHaveText('4')

        await page.locator('input').fill('world')
        await expect(page.locator('#name')).toHaveText('Hello world')
})
