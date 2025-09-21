import {lazy} from "react";

const routes = [
    {
        path: '/',
        component: lazy(() => import('./pages/Home.jsx')),
        entry: "./src/pages/Home.jsx",
        title: 'Home Screen'
    },
    {
        path: '/docs',
        entry: "./src/pages/Docs.jsx",
        component: lazy(() => import('./pages/Docs.jsx')),
        title: 'Docs',
    },
    // {
    //     path: '/:id',
    //     component: lazy(() => import('./pages/ItemPage.jsx')),
    //     entry: "/src/pages/ItemPage.jsx",
    //     title: 'ItemPage Screen'
    // },
    {
        path: '/examples',
        entry: "./src/pages/Examples.jsx",
        component: lazy(() => import('./pages/Examples.jsx')),
        title: 'Examples'
    },

    {
        path: '/about',
        component: lazy(() => import('./pages/About.jsx')),
        entry: "./src/pages/About.jsx",
        title: 'About Screen'
    }
]

export default  routes;