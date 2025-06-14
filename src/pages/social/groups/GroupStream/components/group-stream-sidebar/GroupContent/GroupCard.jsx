import { useNavigate } from "react-router-dom";
import {
    FaUsers,
    FaGlobe,
    FaLock,
    FaUserPlus,
    FaCheck,
    FaTimes,
} from "react-icons/fa";
import PropTypes from "prop-types";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { timeAgo } from "@/services/utils/timeago.utils";
import { useState, useEffect } from "react";
import { userService } from "@/services/api/user/user.service";
const GroupCard = ({
    group,
    type,
    userId,
    onJoinGroup,
    onAcceptInvitation,
    onDeclineInvitation,
}) => {
    const navigate = useNavigate();
    const { profile } = useSelector((state) => state.user);

    const [activeMembers, setActiveMembers] = useState([]);
       
    
        useEffect(() => {
            if (group && group.members) {
                const filteredMembers = group.members.filter(
                    (member) => member.status === "active"
                );
                setActiveMembers(filteredMembers);
                // setTimeout(() => {
                //     setLoading(false);
                // }, 500);
            }
        }, [group.members]);

    const getVisibilityIcon = () => {
        switch (group.visibility) {
            case "public":
                return <FaGlobe className="text-blue-500" size={12} />;
            case "private":
                return <FaLock className="text-gray-500" size={12} />;
            default:
                return <FaGlobe className="text-blue-500" size={12} />;
        }
    };

    const handleCardClick = () => {
        navigate(`/app/social/group/${group.id}`);
    };

    const handleJoinClick = (e) => {
        e.stopPropagation();
        onJoinGroup(group.id);
    };

    const handleAcceptClick = (e) => {
        e.stopPropagation();
        onAcceptInvitation(group.id);
    };

    const handleDeclineClick = (e) => {
        e.stopPropagation();
        onDeclineInvitation(group.id);
    };

    const [invitedBy, setInvitedBy] = useState(null);
    const [invitedByLoading, setInvitedByLoading] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const fetchInvitedBy = async () => {
        try {
          setLoading(true);
          if (group?.members) {
            const member = group.members.find(
              (member) => member.userId === profile._id
            );
            console.log("Member Info:", member);
            setInvitedByLoading(member);

            if (member?.invitedBy) {
              const invitedInfo = await userService.getUserProfileByUserId(
                member.invitedBy
              );
              console.log("Invited By Info:", invitedInfo.data.user);
              setInvitedBy(invitedInfo.data.user);
            }
          }
        } catch (error) {
          console.error("Error fetching invited by info:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchInvitedBy();
    }, [group, profile._id]);

    return (
      <div
        key={group.id}
        className="bg-white rounded-lg border hover:shadow-md transition-all duration-200 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="p-3 md:p-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 md:w-10 md:h-10 rounded-lg overflow-hidden flex items-center justify-center">
              {group.profileImage ? (
                <img
                  src={group.profileImage}
                  alt={`${group.name} group`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {group.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 truncate text-base md:text-sm">
                  {group.name}
                </h3>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  {getVisibilityIcon()}
                  <span className="capitalize">{group.privacy}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaUsers size={10} />
                  <span>
                    {(
                      activeMembers.length.toLocaleString() || 0
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-600 my-3 max-w-[26vw] h-auto line-clamp-2">
                {group.description}
              </p>

              {/* Type-specific content */}
              {type === "joined" && (
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs text-gray-500">
                    {group.recentActivity}
                    {group.unreadPosts > 0 && (
                      <span className="ml-2 bg-blue-500 text-white px-2 py-1 rounded-full">
                        {group.unreadPosts}
                      </span>
                    )}
                  </div>
                  {group.createdBy == userId && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      Admin
                    </span>
                  )}
                </div>
              )}

              {type === "explore" && (
                <div className="w-full flex items-center justify-end">
                  {group.members.some(
                    (member) => member.userId === profile._id
                  ) ? (
                    <button
                      disabled
                      className="text-xs bg-yellow-300 text-white px-3 py-1 rounded-lg flex items-center gap-1 cursor-not-allowed"
                    >
                      <FaUserPlus size={10} />
                      Pending
                    </button>
                  ) : (
                    <button
                      onClick={handleJoinClick}
                      className="text-xs bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 flex items-center gap-1"
                    >
                      <FaUserPlus size={10} />
                      Join this group
                    </button>
                  )}
                </div>
              )}

              {type === "invitation" && (
                <div className="mt-2">
                  <div className="text-xs text-gray-500 mb-2">
                    Invited by {invitedBy?.username} •{" "}
                    {invitedByLoading?.joinedAt && (
                      <> {timeAgo.transform(invitedByLoading.joinedAt)}</>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAcceptClick}
                      className="text-xs bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600 flex items-center gap-1"
                    >
                      <FaCheck size={10} />
                      Accept
                    </button>
                    <button
                      onClick={handleDeclineClick}
                      className="text-xs bg-gray-500 text-white px-2 py-1 rounded-lg hover:bg-gray-600 flex items-center gap-1"
                    >
                      <FaTimes size={10} />
                      Decline
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
};

GroupCard.propTypes = {
    group: PropTypes.object.isRequired,
    type: PropTypes.oneOf(["joined", "explore", "invitation"]).isRequired,
    userId: PropTypes.string,
    onJoinGroup: PropTypes.func.isRequired,
    onAcceptInvitation: PropTypes.func.isRequired,
    onDeclineInvitation: PropTypes.func.isRequired,
};

export default GroupCard;
