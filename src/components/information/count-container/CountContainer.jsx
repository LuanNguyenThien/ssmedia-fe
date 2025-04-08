import PropTypes from "prop-types";
import { Utils } from "@services/utils/utils.service";
import { ChatUtils } from "@/services/utils/chat-utils.service";
import CountContainerSkeleton from "@/components/information/count-container/CountContainerSkeleton";
import "@components/timeline/Timeline.scss";
import { TbMessageCircle } from "react-icons/tb";
import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri";
import InformationButton from "./InformationButton";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { socketService } from "@services/socket/socket.service";
import { FollowersUtils } from "@services/utils/followers-utils.service";

const CountContainer = ({
    followingCount,
    followersCount,
    loading,
    user,
    profile,
    followings,
    isCurrentUser,
    setRendered,
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleClickMessageButton = () => {
        if (user) {
            ChatUtils.navigateToChat(user, navigate);
        }
    };

    const followUser = async (user) => {
        try {
            FollowersUtils.followUser(user, dispatch);
            socketService?.socket?.emit("follow user", user);
        } catch (error) {
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        } finally {
            setRendered();
        }
    };

    const unFollowUser = async (user) => {
        try {
            socketService?.socket?.emit("unfollow user", user);
            FollowersUtils.unFollowUser(user, profile, dispatch);
        } catch (error) {
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        } finally {
            setRendered();
        }
    };

    return (
        <>
            {loading && !user ? (
                <CountContainerSkeleton />
            ) : (
                <div className="w-full h-auto z-50 flex flex-col justify-start items-center gap-2 px-4">
                    {/* username and bio */}
                    {user && (
                        <>
                            <span className="font-extrabold text-xl text-primary-black">
                                {user?.username}
                            </span>

                            {user?.quote.length > 0 && (
                                <div className="w-full bg-primary-white text-sm font-normal text-center truncate whitespace-pre-wrap">
                                    {user?.quote}
                                </div>
                            )}
                        </>
                    )}

                    {/* user information section */}
                    <div className="w-full grid grid-cols-3 gap-2 text-xs lg:text-sm">
                        <div className="size-full text-center col-span-1 border-r">
                            <span className="" data-testid="info">
                                {Utils.shortenLargeNumbers(followersCount)}
                            </span>
                            <p>{`${
                                followersCount > 1 ? "Followers" : "Follower"
                            }`}</p>
                        </div>
                        <div className="text-center col-span-1">
                            <span className="" data-testid="info">
                                {Utils.shortenLargeNumbers(followingCount)}
                            </span>
                            <p>Following</p>
                        </div>
                        <div className="text-center col-span-1 border-l ">
                            <span className="" data-testid="info">
                                {Utils.shortenLargeNumbers(user?.postsCount)}
                            </span>
                            <p>Posts</p>
                        </div>
                    </div>

                    {/* message and follow/unfollow section */}
                    {!isCurrentUser && (
                        <div className="flex items-center gap-4 pt-3">
                            <InformationButton
                                title={"Message"}
                                icon={<TbMessageCircle />}
                                onClick={handleClickMessageButton}
                            />
                            {!Utils.checkIfUserIsFollowed(
                                followings,
                                user?._id
                            ) ? (
                                <InformationButton
                                    title={"Follow"}
                                    icon={<RiUserFollowLine />}
                                    onClick={() => {
                                        followUser(user);
                                    }}
                                />
                            ) : (
                                <InformationButton
                                    title={"Unfollow"}
                                    icon={<RiUserUnfollowLine />}
                                    onClick={() => {
                                        unFollowUser(user);
                                    }}
                                    className=" hover:!text-red-500"
                                />
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};
export default CountContainer;
