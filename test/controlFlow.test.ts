import test, { expect } from '@playwright/test'
import { createContent } from './utils'

test('test ph-if element', async ({ page }) => {
        await page.setContent(
                createContent(/*html*/ `
                <ph-component>
                        <template tag="test-div">
                                <ph-signal name="flag" value="false"></ph-signal>

                                <ph-if value="flag">
                                        <div id="not-present">Present</div>
                                </ph-if>
                                <ph-if value="!flag">
                                        <div id="present">Not Present</div>
                                </ph-if>
                                <script on-mount>
                                        setTimeout(() => {
                                                flag = true
                                        }, 100)
                                </script>
                        </template>
                </ph-component>

                <test-div></test-div>
                `),
                { waitUntil: 'domcontentloaded' },
        )
        await expect(page.locator('#present')).toBeAttached()
        await expect(page.locator('#not-present')).not.toBeAttached()

        await page.waitForTimeout(100)
        await expect(page.locator('#present')).not.toBeAttached()
        await expect(page.locator('#not-present')).toBeAttached()
})

test('test ph-show element', async ({ page }) => {
        await page.setContent(
                createContent(/*html*/ `
                <ph-component>
                        <template tag="test-div">
                                <ph-signal name="flag" value="false"></ph-signal>

                                <ph-show value="flag">
                                        <div id="present">Present</div>
                                </ph-show>
                                <ph-show value="!flag">
                                        <div id="not-present">Not Present</div>
                                </ph-show>
                                <script on-mount>
                                        setTimeout(() => {
                                                flag = true
                                        }, 100)
                                </script>
                        </template>
                </ph-component>

                <test-div></test-div>
                `),
                { waitUntil: 'domcontentloaded' },
        )
        await expect(page.locator('#present')).not.toBeVisible()
        await expect(page.locator('#present')).toBeAttached()
        await expect(page.locator('#not-present')).toBeVisible()
        await page.waitForTimeout(100)
        await expect(page.locator('#present')).toBeVisible()
        await expect(page.locator('#not-present')).not.toBeVisible()
        await expect(page.locator('#not-present')).toBeAttached()
})

test('test ph-either element', async ({ page }) => {
        await page.setContent(
                createContent(/*html*/ `
                <ph-component>
                        <template tag="test-div">
                                <ph-signal name="count" value="2"></ph-signal>

                                <ph-either value="count % 2 === 0">
                                        <div id="even">Even</div>
                                        <div id="odd">Odd</div>
                                </ph-either>

                                <script on-mount>
                                        setTimeout(() => {
                                                count = 3
                                        }, 100)
                                </script>
                        </template>
                </ph-component>

                <test-div></test-div>
                `),
                { waitUntil: 'domcontentloaded' },
        )
        await expect(page.locator('#even')).toBeVisible()
        await expect(page.locator('#odd')).not.toBeVisible()
        await expect(page.locator('#odd')).not.toBeAttached()

        await page.waitForTimeout(100)
        await expect(page.locator('#even')).not.toBeVisible()
        await expect(page.locator('#even')).not.toBeAttached()
        await expect(page.locator('#odd')).toBeVisible()
})
