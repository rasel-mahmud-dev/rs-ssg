import {renderToString} from "react-dom/server";

function renderToString3(component, props) {
    const Component = component;
    const content = renderToString(<Component {...props} />);
    return content;
}

export default renderToString3;