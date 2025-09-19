import routes from "./routes.js";
import { useState, useEffect, Suspense } from 'react';

function App(props) {
    console.log(props, "props in app.jsx");

    const [Component, setComponent] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const currentPath = window?.location?.pathname || '/';
        const decodedPath = decodeURIComponent(currentPath);
        const matchedRoute = routes.find(route =>
            route.path === decodedPath || route.path === currentPath
        );

        console.log(matchedRoute, "matchedRoute");

        if (!matchedRoute) {
            setError(new Error('Route not found'));
            return;
        }

        setComponent(() => matchedRoute.component);
        setError(null);
    }, []);

    if (error) {
        return (
            <div className="error-container">
                <h2>Error Loading Page</h2>
                <p>Sorry, we couldn't load the requested page.</p>
                <button onClick={() => window.location.reload()}>Try Again</button>
            </div>
        );
    }

    if (!Component) {
        return <div>Loading...</div>; // This should match server render
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Component {...props} />
        </Suspense>
    );
}

export default App;