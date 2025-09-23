import findMatchingRoute from "./utils/findMatchingRoute.js";

function CoreApp({routes, ...props}) {
    const currentPath = window?.location?.pathname || '/';
    const decodedPath = decodeURIComponent(currentPath)
    const match = findMatchingRoute(decodedPath, routes);
    if (!match) {
        return <div>Not found...</div>;
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