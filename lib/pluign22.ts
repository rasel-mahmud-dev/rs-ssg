import { transformSync } from '@babel/core';
export default function injectHeadCaller() {
    return {
        name: 'vite-plugin-inject-head-caller',
        transform(code, id) {

            if (!id.match(/\.(jsx|tsx|js|ts)$/) || id.includes('node_modules')) {
                return;
            }

            // Skip if no Head component usage
            if (!code.includes('Head')) {
                return;
            }

            console.log("Processing file:", id);

            try {
                const result = transformSync(code, {
                    filename: id,
                    plugins: [
                        function injectHeadCallerBabel() {
                            return {
                                visitor: {

                                    CallExpression(path) {
                                        if(path.node.arguments?.[0]?.name  === 'Head') {

                                            console.log('Found React.createElement(Head) in:', this.filename);

                                            const filename = this.filename.split('/').pop();
                                            const propsArg = path.node.arguments[1];

                                            if (propsArg?.type === 'ObjectExpression') {
                                                const hasFilenameProp = propsArg.properties.some(prop =>
                                                    prop.key && prop.key.name === 'filename'
                                                );

                                                if (!hasFilenameProp) {
                                                    propsArg.properties.push({
                                                        type: 'ObjectProperty',
                                                        key: {
                                                            type: 'Identifier',
                                                            name: 'filename'
                                                        },
                                                        value: {
                                                            type: 'StringLiteral',
                                                            value: filename
                                                        }
                                                    });
                                                    console.log(`Added filename prop to createElement: ${filename}`);
                                                }
                                            } else if (!propsArg || propsArg.type === 'NullLiteral') {
                                                // If no props object exists, create one with filename
                                                path.node.arguments[1] = {
                                                    type: 'ObjectExpression',
                                                    properties: [{
                                                        type: 'ObjectProperty',
                                                        key: {
                                                            type: 'Identifier',
                                                            name: 'filename'
                                                        },
                                                        value: {
                                                            type: 'StringLiteral',
                                                            value: filename
                                                        }
                                                    }]
                                                };
                                                console.log(`Created props object with filename: ${filename}`);
                                            }
                                        }
                                    }
                                }
                            };
                        }
                    ],
                    presets: [
                        ['@babel/preset-react', { runtime: 'automatic' }]
                    ],
                    parserOpts: {
                        plugins: ['typescript', 'jsx']
                    }
                });

                return {
                    code: result.code,
                    map: result.map
                };
            }
            catch (error) {
                console.warn(`Failed to process file ${id}:`, error);
                return;
            }
        }
    };
}