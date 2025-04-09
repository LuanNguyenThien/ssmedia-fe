const LoadingMessage = () => {
    return (
        <div class="flex flex-row gap-2">
            <div class="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:.4s]"></div>
            <div class="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:.1s]"></div>
            <div class="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:.4s]"></div>
        </div>
    );
};

export default LoadingMessage;
