import path from "path";
import fs from "fs-extra";
import {build} from 'esbuild';
import {pathToFileURL} from 'url';

class RenderPage {

    constructor(config) {
        this.config = config
        this.ssrBuildDir = 'dist/ssr';
    }

    async buildComponentsForSSR() {
        console.log('📦 Building components for SSR...');

        const entryPoints = [
            './playground/src/Home.jsx',
            './playground/src/About.jsx'

        ];

        await build({
            entryPoints,
            bundle: false,
            outdir: this.ssrBuildDir,
            format: 'esm',
            platform: 'node',
            target: 'node22',
            jsx: 'automatic',
            outExtension: {'.js': '.js'},
            // external: ['react', 'react-dom', 'react-dom/server'],
            define: {
                'process.env.NODE_ENV': '"production"'
            }
        });

        await build({
            entryPoints: ["./lib/renderToString3.jsx"],
            bundle: false,
            outfile: `${this.ssrBuildDir}/lib/renderToString3.js`,
            format: 'esm',
            platform: 'node',
            target: 'node22',
            jsx: 'automatic',
            define: {
                'process.env.NODE_ENV': '"production"'
            }
        });

    }


    async renderPage(route, props, manifestItems, commonBuildMeta = {}) {

        await this.buildComponentsForSSR()

        const componentName = path.basename(route.entry, path.extname(route.entry));
        const builtPath = path.resolve(this.ssrBuildDir, `${componentName}.js`);
        const componentUrl = pathToFileURL(builtPath).href;

        console.log('Importing component from:', builtPath);

        try {
            const {default: Component} = await import(componentUrl);
            const renderToString3Path = path.resolve(this.ssrBuildDir, 'lib/renderToString3.js')
            const {default: renderToString} = await import(pathToFileURL(renderToString3Path).href);

            const content = renderToString(Component, props);
            // const app = import(path.resolve(__dirname, ""))
            // const appContent = renderToString(<App {...props} />)
            return this.createHTMLDocument(content, props, {route, manifestItems, commonBuildMeta })

        } catch (error) {
            console.error('Failed to import component:', error);
            throw error;
        }

        // const docPath = path.resolve(this.config.frameworkPath, "dist/lib/dist/document.js")
        // const {default: Document} = await import(docPath)

        function extractHeadTags(htmlString) {
            const headRegex = /<head[^>]*>([\s\S]*?)<\/head>/i;
            const match = htmlString.match(headRegex);

            if (!match) return [];

            const headContent = match[1];
            const tagRegex = /<(title|meta|link|script|style)[^>]*(?:\/>|>[\s\S]*?<\/\1>)/gi;
            const tags = [];
            let tagMatch;

            while ((tagMatch = tagRegex.exec(headContent)) !== null) {
                tags.push(tagMatch[0]);
            }
            return tags;
        }

        // const docContent = renderToString(<Document />)
        // console.log( HeadStore)


    }

    getAllComponentCSS(route, assets, manifestItems) {
        try {
            let allCSS = ""
            if (assets?.css) {
                assets.css?.forEach(css => {
                    allCSS += `<link rel="stylesheet" href="/${css}">\n`
                })
            }

            const indexJs = manifestItems?.find(el => el.name === "index")
            if (indexJs?.css) {
                indexJs.css.forEach((el) => {
                    allCSS += `<link rel="stylesheet" href="/${el}" />\n`
                })
            }

            return allCSS
        } catch (error) {
            return ''
        }
    }

    fullImage(url) {
        if (!url) return "https://rsraselmahmuddev.vercel.app/images/rasel-mahmud-dev.webp";
        if (url.startsWith("http")) return url;
        return `https://rsraselmahmuddev.vercel.app${url}`;
    }

