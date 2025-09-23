import chalk from "chalk";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

class Dev {

    constructor(config) {
        this.config = config
    }

    async start() {

        console.log(chalk.blue('🚀 Starting development server...'));
        console.log(chalk.gray('Loading configuration...'));


        try {
            const { createServer } = await import('vite');

            const config = defineConfig({
                plugins: [
                    react(),
                    tailwindcss()
                ],
                root: this.config.projectRoot,
                publicDir: 'public',
                server: {
                    port:  Number(this.config?.configSeo?.devPort) || 3000,
                }
            });

            const server = await createServer(config);
            await server.listen();

            console.log('Vite dev server is running!');
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