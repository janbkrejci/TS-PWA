import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Register service worker with better error handling
async function registerSW() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/',
                type: 'module'
            });

            // Check for updates on page load
            registration.update();

            // Optionally, set up periodic updates
            setInterval(() => {
                registration.update();
            }, 60 * 60 * 1000); // Check every hour

        } catch (error) {
            console.error('SW registration failed:', error);
        }
    }
}

registerSW();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
