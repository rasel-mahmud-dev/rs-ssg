import React from 'react';

function About() {
    const [isVisible, setIsVisible] = React.useState(true);
    
    const toggleVisibility = () => setIsVisible(!isVisible);
    
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>About Page</h1>
            <button onClick={toggleVisibility} style={{ marginBottom: '20px' }}>
                {isVisible ? 'Hide' : 'Show'} Content
            </button>
            
            {isVisible && (
                <div>
                    <p>This is the about page with interactive content.</p>
                    <h2>Our Mission</h2>
                    <p>Building amazing web applications with React and modern tools.</p>
                    
                    <h2>Technologies</h2>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {['React', 'ESBuild', 'JavaScript', 'CSS'].map(tech => (
                            <span 
                                key={tech}
                                style={{ 
                                    background: '#f0f0f0', 
                                    padding: '5px 10px', 
                                    borderRadius: '15px' 
                                }}
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}


export default About;