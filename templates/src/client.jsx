import {createRoot, hydrateRoot} from 'react-dom/client';
import App from './App.jsx';

const container = document.getElementById('root');

if (container.innerHTML) {
    hydrateRoot(container, <App />);
} else {
    createRoot(container).render(<App />);
}