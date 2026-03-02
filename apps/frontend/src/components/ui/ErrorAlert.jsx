import { FiAlertTriangle, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';

export default function ErrorAlert({ message, onDismiss, autoDismissTimeout = null }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        setVisible(true);
        let timer;
        if (autoDismissTimeout) {
            timer = setTimeout(() => {
                handleDismiss();
            }, autoDismissTimeout);
        }
        return () => clearTimeout(timer);
    }, [message, autoDismissTimeout]);

    if (!visible || !message) return null;

    const handleDismiss = () => {
        setVisible(false);
        onDismiss?.();
    };

    return (
        <div className="animate-fade-in-up w-full">
            <div className="flex items-start gap-4 rounded-2xl border border-red-500/20 bg-red-950/40 px-5 py-4 shadow-xl shadow-red-500/5 backdrop-blur-sm">
                <div className="rounded-full bg-red-500/10 p-2 shrink-0">
                    <FiAlertTriangle className="text-lg text-red-500" />
                </div>

                <div className="flex-1 pt-1">
                    <h4 className="text-sm font-bold text-red-400 mb-1">Error Encountered</h4>
                    <p className="text-sm leading-relaxed text-red-300/90">{message}</p>
                </div>

                <button
                    onClick={handleDismiss}
                    className="shrink-0 rounded-lg p-2 text-red-400/70 transition-colors hover:bg-red-500/20 hover:text-red-400"
                >
                    <FiX className="text-lg" />
                </button>
            </div>
        </div>
    );
}
