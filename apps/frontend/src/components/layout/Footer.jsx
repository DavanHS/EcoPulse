import { FiWind, FiGithub, FiHeart } from 'react-icons/fi';

export default function Footer() {
    return (
        <footer className="border-t border-gray-800 bg-gray-950 mt-auto">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="flex items-center justify-center rounded-lg bg-gray-900 p-2 shadow-sm">
                        <FiWind className="text-green-500" />
                    </div>
                    <span className="font-medium">
                        Eco<span className="font-bold text-white">Pulse</span>
                        <span className="mx-2 text-gray-700">|</span>
                        Breathe smarter.
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5 font-medium">
                        Made with <FiHeart className="text-red-500 animate-pulse" /> in Bengaluru
                    </span>

                    <span className="hidden sm:block text-gray-800">•</span>

                    <span className="font-medium">Powered by WAQI &amp; Gemini</span>

                    <a
                        href="https://github.com/DavanHS/EcoPulse"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-xl bg-gray-900 px-3 py-2 text-gray-400 font-medium transition-colors hover:bg-gray-800 hover:text-white border border-gray-800"
                    >
                        <FiGithub className="text-base" />
                        <span className="hidden sm:inline">GitHub</span>
                    </a>
                </div>
            </div>
        </footer>
    );
}
