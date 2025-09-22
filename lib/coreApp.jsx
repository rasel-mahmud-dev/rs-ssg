function CoreApp({routes, ...props}) {
    const currentPath = window?.location?.pathname || '/';
    const decodedPath = decodeURIComponent(currentPath)
    const matchedRoute = routes.find(route => (route.path === decodedPath || route.path === currentPath));
    if (!matchedRoute) {
        return <div>not found...</div>
    }
    const Component = matchedRoute?.component;
    return <Component key={matchedRoute.path} {...matchedRoute.props} {...props} />
}

export default CoreApp;