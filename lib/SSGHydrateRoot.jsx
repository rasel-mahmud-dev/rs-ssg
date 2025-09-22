import React, {StrictMode} from 'react'
import {createRoot, hydrateRoot} from 'react-dom/client';
import CoreApp from "./coreApp.jsx"

function SSGHydrateRoot(App, routes) {
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
                return <div>Something went wrong during hydration.</div>
            }
            return children
        }

        if(!container.innerHTML){
            const root = createRoot(container);
            return root.render(
                <StrictMode>
                    <ErrorBoundary>
                        <App {...initialProps}>
                            <CoreApp routes={routes} {...initialProps} />
                        </App>
                    </ErrorBoundary>
                </StrictMode>
            );
        } else {
            hydrateRoot(container,
                <StrictMode>
                    <ErrorBoundary>
                        <App {...initialProps}>
                            <CoreApp routes={routes} {...initialProps}/>
                        </App>
                    </ErrorBoundary>
                </StrictMode>
            )
        }
    } catch (error) {
        console.error('❌ Hydration failed:', error)
        const root = createRoot(container);
        root.render(<div>Hydration failed: {error.message}</div>)
    }
}

export default SSGHydrateRoot