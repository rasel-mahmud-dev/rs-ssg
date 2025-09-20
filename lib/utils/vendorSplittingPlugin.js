
export const vendorSplittingPlugin = {
    name: 'vendor-splitting',
    setup(build) {
        // Mark React and React-DOM as external for separate bundling
        build.onResolve({ filter: /^react$/ }, () => {
            return { path: 'react', namespace: 'vendor-react' };
        });

        build.onResolve({ filter: /^react-dom$/ }, () => {
            return { path: 'react-dom', namespace: 'vendor-react-dom' };
        });

        // Handle other node_modules as vendor
        build.onResolve({ filter: /^[^./]/ }, (args) => {
            // Skip if it's already handled or is a built-in
            if (args.namespace === 'vendor-react' ||
                args.namespace === 'vendor-react-dom' ||
                args.path.startsWith('node:')) {
                return null;
            }

            // Check if it's a node_modules package
            if (!args.path.startsWith('.') && !args.path.startsWith('/')) {
                return { path: args.path, namespace: 'vendor-other' };
            }

            return null;
        });

        // Load vendor modules normally but track them
        build.onLoad({ filter: /.*/, namespace: 'vendor-react' }, () => {
            return { contents: `export * from "react";`, loader: 'js' };
        });

        build.onLoad({ filter: /.*/, namespace: 'vendor-react-dom' }, () => {
            return { contents: `export * from "react-dom";`, loader: 'js' };
        });

        build.onLoad({ filter: /.*/, namespace: 'vendor-other' }, (args) => {
            return { contents: `export * from "${args.path}";`, loader: 'js' };
        });
    }
};



// Option 2: Advanced vendor splitting with manual chunks
export const advancedVendorSplitting = {
    name: 'advanced-vendor-splitting',
    setup(build) {
        const vendorMap = new Map();

        build.onResolve({ filter: /.*/ }, (args) => {
            // Categorize imports
            if (args.path === 'react' || args.path === 'react-dom') {
                vendorMap.set(args.path, 'react-vendor');
                return { path: args.path, namespace: 'react-vendor' };
            }

            if (args.path.startsWith('lucide-react')) {
                vendorMap.set(args.path, 'icons-vendor');
                return { path: args.path, namespace: 'icons-vendor' };
            }

            // Other node_modules
            if (!args.path.startsWith('.') && !args.path.startsWith('/') &&
                !args.path.startsWith('node:')) {
                vendorMap.set(args.path, 'vendor');
                return { path: args.path, namespace: 'vendor' };
            }

            return null;
        });

        // Handle each vendor namespace
        ['react-vendor', 'icons-vendor', 'vendor'].forEach(namespace => {
            build.onLoad({ filter: /.*/, namespace }, (args) => {
                return {
                    contents: `export * from "${args.path}";`,
                    loader: 'js'
                };
            });
        });
    }
};

