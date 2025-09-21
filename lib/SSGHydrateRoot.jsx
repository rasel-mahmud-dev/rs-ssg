import React, {StrictMode} from 'react'
import {hydrateRoot} from 'react-dom/client'
import CoreApp from "./coreApp.jsx"

function SSGHydrateRoot(App, routes) {
    const initialProps = window.__INITIAL_PROPS__ || {}
    console.log('Initial props:', initialProps)

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

        hydrateRoot(container,
           <StrictMode>
               <ErrorBoundary>
                   <App {...initialProps}>
                       <CoreApp routes={routes} />
                   </App>
               </ErrorBoundary>
           </StrictMode>
        )
    } catch (error) {
        hydrateRoot(container, <div>Hydration failed: {error.message}</div>)
        console.error('❌ Hydration failed:', error)
    }
}

export default SSGHydrateRoot