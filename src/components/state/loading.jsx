const LoadingSpinner = () => {
    return (
        <div class="p-3 animate-spin drop-shadow-2xl bg-gradient-to-bl from-blue-500 via-blue-300 to-white size-full aspect-square rounded-full">
            <div class="rounded-full h-full w-full bg-slate-100 dark:bg-zinc-900 background-blur-md"></div>
        </div>
    );
};

export default LoadingSpinner;
