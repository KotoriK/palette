import dts from 'vite-plugin-dts'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
export default {
    plugins: [dts({ rollupTypes: true }), nodePolyfills()],
    build: {
        lib: {
            entry: 'src/index.ts',
            fileName: 'index',
            formats: ['es'],
        },
        target: 'esnext',
        minify: false,
        rollupOptions: {
            external: [/^color-space/],
        }
    }
} as import('vite').UserConfig