import findMatchingRoute from "./utils/findMatchingRoute.js";

import NotFound from "./notFoundPage.jsx";

function CoreApp({routes, notFoundPage, ...props}) {
    const currentPath = window?.location?.pathname || '/';
    const decodedPath = decodeURIComponent(currentPath)
    const match = findMatchingRoute(decodedPath, routes);
    if (!match) {
        const NotFoundComponent = notFoundPage || NotFound;
        return <NotFoundComponent />;
    }
    const { route, params } = match;

    // const decodedPath = decodeURIComponent(currentPath)
    // const matchedRoute = routes.find(route => (route.path === decodedPath || route.path === currentPath));
    // if (!matchedRoute) {
    //     return <div>not found...</div>
    // }

    const Component = route?.component;
    return <Component key={route.path} {...props} />
}

export default CoreApp;