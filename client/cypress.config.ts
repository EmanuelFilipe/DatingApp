import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: true,
  e2e: {
    baseUrl: 'https://localhost:4200',
    viewportWidth: 1920,
    viewportHeight: 1080,
    env: {
      APP_URL: 'https://localhost:4200',
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
