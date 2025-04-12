import { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
        testDir: './test',
        timeout: 30000,
        use: {
                headless: true,
                viewport: { width: 1280, height: 720 },
                screenshot: 'only-on-failure',
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
}

export default config
