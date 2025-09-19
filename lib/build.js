import { build } from 'vite';
import path from 'path';
import { fileURLToPath } from "url";
import fs from "fs-extra";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function buildSite() {
    return new Promise(async (resolve) => {

        const outputDir = path.resolve(__dirname, 'dist');

        fs.removeSync(outputDir);

        // const config = path.resolve('vite.config.ts');
        // const d = path.resolve(process.cwd(), 'src/document.tsx');
        const customConfigPath = "" //path.resolve(process.cwd(), 'rs-ssg.config.ts');

        // Use native Node.js instead of glob
        // const libDir = path.resolve(__dirname, '../lib');
        // const libFiles = getAllFiles(libDir).map(file =>
        //     './' + path.relative(process.cwd(), file)
        // );

        const routes = path.resolve("./playground/src/routes.jsx");


        // await build({
        //     logLevel: 'silent',
        //     build: {
        //         ssr: true,
        //         outDir: outputDir,
        //         rollupOptions: {
        //             input: routes,
        //             output: {
        //                 format: 'es',
        //                 entryFileNames: '[name].js'
        //             }
        //         }
        //     }
        // });

        resolve([]);
    });
}

export default buildSite;