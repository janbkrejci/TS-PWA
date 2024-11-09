import { useEffect, useState } from 'react';

function App() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Watch system dark mode preferences
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleDarkModeChange = (e: MediaQueryListEvent | MediaQueryList) => {
            if (e.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        // Initial check
        handleDarkModeChange(mediaQuery);

        // Listen for changes
        mediaQuery.addEventListener('change', handleDarkModeChange);

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
        }

        // Handle install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        });

        // Watch for successful installation
        window.addEventListener('appinstalled', () => {
            setIsInstalled(true);
            setDeferredPrompt(null);
        });

        return () => mediaQuery.removeEventListener('change', handleDarkModeChange);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };

    return (
        <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12 bg-gray-100 dark:bg-gray-900">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="relative px-4 py-10 shadow-lg sm:rounded-3xl sm:p-20 bg-white dark:bg-gray-800">
                    <div className="max-w-md mx-auto">
                        <div className="divide-y divide-gray-200">
                            <div className="py-8 text-base leading-6 space-y-4 sm:text-lg sm:leading-7 text-gray-700 dark:text-gray-300">
                                <p>Vite + React + TypeScript + Tailwind + PWA</p>
                                {!isInstalled && deferredPrompt && (
                                    <button
                                        onClick={handleInstallClick}
                                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                    >
                                        Install App
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
