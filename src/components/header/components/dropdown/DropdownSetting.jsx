import "@components/header/components/dropdown/DropdownSetting.scss";
import PropTypes from "prop-types";
import { icons } from "@assets/assets";

const DropdownSetting = ({ avatarSrc, name, onLogout, onNavigate }) => {
    return (
        <div className="header-dropdown text-primary-black bg-background shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] border border-primary/20 rounded-l-xl rounded-b-xl z-[10000]">
            <div className="w-full text-center bg-transparent px-4 pt-4 text-xl font-bold">
                <span className="text-center">Settings</span>
            </div>
            <div className="w-full flex justify-center items-center py-1">
                <div className="w-1/2 h-[0.5px] bg-background-blur"></div>
            </div>
            <div className="header-dropdown-content">
                <div
                    className="header-dropdown-content-item hover:bg-primary/10 "
                    onClick={onNavigate}
                >
                    <div>
                        <img
                            src={avatarSrc}
                            className="header-dropdown-content-item-avatar"
                            alt="header-dropdown-content-item-avatar"
                        />
                    </div>
                    <span className="header-dropdown-content-item-name">
                        {name}
                    </span>
                </div>

                <div
                    onClick={onLogout}
                    className="header-dropdown-content-item hover:bg-primary/10 "
                >
                    <div>
                        <img
                            src={icons.logout}
                            className="header-dropdown-content-item-avatar"
                            alt="header-dropdown-content-item-avatar"
                        />
                    </div>
                    <span className="header-dropdown-content-item-name">
                        Log out
                    </span>
                </div>
            </div>
        </div>
    );
};
DropdownSetting.propTypes = {
    avatarSrc: PropTypes.string.isRequired, // Expect a string for avatarSrc
    name: PropTypes.string.isRequired, // Expect a string for name
    onLogout: PropTypes.func.isRequired, // Expect a function for onLogout
    onNavigate: PropTypes.func.isRequired, // Expect a function for onNavigate
};
export default DropdownSetting;
