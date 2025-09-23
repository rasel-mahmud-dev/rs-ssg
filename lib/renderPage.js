import path from "path";
import fs from "fs-extra";
import {build} from 'esbuild';

import tailwindPlugin from "esbuild-plugin-tailwindcss";
import viteStyleNamingPlugin from "./viteStyleNamingPlugin.js";

import {renderToString} from "react-dom/server";
import React, {createElement} from "react"
import getHeadMetaData from "./utils/getHeadMetaData.js";
import removeSlashDot from "./utils/removeSlashDot.js";
import chalk from "chalk";

class RenderPage {

    constructor(config) {
        this.config = config
    }

    async buildComponentForSSR(entryPoints) {
        let {metafile} = await build({
            entryPoints: entryPoints,
            bundle: true,
            outdir: `${this.config.buildDir}/ssrr`,
            format: 'esm',
            minify: true,
            splitting: true,
            jsx: 'automatic',
            jsxImportSource: 'react',
            metafile: true,
            chunkNames: '[name]-[hash]',
            platform: 'node',
            target: ['ES2022', 'node20'],
            // Keep React external to avoid duplicates
            external: ['react', 'react-dom', 'react-dom/server'],
            // Ensure proper module resolution
            conditions: ['node', 'import', 'require'],
            mainFields: ['module', 'main'],
            plugins: [
                // reactSSRPlugin,
                viteStyleNamingPlugin,
                tailwindPlugin({}),

            ],
            entryNames: '[name]-[hash]'
        });

        let inputOut = {};
        for (let outputsKey in metafile.outputs) {
            let item = metafile?.outputs?.[outputsKey];
            if (item && item?.entryPoint) {
                inputOut[item.entryPoint] = outputsKey;
            }
        }
        return inputOut;


    }

    async matchDynamicRoute(staticPathsData, route, routes, manifest, commonBuildMeta, compliedPages, configSeo, getStaticProps) {
        const {paths, fallback} = staticPathsData || {}
        if (paths && Array.isArray(paths)) {
            for (let i = 0; i < paths.length; i++) {
                const pathItem = paths[i]
                const params = pathItem?.params

                if (!params) continue // Skip if no params

                const paramKey = Object.keys(params)[0] // Assuming single param for now
                const paramValue = params[paramKey]

                let passedProps = {}

                const requestPath = route?.path?.replace(`/:${paramKey}`, "/" + paramValue)
                let props = {}
                if (typeof getStaticProps === "function") {
                    try{
                        props = await getStaticProps({
                            params: {
                                [paramKey]: paramValue
                            }
                        })
                    } catch (ex){
                        console.log(chalk.red("Error loading getStaticProps function ..", ex?.message) )
                    }
                }

                passedProps = {
                    params: params,
                    ...(props?.props ?? {})
                }

                await this.generateDynamicPage({
                    configSeo,
                    route,
                    requestPath,
                    props: passedProps,
                    manifest,
                    commonBuildMeta,
                    compliedPages
                })


            }
        }
    }

    generateDynamicPage = async (meta) => {

        const {props, route, requestPath, manifest, commonBuildMeta, compliedPages, configSeo} = meta
        const componentPath = compliedPages[removeSlashDot(route.entry)]
        const component = await import(path.resolve(componentPath));
        if (!component) return;

        const {default: componentFn} = component;
        const content = renderToString(React.createElement(componentFn, props));

        const html = this.createHTMLDocument(content, props, {route, manifest, commonBuildMeta, configSeo})
        try {
            const filePath = this.config.buildDir + requestPath
            await fs.ensureDir(filePath);
            await fs.outputFile(path.join(filePath, "index.html"), html);
            console.log(`✅ Generated dynamic route: ${requestPath}`)
        } catch (error) {
            console.error('Failed to write file:', error.message);
        }
    }


