import React from 'react';

const NotFoundPage = () => {
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

    const styles = {
        container: {
            minHeight: '100vh',
            background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)',
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
            padding: '1.5rem'
        },
        content: {
            maxWidth: '42rem',
            width: '100%',
            textAlign: 'center'
        },
        numberSection: {
            marginBottom: '2rem'
        },
        number404: {
            fontSize: '9rem',
            fontWeight: 'bold',
            color: '#059669',
            marginBottom: '0.5rem',
            lineHeight: 1
        },
        divider: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            color: '#9ca3af'
        },
        dividerLine: {
            height: '1px',
            background: '#d1d5db',
            width: '3rem'
        },
        textSection: {
            marginBottom: '2rem'
        },
        title: {
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '1rem'
        },
        description: {
            fontSize: '1.125rem',
            color: '#4b5563',
            marginBottom: '0.5rem'
        },
        subdescription: {
            color: '#6b7280'
        },
        buttonsContainer: {
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '3rem',
            alignItems: 'center'
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
            gap: '0.5rem',
            fontSize: '1rem'
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
            gap: '0.5rem',
            fontSize: '1rem'
        },
        linksCard: {
            background: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb',
            padding: '1.5rem'
        },
        linksTitle: {
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '1rem'
        },
        linksGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '0.75rem'
        },
        linkItem: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            transition: 'background 0.2s',
            textDecoration: 'none',
            color: '#374151',
            background: 'transparent'
        },
        linkText: {
            color: 'inherit'
        },
        linkArrow: {
            fontSize: '1rem',
            color: '#9ca3af',
            transition: 'color 0.2s'
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
        flexDirection: 'row'
    };

    const responsiveNumber = isMobile ? { ...styles.number404, fontSize: '6rem' } : styles.number404;

    const responsiveTitle = isMobile ? { ...styles.title, fontSize: '1.5rem' } : styles.title;

    return (
        <div style={styles.container}>
            <main style={styles.main}>
                <div style={styles.content}>
                    <div style={styles.numberSection}>
                        <h1 style={responsiveNumber}>404</h1>
                        <div style={styles.divider}>
                            <div style={styles.dividerLine}></div>
                            <span style={{ fontSize: '1.25rem' }}>🔍</span>
                            <div style={styles.dividerLine}></div>
                        </div>
                    </div>

                    <div style={styles.textSection}>
                        <h2 style={responsiveTitle}>
                            Page Not Found
                        </h2>
                        <p style={styles.description}>
                            The page you're looking for doesn't exist or has been moved.
                        </p>
                        <p style={styles.subdescription}>
                            Don't worry, even the best static sites have missing pages sometimes.
                        </p>
                    </div>

                    <div style={responsiveButtonsStyle}>
                        <button
                            onClick={handleGoHome}
                            style={styles.buttonPrimary}
                            onMouseOver={(e) => e.target.style.background = '#047857'}
                            onMouseOut={(e) => e.target.style.background = '#059669'}
                        >
                            <span>🏠</span>
                            <span>Go to Homepage</span>
                            <span>→</span>
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
                </div>
            </main>
        </div>
    );
};

export default NotFoundPage;