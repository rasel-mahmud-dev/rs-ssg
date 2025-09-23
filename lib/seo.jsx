import React, {useEffect, useRef} from 'react';
import collectHeadTags from "./utils/devHeadInject.js"

const Seo = (props) => {
    const injectedElementsRef = useRef(new Set());

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.document?.getElementById("seo-data")?.remove();
            collectHeadTags.injectChildrenToHead(props.children, injectedElementsRef);
        }
        return () => {
            collectHeadTags.cleanupInjectedElements(injectedElementsRef);
            window.document?.getElementById("seo-data")?.remove();
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


// import React, {useEffect, useRef} from 'react';
// import collectHeadTags from "./utils/devHeadInject.js"
//
// const Seo = (props) => {
//     const injectedElementsRef = useRef(new Set());
//
//     useEffect(() => {
//         if (typeof window !== "undefined") {
//             window.document?.getElementById("seo-data")?.remove();
//             collectHeadTags.cleanupInjectedElements(injectedElementsRef);
//             injectedElementsRef.current.clear();
//             collectHeadTags.injectChildrenToHead(props.children, injectedElementsRef);
//         }
//         return () => {
//             collectHeadTags.cleanupInjectedElements(injectedElementsRef);
//             window.document?.getElementById("seo-data")?.remove();
//         };
//     }, [props.children]);
//
//     const seoData = collectHeadTags.parseChildrenForSSR(props);
//
//     return React.createElement('script', {
//         type: 'application/json',
//         id: 'seo-data',
//         dangerouslySetInnerHTML: {
//             __html: JSON.stringify(seoData, null, 2)
//         }
//     });
// };
//
// Seo.displayName = 'Seo';
// export default Seo;