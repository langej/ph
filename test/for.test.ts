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

test('test ph-for element with updates', async ({ page }) => {
    await page.setContent(
        createContent(/*html*/ `
            <ph-component tag="test-div">
                <template>
                    <ph-signal name="items" value="[1, 2, 3]"></ph-signal>

                    <ph-for *each="item, idx in items">
                        <template>
                            <div :id="'id' + '-' + idx" @click="items = items.with(idx, item+1)">{{ item }}</div>
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

    await page.locator('#id-0').click()
    await page.locator('#id-1').click()
    await page.locator('#id-2').click()
    await expect(page.locator('#id-0')).toHaveText('2')
    await expect(page.locator('#id-1')).toHaveText('3')
    await expect(page.locator('#id-2')).toHaveText('4')
})

test('test nested ph-for elements', async ({ page }) => {
    await page.setContent(
        createContent(/*html*/ `
            <ph-component tag="test-div">
                <template>
                    <ph-signal name="groups" value="[['a', 'b'], ['c']]"></ph-signal>

                    <ph-for *each="group, groupIdx in groups">
                        <template>
                            <section :id="'group-' + groupIdx">
                                <ph-for *each="item, itemIdx in group">
                                    <template>
                                        <div :id="'item-' + groupIdx + '-' + itemIdx">{{ item }}</div>
                                    </template>
                                </ph-for>
                            </section>
                        </template>
                    </ph-for>
                </template>
            </ph-component>

            <test-div></test-div>
        `),
        { waitUntil: 'domcontentloaded' },
    )

    await expect(page.locator('#item-0-0')).toHaveText('a')
    await expect(page.locator('#item-0-1')).toHaveText('b')
    await expect(page.locator('#item-1-0')).toHaveText('c')
    await expect(page.locator('#item-1-1')).not.toBeAttached()
})

test('nested template each loops support four levels and updates', async ({ page }) => {
    await page.setContent(
        createContent(/*html*/ `
            <ph-component tag="test-div">
                <template>
                    <ph-signal name="groups" value="[[[['deep-0']]]]"></ph-signal>

                    <template *each="level1, idx1 in groups">
                        <section :id="'level-1-' + idx1">
                            <template *each="level2, idx2 in level1">
                                <section :id="'level-2-' + idx1 + '-' + idx2">
                                    <template *each="level3, idx3 in level2">
                                        <section :id="'level-3-' + idx1 + '-' + idx2 + '-' + idx3">
                                            <template *each="value, idx4 in level3">
                                                <div :id="'leaf-' + idx1 + '-' + idx2 + '-' + idx3 + '-' + idx4">{{ value }}</div>
                                            </template>
                                        </section>
                                    </template>
                                </section>
                            </template>
                        </section>
                    </template>

                    <button @click="groups = [...groups, [[['deep-1']]]]">Add</button>
                    <button @click="groups = groups.slice(0, -1)">Remove</button>
                </template>
            </ph-component>

            <test-div></test-div>
        `),
        { waitUntil: 'domcontentloaded' },
    )

    await expect(page.locator('#leaf-0-0-0-0')).toHaveText('deep-0')
    await page.getByRole('button', { name: 'Add' }).click()
    await expect(page.locator('#leaf-1-0-0-0')).toHaveText('deep-1')
    await page.getByRole('button', { name: 'Remove' }).click()
    await expect(page.locator('#leaf-1-0-0-0')).not.toBeAttached()
    await expect(page.locator('#leaf-0-0-0-0')).toHaveText('deep-0')
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

test('for event handler on custom element can access parent context', async ({ page }) => {
    await page.setContent(
        createContent(/*html*/ `
            <ph-component tag="some-item">
                <template attributes="param">
                    <span id="some">{{ param }}</span>
                    <button @click="self.emit('update', 'updated')">Update</button>
                </template>
            </ph-component>

            <ph-component tag="some-manager">
                <template>
                    <ph-signal name="someValues" value="['initial']"></ph-signal>
                    <template *each="some, index in someValues">
                        <some-item :param="some" @update="someValues = someValues.with(index, $e.detail)"></some-item>
                    </template>
                    <output>{{ someValues[0] }}</output>
                </template>
            </ph-component>

            <some-manager></some-manager>
        `),
        { waitUntil: 'domcontentloaded' },
    )

    await expect(page.locator('some-item > #some')).toHaveText('initial')
    await page.getByRole('button', { name: 'Update' }).click()
    await expect(page.locator('output')).toHaveText('updated')
})
