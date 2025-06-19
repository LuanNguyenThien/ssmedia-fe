import { useEffect } from 'react';

export const useViewportHeight = (options = {}) => {
    const {
        headerDesktopSelector = "div.header-desktop",
        headerMobileSelector = "div.header-mb",
        footerMobileSelector = "div.footer-mb",
        rootHeightVar = "--root-height",
        headerFooterHeightVar = "--header-footer-height"
    } = options;

    useEffect(() => {
        const setViewportHeight = () => {
            const viewportHeight = window.innerHeight;
            console.log("Viewport Height:", viewportHeight);
            
            const headerDesktopElement = document.querySelector(headerDesktopSelector);
            const headerElement = document.querySelector(headerMobileSelector);
            const footerElement = document.querySelector(footerMobileSelector);

            // Set root height
            document.documentElement.style.setProperty(
                rootHeightVar,
                `${viewportHeight}px`
            );

            // Set header + footer height
            if (headerElement && footerElement) {
                const headerHeight = headerElement.offsetHeight;
                const footerHeight = footerElement.offsetHeight;
                const totalHeight = headerHeight + footerHeight;
                document.documentElement.style.setProperty(
                    headerFooterHeightVar,
                    `${totalHeight}px`
                );
            } else if (headerDesktopElement) {
                const headerHeight = headerDesktopElement.offsetHeight;
                const totalHeight = headerHeight;
                document.documentElement.style.setProperty(
                    headerFooterHeightVar,
                    `${totalHeight}px`
                );
            }
        };

        // Set initial values
        setViewportHeight();

        // Update on resize
        window.addEventListener('resize', setViewportHeight);

        return () => {
            window.removeEventListener('resize', setViewportHeight);
        };
    }, [headerDesktopSelector, headerMobileSelector, footerMobileSelector, rootHeightVar, headerFooterHeightVar]);
};