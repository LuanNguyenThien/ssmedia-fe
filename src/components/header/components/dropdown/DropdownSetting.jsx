import "@components/header/components/dropdown/DropdownSetting.scss";
import PropTypes from "prop-types";
import { icons } from "@assets/assets";
import { SettingUtils } from "@/services/utils/setting-utils.service";
import { useNavigate } from "react-router-dom";

const DropdownSetting = ({ avatarSrc, name, onLogout, onNavigate, id }) => {
    const navigate = useNavigate();
    const onNavigateSetting = () => {
        SettingUtils.navigateToSetting(
            {
                username: name,
                _id: id,
                uId: "456",
            },
            navigate
        );
    };

    return (
        <div className="header-dropdown text-primary-black bg-background shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] border border-primary/20 rounded-l-xl rounded-b-xl z-[10000]">
            <div className="w-full text-center bg-transparent px-4 pt-4 text-xl font-bold">
                <span className="text-center">Menu</span>
            </div>
            <div className="w-full flex justify-center items-center py-1">
                <div className="w-1/2 h-[0.5px] bg-background-blur"></div>
            </div>
            <div className="header-dropdown-content">
                <div
                    className="header-dropdown-content-item hover:bg-primary/5 "
                    onClick={onNavigate}
                >
                    <div className="h-full w-auto">
                        <img
                            src={avatarSrc}
                            className="header-dropdown-content-item-avatar !object-cover"
                            alt="header-dropdown-content-item-avatar"
                        />
                    </div>
                    <span className="header-dropdown-content-item-name">
                        {name}
                    </span>
                </div>

                <div
                    className="header-dropdown-content-item hover:bg-primary/5 "
                    onClick={onNavigateSetting}
                >
                    <div>
                        <img
                            src={icons.setting}
                            className="header-dropdown-content-item-avatar"
                            alt="header-dropdown-content-item-avatar"
                        />
                    </div>
                    <span className="header-dropdown-content-item-name">
                        Setting
                    </span>
                </div>

                <div
                    onClick={onLogout}
                    className="header-dropdown-content-item hover:bg-primary/5 "
                >
                    <div>
                        <img
                            src={icons.logout}
                            className="header-dropdown-content-item-avatar"
                            alt="header-dropdown-content-item-avatar"
                        />
                    </div>
                    <span className="header-dropdown-content-item-name">
                        Sign out
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DropdownSetting;
