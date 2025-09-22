import React, {useEffect, useRef} from 'react';
import collectHeadTags from "./utils/devHeadInject.js"

const Seo = (props) => {
    const injectedElementsRef = useRef(new Set());

    useEffect(() => {
        if (typeof window !== "undefined") {
            collectHeadTags.injectChildrenToHead(props.children, injectedElementsRef);
        }
        return () => {
            collectHeadTags.cleanupInjectedElements(injectedElementsRef);
        };
    }, [props.children]);

    const seoData = collectHeadTags.parseChildrenForSSR(props);

    return React.createElement('script', {
        type: 'application/json',
        id: 'seo-data',
        dangerouslySetInnerHTML: {
            __html: JSON.stringify(seoData, null, 2)
        }
    });
};

Seo.displayName = 'Seo';
export default Seo;