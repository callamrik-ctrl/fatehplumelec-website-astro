import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://fatehplumelec.com",
  build: {
    format: "file"
  },
  integrations: [sitemap()]
});

