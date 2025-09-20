import chalk from "chalk";
import collectViteConfig from "./utils/collectViteConfig.js";


class Preview {
    constructor(config) {
        this.config = config
        console.log("Preview initialized");
    }

    async start() {
        console.log(chalk.blue('👀 Starting preview server...'));
        let server = null;
        try {
            const {preview} = await import('vite');
            const config = await collectViteConfig('production', this.config);
            server = await preview({
                ...config,
                build: {
                    ...config.build,
                    outDir: this.config.buildDir
                }
            });
            console.log();
            server.printUrls();
            console.log(chalk.green('✅ Preview server started successfully!'));
            console.log(chalk.gray('Press Ctrl+C to stop the server'));

            // Graceful shutdown
            const shutdown = async (signal) => {
                console.log(chalk.yellow(`\n🛑 Received ${signal}. Shutting down preview server...`));
                try {
                    if (server) {
                        await server.close();
                        console.log(chalk.green('✅ Server closed gracefully'));
                    }
                } catch (error) {
                    console.error(chalk.red('Error during shutdown:'), error.message);
                }
                process.exit(0);
            };

            process.on('SIGINT', () => shutdown('SIGINT'));
            process.on('SIGTERM', () => shutdown('SIGTERM'));

            return new Promise(() => {
            });

        } catch (error) {
            console.error(chalk.red('❌ Failed to start preview server:'));
            console.error(chalk.red(error.message));
            console.error(chalk.gray(error.stack));
            if (server) {
                try {
                    await server.close();
                } catch (closeError) {
                    console.error(chalk.red('Error during cleanup:'), closeError.message);
                }
            }
            process.exit(1);
        }
    }
}

export default Preview