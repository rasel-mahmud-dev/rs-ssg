import CoreApp from "../../lib/coreApp.jsx"
import "./global.css"
import routes from "./routes.js";

function App(props) {
    return <CoreApp routes={routes} {...props} />;
}

export default App;