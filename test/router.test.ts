import test, { expect } from '@playwright/test'
import { createContent } from './utils'

test('renders the matching route and updates for browser navigation', async ({ page }) => {
    await page.goto('http://localhost:3111/')
    await page.setContent(
        createContent(/*html*/ `
            <ph-component tag="home-page">
                <template>
                    <span>home-page</span>
                </template>
            </ph-component>
            <ph-component tag="task-page">
                <template>
                    <span id="task-id">{{ router.params.taskId }}</span>
                    <button id="back-button" @click="router.push('/tasks')">Back</button>
                </template>
            </ph-component>
            <ph-component tag="task-list-page">
                <template>
                    <span>task-list-page</span>
                </template>
            </ph-component>
            <ph-router>
                <home-page path="/">Home</home-page>
                <task-list-page path="/tasks">Tasks</task-list-page>
                <task-page path="/tasks/:taskId"></task-page>
                <not-found-page path="*">Not found</not-found-page>
            </ph-router>
        `),
        { waitUntil: 'domcontentloaded' },
    )

    await expect(page.locator('home-page')).toBeVisible()
    await expect(page.locator('task-list-page')).toBeHidden()

    await page.evaluate(() => {
        window.history.pushState({}, '', '/tasks/42')
        window.dispatchEvent(new PopStateEvent('popstate'))
    })
    await expect(page.locator('task-page')).toBeVisible()
    await expect(page.locator('#task-id')).toHaveText('42')
    await expect(page.locator('not-found-page')).toBeHidden()
    await page.click('#back-button')
    await expect(page.locator('task-list-page')).toBeVisible()
    await expect(page.locator('task-page')).toBeHidden()

    await page.evaluate(() => {
        window.history.pushState({}, '', '/missing')
        window.dispatchEvent(new PopStateEvent('popstate'))
    })
    await expect(page.locator('not-found-page')).toBeVisible()
})
