import { type PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
    testDir: './test',
    timeout: 30000,
    use: {
        headless: true,
        viewport: { width: 1280, height: 720 },
        screenshot: 'only-on-failure',
        video: 'off',
    },
    projects: [
        {
            name: 'chromium',
            use: { browserName: 'chromium' },
        },
        {
            name: 'firefox',
            use: { browserName: 'firefox' },
        },
        {
            name: 'webkit',
            use: { browserName: 'webkit' },
        },
    ],
    webServer: {
        command: 'bun run test-server',
        url: 'http://localhost:3111',
        reuseExistingServer: true,
    },
    retries: process.env.CI ? 2 : 0,
    reporter: process.env.CI ? [['github'], ['list']] : 'list',
    workers: process.env.CI ? 2 : undefined,
}

export default config
