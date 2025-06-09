import { useState } from 'react';

const Tooltip = ({ 
    children, 
    message, 
    position = 'top', 
    variant = 'default',
    disabled = false 
}) => {
    const [isVisible, setIsVisible] = useState(false);

    if (disabled || !message) {
        return children;
    }

    const positionClasses = {
        top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
    };

    const arrowClasses = {
        top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent',
        bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent',
        left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent',
        right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent'
    };

    const variantClasses = {
        default: 'bg-gray-900 text-white border-gray-900',
        error: 'bg-red-500 text-white border-red-500',
        warning: 'bg-yellow-500 text-white border-yellow-500',
        success: 'bg-green-500 text-white border-green-500',
        info: 'bg-blue-500 text-white border-blue-500'
    };

    return (
        <div 
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onFocus={() => setIsVisible(true)}
            onBlur={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div
                    className={`absolute z-50 px-3 py-2 text-sm font-medium rounded-lg shadow-lg whitespace-nowrap pointer-events-none transition-opacity duration-200 ${positionClasses[position]} ${variantClasses[variant]}`}
                    role="tooltip"
                >
                    {message}
                    {/* Arrow */}
                    <div
                        className={`absolute w-0 h-0 border-4 !bg-transparent ${arrowClasses[position]} ${variantClasses[variant]}`}
                    />
                </div>
            )}
        </div>
    );
};

export default Tooltip; 