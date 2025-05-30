import useEffectOnce from "@hooks/useEffectOnce";
import useInfiniteScroll from "@hooks/useInfiniteScroll";
import "@pages/social/people/People.scss";
import { followerService } from "@services/api/followers/follower.service";
import { userService } from "@services/api/user/user.service";
import { socketService } from "@services/socket/socket.service";
import { FollowersUtils } from "@services/utils/followers-utils.service";
import { Utils } from "@services/utils/utils.service";
import { uniqBy } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserCard from "./components/UserCard";
import PeopleSkeleton from "./PeopleSkeleton";
import LoadingMessage from "@/components/state/loading-message/LoadingMessage";

const People = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { profile } = useSelector((state) => state.user);
    const bodyRef = useRef(null);
    const bottomLineRef = useRef(null);
    const [fetchingData, setFetchingData] = useState(false);

    const [users, setUsers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalUsersCount, setTotalUsersCount] = useState(0);

    useInfiniteScroll(bodyRef, bottomLineRef, fetchData);

    const PAGE_SIZE = 12;

    async function fetchData() {
        setFetchingData(true);
        let pageNum = currentPage;
        if (currentPage <= Math.round(totalUsersCount / PAGE_SIZE)) {
            pageNum += 1;
            setCurrentPage(pageNum);
            await getAllUsers();
        }
        setFetchingData(false);
    }

    const getAllUsers = useCallback(async () => {
        try {
            const response = await userService.getAllUsers(currentPage);
            if (response.data.users.length > 0) {
                setUsers((data) => {
                    const result = [...data, ...response.data.users];
                    const allUsers = uniqBy(result, "_id");
                    return allUsers;
                });
            }
            setTotalUsersCount(response.data.totalUsers);
        } catch (error) {
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        } finally {
            setLoading(false);
        }
    }, [currentPage, dispatch]);

    const getUserFollowing = async () => {
        try {
            const response = await followerService.getUserFollowing();
            setFollowing(response.data.following);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        }
    };

    const followUser = async (user) => {
        try {
            FollowersUtils.followUser(user, dispatch);
        } catch (error) {
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        }
    };

    const unFollowUser = async (user) => {
        try {
            const userData = user;
            userData.followersCount -= 1;
            socketService?.socket?.emit("unfollow user", userData);
            FollowersUtils.unFollowUser(user, profile, dispatch);
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
        await getAllUsers();
        await getUserFollowing();
        await setCurrentPage((prevPage) => prevPage + 1);
        setLoading(false);
    });

    useEffect(() => {
        FollowersUtils.socketIOFollowAndUnfollow(
            users,
            following,
            setFollowing,
            setUsers
        );
        // const fetchInitialOnlineUsers = () => {
        //     ChatUtils.fetchOnlineUsers(setOnlineUsers);
        // };
        // fetchInitialOnlineUsers();
        // ChatUtils.usersOnline(setOnlineUsers);
    }, [following, users]);

    return (
        <div
            className="h-screen w-full rounded-t-3xl bg-background-blur max-h-[88vh] col-span-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 sm:gap-2 overflow-y-scroll sm:p-4"
            ref={bodyRef}
        >
            {users &&
                users.map((data) => {
                    return (
                        <UserCard
                            key={data._id}
                            user={data}
                            following={following}
                            follow={followUser}
                            unFollow={unFollowUser}
                            navigate={navigate}
                        />
                    );
                })}
            {!users && (
                <div
                    className="col-span-2 sm:col-span-2 lg:col-span-4 size-full bg-primary-white flex justify-center items-center "
                    data-testid="empty-page"
                >
                    <span className="text-xl font-semibold text-primary-black">
                        No users found.
                    </span>
                </div>
            )}
            {loading && !users.length && <PeopleSkeleton />}

            <div
                ref={bottomLineRef}
                className="col-span-2 sm:col-span-2 lg:col-span-4 w-full h-max flex justify-center items-center py-10"
            >
                {fetchingData && (
                    <div className="flex justify-center items-center w-full h-full ">
                        <div className="size-max">
                            <LoadingMessage />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default People;
