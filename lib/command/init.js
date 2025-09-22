import chalk from "chalk";
import path from "path";
import fs from 'fs-extra';

// import {Config} from "./types";

class InitProject {

    // args: string[]
    // config: Config
    // version: string

    constructor(args, config) {
        this.args = args;
        this.config = config
        const pkg = fs.readJsonSync(path.resolve(this.config.frameworkPath, 'package.json'))
        this.version = pkg?.version || '0.0.1'
    }

    createUserProject = async (projectPath, projectName) => {
        let userPackageJson = fs.readFileSync(path.resolve(this.config.frameworkPath, 'templates', 'package.json')).toString();
        userPackageJson = userPackageJson
            .replace("{{PROJECT_NAME}}", projectName)
            .replace("{{VERSION}}", this.version)

        await fs.writeJSON(path.join(projectPath, 'package.json'), JSON.parse(userPackageJson), {spaces: 2});

        await this.createConfigFiles(projectPath, projectName);

        const srcPath = path.join(projectPath, 'src');
        await fs.ensureDir(srcPath);

        const templateSrcPath = path.join(this.config.frameworkPath, 'templates', 'src');
        if (fs.existsSync(templateSrcPath)) {
            await fs.copy(templateSrcPath, srcPath);
        }
        await this.createProjectFiles(projectPath, projectName);
    }

    isValidProjectName(name) {
        return /^[a-zA-Z0-9_-]+$/.test(name) && name.length > 0;
    }

    async createConfigFiles(projectPath, projectName) {

        let rsSSgConfigContent = fs.readFileSync(path.resolve(this.config.frameworkPath, 'templates', 'ssg.config.js')).toString();
        rsSSgConfigContent = rsSSgConfigContent
            .replace("{{PROJECT_NAME}}", projectName)

        await fs.writeFile(path.join(projectPath, 'ssg.config.js'), rsSSgConfigContent);

        let indexHtml = fs.readFileSync(path.resolve(this.config.frameworkPath, 'templates', 'index.html')).toString();
        indexHtml = indexHtml
            .replace("{{PROJECT_NAME}}", projectName)
        await fs.writeFile(path.join(projectPath, 'index.html'), indexHtml);

        await fs.copySync(path.resolve(this.config.frameworkPath, 'templates', 'public'), path.resolve(projectPath, 'public'));
    }

    async createProjectFiles(projectPath, projectName) {
        const gitignoreContent = fs.readFileSync(path.join(this.config.frameworkPath, 'templates', '.gitignore'), 'utf-8');
        await fs.writeFile(path.join(projectPath, '.gitignore'), gitignoreContent);

        let readmeContent = fs.readFileSync(path.join(this.config.frameworkPath, 'templates', 'README.md'), 'utf-8');
        readmeContent = readmeContent.replace("{{PROJECT_NAME}}", projectName);
        await fs.writeFile(path.join(projectPath, 'README.md'), readmeContent);

        const envExample = fs.readFileSync(path.join(this.config.frameworkPath, 'templates', '.env.example'), 'utf-8');
        await fs.writeFile(path.join(projectPath, '.env.example'), envExample);
    }

    init = async ()=> {
        const projectName = this.args[0] || 'my-app';

        if (!this.isValidProjectName(projectName)) {
            console.error(chalk.red(`❌ Invalid project name: ${projectName}`));
            console.log(chalk.yellow('Project name should only contain letters, numbers, hyphens, and underscores'));
            process.exit(1);
        }

        console.log(chalk.blue(`🚀 Creating new project: ${projectName}`));
        console.log(chalk.gray('Using RS Framework v' + this.version));

        const projectPath = path.join(this.config.projectRoot, projectName);

        // if (fs.existsSync(projectPath)) {
        //     console.error(chalk.red(`❌ Directory ${projectName} already exists`));
        //     process.exit(1);
        // }

        await fs.ensureDir(projectPath);

        try {
            await this.createUserProject(projectPath, projectName);

            console.log(chalk.green(`✅ Project ${projectName} created successfully!`));
            console.log(chalk.yellow(`\n📝 Next steps:`));
            console.log(chalk.cyan(`  cd ${projectName}`));
            console.log(chalk.cyan(`  npm install or pnpm install or yarn install`));
            console.log(chalk.cyan(`  rs-ssg dev`));
            console.log(chalk.green(`  Build SSG: rs-ssg build`));

            console.log(chalk.gray(`\n💡 Happy coding! 🎉`));
        } catch (error) {
            console.error(chalk.red('❌ Failed to create project:'), error.message);
            if (fs.existsSync(projectPath)) {
                await fs.remove(projectPath);
            }
            process.exit(1);
        }
    }
}

export default InitProject;