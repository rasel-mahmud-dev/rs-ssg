import {build} from 'esbuild';
import {join, extname, basename} from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';

function generateHash(content, length = 8) {
    return crypto.createHash('md5').update(content).digest('hex').slice(0, length);
}



export async function organizeChunks(metafile) {
    if (!metafile) return;
    await fs.mkdir('dist/client/assets/js', {recursive: true});
    await fs.mkdir('dist/client/assets/css', {recursive: true});
    await fs.mkdir('dist/client/assets/images', {recursive: true});
    await fs.mkdir('dist/client/assets/fonts', {recursive: true});
    await fs.mkdir('dist/client/assets/media', {recursive: true});
}

export async function getManifest(metafile, buildResult) {
    const manifest = {};
    if (!metafile?.outputs) {
        console.warn('⚠️  No metafile available for manifest generation');
        return;
    }

    const getRelativePath = (fullPath) => {
        return fullPath.replace(/^dist\/client\//, '').replace(/^dist\//, '');
    };

    const getFileHash = (filePath) => {
        const match = filePath.match(/-([a-f0-9]{8})\./);
        return match ? match[1] : generateHash(filePath);
    };

    for (const [outputPath, outputInfo] of Object.entries(metafile.outputs)) {

        const relativePath = getRelativePath(outputPath);
        const isEntry = outputInfo.entryPoint !== undefined;
        const isChunk = outputPath.endsWith('.js') && !isEntry;

        if (isEntry) {
            // Entry points (main pages)
            const entryKey = outputInfo.entryPoint.replace(/^\.\//, '');
            const hash = getFileHash(outputPath);

            manifest[entryKey] = {
                file: relativePath,
                name: basename(outputInfo.entryPoint, extname(outputInfo.entryPoint)),
                src: entryKey,
                isEntry: true
            };

            // Add imports if they exist
            if (outputInfo.imports && outputInfo.imports.length > 0) {
                manifest[entryKey].imports = outputInfo.imports.map(imp => getRelativePath(imp.path));
            }

            // Add dynamic imports if they exist
            if (outputInfo.dynamicImports && outputInfo.dynamicImports.length > 0) {
                manifest[entryKey].dynamicImports = outputInfo.dynamicImports.map(imp => getRelativePath(imp.path));
            }

            // Add CSS files if they exist
            const cssFiles = Object.keys(metafile.outputs).filter(path =>
                path.endsWith('.css') &&
                metafile.outputs[path].entryPoint === outputInfo.entryPoint
            );
            if (cssFiles.length > 0) {
                manifest[entryKey].css = cssFiles.map(css => getRelativePath(css));
            }

            // Add assets if they exist
            const assetFiles = Object.keys(metafile.outputs).filter(path =>
                !path.endsWith('.js') &&
                !path.endsWith('.css') &&
                metafile.outputs[path].entryPoint === outputInfo.entryPoint
            );
            if (assetFiles.length > 0) {
                manifest[entryKey].assets = assetFiles.map(asset => getRelativePath(asset));
            }

        } else if (isChunk) {
            // Shared chunks (vendor, shared components, etc.)
            const chunkName = basename(outputPath, '.js').replace(/-[a-f0-9]+$/, '');
            const chunkKey = `_${chunkName}.js`; // Vite prefixes shared chunks with _

            manifest[chunkKey] = {
                file: relativePath
            };

            // Add imports for chunks
            if (outputInfo.imports && outputInfo.imports.length > 0) {
                manifest[chunkKey].imports = outputInfo.imports.map(imp => getRelativePath(imp.path));
            }

            const isDynamicallyImported = Object.values(metafile.outputs).some(output =>
                output.dynamicImports && output.dynamicImports.some(imp => imp.path === outputPath)
            );
            if (isDynamicallyImported) {
                manifest[chunkKey].isDynamicEntry = true;
            }
        }

        // Handle CSS files
        if (outputPath.endsWith('.css')) {
            const cssKey = outputInfo.entryPoint ?
                outputInfo.entryPoint.replace(/^\.\//, '').replace(/\.(jsx?|tsx?)$/, '.css') :
                basename(outputPath);

            if (!manifest[cssKey]) {
                manifest[cssKey] = {
                    file: relativePath,
                    src: cssKey
                };
            }
        }

        // Handle asset files (images, fonts, etc.)
        if (!outputPath.endsWith('.js') && !outputPath.endsWith('.css') && !outputPath.endsWith('.html')) {
            const assetKey = basename(outputPath);
            const originalName = assetKey.replace(/-[a-f0-9]+/, ''); // Remove hash

            manifest[originalName] = {
                file: relativePath,
                src: originalName
            };
        }
    }

    // Add preload information for critical chunks
    for (const [key, entry] of Object.entries(manifest)) {
        if (entry.isEntry && entry.imports) {
            const preloadFiles = [];
            for (const importPath of entry.imports) {
                const importEntry = Object.values(manifest).find(e => e.file === importPath);
                if (importEntry) {
                    preloadFiles.push(importPath);
                }
            }
            if (preloadFiles.length > 0) {
                entry.preload = preloadFiles;
            }
        }
    }

    return manifest
}

export async function generateManifest(metafile, buildResult) {
    const manifest = await getManifest(metafile, buildResult)
    await fs.writeFile('dist/manifest.json', JSON.stringify(manifest, null, 2));
}

async function main() {
    try {
        console.log('🧹 Cleaning dist directory...');
        await fs.rm('dist', {recursive: true, force: true});

        console.log('🏗️  Building with Vite-style organization...');
        const buildResult = await buildPagesViteStyle();

        console.log('📁 Creating Vite directory structure...');
        await fs.mkdir('dist/client/.vite', {recursive: true});
        await organizeChunks(buildResult.metafile);

        console.log('📋 Generating Vite-style manifest...');
        await generateManifest(buildResult.metafile, buildResult);

        console.log('\n✅ Build completed successfully!');
        console.log('📦 Generated Vite-style structure:');
        console.log('├── dist/client/');
        console.log('│   ├── .vite/');
        console.log('│   │   └── manifest.json    # Vite-style manifest');
        console.log('│   ├── assets/');
        console.log('│   │   ├── js/');
        console.log('│   │   │   ├── Home-[hash].js');
        console.log('│   │   │   ├── About-[hash].js');
        console.log('│   │   │   ├── vendor-[hash].js');
        console.log('│   │   │   └── shared-[hash].js');
        console.log('│   │   ├── css/');
        console.log('│   │   ├── images/');
        console.log('│   │   ├── fonts/');
        console.log('│   │   └── media/');
        console.log('│   └── manifest.json        # Legacy manifest');

        // Display sample manifest content
        const manifest = JSON.parse(await fs.readFile('dist/client/manifest.json', 'utf8'));
        console.log('\n📋 Sample manifest entries:');
        console.log('```json');
        console.log(JSON.stringify(Object.fromEntries(Object.entries(manifest).slice(0, 2)), null, 2));
        console.log('```');

    } catch (error) {
        console.error('❌ Build failed sdf :', error);
        process.exit(1);
    }
}

