import chalk from "chalk";
import Builder from "./builder.js";
import routes from "../playground/src/routes.js";
import Preview from "./preview.js";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

async function siteBuild() {
    console.log(chalk.blue('🔨 Building for production...'));
    console.log(chalk.gray('This may take a moment...'));

    try {
        // await buildSite()
        const builder = new Builder({
            buildDir: "dist",
            frameworkPath: ".",
            projectRoot: "./playground",
            configSeo: {}
        })
        await builder.build(routes)
        console.log(chalk.cyan('💡 Run `rs-ssg preview` to test the production build locally'));

        console.log(chalk.green('✅ Preview...!'));
        const preview = new Preview({
            frameworkPath: path.resolve(__dirname, '../'),
            projectRoot: process.cwd(),
            version: '1.0.0',
            buildDir: "dist"
        })
        // await preview.start()

        // const dev = new Dev({
        //     frameworkPath: path.resolve(__dirname, '../'),
        //     projectRoot: process.cwd(),
        //     version: '1.0.0',
        //     buildDir: "dist"
        // })
        // dev.start()

    } catch (error) {
        console.error(chalk.red('❌ Build failed :'));
        console.error(chalk.red(error.message));
    }
}

siteBuild()

export default  siteBuild;
