import test, { expect } from '@playwright/test'
import { createContent } from './utils'

test('test counter with store', async ({ page }) => {
        await page.setContent(
                createContent(/*html*/ `

                <ph-store name="counter">
                        <template>
                                <ph-signal name="count" value="0"></ph-signal>
                                <ph-computed name="double" value="count * 2"></ph-computed>

                                <ph-method name="increment">
                                    <script>
                                        count += 1
                                    </script>
                                </ph-method>

                                <ph-method name="decrement">
                                    <script>
                                        count -= 1
                                    </script>
                                </ph-method>

                                <script init>
                                    count = 1
                                </script>
                        </template>
                </ph-store>

                <ph-component tag="test-div">
                        <template use-stores="counter">
                                <ph-signal name="count" value="0"></ph-signal>
                                <div id="count">{{ $counter.count }}</div>
                                <div id="double">{{ $counter.double }}</div>
                                <button id="increment" @click="$counter.increment()">Increment</button>
                                <button id="decrement" @click="$counter.decrement()">Decrement</button>
                        </template>
                </ph-component>

                <test-div></test-div>
                `),
                { waitUntil: 'domcontentloaded' },
        )
        await expect(page.locator('#count')).toHaveText('1')
        await expect(page.locator('#double')).toHaveText('2')

        await page.locator('#increment').click()
        await expect(page.locator('#count')).toHaveText('2')
        await expect(page.locator('#double')).toHaveText('4')

        await page.locator('#increment').click()
        await expect(page.locator('#count')).toHaveText('3')
        await expect(page.locator('#double')).toHaveText('6')

        await page.locator('#decrement').click()
        await expect(page.locator('#count')).toHaveText('2')
        await expect(page.locator('#double')).toHaveText('4')
})

test('test counter with store (without $ prefix)', async ({ page }) => {
        await page.setContent(
                createContent(/*html*/ `

                <ph-store name="counter">
                        <template>
                                <ph-signal name="count" value="0"></ph-signal>
                                <ph-computed name="double" value="count * 2"></ph-computed>

                                <ph-method name="increment">
                                    <script>
                                        count += 1
                                    </script>
                                </ph-method>

                                <ph-method name="decrement">
                                    <script>
                                        count -= 1
                                    </script>
                                </ph-method>

                                <script init>
                                    count = 1
                                </script>
                        </template>
                </ph-store>

                <ph-component tag="test-div">
                        <template use-stores="counter">
                                <div id="count">{{ counter.count }}</div>
                                <div id="double">{{ counter.double }}</div>
                                <button id="increment" @click="counter.increment()">Increment</button>
                                <button id="decrement" @click="counter.decrement()">Decrement</button>
                        </template>
                </ph-component>

                <test-div></test-div>
                `),
                { waitUntil: 'domcontentloaded' },
        )
        await expect(page.locator('#count')).toHaveText('1')
        await expect(page.locator('#double')).toHaveText('2')

        await page.locator('#increment').click()
        await expect(page.locator('#count')).toHaveText('2')
        await expect(page.locator('#double')).toHaveText('4')

        await page.locator('#increment').click()
        await expect(page.locator('#count')).toHaveText('3')
        await expect(page.locator('#double')).toHaveText('6')

        await page.locator('#decrement').click()
        await expect(page.locator('#count')).toHaveText('2')
        await expect(page.locator('#double')).toHaveText('4')
})
