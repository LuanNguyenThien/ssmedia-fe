import { useState, useEffect } from 'react';

/**
 * Custom hook that calculates the actual visible viewport height
 * and sets a CSS variable that can be used throughout the app
 * @param {string} cssVariableName - The name of the CSS variable to set (default: --viewport-height)
 * @returns {number} The current viewport height in pixels
 */
const useViewportHeight = (cssVariableName = '--viewport-height') => {
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    // Function to update the viewport height
    const updateViewportHeight = () => {
      // Get the visual viewport height if available (more accurate on mobile)
      const height = window.visualViewport 
        ? window.visualViewport.height 
        : window.innerHeight;
      
      // Set the CSS variable
      document.documentElement.style.setProperty(cssVariableName, `${height}px`);
      
      // Update the state
      setViewportHeight(height);
    };

    // Update on initial render
    updateViewportHeight();

    // Add event listeners for changes in viewport size
    window.addEventListener('resize', updateViewportHeight);
    
    // Add visual viewport event listener if available (better for mobile)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewportHeight);
      window.visualViewport.addEventListener('scroll', updateViewportHeight);
    }

    // Orientation change event for mobile devices
    window.addEventListener('orientationchange', updateViewportHeight);

    // Update when keyboard appears/disappears on mobile
    window.addEventListener('focusin', () => {
      // Short timeout to let keyboard fully appear
      setTimeout(updateViewportHeight, 100);
    });
    
    window.addEventListener('focusout', () => {
      // Short timeout to let keyboard fully disappear
      setTimeout(updateViewportHeight, 100);
    });

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('orientationchange', updateViewportHeight);
      window.removeEventListener('focusin', updateViewportHeight);
      window.removeEventListener('focusout', updateViewportHeight);
      
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateViewportHeight);
        window.visualViewport.removeEventListener('scroll', updateViewportHeight);
      }
    };
  }, [cssVariableName]);

  return viewportHeight;
};

export default useViewportHeight;