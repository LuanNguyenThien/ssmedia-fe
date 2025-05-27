import { useEffect, useState } from "react";
import PersonalizeItem from "./components/PersonalizeItem";
import { INTERESTS } from "./constant";

const PersonalizeModal = ({
    alreadyPersonalized,
    onClose,
    onContinue,
    title,
    description,
    
}) => {
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        if (alreadyPersonalized) {
            setSelected(alreadyPersonalized);
        }
    }, [alreadyPersonalized, onClose]);

    const handleToggle = (value) => {
        const splitValue = value.split(" ");
        const topicKey = splitValue[0];

        // one more step, check the related topics,

        setSelected((prev) => {
            const isTopicSelected = prev.some(
                (item) => item.split(" ")[0] === topicKey
            );

            if (isTopicSelected) {
                return prev.filter((item) => item.split(" ")[0] !== topicKey);
            } else {
                return [...prev, value];
            }
        });
    };
    console.log(selected);

    const handleKeyDown = (e, value) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle(value);
        }
    };

    const handleContinue = (isContinue = true) => {
        if (isContinue) {
            onContinue(selected);
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-black bg-opacity-30">
            <div className="w-full max-w-4xl h-[90dvh] sm:h-auto overflow-y-scroll bg-primary-white rounded-2xl shadow-lg p-8 animate__animated animate__fadeInUp">
                <h2 className="text-2xl font-bold text-primary-black mb-2">
                    {title ? title : (
                        <>
                            Welcome to{" "}
                            <span className="text-2xl font-bold text-primary">
                                BRAINET
                            </span>{" "}
                            community!
                        </>
                    )}
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                    {description
                        ? description
                        : "Tell us more about you. What are your interests?"}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[420px] overflow-y-auto py-2">
                    {INTERESTS.map((interest) => {
                        const isSelected = selected.includes(
                            interest.label.toLowerCase()
                        );
                        return (
                            <PersonalizeItem
                                key={interest.value}
                                interest={interest}
                                isSelected={isSelected}
                                onToggle={handleToggle}
                                onKeyDown={handleKeyDown}
                            />
                        );
                    })}
                </div>
                <div className="flex flex-col items-center justify-center pb-8  sm:pb-0 ">
                    <button
                        onClick={() => handleContinue(true)}
                        className="mt-6 w-full py-3 rounded-lg bg-primary text-white font-bold text-lg disabled:bg-primary/40 disabled:cursor-not-allowed transition-colors"
                        disabled={selected.length < 1}
                        aria-disabled={selected.length < 1}
                    >
                        {selected.length < 1
                            ? `Select ${
                                  1 - selected.length
                              } more topics to continue`
                            : "Continue"}
                    </button>

                    <div
                        onClick={() => handleContinue(false)}
                        className="text-gray-400 text-center w-full text-sm py-2 cursor-pointer underline hover:text-primary"
                    >
                        I will do it later
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalizeModal;
