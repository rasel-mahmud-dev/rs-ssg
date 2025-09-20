import React from 'react';

const Seo = (props) => {
    const children = Array.isArray(props.children) ? props.children : [props.children];
    const flatChildren = children.flat().filter(Boolean);

    const titleElement = flatChildren.find(child =>
        child?.type === 'title' || child?.props?.tagName === 'title'
    );

    const metaTags = flatChildren
        .filter(child => child?.type === 'meta' || child?.props?.tagName === 'meta')
        .map(tag => {
            const props = tag.props || {};
            // Capture all possible meta attributes
            return {
                name: props.name,
                content: props.content,
                property: props.property,
                httpEquiv: props.httpEquiv,
                charset: props.charset,
                itemProp: props.itemProp,
                // Include any custom attributes (like about_author)
                ...Object.keys(props).reduce((acc, key) => {
                    if (!['children', 'tagName'].includes(key)) {
                        acc[key] = props[key];
                    }
                    return acc;
                }, {})
            };
        })
        .filter(tag =>
            tag.name || tag.property || tag.httpEquiv || tag.charset || tag.itemProp ||
            // Include any tag that has content and at least one attribute
            (tag.content && Object.keys(tag).length > 1)
        );

    const linkTags = flatChildren
        .filter(child => child?.type === 'link' || child?.props?.tagName === 'link')
        .map(tag => {
            const props = tag.props || {};
            return {
                rel: props.rel,
                href: props.href,
                type: props.type,
                hreflang: props.hreflang,
                media: props.media,
                sizes: props.sizes,
                crossOrigin: props.crossOrigin,
                as: props.as,
                title: props.title,
                // Include any custom attributes (like about_icon)
                ...Object.keys(props).reduce((acc, key) => {
                    if (!['children', 'tagName'].includes(key)) {
                        acc[key] = props[key];
                    }
                    return acc;
                }, {})
            };
        })
        .filter(tag => tag.rel || tag.href);

    const scriptTags = flatChildren
        .filter(child => child?.type === 'script' || child?.props?.tagName === 'script')
        .map(tag => {
            const props = tag.props || {};
            return {
                type: props.type,
                src: props.src,
                async: props.async,
                defer: props.defer,
                crossOrigin: props.crossOrigin,
                integrity: props.integrity,
                noModule: props.noModule,
                content: typeof tag.props?.children === 'string' ? tag.props.children :
                    props.dangerouslySetInnerHTML?.__html || '',
                ...Object.keys(props).reduce((acc, key) => {
                    if (!['children', 'tagName', 'dangerouslySetInnerHTML'].includes(key)) {
                        acc[key] = props[key];
                    }
                    return acc;
                }, {})
            };
        });

    const noscriptTags = flatChildren
        .filter(child => child?.type === 'noscript' || child?.props?.tagName === 'noscript')
        .map(tag => ({
            content: tag.props?.children || tag.props?.dangerouslySetInnerHTML?.__html || '',
            ...Object.keys(tag.props || {}).reduce((acc, key) => {
                if (!['children', 'tagName', 'dangerouslySetInnerHTML'].includes(key)) {
                    acc[key] = tag.props[key];
                }
                return acc;
            }, {})
        }));

    const styleTags = flatChildren
        .filter(child => child?.type === 'style' || child?.props?.tagName === 'style')
        .map(tag => ({
            content: tag.props?.children || tag.props?.dangerouslySetInnerHTML?.__html || '',
            type: tag.props?.type || 'text/css',
            media: tag.props?.media,
            ...Object.keys(tag.props || {}).reduce((acc, key) => {
                if (!['children', 'tagName', 'dangerouslySetInnerHTML', 'type'].includes(key)) {
                    acc[key] = tag.props[key];
                }
                return acc;
            }, {})
        }));

    const baseTag = flatChildren.find(child =>
        child?.type === 'base' || child?.props?.tagName === 'base'
    );

    const findMeta = (identifier, type = 'name') => {
        return metaTags.find(tag => tag[type] === identifier);
    };

    const findLink = (rel) => {
        return linkTags.find(tag => tag.rel === rel);
    };

    const data = {
        title: titleElement?.props?.children || titleElement?.children || '',
        meta: metaTags,
        link: linkTags,
        script: scriptTags,
        noscript: noscriptTags.length > 0 ? noscriptTags : undefined,
        style: styleTags.length > 0 ? styleTags : undefined,
        base: baseTag ? {
            href: baseTag.props?.href,
            target: baseTag.props?.target,
            ...Object.keys(baseTag.props || {}).reduce((acc, key) => {
                if (!['children', 'tagName'].includes(key)) {
                    acc[key] = baseTag.props[key];
                }
                return acc;
            }, {})
        } : undefined,

        seo: {
            pageTitle: titleElement?.props?.children || titleElement?.children || '',
            description: findMeta('description')?.content,
            keywords: findMeta('keywords')?.content,
            robots: findMeta('robots')?.content,
            author: findMeta('author')?.content,
            generator: findMeta('generator')?.content,
            viewport: findMeta('viewport')?.content,

            canonical: findLink('canonical')?.href,

            language: findMeta('content-language', 'httpEquiv')?.content,

            ogTitle: findMeta('og:title', 'property')?.content,
            ogDescription: findMeta('og:description', 'property')?.content,
            ogImage: findMeta('og:image', 'property')?.content,
            ogImageAlt: findMeta('og:image:alt', 'property')?.content,
            ogImageWidth: findMeta('og:image:width', 'property')?.content,
            ogImageHeight: findMeta('og:image:height', 'property')?.content,
            ogUrl: findMeta('og:url', 'property')?.content,
            ogType: findMeta('og:type', 'property')?.content,
            ogSiteName: findMeta('og:site_name', 'property')?.content,
            ogLocale: findMeta('og:locale', 'property')?.content,

            twitterCard: findMeta('twitter:card')?.content,
            twitterTitle: findMeta('twitter:title')?.content,
            twitterDescription: findMeta('twitter:description')?.content,
            twitterImage: findMeta('twitter:image')?.content,
            twitterImageAlt: findMeta('twitter:image:alt')?.content,
            twitterSite: findMeta('twitter:site')?.content,
            twitterCreator: findMeta('twitter:creator')?.content,

            articleAuthor: findMeta('article:author', 'property')?.content,
            articlePublishedTime: findMeta('article:published_time', 'property')?.content,
            articleModifiedTime: findMeta('article:modified_time', 'property')?.content,
            articleSection: findMeta('article:section', 'property')?.content,
            articleTag: findMeta('article:tag', 'property')?.content,

            appName: findMeta('application-name')?.content,
            appleMobileWebAppTitle: findMeta('apple-mobile-web-app-title')?.content,
            appleMobileWebAppCapable: findMeta('apple-mobile-web-app-capable')?.content,

            themeColor: findMeta('theme-color')?.content,
            msapplicationTileColor: findMeta('msapplication-TileColor')?.content,

            structuredData: scriptTags
                .filter(script => script.type === 'application/ld+json')
                .map(script => {
                    try {
                        return JSON.parse(script.content);
                    } catch {
                        return script.content;
                    }
                }),

            customMeta: metaTags.filter(tag =>
                !['description', 'keywords', 'robots', 'author', 'generator', 'viewport', 'content-language'].includes(tag.name) &&
                !tag.property?.startsWith('og:') &&
                !tag.name?.startsWith('twitter:') &&
                !tag.property?.startsWith('article:') &&
                !['application-name', 'apple-mobile-web-app-title', 'apple-mobile-web-app-capable', 'theme-color', 'msapplication-TileColor'].includes(tag.name) &&
                !tag.httpEquiv &&
                !tag.charset
            ),

            customLinks: linkTags.filter(tag =>
                !['canonical', 'alternate', 'icon', 'apple-touch-icon', 'manifest', 'preconnect', 'dns-prefetch', 'preload', 'prefetch'].includes(tag.rel)
            ),

            // SEO indicators
            noindex: metaTags.some(tag =>
                tag.name === 'robots' && tag.content?.includes('noindex')
            ),
            nofollow: metaTags.some(tag =>
                tag.name === 'robots' && tag.content?.includes('nofollow')
            ),
            noarchive: metaTags.some(tag =>
                tag.name === 'robots' && tag.content?.includes('noarchive')
            ),
            nosnippet: metaTags.some(tag =>
                tag.name === 'robots' && tag.content?.includes('nosnippet')
            )
        }
    };

    Object.keys(data.seo).forEach(key => {
        if (data.seo[key] === undefined ||
            (Array.isArray(data.seo[key]) && data.seo[key].length === 0)) {
            delete data.seo[key];
        }
    });

    return React.createElement('script', {
        type: 'application/json',
        id: 'seo-data',
        dangerouslySetInnerHTML: {
            __html: JSON.stringify(data, null, 2)
        }
    });
};

Seo.displayName = 'Seo';
export default Seo;