import chalk from "chalk";
// import buildSite from "./build.js";
import Builder from "./builder.js";
import routes from "../playground/src/routes.js";

async function siteBuild(){
    console.log(chalk.blue('🔨 Building for production...'));
    console.log(chalk.gray('This may take a moment...'));

    try {
         // await buildSite()
        const builder = new Builder({
            buildDir: "dist",
            frameworkPath: ".",
            projectRoot: "./playground",
        })
        await builder.build(routes)
        console.log(chalk.cyan('💡 Run `rs-ssg preview` to test the production build locally'));
    } catch (error) {
        console.error(chalk.red('❌ Build failed :'));
        console.error(chalk.red(error.message));
    }
}

siteBuild()

export default  siteBuild;
