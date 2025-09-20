import {lazy} from "react";

const routes = [
    {
        path: '/',
        component: lazy(() => import('./pages/Home.jsx')),
        entry: "/src/pages/Home.jsx",
        title: 'Home Screen'
    },
    {
        path: '/about',
        component: lazy(() => import('./pages/About.jsx')),
        entry: "/src/pages/About.jsx",
        title: 'About Screen'
    }
]


export default  routes;