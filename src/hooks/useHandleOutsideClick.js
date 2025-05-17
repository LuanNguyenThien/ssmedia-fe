import { useEffect } from "react";

/**
 * Hook for handling clicks outside of a specified element(s)
 * @param {Object|Array} refs - React ref object or array of refs to check
 * @param {Function} callback - Function to call when a click outside occurs
 * @param {Object} options - Additional options
 * @param {string} options.eventType - Type of event to listen for ('click', 'mousedown', etc.)
 * @param {boolean} options.disabled - Whether the hook is disabled
 */
export default function useHandleOutsideClick(refs, callback, options = {}) {
    const { eventType = "mousedown", disabled = false } = options;

    useEffect(() => {
        if (disabled) return;

        const handleClickOutside = (event) => {
            // Handle case where refs is a single ref
            if (!Array.isArray(refs)) {
                if (refs.current && !refs.current.contains(event.target)) {
                    callback(false);
                }
                return;
            }

            // Handle case where refs is an array of refs
            const clickedOutside = refs.every(
                (ref) => !ref.current || !ref.current.contains(event.target)
            );

            if (clickedOutside) {
                callback(false);
            }
        };

        document.addEventListener(eventType, handleClickOutside);
        return () =>
            document.removeEventListener(eventType, handleClickOutside);
    }, [refs, callback, eventType, disabled]);
}

/**
 * Legacy support for multiple refs with same functionality
 * @deprecated Use the default export with an array of refs instead
 */
export const useHandleOutsideClicks = (refs, callback, options = {}) => {
    return useHandleOutsideClick(refs, callback, options);
};
