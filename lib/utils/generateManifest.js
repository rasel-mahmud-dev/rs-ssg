import {basename, extname} from "path";
import fs from "fs/promises";

import crypto from "crypto";

function generateHash(content, length = 8) {
    return crypto.createHash('md5').update(content).digest('hex').slice(0, length);
}

export async function getManifest(metafile, buildResult) {
    const manifest = {};
    if (!metafile?.outputs) {
        console.warn('⚠️  No metafile available for manifest generation');
        return;
    }

    const getRelativePath = (fullPath) => {
        return fullPath.replace(/^.rs-ssg\/client\//, '').replace(/^.rs-ssg\//, '');
    };

    const getFileHash = (filePath) => {
        const match = filePath.match(/-([a-f0-9]{8})\./);
        return match ? match[1] : generateHash(filePath);
    };

    // First pass: collect CSS files by their associated entry points
    const cssFilesByEntry = new Map();

    for (const [outputPath, outputInfo] of Object.entries(metafile.outputs)) {
        if (outputPath.endsWith('.css')) {
            const entryPoint = outputInfo.entryPoint;
            if (entryPoint) {
                const entryKey = entryPoint.replace(/^\.\//, '');
                if (!cssFilesByEntry.has(entryKey)) {
                    cssFilesByEntry.set(entryKey, []);
                }
                cssFilesByEntry.get(entryKey).push(outputPath);
            } else {
                // Handle CSS that might be imported by multiple entries
                // Check which entries import this CSS
                const importingEntries = [];
                for (const [otherPath, otherInfo] of Object.entries(metafile.outputs)) {
                    if (otherInfo.entryPoint && otherInfo.cssBundle?.includes(outputPath)) {
                        importingEntries.push(otherInfo.entryPoint.replace(/^\.\//, ''));
                    }
                }

                // If no specific importing entries found, try to associate with shared chunks
                if (importingEntries.length === 0) {
                    cssFilesByEntry.set('shared', cssFilesByEntry.get('shared') || []);
                    cssFilesByEntry.get('shared').push(outputPath);
                } else {
                    // Associate with each importing entry
                    importingEntries.forEach(entryKey => {
                        if (!cssFilesByEntry.has(entryKey)) {
                            cssFilesByEntry.set(entryKey, []);
                        }
                        cssFilesByEntry.get(entryKey).push(outputPath);
                    });
                }
            }
        }
    }

    // Second pass: build manifest entries
    for (const [outputPath, outputInfo] of Object.entries(metafile.outputs)) {
        const relativePath = getRelativePath(outputPath);
        const isEntry = outputInfo.entryPoint !== undefined;
        const isChunk = outputPath.endsWith('.js') && !isEntry;

        if (isEntry) {
            // Entry points (main pages)
            const entryKey = outputInfo.entryPoint.replace(/^\.\//, '');
            const pageName = basename(outputInfo.entryPoint, extname(outputInfo.entryPoint));

            manifest[entryKey] = {
                file: relativePath,
                name: pageName,
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

            // Add CSS files for this specific page
            const pageCssFiles = cssFilesByEntry.get(entryKey);
            if (pageCssFiles && pageCssFiles.length > 0) {
                manifest[entryKey].css = pageCssFiles.map(css => getRelativePath(css));

                // Also create individual CSS manifest entries for this page
                pageCssFiles.forEach(cssPath => {
                    const cssKey = `${pageName}.css`; // Page-specific CSS key
                    const cssRelativePath = getRelativePath(cssPath);

                    manifest[cssKey] = {
                        file: cssRelativePath,
                        src: cssKey,
                        page: entryKey, // Associate with the page
                        type: 'stylesheet'
                    };
                });
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
                file: relativePath,
                type: 'chunk'
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

        // Handle asset files (images, fonts, etc.)
        if (!outputPath.endsWith('.js') && !outputPath.endsWith('.css') && !outputPath.endsWith('.html')) {
            const assetKey = basename(outputPath);
            const originalName = assetKey.replace(/-[a-f0-9]+/, ''); // Remove hash

            manifest[originalName] = {
                file: relativePath,
                src: originalName,
                type: 'asset'
            };
        }
    }

    // Add shared CSS if any
    const sharedCss = cssFilesByEntry.get('shared');
    if (sharedCss && sharedCss.length > 0) {
        manifest['shared.css'] = {
            files: sharedCss.map(css => getRelativePath(css)),
            type: 'stylesheet',
            shared: true
        };
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

    return manifest;
}

export async function generateManifest(metafile, buildResult) {
    const manifest = await getManifest(metafile, buildResult)
    await fs.writeFile('.rs-ssg/manifest.json', JSON.stringify(manifest, null, 2));
}