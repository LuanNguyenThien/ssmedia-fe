import { IoIosSettings } from "react-icons/io";
import { PiSignOutBold } from "react-icons/pi";
import { FaUsers } from "react-icons/fa";
import { RiGroupLine } from "react-icons/ri";
import { BsBookmarkFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { SettingUtils } from "@/services/utils/setting-utils.service";

const DropdownSettingMb = ({ id, name, onLogout }) => {
    const navigate = useNavigate();

    const navigateToPage = (pageName, url) => {
        if (pageName === "Settings") {
            SettingUtils.navigateToSetting(
                {
                    username: name,
                    _id: id,
                },
                navigate
            );
        } else if (pageName === "Sign out") {
            onLogout && onLogout();
        } else {
            navigate(`/app/social${url}`);
        }
    };

    const menuItems = [
        {
            name: "People",
            icon: <FaUsers className="text-4xl text-gray-500" />,
            url: "/people",
        },
        {
            name: "Groups",
            icon: <RiGroupLine className="text-4xl text-gray-500" />,
            url: "/groups",
        },
        {
            name: "Settings",
            icon: <IoIosSettings className="text-4xl text-gray-500" />,
            url: "", // Not used directly, handled in navigateToPage
        },
        {
            name: "Saved posts",
            icon: <BsBookmarkFill className="text-4xl text-gray-500" />,
            url: "/save",
        },
        {
            name: "Sign out",
            icon: <PiSignOutBold className="text-4xl text-gray-500" />,
            url: "", // Not used directly, handled in navigateToPage
        },
    ];

    const MenuItem = ({ icon, label, onClick }) => (
        <li
            className="flex items-center gap-3 px-3 py-3 rounded-md transition-colors duration-200 active:bg-primary/20 hover:bg-primary/10 cursor-pointer"
            onClick={onClick}
        >
            {icon}
            <span className="size-full text-gray-500 flex items-center">
                {label}
            </span>
        </li>
    );

    return (
        <div className="absolute z-[50] text-base top-5 right-0 w-max h-auto bg-background backdrop-blur-sm rounded-lg shadow-xl p-2 border border-gray-100">
            <div className="w-full text-center bg-transparent px-2 py-2 text-2xl font-bold border-b border-gray-200">
                <span className="text-center ">Menu</span>
            </div>

            <ul className="mt-2">
                {menuItems.map((item, index) => (
                    <MenuItem
                        key={index}
                        icon={item.icon}
                        label={item.name}
                        onClick={() => navigateToPage(item.name, item.url)}
                    />
                ))}
            </ul>
        </div>
    );
};

export default DropdownSettingMb;
