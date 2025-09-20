export default {
    siteUrl: 'https://example.com',
    siteName: 'My App',
    port: 3000,
    host: 'localhost',
    pagesDir: './pages',
    publicDir: './public',
    buildDir: './.my-framework',
    outputDir: './dist',

    redirects: async () => {
        return [
            {
                source: '/old-page',
                destination: '/new-page',
                permanent: true
            }
        ];
    },

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