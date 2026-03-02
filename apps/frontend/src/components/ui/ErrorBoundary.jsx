import { Component } from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-[70vh] items-center justify-center px-5">
                    <div className="w-full max-w-md animate-fade-in-up text-center">
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                            <FiAlertTriangle className="text-3xl" />
                        </div>
                        <h2 className="mb-2 text-2xl font-black tracking-tight text-white">
                            Something went wrong
                        </h2>
                        <p className="mb-6 text-sm text-gray-400">
                            An unexpected error occurred. Try refreshing the page.
                        </p>
                        <button
                            onClick={this.handleReset}
                            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95"
                            style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 4px 14px rgba(34,197,94,0.25)' }}
                        >
                            <FiRefreshCw className="text-[15px]" />
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
