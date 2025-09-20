import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    publicDir: false,
    build: {
        rollupOptions: {
            input: './playground/src/pages/Home.jsx'
        },
        // Use esbuild for minification instead of Terser
        minify: 'esbuild',
        // esbuild target
        target: 'esnext'
    },
    // esbuild options for development and dependencies
    esbuild: {
        target: 'esnext',
        platform: 'browser',
        format: 'esm',
        // Keep console.log statements
        drop: [], // Don't drop console or debugger
        // Or if you want to drop console in production:
        // drop: ['console', 'debugger'],

        // JSX configuration (if needed)
        jsxFactory: 'React.createElement',
        jsxFragment: 'React.Fragment',

        // Source maps
        sourcemap: true
    },
    // Optimize dependencies with esbuild
    optimizeDeps: {
        esbuildOptions: {
            target: 'esnext',
            platform: 'browser',
            format: 'esm'
        }
    },
    server: {
        port: 5173,
        host: "0.0.0.0"
    },
    preview: {
        port: 4173,
        host: true,
        open: false,
        strictPort: false
    }
})