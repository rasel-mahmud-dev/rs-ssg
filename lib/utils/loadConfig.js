import path from "path";

function deepMerge(target, source) {
    for (const key of Object.keys(source)) {
        if (
            source[key] &&
            typeof source[key] === "object" &&
            !Array.isArray(source[key])
        ) {
            if (!target[key]) target[key] = {};
            deepMerge(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}

async function loadConfig(projectRoot, frameworkPath) {
    const projectConfig =
        (await import(path.resolve(projectRoot, "ssg.config.js"))).default || {};
    const frameworkConfig =
        (await import(path.resolve(frameworkPath, "templates", "ssg.config.js")))
            .default || {};

    // TODO: validate config schema
    return deepMerge(structuredClone(frameworkConfig), projectConfig);
}

export default loadConfig;
