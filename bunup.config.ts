import { defineConfig } from "bunup";

export default defineConfig({
  clean: true,
  dts: {
    inferTypes: true
  },
  entry: [
    "src-new/index.ts"
  ],
  format: ["cjs", "esm"],
  minify: true,
  outDir: "dist",
  splitting: false
});
