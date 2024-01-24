/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import('./src/env.js');

const __dirname = new URL('.', import.meta.url).pathname;

/** @type {import("next").NextConfig} */
const config = {
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },
};

export default config;
