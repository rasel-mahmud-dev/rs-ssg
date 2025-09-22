class CollectHeadTags {

    injectChildrenToHead = (children, injectedElementsRef) => {
        const head = document.head;
        const childrenArray = Array.isArray(children) ? children : [children];
        const flatChildren = childrenArray.flat().filter(Boolean);

        flatChildren.forEach(child => {
            if (!child || !child.type) return;

            const element = this.createElementFromChild(child);
            if (element) {
                // Mark element as SEO-injected for easy cleanup
                element.setAttribute('data-seo-injected', 'true');
                element.setAttribute('data-seo-id', this.generateElementId(child));

                // Check if similar element already exists to avoid duplicates
                const existingElement = head.querySelector(
                    `[data-seo-id="${this.generateElementId(child)}"]`
                );

                if (existingElement) {
                    existingElement.remove();
                }

                head.appendChild(element);
                injectedElementsRef.current.add(element);
            }
        });
    };

    createElementFromChild = (child) => {
        const { type, props } = child;

        // Handle different tag types
        switch (type) {
            case 'title':
                return this.createTitleElement(props);
            case 'meta':
                return this.createMetaElement(props);
            case 'link':
                return this.createLinkElement(props);
            case 'script':
                return this.createScriptElement(props);
            case 'style':
                return this.createStyleElement(props);
            case 'base':
                return this.createBaseElement(props);
            case 'noscript':
                return this.createNoscriptElement(props);
            default:
                console.warn(`Unsupported SEO tag type: ${type}`);
                return null;
        }
    };

    createTitleElement = (props) => {
        const title = props?.children || '';
        if (title) {
            document.title = title;
        }
        return null;
    };

    createMetaElement = (props) => {
        const meta = document.createElement('meta');

        Object.keys(props || {}).forEach(key => {
            if (key !== 'children' && props[key] !== undefined && props[key] !== null && props[key] !== '') {
                meta.setAttribute(key, props[key]);
            }
        });

        // Ensure meta has at least one required attribute
        if (!meta.hasAttributes() ||
            (!meta.getAttribute('name') && !meta.getAttribute('property') &&
                !meta.getAttribute('http-equiv') && !meta.getAttribute('charset') &&
                !meta.getAttribute('itemprop'))) {
            return null;
        }

        return meta;
    };

    createLinkElement = (props) => {
        const link = document.createElement('link');

        Object.keys(props || {}).forEach(key => {
            if (key !== 'children' && props[key] !== undefined && props[key] !== null && props[key] !== '') {
                // Handle camelCase to kebab-case conversion for certain attributes
                const attrName = key === 'crossOrigin' ? 'crossorigin' : key;
                link.setAttribute(attrName, props[key]);
            }
        });

        // Link must have at least rel or href
        if (!link.getAttribute('rel') && !link.getAttribute('href')) {
            return null;
        }

        return link;
    };

    createScriptElement = (props) => {
        const script = document.createElement('script');

        Object.keys(props || {}).forEach(key => {
            if (key === 'children') {
                // Handle script content from children
                if (typeof props[key] === 'string') {
                    script.textContent = props[key];
                }
            } else if (key === 'dangerouslySetInnerHTML') {
                // Handle dangerouslySetInnerHTML
                if (props[key] && props[key].__html) {
                    script.textContent = props[key].__html;
                }
            } else if (props[key] !== undefined && props[key] !== null && props[key] !== '') {
                // Handle boolean attributes
                if (key === 'async' || key === 'defer' || key === 'noModule') {
                    if (props[key]) {
                        script.setAttribute(key, '');
                    }
                } else {
                    const attrName = key === 'crossOrigin' ? 'crossorigin' : key;
                    script.setAttribute(attrName, props[key]);
                }
            }
        });

        return script;
    };

    createStyleElement = (props) => {
        const style = document.createElement('style');

        // Set style attributes
        if (props?.type) style.type = props.type;
        if (props?.media) style.media = props.media;

        // Set style content
        if (props?.children) {
            style.textContent = props.children;
        } else if (props?.dangerouslySetInnerHTML && props.dangerouslySetInnerHTML.__html) {
            style.textContent = props.dangerouslySetInnerHTML.__html;
        }

        // Handle other attributes
        Object.keys(props || {}).forEach(key => {
            if (!['children', 'dangerouslySetInnerHTML', 'type', 'media'].includes(key) &&
                props[key] !== undefined && props[key] !== null && props[key] !== '') {
                style.setAttribute(key, props[key]);
            }
        });

        return style;
    };

    createBaseElement = (props) => {
        const base = document.createElement('base');

        Object.keys(props || {}).forEach(key => {
            if (key !== 'children' && props[key] !== undefined && props[key] !== null && props[key] !== '') {
                base.setAttribute(key, props[key]);
            }
        });

        // Base should have href
        if (!base.getAttribute('href')) {
            return null;
        }

        return base;
    };

    createNoscriptElement = (props) => {
        const noscript = document.createElement('noscript');

        if (props?.children) {
            noscript.textContent = props.children;
        } else if (props?.dangerouslySetInnerHTML && props.dangerouslySetInnerHTML.__html) {
            noscript.innerHTML = props.dangerouslySetInnerHTML.__html;
        }

        return noscript;
    };

    generateElementId = (child) => {
        const { type, props } = child;

        // Generate unique ID based on element type and key attributes
        switch (type) {
            case 'meta':
                return `meta-${props?.name || props?.property || props?.httpEquiv || 'unnamed'}-${Date.now()}`;
            case 'link':
                return `link-${props?.rel || 'unnamed'}-${props?.href || Date.now()}`;
            case 'script':
                return `script-${props?.src || props?.type || Date.now()}`;
            case 'style':
                return `style-${Date.now()}`;
            case 'base':
                return `base-${props?.href || Date.now()}`;
            case 'noscript':
                return `noscript-${Date.now()}`;
            default:
                return `${type}-${Date.now()}`;
        }
    };

    cleanupInjectedElements = (injectedElementsRef) => {
        if (injectedElementsRef.current) {
            injectedElementsRef.current.forEach(element => {
                if (element && element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            });
            injectedElementsRef.current.clear();
        }
    };

    parseChildrenForSSR = (props) => {
        const children = Array.isArray(props.children) ? props.children : [props.children];
        const flatChildren = children.flat().filter(Boolean);

        const titleElement = flatChildren.find(child =>
            child?.type === 'title'
        );

        const metaTags = flatChildren
            .filter(child => child?.type === 'meta')
            .map(tag => tag.props)
            .filter(Boolean);

        const linkTags = flatChildren
            .filter(child => child?.type === 'link')
            .map(tag => tag.props)
            .filter(Boolean);

        const scriptTags = flatChildren
            .filter(child => child?.type === 'script')
            .map(tag => ({
                ...tag.props,
                content: tag.props?.children || tag.props?.dangerouslySetInnerHTML?.__html || ''
            }))
            .filter(Boolean);

        const styleTags = flatChildren
            .filter(child => child?.type === 'style')
            .map(tag => ({
                ...tag.props,
                content: tag.props?.children || tag.props?.dangerouslySetInnerHTML?.__html || ''
            }))
            .filter(Boolean);

        const noscriptTags = flatChildren
            .filter(child => child?.type === 'noscript')
            .map(tag => ({
                ...tag.props,
                content: tag.props?.children || tag.props?.dangerouslySetInnerHTML?.__html || ''
            }))
            .filter(Boolean);

        const baseTag = flatChildren.find(child => child?.type === 'base');

        const data = {
            title: titleElement?.props?.children || '',
            meta: metaTags,
            link: linkTags,
            script: scriptTags,
            style: styleTags.length > 0 ? styleTags : undefined,
            noscript: noscriptTags.length > 0 ? noscriptTags : undefined,
            base: baseTag ? baseTag.props : undefined
        };

        return data;
    };

    // Enhanced method to get better element IDs (avoiding Date.now() for duplicates)
    generateStableElementId = (child) => {
        const { type, props } = child;

        switch (type) {
            case 'meta':
                const metaKey = props?.name || props?.property || props?.httpEquiv || 'charset';
                const metaValue = props?.content || props?.charset || 'unknown';
                return `meta-${metaKey}-${this.hashString(metaValue)}`;
            case 'link':
                const linkRel = props?.rel || 'unknown';
                const linkHref = props?.href || 'unknown';
                return `link-${linkRel}-${this.hashString(linkHref)}`;
            case 'script':
                const scriptSrc = props?.src;
                const scriptType = props?.type || 'text/javascript';
                const scriptContent = props?.children || props?.dangerouslySetInnerHTML?.__html || '';
                const identifier = scriptSrc || this.hashString(scriptContent) || 'inline';
                return `script-${scriptType}-${identifier}`;
            case 'style':
                const styleContent = props?.children || props?.dangerouslySetInnerHTML?.__html || '';
                return `style-${this.hashString(styleContent)}`;
            case 'base':
                return `base-${this.hashString(props?.href || 'default')}`;
            case 'noscript':
                const noscriptContent = props?.children || props?.dangerouslySetInnerHTML?.__html || '';
                return `noscript-${this.hashString(noscriptContent)}`;
            default:
                return `${type}-${this.hashString(JSON.stringify(props) || 'default')}`;
        }
    };

    // Simple hash function for generating stable IDs
    hashString = (str) => {
        let hash = 0;
        if (str.length === 0) return hash.toString();
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString();
    };

    // Method to remove all SEO injected elements
    removeAllSeoElements = () => {
        const seoElements = document.head.querySelectorAll('[data-seo-injected="true"]');
        seoElements.forEach(element => element.remove());
    };

    // Method to check if element already exists
    elementExists = (child) => {
        const id = this.generateStableElementId(child);
        return !!document.head.querySelector(`[data-seo-id="${id}"]`);
    };

    // Enhanced injection method with better duplicate handling
    injectChildrenToHeadEnhanced = (children, injectedElementsRef) => {
        const head = document.head;
        const childrenArray = Array.isArray(children) ? children : [children];
        const flatChildren = childrenArray.flat().filter(Boolean);

        flatChildren.forEach(child => {
            if (!child || !child.type) return;

            // Use stable ID generation
            const elementId = this.generateStableElementId(child);

            // Check if element already exists
            const existingElement = head.querySelector(`[data-seo-id="${elementId}"]`);
            if (existingElement) {
                existingElement.remove();
                // Also remove from ref if it exists
                if (injectedElementsRef.current && injectedElementsRef.current.has(existingElement)) {
                    injectedElementsRef.current.delete(existingElement);
                }
            }

            const element = this.createElementFromChild(child);
            if (element) {
                element.setAttribute('data-seo-injected', 'true');
                element.setAttribute('data-seo-id', elementId);
                head.appendChild(element);

                if (injectedElementsRef.current) {
                    injectedElementsRef.current.add(element);
                }
            }
        });
    };
}

export default new CollectHeadTags();