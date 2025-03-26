import { useEffect } from "react";

export default function useHandleOutsideClick(ref, onClickOutSide) {
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                onClickOutSide(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [ref, onClickOutSide]);
}

export const useHandleOutsideClicks = (refs, callback) => {
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                refs.some(
                    (ref) => ref.current && ref.current.contains(event.target)
                )
            ) {
                return;
            }
            callback();
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [refs, callback]);
};
