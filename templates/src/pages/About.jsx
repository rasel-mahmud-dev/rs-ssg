import React from 'react';

export default function About() {
    const features = [
        { icon: '⚛️', title: 'React 19', description: 'Latest React with concurrent features and improved performance' },
        { icon: '⚡', title: 'Vite', description: 'Next generation frontend tooling with instant HMR' },
        { icon: '🎨', title: 'Tailwind CSS', description: 'Utility-first CSS framework for rapid UI development' },
        { icon: '🛣️', title: 'React Router', description: 'Declarative routing for React applications' },
        { icon: '📱', title: 'Responsive', description: 'Mobile-first responsive design out of the box' },
        { icon: '🔧', title: 'DevTools', description: 'ESLint, path aliases, and development utilities' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-6 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">About RS Framework</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            A modern, opinionated React framework designed to help developers
                            build amazing applications faster than ever before.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
                                <div className="flex items-start space-x-4">
                                    <div className="text-3xl">{feature.icon}</div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                        <p className="text-gray-600">{feature.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white text-center">
                        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
                        <p className="text-xl mb-6 opacity-90">
                            Create your next React application with RS Framework today!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                to="/"
                                className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
                            >
                                ← Back Home
                            </a>
                            <a
                                href="https://github.com/your-username/rs-ssg"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-indigo-400 hover:bg-indigo-300 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
                            >
                                Documentation
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}