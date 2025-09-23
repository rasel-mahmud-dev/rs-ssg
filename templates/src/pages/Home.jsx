import React from 'react';

export default function Home() {
    const features = [
        { icon: '⚛️', title: 'React 19', description: 'Latest React with concurrent features and improved performance' },
        { icon: '⚡', title: 'Esbuild', description: 'Next generation frontend tooling with instant HMR' },
        { icon: '🎨', title: 'Tailwind CSS', description: 'Utility-first CSS framework for rapid UI development' },
        { icon: '🛣️', title: 'Routing', description: 'Declarative routing for multi page' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-6 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">RS SSG Framework</h1>
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

                    <div className="text-center mb-16">
                        <a href="/about" className="inline-block bg-blue-400 text-white px-10 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition-colors duration-200">
                            <h1 className="text-xl font-bold text-gray-900 ">About Us</h1>
                        </a>
                    </div>

                </div>
            </div>
        </div>
    );
}