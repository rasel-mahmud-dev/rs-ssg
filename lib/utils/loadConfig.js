import path from "path";

async function loadConfig(projectRoot, frameworkPath) {
    const projectConfig =
        (await import(path.resolve(projectRoot, "ssg.config.js"))).default || {};
    const frameworkConfig =
        (await import(path.resolve(frameworkPath, "templates", "ssg.config.js")))
            .default || {};

    // TODO: deep merge required
    return  {
        ...(frameworkConfig ?? {}),
        ...(projectConfig ?? {}),
        seo: {
            ...(frameworkConfig?.seo ?? {}),
            ...(projectConfig?.seo ?? {}),
        }
    }

}

export default loadConfig;
