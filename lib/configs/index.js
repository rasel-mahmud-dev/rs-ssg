const defaultConfig = {
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
    resolve: {
        alias: {
            '@': '/src'
        }
    }
}

export default defaultConfig