    async renderPage(meta) {
        const {route, routes, manifest, commonBuildMeta, srrPath, compliedPages, configSeo} = meta

        try {
            const component = await import(path.resolve(srrPath));
            const {default: componentFn, getStaticPaths, getStaticProps, generateMetadata} = component;
            if (typeof getStaticPaths === "function") {
                console.log(chalk.green("Loading getStaticPaths.."))
                let staticPathsData = null; // {  paths: [{params: {id: '1'}}, {params: {id: '2'}}], fallback: false }
                try {
                    staticPathsData = await getStaticPaths?.()
                } catch (ex) {
                    console.log(chalk.red("Error loading getStaticPaths function ..", ex?.message))
                }
                await this.matchDynamicRoute(staticPathsData, route, routes, manifest, commonBuildMeta, compliedPages, configSeo, getStaticProps)

            } else {

                let staticPropsData = {}
                if (typeof getStaticProps === "function") {
                    staticPropsData = await getStaticProps({})
                }

                const content = renderToString(createElement(componentFn, staticPropsData?.props || {}));

                const html = this.createHTMLDocument(content, staticPropsData?.props, {route, manifest, commonBuildMeta, configSeo})

                const distDir = path.resolve(this.config.buildDir)
                let filePath
                if (route.path === '/') {
                    filePath = path.join(distDir, 'index.html')
                } else {
                    const routeDir = path.join(distDir, route.path)
                    await fs.ensureDir(routeDir)
                    filePath = path.join(routeDir, 'index.html')
                }
                await fs.writeFile(filePath, html)
            }

        } catch (error) {
            console.error('Failed to import component:', error);
            throw error;
        }
    }

    generateFilePath = (route, props) => {
        let filePath;
        const distDir = this.config?.buildDir
        const {params} = props

        let routePath = route.path;

        routePath = routePath
            .replace(/:([^/]+)/g, (match, paramName) => {
                return params?.[paramName] || match;
            })
            .replace(/\[([^\]]+)\]/g, (match, paramName) => {
                return params?.[paramName] || match;
            })
            .replace(/\[\.\.\.[^\]]+\]/g, (match) => {
                const slugParam = params?.slug;
                return Array.isArray(slugParam) ? slugParam.join('/') : (slugParam || match);
            });

        routePath = routePath
            .replace(/\/+/g, '/')
            .replace(/\/$/, '');

        if (!routePath || routePath === '/') {
            filePath = path.join(distDir, 'index.html');
        } else {
            const routeDir = path.join(distDir, routePath);
            filePath = path.join(routeDir, 'index.html');
        }
        return {filePath, routeDir: path.dirname(filePath), finalPath: routePath};
    }


    getAllComponentCSS(route, assets, manifestItems, styles) {
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

            if (styles && styles?.length) {
                styles.forEach((el) => {
                    allCSS += `<link rel="stylesheet" href="/${el}">\n`
                })
            }

            return allCSS
        } catch (error) {
            return ''
        }
    }


    createHTMLDocument = (content, props = {}, meta) => {
        const asset = meta?.manifest?.find(el => el?.src?.endsWith(removeSlashDot(meta?.route?.entry)))
        const scripts = meta?.commonBuildMeta?.scripts
        const styles = meta?.commonBuildMeta?.styles
        const {headMetadata, html} = getHeadMetaData(content, meta?.configSeo, meta?.route, {})

        return `<!DOCTYPE html>
<html lang="en">
<head>
    ${headMetadata}
  
    ${this.getAllComponentCSS(meta?.route, asset, meta?.manifest, styles)}
    ${this.getClientScripts(meta?.route, asset, meta?.manifest, scripts)}

</head>
<body>
  <div id="root">${html}</div>
    <script>
        window.__INITIAL_PROPS__ = ${JSON.stringify(props)};
    </script>

</body>
</html>`
    }

    getClientScripts = (route, asset, manifestItems, scripts) => {

        try {
            let result = "";

            if (asset?.file) {
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
            if (asset.isEntry && asset?.file) {
                result += `<script type="module" src="/${asset.file}"></script>\n`;
            }


            if (scripts) {
                scripts.forEach(script => {
                    result += `<script type="module" src="/${script}"></script>\n`;
                })
            }

            // Optional: Add index.js if needed
            const indexJs = manifestItems?.find(el => el.name === "index");
            if (indexJs && indexJs?.file) {
                result += `<script type="module" src="/${indexJs.file}"></script>\n`;
            }

            return result;

        } catch (error) {
            console.warn('❌ Could not generate client scripts:', error.message);
            return '';
        }
    }

    async generateStaticPages(routes, commonBuildMeta = {}) {
        const {buildDir, configSeo} = this.config
        const viteManifestPath = path.resolve(`${buildDir}/manifest.json`)
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

        const entryPoints = routes.map(route => route.entry)
        const srrPath = await this.buildComponentForSSR(entryPoints)
        for (const route of routes) {
            const pageAssertPath = srrPath[route?.entry?.replace("./", "")]

            await this.renderPage({
                route,
                routes,
                props: {},
                manifest: items,
                commonBuildMeta,
                configSeo,
                compliedPages: srrPath,
                srrPath: pageAssertPath
            })

            console.log(`✅ Generated: ${route.path}`)
        }

    }

}

export default RenderPage