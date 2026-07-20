// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // No test here touches the DOM (all are pure file-text / math assertions),
    // so run in node — avoids a jsdom devDependency that was never installed.
    environment: 'node',
    globals: true,
  },
});
