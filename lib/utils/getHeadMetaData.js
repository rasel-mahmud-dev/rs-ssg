
const getValue = (pageValue, configValue, defaultValue = '') => {
    return pageValue || configValue || defaultValue;
};

  function getHeadMetaData(content, configSeo, routeData = {}) {
    const enableStructuredData = configSeo?.enableStructuredData ?? false;

      const seoRegex = /<script type="application\/json" id="seo-data">(.*?)<\/script>/s;
      const match = content.match(seoRegex);

      let pageSeoData = {};

      if (match && match[1]) {
          try {
              pageSeoData = JSON.parse(match[1]);
          } catch (err) {
              console.error("Invalid SEO JSON:", err);
          }
          content = content.replace(seoRegex, '');
      }

      const fullSitePath = (configSeo?.siteUrl || 'https://rsraselmahmuddev.vercel.app') + (routeData?.path || '/');


    const getImageUrl = (image) => {
        if (!image) return configSeo?.ogImage || '';
        if (image.startsWith('http')) return image;
        return `${configSeo?.siteUrl || ''}${image}`;
    };

    const getCurrentUrl = (path = '') => {
        const siteUrl = configSeo?.siteUrl || 'https://rsraselmahmuddev.vercel.app';
        return `${siteUrl}${path}`;
    };

    const configSeoData = configSeo?.seo ?? {}

    let finalTitle = getValue(
        pageSeoData?.title,
        configSeoData?.title
    );

    if (configSeoData?.titleTemplate && configSeoData.title && !configSeoData.title.includes('|')) {
        finalTitle = configSeo.titleTemplate.replace('%s', configSeoData.title);
    }

    const mergedSeo = {
        title: finalTitle,
        description: getValue(configSeoData?.description, pageSeoData?.description, 'This is my awesome app.'),
        keywords: getValue(configSeoData?.keywords, pageSeoData?.keywords, 'web app, javascript, react, modern web'),
        author: getValue(configSeoData?.author, pageSeoData?.author, 'RS Rasel Mahmud'),
        robots: getValue(configSeoData?.robots, pageSeoData?.robots, 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'),
        canonical: getValue(configSeoData?.canonical, getCurrentUrl(pageSeoData?.path), getCurrentUrl(routeData.path)),
        url: fullSitePath,
        // Open Graph
        ogTitle: getValue(configSeoData?.ogTitle, finalTitle),
        ogDescription: getValue(configSeoData?.ogDescription, pageSeoData?.ogDescription, 'This is my awesome app.'),
        ogImage: getImageUrl(configSeoData?.ogImage || pageSeoData?.ogImage),
        ogImageAlt: getValue(configSeoData?.ogImageAlt,  finalTitle),
        ogType: getValue(configSeoData?.ogType,  pageSeoData?.ogType,  'website'),
        ogUrl: fullSitePath,
        ogSiteName: getValue(configSeoData?.ogSiteName, 'RS Rasel Mahmud Dev'),
        ogLocale: getValue(configSeoData?.ogLocale,   'en_US'),

        // Twitter
        twitterCard: getValue(configSeoData?.twitterCard,  configSeoData?.twitterCard,'summary_large_image'),
        twitterSite: getValue(configSeoData?.twitterSite, configSeoData?.twitterCard,'@yourtwitterhandle'),
        twitterCreator: getValue(configSeoData?.twitterCreator, configSeoData?.twitterCard, '@yourtwitterhandle'),
        twitterTitle: getValue(configSeoData.title,configSeoData?.twitterCard, finalTitle),
        twitterDescription: getValue(configSeoData.description, configSeo?.description, 'This is my awesome app.'),
        twitterImage: getImageUrl(configSeoData.image, configSeoData?.twitterCard, routeData.image),
        twitterImageAlt: getValue(configSeoData.imageAlt, routeData.title, finalTitle),

        // Theme and branding
        themeColor: getValue(configSeoData.themeColor, "", '#000000'),
        appleMobileWebAppTitle: getValue(configSeoData.appleMobileWebAppTitle, "", finalTitle),

        // Language
        language: getValue(configSeoData.language, pageSeoData?.language, 'en-US'),
        contentLanguage: getValue(configSeoData.language, pageSeoData?.language, 'en-US'),
        security:  {
            contentSecurityPolicy: getValue(configSeoData?.security?.contentSecurityPolicy, ""),
            xContentTypeOptions: getValue(configSeoData?.security?.xContentTypeOptions, ""),
            referrerPolicy: getValue(configSeoData?.security?.referrerPolicy, ""),
            xFrameOptions: getValue(configSeoData?.security?.xFrameOptions, ""),

        }
    };

    const pageMetaTags = pageSeoData?.meta || [];
    const pageLinkTags = pageSeoData?.link || [];
    const pageScriptTags = pageSeoData?.script || [];

    const customMetaTags = pageMetaTags.map(tag => {
        const attrs = Object.entries(tag)
            .filter(([key, value]) => value !== undefined && value !== null && value !== '')
            .map(([key, value]) => `${key}="${String(value).replace(/"/g, '&quot;')}"`)
            .join(' ');
        return attrs ? `<meta ${attrs}>` : '';
    }).filter(Boolean).join('\n');

    const customLinkTags = pageLinkTags.map(tag => {
        const attrs = Object.entries(tag)
            .filter(([key, value]) => value !== undefined && value !== null && value !== '')
            .map(([key, value]) => `${key}="${String(value).replace(/"/g, '&quot;')}"`)
            .join(' ');
        return attrs ? `<link ${attrs}>` : '';
    }).filter(Boolean).join('\n');

    const customScriptTags = pageScriptTags.map(tag => {
        const attrs = Object.entries(tag)
            .filter(([key, value]) => key !== 'content' && value !== undefined && value !== null && value !== '')
            .map(([key, value]) => `${key}="${String(value).replace(/"/g, '&quot;')}"`)
            .join(' ');
        const content = tag.content || '';
        return `<script ${attrs}>${content}</script>`;
    }).filter(tag => tag !== '<script></script>').join('\n');

    const articleStructuredData = routeData.type === 'article' ? `
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${mergedSeo.ogTitle}",
  "description": "${mergedSeo.ogDescription}",
  "image": "${mergedSeo.ogImage}",
  "author": {
    "@type": "Person",
    "name": "${mergedSeo.author}"
  },
  "publisher": {
    "@type": "Organization",
    "name": "${mergedSeo.ogSiteName}"
  },
  "datePublished": "${routeData.publishDate || new Date().toISOString()}",
  "dateModified": "${routeData.modifiedDate || routeData.publishDate || new Date().toISOString()}",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "${mergedSeo.ogUrl}"
  }
}
</script>` : '';

    const { security } = mergedSeo;
      const securityMetaTags = `
  ${security?.contentSecurityPolicy
          ? `<meta http-equiv="Content-Security-Policy" content="${security.contentSecurityPolicy}">`
          : ''}

  ${security?.xContentTypeOptions
          ? `<meta http-equiv="X-Content-Type-Options" content="${security.xContentTypeOptions}">`
          : ''}

  ${security?.referrerPolicy
          ? `<meta http-equiv="Referrer-Policy" content="${security.referrerPolicy}">`
          : ''}

  ${security?.xFrameOptions
          ? `<meta http-equiv="X-Frame-Options" content="${security.xFrameOptions}">`
          : ''}
`;

    const headMetadata = `
<!-- Basic Meta Tags -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="format-detection" content="telephone=no">
<meta name="theme-color" content="${mergedSeo.themeColor}">

<!-- Favicon and Icons -->
<link rel="icon" type="image/png" href="/favicon.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="msapplication-TileColor" content="${mergedSeo.themeColor}">

<!-- Title and Description -->
<title>${mergedSeo.title}</title>
<meta name="description" content="${mergedSeo.description}">
<meta name="url" content="${mergedSeo.url}">
<meta name="keywords" content="${mergedSeo.keywords}">
<meta name="author" content="${mergedSeo.author}">
<meta name="robots" content="${mergedSeo.robots}">

<!-- Canonical URL -->
<link rel="canonical" href="${mergedSeo.canonical}">

<!-- Language and Locale -->
<meta http-equiv="content-language" content="${mergedSeo.contentLanguage}">
<meta name="language" content="English">

<!-- Open Graph (Facebook, LinkedIn, etc.) -->
<meta property="og:title" content="${mergedSeo.ogTitle}">
<meta property="og:description" content="${mergedSeo.ogDescription}">
<meta property="og:image" content="${mergedSeo.ogImage}">
<meta property="og:image:alt" content="${mergedSeo.ogImageAlt}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:type" content="${mergedSeo.ogType}">
<meta property="og:url" content="${mergedSeo.ogUrl}">
<meta property="og:site_name" content="${mergedSeo.ogSiteName}">
<meta property="og:locale" content="${mergedSeo.ogLocale}">

<!-- Twitter Card -->
<meta name="twitter:card" content="${mergedSeo.twitterCard}">
<meta name="twitter:site" content="${mergedSeo.twitterSite}">
<meta name="twitter:creator" content="${mergedSeo.twitterCreator}">
<meta name="twitter:title" content="${mergedSeo.twitterTitle}">
<meta name="twitter:description" content="${mergedSeo.twitterDescription}">
<meta name="twitter:image" content="${mergedSeo.twitterImage}">
<meta name="twitter:image:alt" content="${mergedSeo.twitterImageAlt}">

<!-- Additional SEO Meta Tags -->
<meta name="revisit-after" content="7 days">
<meta name="rating" content="general">
<meta name="distribution" content="global">
<meta name="coverage" content="worldwide">
<meta name="target" content="all">
<meta name="HandheldFriendly" content="true">
<meta name="MobileOptimized" content="width">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="${mergedSeo.appleMobileWebAppTitle}">

<!-- Preconnect for Performance -->
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://www.google-analytics.com" crossorigin>
<link rel="dns-prefetch" href="//www.google-analytics.com">

<!-- Page-specific Meta Tags -->
${customMetaTags}

<!-- Page-specific Link Tags -->
${customLinkTags}

<!-- Structured Data (JSON-LD) -->
${
        enableStructuredData ? `<script type="application/ld+json">
            {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "${mergedSeo.ogSiteName}",
                "url": "${configSeo?.siteUrl || 'https://rsraselmahmuddev.vercel.app'}",
                "description": "${mergedSeo.description}",
                "author": {
                "@type": "Person",
                "name": "${mergedSeo.author}",
                "url": "${configSeo?.siteUrl || 'https://rsraselmahmuddev.vercel.app'}"
            },
                "potentialAction": {
                "@type": "SearchAction",
                "target": "${configSeo?.siteUrl || 'https://rsraselmahmuddev.vercel.app'}/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
            }
            }
        </script>` : ''
    }

<!-- Article Structured Data -->
${articleStructuredData}

<!-- Page-specific Scripts -->
${customScriptTags}

<!-- Security Headers --> 
${securityMetaTags}

<!-- Sitemap -->
<link rel="sitemap" type="application/xml" href="/sitemap.xml">
    `.trim();

    return {
        html: content,
        headMetadata
    };
}

export default getHeadMetaData;