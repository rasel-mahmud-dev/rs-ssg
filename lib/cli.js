#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import {fileURLToPath} from 'url';
import InitProject from "./command/init.js";
import Builder from "./builder.js";
import Preview from "./command/preview.js";
import loadConfig from "./utils/loadConfig.js";
import Dev from "./command/dev.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));


class RsSSGCli {

    // command: string
    // args: string[]
    // projectRoot: string
    // version: string
    // init: InitProject
    // config: Config
    // builder: Builder
    // preview: Preview

    constructor() {
        this.command = process.argv[2];
        this.args = process.argv.slice(3);

        this.config = {
            frameworkPath: path.resolve(path.dirname(__dirname), '.'),
            projectRoot: process.cwd(),
            version: '1.0.0',
            buildDir: ".rs-ssg",
            configSeo: {}
        };
    }

    static async create() {
        const instance = new RsSSGCli();
        await instance.initialize();
        return instance;
    }

    async initialize() {
        await this.loadProjectConfiguration()
        this.init = new InitProject(this.args, this.config, this.loadProjectConfiguration);
        this.builder = new Builder(this.config, this.loadProjectConfiguration);
        this.preview = new Preview(this.config);
        this.dev = new Dev(this.config);
    }

    async loadProjectConfiguration(){
        const config = await loadConfig(this.config.projectRoot, this.config.frameworkPath);
        this.config.configSeo = config;
        this.config.buildDir = config?.outputDir || "dist";
    }

    async build() {
        console.log(chalk.blue('🔨 Building for production...'));
        console.log(chalk.gray('This may take a moment...'));
        try {
            const routesPath = path.join(this.config.projectRoot, 'src', 'routes.js');
            const {default: routes} = (await import(routesPath))
            if(!routes){
                throw new Error('❌ No routes found! Please define routes in src/routes.jsx')
            }
            await this.builder.build(routes)
            console.log(chalk.cyan('💡 Run `rs-ssg preview` to test the production build locally'));
        } catch (error) {
            console.error(chalk.red('❌ Build failed:'));
            console.error(chalk.red(error.message));
            process.exit(1);
        }
    }

    async clean() {
        console.log(chalk.blue('🧹 Cleaning build artifacts...'));

        const distPath = path.join(this.projectRoot, 'dist');
        const nodeModulesPath = path.join(this.projectRoot, 'node_modules');

        try {
            let cleaned = false;

            if (fs.existsSync(distPath)) {
                await fs.remove(distPath);
                console.log(chalk.green('✅ Removed dist/ directory'));
                cleaned = true;
            }

            if (this.args.includes('--all') && fs.existsSync(nodeModulesPath)) {
                await fs.remove(nodeModulesPath);
                console.log(chalk.green('✅ Removed node_modules/ directory'));
                console.log(chalk.yellow('💡 Run `npm install` to reinstall dependencies'));
                cleaned = true;
            }

            if (!cleaned) {
                console.log(chalk.gray('Nothing to clean'));
            }
        } catch (error) {
            console.error(chalk.red('❌ Failed to clean:'), error.message);
            process.exit(1);
        }
    }

