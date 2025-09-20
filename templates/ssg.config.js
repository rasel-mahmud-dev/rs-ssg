
export default {
    siteUrl: 'https://rsraselmahmuddev.vercel.app',
    siteName: 'RS Rasel Mahmud Dev',
    port: 3000,
    seo: {
        // Default SEO settings - will be used if not overridden in page layer
        title: 'RS Rasel Mahmud Dev - Full Stack Developer',
        titleTemplate: '%s | RS Rasel Mahmud Dev', // %s will be replaced with page title
        description: 'Full Stack Developer specializing in React, Node.js, and modern web technologies. Building scalable web applications and digital solutions.',
        keywords: 'full stack developer, react, nodejs, javascript, web development, frontend, backend, API, database, mongodb, postgresql',
        author: 'RS Rasel Mahmud',
        language: 'en-US',
        locale: 'en_US',

        // Open Graph defaults
        ogType: 'website',
        ogSiteName: 'RS Rasel Mahmud Dev',
        ogImage: '/images/og-default.jpg',
        ogImageAlt: 'RS Rasel Mahmud Dev - Full Stack Developer',
        ogImageWidth: '1200',
        ogImageHeight: '630',

        // Twitter Card defaults
        twitterCard: 'summary_large_image',
        twitterSite: '@rsraselmahmud',
        twitterCreator: '@rsraselmahmud',
        twitterImage: '/images/twitter-default.jpg',
        twitterImageAlt: 'RS Rasel Mahmud Dev - Full Stack Developer',

        // Technical SEO defaults
        robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
        googlebot: 'index, follow',
        revisitAfter: '7 days',
        rating: 'general',
        distribution: 'global',

        enableStructuredData: false,
        structuredData: {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'RS Rasel Mahmud Dev',
            url: 'https://rsraselmahmuddev.vercel.app',
            description: 'Full Stack Developer specializing in React, Node.js, and modern web technologies.',
            author: {
                '@type': 'Person',
                name: 'RS Rasel Mahmud',
                url: 'https://rsraselmahmuddev.vercel.app',
                jobTitle: 'Full Stack Developer',
                worksFor: {
                    '@type': 'Organization',
                    name: 'Freelance'
                }
            },
            potentialAction: {
                '@type': 'SearchAction',
                target: 'https://rsraselmahmuddev.vercel.app/search?q={search_term_string}',
                'query-input': 'required name=search_term_string'
            }
        },

        // Theme and branding
        themeColor: '#000000',
        backgroundColor: '#ffffff',

        // Icons and manifest
        icons: {
            favicon: '/favicon.ico',
            icon16: '/favicon-16x16.png',
            icon32: '/favicon-32x32.png',
            appleTouchIcon: '/apple-touch-icon.png',
            androidIcon192: '/android-chrome-192x192.png',
            androidIcon512: '/android-chrome-512x512.png'
        },

        // Manifest settings
        manifest: '/site.webmanifest',

        // Additional meta tags
        additionalMetaTags: [
            {
                name: 'format-detection',
                content: 'telephone=no'
            },
            {
                httpEquiv: 'X-UA-Compatible',
                content: 'IE=edge'
            },
            {
                name: 'HandheldFriendly',
                content: 'true'
            },
            {
                name: 'MobileOptimized',
                content: 'width'
            },
            {
                name: 'apple-mobile-web-app-capable',
                content: 'yes'
            },
            {
                name: 'apple-mobile-web-app-status-bar-style',
                content: 'black-translucent'
            }
        ],

        // Additional link tags
        additionalLinkTags: [
            {
                rel: 'preconnect',
                href: 'https://fonts.googleapis.com',
                crossOrigin: 'anonymous'
            },
            {
                rel: 'preconnect',
                href: 'https://fonts.gstatic.com',
                crossOrigin: 'anonymous'
            },
            {
                rel: 'dns-prefetch',
                href: '//www.google-analytics.com'
            },
            {
                rel: 'sitemap',
                type: 'application/xml',
                href: '/sitemap.xml'
            },
            {
                rel: 'alternate',
                type: 'application/rss+xml',
                title: 'RSS Feed',
                href: '/feed.xml'
            }
        ],

        // Security headers
        security: {
            contentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:;",
            xFrameOptions: 'DENY',
            xContentTypeOptions: 'nosniff',
            referrerPolicy: 'strict-origin-when-cross-origin'
        }
    },
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