import {Seo} from "rs-ssg";

function App(props) {
    return (
        <div>
            <Seo>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
                <link href="https://fonts.googleapis.com/css2?family=Alan+Sans:wght@300..900&display=swap"
                      rel="stylesheet"/>
            </Seo>
            {props.children}
        </div>
    )
}

export default App;


// my-project
//     dist
//     node_modules
//     public
//     src
//         components
//         pages
//         App.jsx
//         client.jsx
//         index.css
//         routes.js
//     index.html
//     package.json
//     pnpm-lock.yaml
//     ssg.config.js
//     .gitignore