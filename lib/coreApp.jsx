import {useState, useEffect, Suspense} from 'react';
import RouteManager from './routeManager.jsx';


function CoreApp({routes, ...userProps}) {

    const [Component, setComponent] = useState(null);
    const [error, setError] = useState(null);
    const [routeParams, setRouteParams] = useState({});
    const [matchedRoute, setMatchedRoute] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const currentPath = window?.location?.pathname?.replace("/index.html", "") || '/';
        console.log(currentPath, "currentPath")
        const decodedPath = decodeURIComponent(currentPath);
        console.log('🚀 Framework App initializing with path:', currentPath);

        try {
            setIsLoading(true);
            const routeMatch = RouteManager.matchRoute(decodedPath, routes);

            if (!routeMatch) {
                throw new Error(`Route not found: ${currentPath}`);
            }

            const {route, params} = routeMatch;
            setMatchedRoute(route);
            setRouteParams(params);
            setComponent(() => route.component);
            setError(null);

            console.log('📍 Route matched successfully:', {
                path: route.path,
                params,
                title: route.title
            });

        } catch (err) {
            console.error('❌ Route matching failed:', err);
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, [routes]);

    if (isLoading) {
        return null
    }

    if (error) return <div style={{color: 'red'}}>Error: {error.message}</div>

    if (Component) {
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <Component {...userProps} routeParams={routeParams} matchedRoute={matchedRoute}/>
            </Suspense>
        );
    }

    return null;
}


export default CoreApp