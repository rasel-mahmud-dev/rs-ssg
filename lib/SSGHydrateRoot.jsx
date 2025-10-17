import React, {StrictMode} from 'react'
import {createRoot, hydrateRoot} from 'react-dom/client';
import CoreApp from "./coreApp.jsx"
import ErrorPage from "./errorPage.jsx";

// type options = {
//     notFoundPage?: React.ComponentType<any>
// }

function SSGHydrateRoot(App, routes, options = {}) {
    const initialProps = window.__INITIAL_PROPS__ || {}

    const container = document.getElementById('root')
    try {
        function ErrorBoundary({children}) {
            const [hasError, setHasError] = React.useState(false)

            React.useEffect(() => {
                const handleError = (error) => {
                    setHasError(true)
                }
                window.addEventListener('error', handleError)
                return () => window.removeEventListener('error', handleError)
            }, [])

            if (hasError) {
                return <ErrorPage/>
            }
            return children
        }

        if (!container.innerHTML) {
            const root = createRoot(container);
            return root.render(
                <StrictMode>
                    <ErrorBoundary>
                        <App {...initialProps}>
                            <CoreApp
                                routes={routes}
                                notFoundPage={options?.notFoundPage}
                                {...initialProps}
                            />
                        </App>
                    </ErrorBoundary>
                </StrictMode>
            );
        } else {
            hydrateRoot(container,
                <StrictMode>
                    <ErrorBoundary>
                        <App {...initialProps}>
                            <CoreApp
                                routes={routes}
                                notFoundPage={options?.notFoundPage}
                                {...initialProps}/>
                        </App>
                    </ErrorBoundary>
                </StrictMode>
            )
        }
    } catch (error) {
        console.error('❌ Hydration failed:', error)
        const root = createRoot(container);
        root.render(
            <ErrorPage error={error} errorType="hydration"/>
        )
    }
}

export default SSGHydrateRoot