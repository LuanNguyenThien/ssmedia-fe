import Avatar from "@components/avatar/Avatar";
import Button from "@components/button/Button";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "@components/suggestions/Suggestions.scss";
import { Utils } from "@services/utils/utils.service";
import { FollowersUtils } from "@services/utils/followers-utils.service";
import { filter } from "lodash";
import { addToSuggestions } from "@redux/reducers/suggestions/suggestions.reducer";
import { ProfileUtils } from "@services/utils/profile-utils.service";
import SuggestionsSkeletons from "./SuggestionsSkeleton";
import { FaChevronDown } from "react-icons/fa";

export default function Suggestions() {
    const { suggestions } = useSelector((state) => state);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const followUser = async (user) => {
        try {
            FollowersUtils.followUser(user, dispatch);
            const result = filter(users, (data) => data?._id !== user?._id);
            setUsers(result);
            dispatch(addToSuggestions({ users: result, isLoading: false }));
        } catch (error) {
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        }
    };

    useEffect(() => {
        setUsers(suggestions?.users);
    }, [suggestions, users]);

    return (
        <>
            {users?.length > 0 && (
                <div className="max-w-md mx-auto h-full bg-transparent rounded-lg overflow-hidden shadow-sm">
                    <div className="pb-2">
                        <h2 className="text-lg font-medium text-primary-black">
                            Suggested for you
                        </h2>
                    </div>
                    <div className="flex flex-col gap-2">
                        {users?.slice(0, 8).map((user) => (
                            <div
                                className="flex items-center justify-between cursor-pointer py-2 px-3 hover:bg-background-blur rounded-md"
                                onClick={() =>
                                    ProfileUtils.navigateToProfile(
                                        user,
                                        navigate
                                    )
                                }
                                data-testid="suggestions-item"
                                key={user?._id}
                            >
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0">
                                        <Avatar
                                            name={user?.username}
                                            bgColor={user?.avatarColor}
                                            textColor="#ffffff"
                                            size={40}
                                            avatarSrc={user?.profilePicture}
                                        />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-bold text-gray-900  truncate max-w-[120px]">
                                            {user?.username}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Suggested for you
                                        </p>
                                    </div>
                                </div>

                                <button
                                    className="ml-auto bg-transparent  text-blue-500  py-1 text-sm rounded-md cursor-pointer transition-all duration-300 
                hover:border-gray-500 hover:underline hover:underline-offset-2 hover:decoration-blue-500"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        followUser(user);
                                    }}
                                    disabled={false}
                                >
                                    Follow
                                </button>
                            </div>
                        ))}
                        {users.length > 8 && (
                            <div
                                className="view-more cursor-pointer w-full text-center text-sm text-gray-500 flex items-center justify-center gap-2"
                                onClick={() => navigate("/app/social/people")}
                            >
                                View More
                                <FaChevronDown />
                            </div>
                        )}
                    </div>
                </div>
            )}
            {users?.length === 0 && <SuggestionsSkeletons />}
        </>
    );
}
