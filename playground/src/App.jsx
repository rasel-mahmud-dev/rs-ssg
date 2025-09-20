import routes from "./routes.js";
import { useState, useEffect, Suspense } from 'react';

class RouteManager {
    static matchRoute(currentPath, routes) {
        console.log(`🔍 Matching path: ${currentPath}`);

        // Sort routes by specificity (static routes first, then by parameter count)
        const sortedRoutes = [...routes].sort((a, b) => {
            const aParams = (a.path.match(/[:\[]/g) || []).length;
            const bParams = (b.path.match(/[:\[]/g) || []).length;
            return aParams - bParams;
        });

        for (const route of sortedRoutes) {
            const match = this.testRoute(route.path, currentPath);
            if (match) {
                console.log(`✅ Matched route: ${route.path}`, match);
                return { route, params: match.params };
            }
        }

        console.log(`❌ No route matched for: ${currentPath}`);
        return null;
    }

    static testRoute(routePattern, actualPath) {
        // Handle exact matches first
        if (routePattern === actualPath) {
            return { params: {} };
        }

        // Skip non-dynamic routes that don't match exactly
        if (!routePattern.includes(':') && !routePattern.includes('[')) {
            return null;
        }

        // Convert route pattern to segments
        const routeSegments = routePattern.split('/').filter(Boolean);
        const pathSegments = actualPath.split('/').filter(Boolean);

        // Handle catch-all routes
        if (routePattern.includes('[...')) {
            const catchAllIndex = routeSegments.findIndex(seg => seg.includes('[...'));
            if (catchAllIndex !== -1) {
                const beforeCatchAll = routeSegments.slice(0, catchAllIndex);
                const pathBefore = pathSegments.slice(0, catchAllIndex);

                // Check segments before catch-all
                if (this.segmentsMatch(beforeCatchAll, pathBefore)) {
                    const catchAllParam = routeSegments[catchAllIndex].match(/\[\.\.\.([^\]]+)\]/)?.[1];
                    const params = {};

                    // Extract params before catch-all
                    this.extractParams(beforeCatchAll, pathBefore, params);

                    // Add catch-all param
                    if (catchAllParam) {
                        params[catchAllParam] = pathSegments.slice(catchAllIndex);
                    }

                    return { params };
                }
                return null;
            }
        }

        // Check if segment counts match for regular dynamic routes
        if (routeSegments.length !== pathSegments.length) {
            return null;
        }

        // Test each segment
        if (this.segmentsMatch(routeSegments, pathSegments)) {
            const params = {};
            this.extractParams(routeSegments, pathSegments, params);
            return { params };
        }

        return null;
    }

    static segmentsMatch(routeSegments, pathSegments) {
        if (routeSegments.length !== pathSegments.length) {
            return false;
        }

        return routeSegments.every((routeSegment, i) => {
            const pathSegment = pathSegments[i];

            // Dynamic segment (matches anything)
            if (routeSegment.startsWith(':') ||
                (routeSegment.startsWith('[') && routeSegment.endsWith(']'))) {
                return true;
            }

            // Static segment (must match exactly)
            return routeSegment === pathSegment;
        });
    }

    static extractParams(routeSegments, pathSegments, params) {
        routeSegments.forEach((routeSegment, i) => {
            const pathSegment = pathSegments[i];

            if (routeSegment.startsWith(':')) {
                // :paramName format
                const paramName = routeSegment.slice(1);
                params[paramName] = pathSegment;
            } else if (routeSegment.startsWith('[') && routeSegment.endsWith(']')) {
                // [paramName] format
                const paramName = routeSegment.slice(1, -1);
                if (!paramName.startsWith('...')) {
                    params[paramName] = pathSegment;
                }
            }
        });
    }
}

function App(props) {
    console.log(props, "props in app.jsx");

    const [Component, setComponent] = useState(null);
    const [error, setError] = useState(null);
    const [routeParams, setRouteParams] = useState({});
    const [matchedRoute, setMatchedRoute] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const currentPath = window?.location?.pathname?.replace("/index.html") || '/';

        console.log(currentPath, "currentPath")

        const decodedPath = decodeURIComponent(currentPath);

        console.log('🚀 App initializing with path:', currentPath);

        try {
            setIsLoading(true);

            // Find matching route
            const routeMatch = RouteManager.matchRoute(decodedPath, routes);

            if (!routeMatch) {
                throw new Error(`Route not found: ${currentPath}`);
            }

            const { route, params } = routeMatch;

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
    }, []);

    // Handle browser navigation (back/forward)
    useEffect(() => {
        const handlePopState = () => {
            console.log('🔄 Navigation detected, reloading...');
            window.location.reload(); // Simple approach - reload on navigation
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    if (isLoading) {
        return (
            <div style={{
                padding: '40px',
                textAlign: 'center',
                fontFamily: 'Arial, sans-serif'
            }}>
                <div style={{
                    fontSize: '18px',
                    color: '#666'
                }}>
                    Initializing...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container" style={{
                padding: '40px',
                textAlign: 'center',
                fontFamily: 'Arial, sans-serif',
                maxWidth: '600px',
                margin: '0 auto'
            }}>
                <h2 style={{ color: '#e74c3c', marginBottom: '20px' }}>
                    404 - Page Not Found
                </h2>
                <p style={{ color: '#666', marginBottom: '20px' }}>
                    The page you're looking for doesn't exist.
                </p>
                <p style={{
                    background: '#f8f9fa',
                    padding: '15px',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    color: '#666',
                    marginBottom: '30px',
                    border: '1px solid #e9ecef'
                }}>
                    <strong>Requested:</strong> {window?.location?.pathname}
                </p>

                <div style={{ marginBottom: '30px' }}>
                    <button
                        onClick={() => window.location.href = '/'}
                        style={{
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginRight: '10px',
                            fontSize: '16px'
                        }}
                    >
                        Go Home
                    </button>
                    <button
                        onClick={() => window.history.back()}
                        style={{
                            background: '#6c757d',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Go Back
                    </button>
                </div>

                <details style={{ textAlign: 'left' }}>
                    <summary style={{
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        marginBottom: '10px'
                    }}>
                        Available Routes
                    </summary>
                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                    }}>
                        {routes.map((route, index) => (
                            <li key={index} style={{
                                fontFamily: 'monospace',
                                margin: '8px 0',
                                background: '#f8f9fa',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                border: '1px solid #e9ecef'
                            }}>
                                <strong>{route.path}</strong> - {route.title}
                                {route.path.includes(':') && (
                                    <span style={{
                                        color: '#007bff',
                                        fontSize: '12px',
                                        marginLeft: '10px'
                                    }}>
                                        (dynamic)
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </details>
            </div>
        );
    }

    if (!Component) {
        return (
            <div style={{
                padding: '40px',
                textAlign: 'center',
                fontFamily: 'Arial, sans-serif'
            }}>
                Loading component...
            </div>
        );
    }

    // Prepare props to pass to the component
    const componentProps = {
        ...props,
        params: routeParams,
        route: matchedRoute,
        // Add some helpful utilities
        currentPath: window?.location?.pathname,
        query: Object.fromEntries(new URLSearchParams(window?.location?.search || ''))
    };

    console.log('🎯 Rendering component with props:', componentProps);

    return (
        <Suspense fallback={
            <div style={{
                padding: '40px',
                textAlign: 'center',
                fontFamily: 'Arial, sans-serif'
            }}>
                <div style={{ fontSize: '16px', color: '#666' }}>
                    Loading {matchedRoute?.title || 'page'}...
                </div>
            </div>
        }>
            <Component {...componentProps} />
        </Suspense>
    );
}

export default App;