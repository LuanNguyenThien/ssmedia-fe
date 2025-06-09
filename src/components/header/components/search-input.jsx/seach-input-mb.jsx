import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { icons } from "@assets/assets";
import useHandleOutsideClick from "@hooks/useHandleOutsideClick";
import { Utils } from "@/services/utils/utils.service";
import { useNavigate } from "react-router-dom";
const SearchInputMb = ({ searchTerm, setSearchTerm, handleSearchKeyPress }) => {
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);
    const inputRef = useRef(null);
    const containerRef = useRef(null);
    useHandleOutsideClick(containerRef, setIsExpanded);

    const toggleSearch = (event) => {
        event.stopPropagation();

        if (Utils.isMobileDevice()) {
            navigate("search", {
                state: {
                    query: "common",
                },
            });
        }
        
        setIsExpanded((prev) => !prev);
        if (!isExpanded) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearchKeyPress();
        }
    };

    return (
        <div
            ref={containerRef}
            className={`relative flex items-center py-1 border-gray-300 rounded-[30px] transition-all duration-300 ${
                isExpanded ? "border w-[100%] px-4" : "w-auto "
            }`}
        >
            <button className="size-7 relative z-10" onClick={toggleSearch}>
                <img
                    src={icons.search}
                    className="size-full object-cover"
                    alt="search"
                />
            </button>
            <motion.input
                ref={inputRef}
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="rounded-r-lg text-[12px] text-primary-black bg-transparent outline-none"
                placeholder="What’s on your mind?"
                autoComplete="off"
                spellCheck="false"
                initial={{ width: "10px", opacity: 0 }}
                animate={{
                    width: isExpanded ? "160px" : "0px",
                    opacity: isExpanded ? 1 : 0,
                    padding: isExpanded ? "0 0.5rem" : "0px",
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            />
        </div>
    );
};

export default SearchInputMb;
