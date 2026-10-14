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
        document.querySelector('test-div')?.setAttribute('value', 'world')
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

test('test component with properties', async ({ page }) => {
    await page.setContent(
        createContent(/*html*/ `
            <ph-store name="test">
                <template>
                    <ph-signal name="users" value="[
                        { name: 'John', age: 30, id: 'john123' },
                        { name: 'Jane', age: 25, id: 'jane456' }
                    ]"></ph-signal>

                    <script init>
                        setTimeout(() => {
                            users = users.with(0, { name: 'John', age: 31, id: 'john123' })
                        }, 250)
                    </script>

                </template>
            </ph-store>

            <ph-component tag="test-div">
                <template properties="user">
                    <div :user-id="user.id">
                        <div id="name">Hello {{ user.name }}</div>
                        <div id="age">{{ user.age }}</div>
                    </div>
                </template>
            </ph-component>

            <ph-component tag="test-outer">
                <template use-stores="test">
                    <ph-computed name="users" value="test.users"></ph-computed>
                    <template *each="user in users">
                        <test-div .user="user"></test-div>
                    </template>
                </template>
            </ph-component>

            <test-outer></test-outer>
        `),
        { waitUntil: 'domcontentloaded' },
    )
    await expect(page.locator('div[user-id]')).toHaveCount(2)
    await expect(page.locator('div[user-id="john123"] > #name')).toHaveText('Hello John')
    await expect(page.locator('div[user-id="john123"] > #age')).toHaveText('30')
    await expect(page.locator('div[user-id="jane456"] > #name')).toHaveText('Hello Jane')
    await expect(page.locator('div[user-id="jane456"] > #age')).toHaveText('25')

    // wait for the setTimeout to update the age
    await page.waitForTimeout(300)
    await expect(page.locator('div[user-id="john123"] > #age')).toHaveText('31')
})
