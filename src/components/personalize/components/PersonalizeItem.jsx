import React from "react";

const PersonalizeItem = ({ interest, isSelected, onToggle, onKeyDown }) => (
    <div
        tabIndex={0}
        aria-label={interest.label}
        onClick={() => onToggle(interest.label.toLowerCase())}
        onKeyDown={(e) => onKeyDown(e, interest.label.toLowerCase())}
        className={`relative cursor-pointer rounded-xl bg-white shadow-lg overflow-hidden group outline-none ring-2 ring-transparent focus:ring-primary transition-all duration-200 transform hover:scale-105 hover:shadow-2xl ${
            isSelected ? "ring-primary" : "hover:ring-primary/50"
        }`}
        role="button"
    >
        <img
            src={interest.img}
            alt={interest.label}
            className="w-full h-32 object-cover rounded-t-xl group-hover:scale-110 transition-transform duration-300"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
        {/* Checkmark */}
        <span
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                isSelected
                    ? "bg-primary text-white border-primary shadow-lg"
                    : "bg-white/80 text-primary border-gray-300"
            }`}
        >
            {isSelected ? (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            ) : (
                <span className="block w-3 h-3 rounded-full bg-primary/40 group-hover:bg-primary/60 transition" />
            )}
        </span>
        {/* Label */}
        <span className="absolute bottom-3 left-3 right-3 text-lg font-bold text-white drop-shadow-lg select-none">
            {interest.label}
        </span>
    </div>
);

export default PersonalizeItem;
