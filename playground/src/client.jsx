import ReactDOM from 'react-dom/client' // keep this line for [dev]
import ssgHydrateRoot from 'rs-ssg/lib/SSGHydrateRoot.jsx'

import routes from './routes.js'
import App from './App.jsx'
import "./index.css"

ssgHydrateRoot(App, routes)
