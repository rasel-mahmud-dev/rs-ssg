import React from 'react';

export default function About() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-6 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">About US</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            A modern, opinionated React framework designed to help developers
                            build amazing applications faster than ever before.
                        </p>
                    </div>
                </div>

                <div className="text-center mb-16">
                    <a href="/" className="inline-block bg-blue-400 text-white px-10 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition-colors duration-200">
                        <h1 className="text-xl font-bold text-gray-900 ">Back to Home</h1>
                    </a>
                </div>

            </div>
        </div>
    );
}