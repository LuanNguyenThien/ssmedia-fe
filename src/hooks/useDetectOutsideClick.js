import { useEffect, useState } from "react";

const useDetectOutsideClick = (ref, initialState) => {
    const [isActive, setIsActive] = useState(initialState);
    useEffect(() => {initialState
        const onClick = (event) => {
            if (
                ref.current !== null &&
                !ref.current.contains(event.target) &&
                !event.target.closest(".header-nav-item")
            ) {
                // Only set to false if currently true
                console.log("Setting isActive to false");
                if (isActive) {
                    setIsActive(false);
                }
            }
        };

        // Always add the event listener, not conditional on isActive
        window.addEventListener("click", onClick);

        return () => {
            window.removeEventListener("click", onClick);
        };
    }, [isActive, ref]);

    return [isActive, setIsActive];
};
export default useDetectOutsideClick;
