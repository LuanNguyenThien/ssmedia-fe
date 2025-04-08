import { Utils } from "@services/utils/utils.service";
import { FaUserFriends } from "react-icons/fa";
import { ProfileUtils } from "@services/utils/profile-utils.service";
import { useNavigate } from "react-router-dom";

const FollowingCard = ({ followings }) => {
    const navigate = useNavigate();
    console.log("followings", followings);
    return (
        <div className="">
            {followings.length > 0 ? (
                <div className="card-element">
                    {followings.map((data) => (
                        <div
                            onClick={() => {
                                ProfileUtils.navigateToProfile(data, navigate);
                            }}
                            className="card"
                            key={data._id}
                        >
                            <img
                                src={data?.profilePicture}
                                alt={data?.username}
                                className="card-image"
                            />
                            <div className="card-user">
                                <span className="name">{data?.username}</span>
                                <p className="count">
                                    <FaUserFriends className="heart" />{" "}
                                    <span data-testid="count">
                                        {Utils.shortenLargeNumbers(
                                            data?.followersCount
                                        )}
                                    </span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-page">No followings to display</div>
            )}
        </div>
    );
};

export default FollowingCard;
