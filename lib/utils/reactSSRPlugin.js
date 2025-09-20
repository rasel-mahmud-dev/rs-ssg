import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const reactSSRPlugin = {
    name: 'react-ssr',
    setup(build) {
        build.onResolve({ filter: /^react$/ }, () => {
            return { path: path.resolve(__dirname, 'node_modules/react/index.js'), external: false }
        })

        build.onResolve({ filter: /^react-dom$/ }, () => {
            return { path: path.resolve(__dirname, 'node_modules/react-dom/index.js'), external: false }
        })
    }
}

export default reactSSRPlugin