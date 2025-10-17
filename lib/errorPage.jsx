import React from 'react';

const ErrorPage = ({ error = null, errorType = 'hydration' }) => {
    const handleRefresh = () => {
        if (typeof window !== "undefined") {
            window.location.reload();
        }
    };

    const handleGoHome = () => {
        if (typeof window !== "undefined") {
            window.location.href = '/';
        }
    };

    const handleGoDocs = () => {
        if (typeof window !== "undefined") {
            window.location.href = 'https://rs-ssg1.web.app/docs';
        }
    };

    const errorDetails = error ? {
        message: error.message || 'An unexpected error occurred',
        stack: error.stack
    } : {
        message: 'Something went wrong during hydration',
        stack: null
    };

    const styles = {
        container: {
            minHeight: '100vh',
            background: 'linear-gradient(to bottom right, #fef2f2, #f3f4f6)',
            display: 'flex',
            flexDirection: 'column'
        },
        header: {
            background: 'white',
            borderBottom: '1px solid #e5e7eb',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        },
        headerContent: {
            maxWidth: '80rem',
            margin: '0 auto',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        },
        logo: {
            width: '2rem',
            height: '2rem',
            background: '#059669',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem'
        },
        brandName: {
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#1f2937'
        },
        main: {
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem 1.5rem'
        },
        content: {
            maxWidth: '48rem',
            width: '100%'
        },
        errorIcon: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '5rem',
            height: '5rem',
            background: '#fee2e2',
            borderRadius: '9999px',
            marginBottom: '1rem',
            fontSize: '2.5rem'
        },
        title: {
            fontSize: '2.25rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '0.5rem',
            textAlign: 'center'
        },
        subtitle: {
            fontSize: '1.125rem',
            color: '#4b5563',
            textAlign: 'center',
            marginBottom: '2rem'
        },
        card: {
            background: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #fecaca',
            marginBottom: '1.5rem',
            overflow: 'hidden'
        },
        cardHeader: {
            background: '#fef2f2',
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #fecaca',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        },
        cardHeaderTitle: {
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#991b1b'
        },
        cardBody: {
            padding: '1.5rem'
        },
        errorMessage: {
            background: '#fef2f2',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '1rem'
        },
        errorText: {
            color: '#991b1b',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            wordBreak: 'break-words'
        },
        details: {
            cursor: 'pointer'
        },
        summary: {
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem'
        },
        stackTrace: {
            background: '#1f2937',
            borderRadius: '0.5rem',
            padding: '1rem',
            overflowX: 'auto'
        },
        stackText: {
            fontSize: '0.75rem',
            color: '#d1d5db',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-words'
        },
        tipsCard: {
            background: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb',
            marginBottom: '1.5rem',
            padding: '1.5rem'
        },
        tipsTitle: {
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        },
        tipsList: {
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
        },
        tipItem: {
            display: 'flex',
            alignItems: 'flex-start',
            color: '#374151'
        },
        tipBullet: {
            color: '#059669',
            marginRight: '0.5rem'
        },
        buttonsContainer: {
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '1.5rem'
        },
        buttonPrimary: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.75rem 1.5rem',
            background: '#059669',
            color: 'white',
            fontWeight: '500',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 10px 15px -3px rgba(5, 150, 105, 0.3)',
            transition: 'background 0.2s',
            gap: '0.5rem'
        },
        buttonSecondary: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.75rem 1.5rem',
            background: 'white',
            color: '#374151',
            fontWeight: '500',
            borderRadius: '0.5rem',
            border: '2px solid #e5e7eb',
            cursor: 'pointer',
            transition: 'background 0.2s',
            gap: '0.5rem'
        },
        helpText: {
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#6b7280'
        },
        link: {
            color: '#059669',
            textDecoration: 'underline'
        },
        footer: {
            background: 'white',
            borderTop: '1px solid #e5e7eb',
            padding: '1.5rem'
        },
        footerContent: {
            maxWidth: '80rem',
            margin: '0 auto',
            padding: '0 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
        },
        footerLogo: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        },
        footerLogoBox: {
            width: '1.5rem',
            height: '1.5rem',
            background: '#059669',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem'
        },
        footerBrand: {
            fontSize: '0.875rem',
            fontWeight: 'bold',
            color: '#1f2937'
        },
        footerText: {
            color: '#6b7280',
            fontSize: '0.875rem'
        }
    };

    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        if (typeof window !== "undefined") {
            window.addEventListener('resize', checkMobile);
        }
        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener('resize', checkMobile);
            }
        }
    }, []);

    const responsiveButtonsStyle = isMobile ? styles.buttonsContainer : {
        ...styles.buttonsContainer,
        flexDirection: 'row',
        justifyContent: 'center'
    };


    return (
        <div style={styles.container}>

            <main style={styles.main}>
                <div style={styles.content}>
                    {/* Error Icon and Title */}
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={styles.errorIcon}>⚠️</div>
                        <h1 style={styles.title}>
                            {errorType === 'hydration' ? 'Hydration Failed' : 'Application Error'}
                        </h1>
                        <p style={styles.subtitle}>
                            Something went wrong while loading the application
                        </p>
                    </div>

                    {/* Error Message Card */}
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>
                            <span style={{ fontSize: '1.25rem' }}>💻</span>
                            <h2 style={styles.cardHeaderTitle}>Error Details</h2>
                        </div>
                        <div style={styles.cardBody}>
                            <div style={styles.errorMessage}>
                                <p style={styles.errorText}>
                                    {errorDetails.message}
                                </p>
                            </div>

                            {errorDetails.stack && (
                                <details style={styles.details}>
                                    <summary style={styles.summary}>
                                        View Stack Trace
                                    </summary>
                                    <div style={styles.stackTrace}>
                                        <pre style={styles.stackText}>
                                            {errorDetails.stack}
                                        </pre>
                                    </div>
                                </details>
                            )}
                        </div>
                    </div>

                    <div style={styles.tipsCard}>
                        <h3 style={styles.tipsTitle}>
                            <span>💡</span>
                            <span>Common Solutions</span>
                        </h3>
                        <ul style={styles.tipsList}>
                            <li style={styles.tipItem}>
                                <span style={styles.tipBullet}>•</span>
                                <span>Try refreshing the page to reload the application</span>
                            </li>
                            <li style={styles.tipItem}>
                                <span style={styles.tipBullet}>•</span>
                                <span>Clear your browser cache and cookies</span>
                            </li>
                            <li style={styles.tipItem}>
                                <span style={styles.tipBullet}>•</span>
                                <span>Check the browser console for additional error information</span>
                            </li>
                            <li style={styles.tipItem}>
                                <span style={styles.tipBullet}>•</span>
                                <span>Ensure JavaScript is enabled in your browser</span>
                            </li>
                            <li style={styles.tipItem}>
                                <span style={styles.tipBullet}>•</span>
                                <span>Verify that all required dependencies are properly loaded</span>
                            </li>
                        </ul>
                    </div>

                    <div style={responsiveButtonsStyle}>
                        <button
                            onClick={handleRefresh}
                            style={styles.buttonPrimary}
                            onMouseOver={(e) => e.target.style.background = '#047857'}
                            onMouseOut={(e) => e.target.style.background = '#059669'}
                        >
                            <span>🔄</span>
                            <span>Refresh Page</span>
                        </button>
                        <button
                            onClick={handleGoHome}
                            style={styles.buttonSecondary}
                            onMouseOver={(e) => e.target.style.background = '#f9fafb'}
                            onMouseOut={(e) => e.target.style.background = 'white'}
                        >
                            <span>🏠</span>
                            <span>Go to Homepage</span>
                        </button>
                        <button
                            onClick={handleGoDocs}
                            style={styles.buttonSecondary}
                            onMouseOver={(e) => e.target.style.background = '#f9fafb'}
                            onMouseOut={(e) => e.target.style.background = 'white'}
                        >
                            <span>📚</span>
                            <span>View Documentation</span>
                        </button>
                    </div>

                    <div style={styles.helpText}>
                        <p>
                            If the problem persists, please check the{' '}
                            <a href="/docs" style={styles.link}>
                                documentation
                            </a>
                            {' '}or report the issue to the development team.
                        </p>
                    </div>
                </div>
            </main>


        </div>
    );
};

export default ErrorPage;