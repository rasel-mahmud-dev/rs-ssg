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
        path: '/examples',
        entry: "./src/pages/Examples.jsx",
        component: lazy(() => import('./pages/Examples.jsx')),
    },
    {
        path: '/about',
        component: lazy(() => import('./pages/About.jsx')),
        entry: "./src/pages/About.jsx",
    },
    {
        path: '/blogs',
        component: lazy(() => import('./pages/Blogs.jsx')),
        entry: "./src/pages/Blogs.jsx",
    },
    {
        path: '/blogs/:id',
        component: lazy(() => import('./pages/BlogItem.jsx')),
        entry: "./src/pages/BlogItem.jsx",
    }
]

export default  routes;