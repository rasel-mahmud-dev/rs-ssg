import chalk from "chalk";

const forwardToTrailingSlash = {
    name: "forward-to-trailing-slash",
    configureServer: (server) => {
        console.log("server configured")
        server.middlewares.use((req, res, next) => {
            console.log("dev server middleware hit")
            if (!req.url) {
                return next();
            }

            const requestURL = new URL(req.url, `http://${req.headers.host}`);
            if (/^\/(?:[^@]+\/)*[^@./]+$/g.test(requestURL.pathname)) {
                requestURL.pathname += "/";
                req.url = requestURL.toString();
            }

            return next();
        });
    },

    configurePreviewServer: (server) => {
        console.log("preview server configured")
        server.middlewares.use((req, res, next) => {
            console.log("preview server middleware hit:", req.url)
            if (!req.url) {
                return next();
            }

            const requestURL = new URL(req.url, `http://${req.headers.host}`);
            if (/^\/(?:[^@]+\/)*[^@./]+$/g.test(requestURL.pathname)) {
                console.log("Redirecting to add trailing slash:", requestURL.pathname)
                const newUrl = requestURL.pathname + "/" + requestURL.search;
                res.writeHead(301, { 'Location': newUrl });
                res.end();
                return; // Don't call next() after redirect
            }

            return next();
        });
    },
}

class Preview {
    constructor(config) {
        this.config = config
        console.log("Preview initialized");
    }

    async start() {
        console.log(chalk.blue('👀 Starting preview server...'));
        let server = null;
        try {
            const { preview } = await import('vite');

            const viteConfig =  {}

            server = await preview({
                ...viteConfig, // Spread existing config
                build: {
                    ...viteConfig?.build,
                    outDir: this.config.buildDir
                },
                plugins: [
                    ...(viteConfig?.plugins || []), // Include existing plugins
                    forwardToTrailingSlash
                ],
                // Make sure preview server applies plugins
                preview: {
                    ...viteConfig?.preview,
                    middlewareMode: false
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