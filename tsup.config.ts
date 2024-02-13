import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.tsx'],
    dts: true,
    sourcemap: true,
    clean: true,
});
