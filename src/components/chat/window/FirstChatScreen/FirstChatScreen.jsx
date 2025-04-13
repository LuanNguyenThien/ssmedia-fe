import { icons } from "@/assets/assets";

const FirstChatScreen = () => {
    return (
        <div className="size-full max-h-full flex justify-center items-center ">
            <div className="flex flex-col justify-center items-center h-auto w-full text-center px-4">
                <div className="h-[30vh] w-[30vh] animate__animated animate__jackInTheBox animate__slow">
                    <img
                        src={icons.say_hi}
                        className="size-full object-cover"
                        alt=""
                    />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-primary-black my-4 animate-fade-in-top animate__animated animate__fadeIn ">
                    Let’s chat it up!
                </h1>
                <p className="w-max max-w-full h-auto text-base sm:text-lg text-primary-black/50 mb-8 animate__animated animate__fadeIn">
                    Got something to share? Or just wanna vibe? Let's go for it!
                </p>
            </div>
        </div>
    );
};

export default FirstChatScreen;
