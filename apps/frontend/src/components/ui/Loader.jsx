export default function Loader({ size = 'md', text = '' }) {
    const sizes = {
        sm: 'h-5 w-5 border-2',
        md: 'h-8 w-8 border-2 sm:h-10 sm:w-10 sm:border-[3px]',
        lg: 'h-12 w-12 border-[3px] sm:h-16 sm:w-16 sm:border-4',
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="relative flex items-center justify-center">
                {/* Outer Glow */}
                <div className="absolute inset-0 animate-pulse rounded-full bg-green-500/20 blur-xl" />
                {/* Spinner */}
                <div
                    className={`${sizes[size]} animate-spin rounded-full border-gray-800 border-t-green-500/90 border-r-cyan-500/90 shadow-lg`}
                />
            </div>
            {text && (
                <p className="mt-4 animate-pulse text-sm font-medium text-gray-400">
                    {text}
                </p>
            )}
        </div>
    );
}
