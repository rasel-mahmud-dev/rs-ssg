import chalk from "chalk";

class Preview {
    constructor(config) {
        this.config = config
    }

    async start() {
        let server = null;
        try {
            const { preview } = await import('vite');
            server = await preview({
                build: {
                    outDir: this.config.buildDir
                }
            });

            const originalUse = server.middlewares.use.bind(server.middlewares);
            server.middlewares.stack.unshift({
                route: '',
                handle: (req, res, next) => {
                    if (!req.url) return next();
                    const requestURL = new URL(req.url, `http://${req.headers.host}`);
                    if (/^\/(?:[^@]+\/)*[^@./]+$/g.test(requestURL.pathname) && requestURL.pathname !== '/') {
                        requestURL.pathname += "/";
                        req.url = requestURL.pathname + requestURL.search;
                    }
                    return next();
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