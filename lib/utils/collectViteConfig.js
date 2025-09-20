import path from 'path';

async function  collectViteConfig(mode, config) {

    const {frameworkPath, projectRoot} = config

    // const customConfigPath = path.resolve(frameworkPath, 'dist/lib/dist/rs-ssg.config.js');
    const configPath = path.resolve(frameworkPath,  'vite.config.js');

    const {default: viteConfig} = await import(configPath);
    // const {default: customConfig} = await import(customConfigPath);

    let customConfig = undefined

    const viteConfigFinal= {}

    viteConfigFinal.preview = viteConfig?.preview || {}
    if (customConfig && customConfig.preview) {
        viteConfigFinal.preview = {...viteConfigFinal.preview, ...customConfig.preview}
    }

    if (viteConfig.plugins) {
        viteConfigFinal.plugins = viteConfig.plugins || []

        if (customConfig && customConfig.plugins) {
            viteConfigFinal.plugins.push(...customConfig.plugins)
        }
    }

    if (viteConfig.resolve) {
        viteConfigFinal.resolve = {...viteConfig.resolve};

        if (customConfig && customConfig.resolve) {
            viteConfigFinal.resolve = {...viteConfigFinal.resolve, ...customConfig.resolve}
        }
    }

    if (viteConfig.server) {
        viteConfigFinal.server = {...viteConfig.server};

        if (customConfig && customConfig.devServer) {
            viteConfigFinal.server = {...viteConfigFinal.server, ...customConfig.devServer};
        }
    }
    if (viteConfig.build) {
        viteConfigFinal.build = {...viteConfig.build};

        if (customConfig && customConfig.build) {
            viteConfigFinal.build = {...viteConfigFinal.build, ...customConfig.build}
        }
    }
    if (customConfig && customConfig.resolve) {
        viteConfigFinal.resolve = customConfig.resolve
    }
    viteConfigFinal.root = projectRoot
    viteConfigFinal.mode = mode
    return viteConfigFinal
}

export default collectViteConfig