import Logo from "./components/logo/Logo";
import { IoIosSettings } from "react-icons/io";
import { PiSignOutBold } from "react-icons/pi";

import { RxHamburgerMenu } from "react-icons/rx";
import SearchInputMb from "./components/search-input.jsx/seach-input-mb";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const HeaderMb = () => {
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const containerRef = useRef(null);
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setIsOpenMenu(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const handleSearchKeyPress = () => {
        navigate("/app/social/search", { state: { query: searchTerm } });
    };
    const handleOpenMenu = () => {
        setIsOpenMenu(!isOpenMenu);
    };

    return (
        <div className="h-[8vh] bg-secondary flex items-center justify-between px-4">
            <Logo />
            <div className="flex items-center justify-end gap-4 relative max-w-[80%]">
                <SearchInputMb
                    handleSearchKeyPress={handleSearchKeyPress}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
                <div ref={containerRef} onClick={handleOpenMenu}>
                    <RxHamburgerMenu className="text-3xl text-primary-black" />
                </div>
                {isOpenMenu && (
                    <div className="absolute z-[50] text-lg top-5 right-0 w-max h-auto bg-background-blur rounded-lg shadow-xl p-4">
                        <ul>
                            <li className="flex items-center gap-2">
                                <IoIosSettings className="text-3xl" />
                                <span className="size-full flex items-center">
                                    Setting
                                </span>
                            </li>
                            <li className="flex items-center gap-2">
                                <PiSignOutBold className="text-3xl" />
                                <span className="size-full flex items-center">
                                    Sign out
                                </span>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeaderMb;
