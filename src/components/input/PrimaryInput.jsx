import { useState, forwardRef } from "react";
import PropTypes from "prop-types";

const PrimaryInput = forwardRef(({
    type = "text",
    name,
    id,
    value,
    onChange,
    onBlur,
    onFocus,
    placeholder,
    className = "",
    required = false,
    disabled = false,
    readOnly = false,
    labelText,
    icon,
    error,
    accept,
    autoComplete = "off",
    min,
    max,
    maxLength,
    multiple = false
}, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    
    const handleFocus = (e) => {
        setIsFocused(true);
        if (onFocus) onFocus(e);
    };
    
    const handleBlur = (e) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
    };

    return (
        <div className={`w-full ${className}`}>
            {labelText && (
                <label 
                    htmlFor={id || name} 
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    {labelText}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className={`
                relative flex items-center rounded-md shadow-sm
                ${error ? 'ring-2 ring-red-500' : ''}
                ${isFocused ? 'ring-2 ring-primary' : 'ring-1 ring-gray-300'}
                ${disabled ? 'bg-gray-100' : 'bg-white'}
            `}>
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {icon}
                    </div>
                )}
                
                <input
                    ref={ref}
                    type={type}
                    name={name}
                    id={id || name}
                    value={value}
                    onChange={onChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={readOnly}
                    required={required}
                    accept={accept}
                    min={min}
                    max={max}
                    maxLength={maxLength}
                    multiple={multiple}
                    autoComplete={autoComplete}
                    className={`
                        block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm focus:outline-none sm:text-sm sm:leading-6
                        disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500
                        ${icon ? 'pl-10' : 'pl-3'}
                        pr-3
                    `}
                />
            </div>
            
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
});

PrimaryInput.displayName = 'PrimaryInput';

PrimaryInput.propTypes = {
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    id: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    labelText: PropTypes.string,
    icon: PropTypes.element,
    error: PropTypes.string,
    accept: PropTypes.string,
    autoComplete: PropTypes.string,
    min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    maxLength: PropTypes.number,
    multiple: PropTypes.bool
};

export default PrimaryInput;