    info = async () => {
        console.log(chalk.blue('📊 Project Information\n'));

        try {
            const packageJsonPath = path.join(this.projectRoot, 'package.json');
            const viteConfigPath = path.join(this.projectRoot, 'vite.config.js');
            const srcPath = path.join(this.projectRoot, 'src');

            if (fs.existsSync(packageJsonPath)) {
                const packageJson = await fs.readJSON(packageJsonPath);
                console.log(chalk.cyan('📦 Package Information:'));
                console.log(`   Name: ${chalk.white(packageJson.name)}`);
                console.log(`   Version: ${chalk.white(packageJson.version)}`);
                console.log(`   Private: ${chalk.white(packageJson.private ? 'Yes' : 'No')}`);
                console.log();
            }

            console.log(chalk.cyan('🛠️  RS SSG Framework:'));
            console.log(`   Version: ${chalk.white(this.version)}`);
            console.log(`   Node.js: ${chalk.white(process.version)}`);
            console.log();

            console.log(chalk.cyan('📁 Project Structure:'));
            const hasViteConfig = fs.existsSync(viteConfigPath);
            const hasSrc = fs.existsSync(srcPath);
            const hasNodeModules = fs.existsSync(path.join(this.projectRoot, 'node_modules'));
            const hasDist = fs.existsSync(path.join(this.projectRoot, 'dist'));

            console.log(`   vite.config.js: ${hasViteConfig ? chalk.green('✓') : chalk.red('✗')}`);
            console.log(`   src/ directory: ${hasSrc ? chalk.green('✓') : chalk.red('✗')}`);
            console.log(`   node_modules/: ${hasNodeModules ? chalk.green('✓') : chalk.red('✗')}`);
            console.log(`   dist/ directory: ${hasDist ? chalk.green('✓') : chalk.red('✗')}`);

            if (hasSrc) {
                const srcContents = await fs.readdir(srcPath);
                console.log(`   src/ contents: ${chalk.white(srcContents.join(', '))}`);
            }

        } catch (error) {
            console.error(chalk.red('❌ Failed to get project info:'), error.message);
        }
    }

    showVersion() {
        console.log(chalk.blue(`RS Framework v${this.version}`));
        console.log(chalk.gray(`Node.js ${process.version}`));
    }

    showHelp() {
        console.log(`
${chalk.blue('🛠️  RS Framework CLI v' + this.version)}

${chalk.cyan('Usage:')} rs <command> [options]

${chalk.cyan('Commands:')}
  ${chalk.green('init [name]')}       Create a new React project
  ${chalk.green('dev')}               Start development server with hot reload
  ${chalk.green('build')}             Build optimized production bundle
  ${chalk.green('preview')}           Preview production build locally
  ${chalk.green('clean')}             Remove build artifacts
  ${chalk.green('info')}              Show project information
  ${chalk.green('version')}           Show version information
  ${chalk.green('help')}              Show this help message

${chalk.cyan('Options:')}
  ${chalk.green('--version, -v')}     Show version
  ${chalk.green('--help, -h')}        Show help

${chalk.cyan('Examples:')}
  ${chalk.gray('rs init my-awesome-app')}     Create new project
  ${chalk.gray('cd my-awesome-app && rs dev')}  Start development
  ${chalk.gray('rs build')}                   Build for production
  ${chalk.gray('rs clean --all')}             Clean everything including node_modules

${chalk.cyan('Documentation:')}
  ${chalk.gray('https://github.com/your-username/rs-ssg')}

${chalk.gray('Built with ❤️  using React + Esbuild + Tailwind CSS')}
`);
    }

    async run() {
        if (this.command === '--version' || this.command === '-v' || this.args.includes('--version') || this.args.includes('-v')) {
            return this.showVersion();
        }

        if (this.command === '--help' || this.command === '-h' || this.args.includes('--help') || this.args.includes('-h')) {
            return this.showHelp();
        }

        switch (this.command) {
            case 'init':
                await this.init.init();
                break;
            case 'dev':
                await this.dev.start();
                break;
            case 'build':
                await this.build();
                break;
            case 'preview':
                await this.preview.start();
                break;
            case 'clean':
                await this.clean();
                break;
            case 'info':
                await this.info();
                break;
            case 'version':
                this.showVersion();
                break;
            case 'help':
            default:
                this.showHelp();
                break;
        }
    }
}

RsSSGCli.create().then(instance=>{
    instance.run().catch(error => {
        console.error(chalk.red('\n❌ Unexpected Error:'));
        console.error(chalk.red(error.message));

        if (error.stack && process.env.NODE_ENV !== 'production') {
            console.error(chalk.gray('\nStack trace:'));
            console.error(chalk.gray(error.stack));
        }

        console.log(chalk.yellow('\n💡 If this error persists, please report it at:'));
        console.log(chalk.cyan('   https://github.com/your-username/rs-ssg/issues'));

        process.exit(1);
    })
})