export default {
    build: {
        outDir: 'dist',
        sourcemap: true
    },
    devServer: {
        port: 5111,
        host: '0.0.0.0',
        open: true
    },
    preview: {
        port: 4111,
        open: false
    },
    resolve: {
        alias: {
            '@': '/src'
        }
    }
}