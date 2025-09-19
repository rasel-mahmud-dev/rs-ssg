import fs from "fs/promises";
import {join} from "path";

const viteStyleNamingPlugin = {
    name: 'vite-style-naming',
    setup(build) {
        // Handle manual chunks similar to Vite's manualChunks
        build.onResolve({filter: /.*/}, (args) => {
            if (args.path.includes('node_modules')) {
                return {
                    path: args.path,
                    namespace: 'vendor'
                };
            }
            if (args.path.includes('src/components')) {
                return {
                    path: args.path,
                    namespace: 'shared'
                };
            }
            return null;
        });

        // Handle asset file naming
        build.onLoad({filter: /\.(png|jpe?g|gif|svg|webp|avif|mp4|webm|ogg|mp3|wav|flac|aac|woff2?|eot|ttf|otf)$/}, async (args) => {
            const content = await fs.readFile(args.path);
            const ext = extname(args.path);
            const name = basename(args.path, ext);
            const hash = generateHash(content);

            let assetType = 'assets';
            if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i.test(args.path)) {
                assetType = 'media';
            } else if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(args.path)) {
                assetType = 'images';
            } else if (/\.(woff2?|eot|ttf|otf)$/i.test(args.path)) {
                assetType = 'fonts';
            }

            // Create asset directory
            const assetDir = `dist/client/assets/${assetType}`;
            await fs.mkdir(assetDir, {recursive: true});

            // Copy asset with hashed name
            const hashedName = `${name}-${hash}${ext}`;
            await fs.writeFile(join(assetDir, hashedName), content);

            return {
                contents: `export default "/assets/${assetType}/${hashedName}"`,
                loader: 'js'
            };
        });
    }
};



export default viteStyleNamingPlugin