    createHTMLDocument = (content, props = {}, meta) => {
        const asset = meta?.manifestItems?.find(el => el?.src.endsWith(meta?.route?.entry))
        const scripts = meta?.commonBuildMeta?.scripts
        const styles = meta?.commonBuildMeta?.styles

        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="/favicon.png">
    ${this.getAllComponentCSS(meta?.route, asset, meta?.manifestItems)}
    <title>${meta?.route?.title || 'My App'}</title>
    
    ${this.getClientScripts(meta?.route, asset, meta?.manifestItems, scripts)}
        
    <meta name="description" content="${meta?.route?.description || 'This is my awesome app.'}">
    <meta property="og:title" content="${meta?.route?.title || 'My App'}">
    <meta property="og:description" content="${meta?.route?.description || 'This is my awesome app.'}">
    <meta property="og:image" content="${this.fullImage(meta?.route?.image)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://rsraselmahmuddev.vercel.app${meta?.route?.path}">

</head>
<body>
  <div id="root">${content}</div>
    <script>
        window.__INITIAL_PROPS__ = ${JSON.stringify(props)};
    </script>

</body>
</html>`
    }

    // Fixed getClientScripts function
    getClientScripts = (route, asset, manifestItems, scripts) => {

        try {
            let result = "";

            if (asset.file) {
                result += `<link rel="modulepreload" crossorigin href="/${asset.file}" />\n`;
            }

            if (asset?.imports && asset.imports.length > 0) {
                asset.imports.forEach(importedFile => {
                    // First try to find by fileId
                    let importedItem = manifestItems?.find(el => el.fileId === importedFile);

                    // If not found by fileId, try to find by file path
                    if (!importedItem) {
                        importedItem = manifestItems?.find(el => el.file === importedFile);
                    }

                    if (importedItem?.file) {
                        result += `<link rel="modulepreload" crossorigin href="/${importedItem.file}" />\n`;
                    } else {
                        // Fallback: use the import path directly
                        result += `<link rel="modulepreload" crossorigin href="/${importedFile}" />\n`;
                    }
                });
            }

            // Add modulepreload for preload files (if different from imports)
            if (asset?.preload && asset.preload.length > 0) {
                asset.preload.forEach(preloadFile => {
                    // Skip if already added in imports
                    if (!asset.imports?.includes(preloadFile)) {
                        let preloadItem = manifestItems?.find(el => el.file === preloadFile);
                        if (preloadItem?.file) {
                            result += `<link rel="modulepreload" crossorigin href="/${preloadItem.file}" />\n`;
                        } else {
                            result += `<link rel="modulepreload" crossorigin href="/${preloadFile}" />\n`;
                        }
                    }
                });
            }

            // Add the main script tag for the entry point
            if (asset.isEntry && asset.file) {
                result += `<script type="module" src="/${asset.file}"></script>\n`;
            }

            console.log(scripts)

            if (scripts) {
                scripts.forEach(script => {
                    result += `<script type="module" src="${script}"></script>\n`;
                })
            }

            // Optional: Add index.js if needed
            const indexJs = manifestItems?.find(el => el.name === "index");
            if (indexJs && indexJs.file) {
                result += `<script type="module" src="/${indexJs.file}"></script>\n`;
            }

            console.log('✅ Generated client scripts:', result);
            return result;

        } catch (error) {
            console.warn('❌ Could not generate client scripts:', error.message);
            return '';
        }
    }

    // getClientScriptsEnhanced(route, asset, manifestItems) {
    //     console.log('🎬 Processing asset for route:', route);
    //     console.log('📦 Asset data:', asset);
    //
    //     try {
    //         let result = "";
    //         const addedFiles = new Set(); // Prevent duplicates
    //
    //         // Helper function to add script/preload
    //         const addPreload = (filePath, type = 'modulepreload') => {
    //             if (!addedFiles.has(filePath)) {
    //                 result += `<link rel="${type}" crossorigin href="/${filePath}" />\n`;
    //                 addedFiles.add(filePath);
    //             }
    //         };
    //
    //         const addScript = (filePath, isModule = true) => {
    //             if (!addedFiles.has(`script:${filePath}`)) {
    //                 const moduleAttr = isModule ? ' type="module"' : '';
    //                 result += `<script${moduleAttr} src="/${filePath}"></script>\n`;
    //                 addedFiles.add(`script:${filePath}`);
    //             }
    //         };
    //
    //         // 1. Add preloads for imported chunks first
    //         if (asset?.imports && asset.imports.length > 0) {
    //             asset.imports.forEach(importPath => {
    //                 // Clean the import path (remove dist/ prefix if present)
    //                 const cleanPath = importPath.startsWith('dist/') ? importPath.slice(5) : importPath;
    //                 addPreload(cleanPath);
    //             });
    //         }
    //
    //         // 2. Add preloads for explicitly marked preload files
    //         if (asset?.preload && asset.preload.length > 0) {
    //             asset.preload.forEach(preloadPath => {
    //                 const cleanPath = preloadPath.startsWith('dist/') ? preloadPath.slice(5) : preloadPath;
    //                 addPreload(cleanPath);
    //             });
    //         }
    //
    //         // 3. Add CSS files if any
    //         if (asset?.css && asset.css.length > 0) {
    //             asset.css.forEach(cssPath => {
    //                 const cleanPath = cssPath.startsWith('dist/') ? cssPath.slice(5) : cssPath;
    //                 addPreload(cleanPath, 'stylesheet');
    //             });
    //         }
    //
    //         // 4. Add the main entry script
    //         if (asset.isEntry && asset.file) {
    //             const cleanPath = asset.file.startsWith('dist/') ? asset.file.slice(5) : asset.file;
    //             addScript(cleanPath);
    //         }
    //
    //         // 5. Optional: Add client hydration script
    //         const clientScript = manifestItems?.find(el =>
    //             el.name === "client" || el.name === "main" || el.name === "index"
    //         );
    //         if (clientScript && clientScript.file) {
    //             const cleanPath = clientScript.file.startsWith('dist/') ? clientScript.file.slice(5) : clientScript.file;
    //             addScript(cleanPath);
    //         }
    //
    //         console.log('✅ Generated enhanced client scripts');
    //         return result;
    //
    //     } catch (error) {
    //         console.warn('❌ Could not generate client scripts:', error.message);
    //         console.warn('Asset data:', asset);
    //         return '';
    //     }
    // }

    getClientScripts(route, assets, manifestItems) {
        try {
            let result = ""
            if (assets.file) {
                result += `<link rel="modulepreload" crossorigin href="/${assets.file}" />\n`
            }

            if (assets?.imports) {
                assets.imports.forEach(importedFile => {
                    const importedItem = manifestItems?.find(el => el.fileId === importedFile)
                    if (importedItem?.file) {
                        result += `<link rel="modulepreload" crossorigin href="/${importedItem.file}" />\n`
                    } else {
                        result += `<link rel="modulepreload" crossorigin href="/${importedFile}"/>\n`
                    }
                })
            }

            const indexJs = manifestItems?.find(el => el.name === "index")
            if (indexJs) {
                // result += `<script defer type="module" src="/${indexJs.file}"></script>\n`
            }

            return result
        } catch (error) {
            console.warn('Could not find client scripts:', error.message)
            return ''
        }
    }

    async generateStaticPages(routes, commonBuildMeta = {}) {
        const {buildDir} = this.config
        const viteManifestPath = path.resolve(`dist/manifest.json`)

        const viteManifest = await fs.readJson(viteManifestPath)

        const items = []

        for (let viteManifestKey in viteManifest) {
            items.push({
                fileId: viteManifestKey,
                ...viteManifest[viteManifestKey]
            })
        }

        const distDir = path.resolve(buildDir)
        await fs.ensureDir(distDir)


        for (const route of routes) {
            const html = await this.renderPage(route, {}, items, commonBuildMeta)
            let filePath
            if (route.path === '/') {
                filePath = path.join(distDir, 'index.html')
            } else {
                const routeDir = path.join(distDir, route.path)
                await fs.ensureDir(routeDir)
                filePath = path.join(routeDir, 'index.html')
            }
            await fs.writeFile(filePath, html)
            console.log(`✅ Generated: ${route.path} -> ${path.relative(process.cwd(), filePath)}`)
        }

    }

}

export default RenderPage