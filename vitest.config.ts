import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globalSetup: ['./test/global-setup.ts'],
    include: ['test/**/*.test.ts'],
    // Build-validation and order tests swap the live Product Config file and
    // build into a shared dist-fixture/; running test files in parallel would
    // race on both. File-level serialization is the price of testing at the
    // build-process seam.
    fileParallelism: false,
  },
});
