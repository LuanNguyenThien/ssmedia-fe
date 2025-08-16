import { useEffect, useState, useCallback, useMemo } from "react";
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

    // Create a Set for O(1) lookup performance instead of O(n) array operations
    const selectedSet = useMemo(() => new Set(selected), [selected]);

    // Memoize the toggle handler to prevent recreating on every render
    const handleToggle = useCallback((value) => {
        const splitValue = value.split(" ");
        const topicKey = splitValue[0];

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
    }, []);

    // Memoize the keydown handler
    const handleKeyDown = useCallback((e, value) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle(value);
        }
    }, [handleToggle]);

    // Memoize the continue handler
    const handleContinue = useCallback((isContinue = true) => {
        if (isContinue) {
            onContinue(selected);
        } else {
            onClose();
        }
    }, [selected, onContinue, onClose]);

    // Memoize the interests with their selection state to prevent unnecessary re-renders
    const interestsWithSelection = useMemo(() => {
        return INTERESTS.map((interest) => ({
            ...interest,
            isSelected: selectedSet.has(interest.label.toLowerCase())
        }));
    }, [selectedSet]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-black bg-opacity-30">
            <div className="w-full max-w-4xl h-[90dvh] sm:h-auto overflow-y-scroll bg-primary-white rounded-2xl shadow-lg p-8 animate__animated animate__faster animate__fadeInUp">
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[420px] scroll-smooth overflow-y-auto py-2">
                    {interestsWithSelection.map((interest) => (
                        <PersonalizeItem
                            key={interest.value}
                            interest={interest}
                            isSelected={interest.isSelected}
                            onToggle={handleToggle}
                            onKeyDown={handleKeyDown}
                        />
                    ))}
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
