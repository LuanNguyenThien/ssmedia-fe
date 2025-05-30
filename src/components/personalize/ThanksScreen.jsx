const ThanksScreen = ({ onClose, text, title }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center animate__animated animate__fadeInUp animate__faster">
                <div
                    className="text-7xl mb-6 animate-bounce-slow select-none"
                    aria-hidden="true"
                >
                    🎉
                </div>
                <h1 className="text-3xl font-extrabold text-primary-black mb-2 text-center">
                    {title ? title : "Welcome aboard!"}
                </h1>
                <h2 className="text-lg font-semibold text-primary-black mb-4 text-center">
                    {text ? text : "Thank you for sharing your interests"}
                </h2>
                <p className="text-base text-gray-600 mb-8 text-center max-w-md">
                    We'll use your info to make your experience more fun,
                    personal, and inspiring. Get ready for awesome content
                    picked just for you!
                </p>
                <button
                    className="bg-primary text-white text-lg font-bold px-8 py-3 rounded-full flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-primary/60"
                    onClick={onClose}
                    autoFocus
                >
                    <span>Let's go!</span>
                    <span aria-hidden="true" className="text-2xl">
                        🚀
                    </span>
                </button>
            </div>
        </div>
    );
};

export default ThanksScreen;
