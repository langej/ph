import test, { expect } from '@playwright/test'
import { createContent, debug } from './utils'
import http from 'http'

test.beforeAll(async ({ browser }) => {
        // Start test server
        const server = http.createServer((req, res) => {
                res.writeHead(200)
                res.end()
        })
        server.listen(3111)
})

test('test ph-signal', async ({ page }) => {
        let count = 42
        await page.setContent(
                createContent(/*html*/ `
                <ph-component>
                        <template tag="test-div">
                                <ph-signal name="count" value="0"></ph-signal>
                                <div id="count">{{ count }}</div>
                                <script on-mount>
                                        setTimeout(() => {
                                                count = ${count}
                                        }, 100)
                                </script>
                        </template>
                </ph-component>
                
                <test-div></test-div>
                `),
                { waitUntil: 'domcontentloaded' },
        )
        await expect(page.locator('#count')).toHaveText('0')
        await page.waitForTimeout(100)
        await expect(page.locator('#count')).toHaveText(`${count}`)
})

test('test ph-computed', async ({ page }) => {
        let count = 42
        await page.setContent(
                createContent(/*html*/ `
                <ph-component>
                        <template tag="test-div">
                                <ph-signal name="count" value="0"></ph-signal>
                                <ph-computed name="doubled" value="count * 2"></ph-computed>
                                <div id="count">{{ count }}</div>
                                <div id="doubled">{{ doubled }}</div>
                                <script on-mount>
                                        setTimeout(() => {
                                                count = ${count}
                                        }, 100)
                                </script>
                        </template>
                </ph-component>
                
                <test-div></test-div>
                `),
                { waitUntil: 'domcontentloaded' },
        )
        await expect(page.locator('#count')).toHaveText('0')
        await expect(page.locator('#doubled')).toHaveText('0')
        await page.waitForTimeout(100)
        await expect(page.locator('#count')).toHaveText(`${count}`)
        await expect(page.locator('#doubled')).toHaveText(`${count * 2}`)
})

test('test local storage persistence', async ({ page }) => {
        await page.goto('http://localhost:3111')
        await page.setContent(
                createContent(/*html*/ `
                <ph-component>
                        <template tag="test-div">
                                <ph-signal name="username" value="'John Doe'" local-storage></ph-signal>
                                <ph-signal name="count" value="0" local-storage="test"></ph-signal>
                                <div id="count">{{ count }}</div>
                                <div id="username">{{ username }}</div>
                        </template>
                </ph-component>
                <test-div></test-div>
                `),
        )
        expect(page.locator('#username')).toHaveText('John Doe')
        expect(page.locator('#count')).toHaveText('0')
        const localStorageData = await page.evaluate(() => {
                return {
                        username: JSON.parse(localStorage.getItem('username')),
                        count: JSON.parse(localStorage.getItem('test/count')),
                }
        })

        expect(localStorageData).toEqual({
                username: 'John Doe',
                count: 0,
        })
})
