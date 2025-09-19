import {lazy} from "react";

const routes = [
    {
        path: '/',
        component: lazy(() => import('./Home.jsx')),
        entry: "/src/Home.jsx",
        title: 'Home Screen'
    },
    {
        path: '/about',
        component: lazy(() => import('./Home.jsx')),
        entry: "/src/About.jsx",
        title: 'About Screen'
    },
]


export default  routes;