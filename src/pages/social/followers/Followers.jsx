import Avatar from "@components/avatar/Avatar";
import "@pages/social/followers/Followers.scss";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { followerService } from "@services/api/followers/follower.service";
import { Utils } from "@services/utils/utils.service";

import { FollowersUtils } from "@services/utils/followers-utils.service";
import { socketService } from "@services/socket/socket.service";
import useEffectOnce from "@hooks/useEffectOnce";

import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import LoadingMessage from "@/components/state/loading-message/LoadingMessage";
import FollowCard from "@/components/card-element/follow/FollowCard";

const Follower = ({ userData }) => {
    const dispatch = useDispatch();
    const { profile } = useSelector((state) => state.user);

    const [searchParams] = useSearchParams();

    const [followers, setFollowers] = useState([]);
    const [user, setUser] = useState(userData || profile);

    //state
    const [loading, setLoading] = useState(true);

    //paging
    const bodyRef = useRef(null);
    const bottomRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalFollowersCount, setTotalFollowersCount] = useState(0);
    const PAGE_SIZE = 6;

    useInfiniteScroll(bodyRef, bottomRef, fetchData);

    async function fetchData() {
        setLoading(true);
        console.log("currentPage", currentPage);

        if (
            (currentPage > Math.round(totalFollowersCount / PAGE_SIZE) &&
                !loading) ||
            currentPage === 1
        ) {
            setCurrentPage((prevPage) => prevPage + 1);
            await getUserFollowers();
        }

        setLoading(false);
    }

    const getUserFollowers = async () => {
        setLoading(true);
        try {
            const response = await followerService.getUserFollowersByPage(
                searchParams.get("id"),
                currentPage
            );
            console.log("response", response);
            if (currentPage === 1) {
                setFollowers(response.data.followers);
            } else {
                setFollowers([...followers, ...response.data.followers]);
            }
        } catch (error) {
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        setTotalFollowersCount(followers.length);
    }, [followers]);

    const blockUser = (userInfo) => {
        try {
            socketService?.socket?.emit("block user", {
                blockedUser: userInfo._id,
                blockedBy: user?._id,
            });
            FollowersUtils.blockUser(userInfo, dispatch);
        } catch (error) {
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        }
    };

    const unblockUser = (userInfo) => {
        try {
            socketService?.socket?.emit("unblock user", {
                blockedUser: userInfo._id,
                blockedBy: user?._id,
            });
            FollowersUtils.unblockUser(userInfo, dispatch);
        } catch (error) {
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        }
    };

    useEffectOnce(async () => {
        setLoading(true);
        // await getUserProfileByUsername();
        await getUserFollowers();
        setCurrentPage(2);
        setLoading(false);
    });

    useEffect(() => {
        FollowersUtils.socketIOBlockAndUnblockCard(user, setUser);
    }, [user]);

    return (
        <div
            ref={bodyRef}
            className="size-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-scroll"
        >
            {followers.length > 0 &&
                followers.map((data) => {
                    const isBlocked = Utils.checkIfUserIsBlocked(
                        user?.blocked,
                        data?._id
                    );
                    return (
                        <FollowCard
                            key={data._id}
                            cardData={data}
                            user={user}
                            isBlocked={isBlocked}
                            unblockUser={(e) => {
                                e.stopPropagation();
                                unblockUser(data);
                            }}
                            blockUser={(e) => {
                                e.stopPropagation();
                                blockUser(data);
                            }}
                        />
                    );
                })}

            <div
                ref={bottomRef}
                className="py-5 col-span-full h-[90px] flex justify-center items-center "
            >
                {loading && (
                    <div className="flex justify-center items-center w-full h-full">
                        <div className="size-10">
                            <LoadingMessage />
                        </div>
                    </div>
                )}
            </div>
            {!loading && !followers.length && (
                <div className="col-span-full size-full flex justify-center items-start text-primary-black font-bold text-xl">
                    There are no followers to display
                </div>
            )}
        </div>
    );
};

export default Follower;
