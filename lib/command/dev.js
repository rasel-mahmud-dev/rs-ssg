import chalk from "chalk";
import collectViteConfig from "./utils/collectViteConfig.js";
import reactPlugin from '@vitejs/plugin-react';

class Dev {

    constructor(config) {
        this.config = config
    }

    async start() {

        console.log(chalk.blue('🚀 Starting development server...'));
        console.log(chalk.gray('Loading configuration...'));

        // await this.ensureConfigFiles();

        try {
            const {createServer} = await import('vite');
            // const config = await collectViteConfig('development', this.config);



            const server = await createServer({
                root: "./playground",
                build: {
                    index: "./index.html",
                },
                server: {
                    port: 3000,
                    open: true,
                },
                preview: {
                    port: 5000,
                    open: true,
                },
                plugins:  [reactPlugin()]
                // ...config,
                // optimizeDeps: {
                //     include: ['react', 'react-dom']
                // }
            });
            await server.listen()

            console.log();
            server.printUrls();
            console.log(chalk.green('✅ Development server started successfully!'));
            console.log(chalk.gray('Press Ctrl+C to stop the server'));

            // Graceful shutdown
            const shutdown = async () => {
                console.log(chalk.yellow('\n🛑 Shutting down development server...'));
                await server.close();
                console.log(chalk.green('✅ Server closed'));
                process.exit(0);
            };

            process.on('SIGINT', shutdown);
            process.on('SIGTERM', shutdown);

        } catch (error) {
            console.error(chalk.red('❌ Failed to start development server:'));
            console.error(chalk.red(error.message));
            if (error.code === 'EADDRINUSE') {
                console.log(chalk.yellow('💡 Try using a different port or close the application using that port'));
            }
            process.exit(1);
        }
    }
}

export default Dev