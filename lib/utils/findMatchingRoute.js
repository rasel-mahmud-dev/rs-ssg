const routeCache = new Map();

function compileRoute(path) {
    if (routeCache.has(path)) {
        return routeCache.get(path);
    }

    const paramNames = [];
    let pattern = '^';

    for (let i = 0; i < path.length; i++) {
        const char = path[i];
        const nextChar = path[i + 1];

        if (char === ':' && nextChar && /[a-zA-Z_]/.test(nextChar)) {
            // Start of parameter
            let paramName = '';
            let j = i + 1;

            while (j < path.length && /[a-zA-Z0-9_]/.test(path[j])) {
                paramName += path[j];
                j++;
            }

            paramNames.push(paramName);
            pattern += '([^/]+)';
            i = j - 1;
        } else if (char === '*') {
            pattern += '.*';
        } else {
            pattern += char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }
    }

    pattern += '/?$';

    const result = {
        regex: new RegExp(pattern),
        paramNames
    };

    routeCache.set(path, result);
    return result;
}

function matchRoute(pathname, routePath) {
    if (pathname === routePath) {
        return { params: {}, exact: true };
    }
    const { regex, paramNames } = compileRoute(routePath);
    const match = regex.exec(pathname);
    if (!match) return null;
    const params = {};
    for (let i = 0; i < paramNames.length; i++) {
        params[paramNames[i]] = match[i + 1];
    }

    return { params, exact: pathname === routePath };
}

function findMatchingRoute(currentPath, routes) {
    const pathname = currentPath.replace(/\/+$/, '') || '/';
    let bestMatch = null;
    let bestScore = -1;

    // Score-based matching (like Express.js)
    for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        const result = matchRoute(pathname, route.path);

        if (result) {
            // Scoring: exact match > dynamic match > wildcard match
            let score = 0;

            if (result.exact) {
                score = 100; // Highest priority for exact matches
            } else if (route.path.includes(':')) {
                score = 50; // Medium priority for param routes
            } else if (route.path.includes('*')) {
                score = 10; // Lowest priority for wildcards
            }

            // Prefer earlier routes with same score (Express behavior)
            score -= i * 0.001;

            if (score > bestScore) {
                bestScore = score;
                bestMatch = { route, params: result.params };
            }
        }
    }

    return bestMatch;
}

export default findMatchingRoute;