import {lazy} from "react";

const routes = [
    {
        path: '/',
        component: lazy(() => import('./pages/Home.jsx')),
        entry: "./src/pages/Home.jsx",
    },
    {
        path: '/docs',
        entry: "./src/pages/Docs.jsx",
        component: lazy(() => import('./pages/Docs.jsx')),
    },
    {
        path: '/changelog',
        entry: "./src/pages/ChangelogPage.jsx",
        component: lazy(() => import('./pages/ChangelogPage.jsx')),
    },
    {
        path: '/examples',
        entry: "./src/pages/Examples.jsx",
        component: lazy(() => import('./pages/Examples.jsx')),
    },
    {
        path: '/about',
        component: lazy(() => import('./pages/About.jsx')),
        entry: "./src/pages/About.jsx",
    }
]

export default  routes;