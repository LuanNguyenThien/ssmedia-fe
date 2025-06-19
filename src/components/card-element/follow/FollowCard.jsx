import Avatar from "@/components/avatar/Avatar";
import { Utils } from "@/services/utils/utils.service";
import { useSelector } from "react-redux";
import InformationButton from "@/components/information/count-container/InformationButton";
import { GoBlocked } from "react-icons/go";
import { CgUnblock } from "react-icons/cg";
import { useParams } from "react-router-dom";
import { RiUserUnfollowLine } from "react-icons/ri";
import { ProfileUtils } from "@/services/utils/profile-utils.service";
import { useNavigate } from "react-router-dom";

const FollowCard = ({
    cardData,
    user,
    isBlocked,
    unblockUser,
    blockUser,
    unFollowUser,
}) => {
    const { profile } = useSelector((state) => state.user);
    const { username } = useParams();
    const navigate = useNavigate();

    return (
        <div
            onClick={() => {
                if (cardData) {
                    ProfileUtils.navigateToProfile(cardData, navigate);
                }
            }}
            className="cursor-pointer border-2 border-primary-white hover:border-primary/20 w-full sm:h-[30vh] lg:h-[40vh] flex flex-col gap-1 justify-center items-center bg-primary-white rounded-lg shadow-md p-4"
        >
            {/* avatar */}
            <div className="card-avatar">
                <Avatar
                    name={cardData?.username}
                    bgColor={cardData?.avatarColor}
                    textColor="#ffffff"
                    size={100}
                    avatarSrc={cardData?.profilePicture}
                />
            </div>

            {/* name */}
            {/* quotes */}
            <span className="text-xl font-bold">{cardData?.username}</span>

            {/* social entities */}
            <div className="flex items-center text-sm font-medium">
                <span>
                    {Utils.shortenLargeNumbers(cardData?.followersCount)}
                    <span className="count"> followers, </span>
                    {Utils.shortenLargeNumbers(cardData?.followingCount)}
                    <span className="count"> following</span>
                </span>
            </div>

            {/* button */}
            {username === profile?.username && (unblockUser || blockUser) && (
                <div
                    className="card-following-button py-2"
                    data-testid="card-following-button"
                >
                    <InformationButton
                        title={isBlocked ? "Unblock " : "Block "}
                        icon={isBlocked ? <CgUnblock /> : <GoBlocked />}
                        onClick={isBlocked ? unblockUser : blockUser}
                        className={
                            isBlocked
                                ? "!bg-background-blur !text-primary-black hover:!bg-background-blur/70"
                                : "!bg-background-blur  !text-primary-black hover:!bg-background-blur/70"
                        }
                    />
                </div>
            )}
            {unFollowUser && username === profile?.username && (
                <div
                    className="card-following-button py-2"
                    data-testid="card-following-button"
                >
                    <InformationButton
                        title={"Unfollow"}
                        icon={<RiUserUnfollowLine />}
                        onClick={unFollowUser}
                        className={
                            "!bg-background-blur !text-primary-black hover:!bg-background-blur/50"
                        }
                    />
                </div>
            )}
        </div>
    );
};

export default FollowCard;
