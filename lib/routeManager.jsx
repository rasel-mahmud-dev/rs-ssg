
class RouteManager {
    static matchRoute(currentPath, routes) {
        console.log(`🔍 Matching path: ${currentPath}`);

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
        if (routePattern === actualPath) {
            return { params: {} };
        }

        if (!routePattern.includes(':') && !routePattern.includes('[')) {
            return null;
        }

        const routeSegments = routePattern.split('/').filter(Boolean);
        const pathSegments = actualPath.split('/').filter(Boolean);

        if (routePattern.includes('[...')) {
            const catchAllIndex = routeSegments.findIndex(seg => seg.includes('[...'));
            if (catchAllIndex !== -1) {
                const beforeCatchAll = routeSegments.slice(0, catchAllIndex);
                const pathBefore = pathSegments.slice(0, catchAllIndex);

                if (this.segmentsMatch(beforeCatchAll, pathBefore)) {
                    const catchAllParam = routeSegments[catchAllIndex].match(/\[\.\.\.([^\]]+)\]/)?.[1];
                    const params = {};
                    this.extractParams(beforeCatchAll, pathBefore, params);
                    if (catchAllParam) {
                        params[catchAllParam] = pathSegments.slice(catchAllIndex);
                    }
                    return { params };
                }
                return null;
            }
        }

        if (routeSegments.length !== pathSegments.length) {
            return null;
        }

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

            if (routeSegment.startsWith(':') ||
                (routeSegment.startsWith('[') && routeSegment.endsWith(']'))) {
                return true;
            }

            return routeSegment === pathSegment;
        });
    }

    static extractParams(routeSegments, pathSegments, params) {
        routeSegments.forEach((routeSegment, i) => {
            const pathSegment = pathSegments[i];

            if (routeSegment.startsWith(':')) {
                const paramName = routeSegment.slice(1);
                params[paramName] = pathSegment;
            } else if (routeSegment.startsWith('[') && routeSegment.endsWith(']')) {
                const paramName = routeSegment.slice(1, -1);
                if (!paramName.startsWith('...')) {
                    params[paramName] = pathSegment;
                }
            }
        });
    }
}

export default RouteManager;
