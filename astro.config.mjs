// @js-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: "https://kolop-code.github.io",
  base: "/sokol-kostelec-website",
  output: "static",
  trailingSlash: "always"
});
