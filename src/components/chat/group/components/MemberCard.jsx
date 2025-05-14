import Avatar from "@components/avatar/Avatar";
import PropTypes from "prop-types";
import { TiUserAddOutline, TiUserDeleteOutline } from "react-icons/ti";

import "./../CreateGroup.scss";

const MemberCard = ({ user, isSelected, onToggleSelect }) => {
    return (
        <div
            className={`member-card flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                isSelected ? "bg-primary/10" : "hover:bg-gray-100"
            }`}
            onClick={() => onToggleSelect(user)}
        >
            <div className="member-avatar mr-3">
                <Avatar
                    name={user.username}
                    bgColor={user.avatarColor}
                    textColor="#ffffff"
                    size={40}
                    avatarSrc={user.profilePicture}
                />
            </div>
            <div className="member-info flex-1">
                <h4 className="member-name font-semibold">{user.username}</h4>
                <p className="member-details text-primary-black/50 text-xs">
                    {user.email || "No email available"}
                </p>
            </div>
            <div className="member-select text-xl text-primary-black/80 ">
                {isSelected ? <TiUserDeleteOutline className="hover:text-red-400"/> : <TiUserAddOutline className="hover:text-primary"/>}
            </div>
        </div>
    );
};

MemberCard.propTypes = {
    user: PropTypes.object.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onToggleSelect: PropTypes.func.isRequired,
};

export default MemberCard;
