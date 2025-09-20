import fs from 'fs-extra';
import path from 'path';
import { build } from 'esbuild';
import { execSync } from 'child_process';

// Clean Tailwind v4 plugin that resolves the import properly
const tailwindV4Plugin = {
    name: 'tailwind-v4',
    setup(build) {
        // Resolve tailwindcss imports
        build.onResolve({ filter: /^tailwindcss$/ }, () => {
            return { path: 'tailwindcss', namespace: 'tailwindcss-virtual' };
        });

        // Handle the virtual tailwindcss module
        build.onLoad({ filter: /.*/, namespace: 'tailwindcss-virtual' }, () => {
            // Return empty CSS - the actual processing happens in the CSS loader
            return {
                contents: '',
                loader: 'css'
            };
        });

        // Process CSS files that import tailwindcss
        build.onLoad({ filter: /\.css$/ }, async (args) => {
            const css = await fs.readFile(args.path, 'utf8');

            // Check if CSS uses Tailwind v4 import
            if (css.includes('@import "tailwindcss"')) {
                try {
                    console.log(`🎨 Processing Tailwind CSS: ${path.basename(args.path)}`);

                    // Use Tailwind CLI to process the CSS
                    const result = execSync(
                        `npx tailwindcss@next --input - --stdout`,
                        {
                            input: css,
                            encoding: 'utf8',
                            stdio: ['pipe', 'pipe', 'pipe'],
                            cwd: process.cwd()
                        }
                    );

                    console.log(`✅ Tailwind CSS processed: ${path.basename(args.path)}`);

                    return {
                        contents: result,
                        loader: 'css'
                    };
                } catch (error) {
                    console.error(`❌ Tailwind processing failed for ${path.basename(args.path)}:`, error.message);
                    return {
                        contents: css,
                        loader: 'css'
                    };
                }
            }
            return {
                contents: css,
                loader: 'css'
            };
        });
    }
};

export default tailwindV4Plugin