import { useEffect } from "react";

const useHandleOutsideClick = (ref, onClickOutSide) => {
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                onClickOutSide(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);
};

export default useHandleOutsideClick;
