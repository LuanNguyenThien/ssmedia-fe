import { useState, useEffect } from "react";

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 550);
        };

        // Check on initial mount
        checkIfMobile();

        // Add event listener for window resize to detect orientation changes
        window.addEventListener("resize", checkIfMobile);

        // Clean up
        return () => {
            window.removeEventListener("resize", checkIfMobile);
        };
    }, []);

    return isMobile;
};

export default useIsMobile;
