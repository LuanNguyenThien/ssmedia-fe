import SocialLinks from "components/informations/social-links/SocialLinks";
import useEffectOnce from "hooks/useEffectOnce";
import { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { followerService } from "services/api/followers/follower.service";
import { Utils } from "services/utils/utils.service";
import BasicInfo from "./basic-info/BasicInfo";
import CountContainer from "./count-container/CountContainer";
import InformationEdit from "./InformationEdit";

const Information = ({ userProfileData }) => {
    const { username } = useParams();
    const { profile } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [editableInputs, setEditableInputs] = useState({
        quote: "",
        work: "",
        school: "",
        location: "",
    });
    const [editableSocialInputs, setEditableSocialInputs] = useState({
        instagram: "",
        twitter: "",
        facebook: "",
        youtube: "",
    });

    const [following, setFollowing] = useState([]);
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const getUserFollowing = async () => {
        try {
            setLoading(true);
            const response = await followerService.getUserFollowing();
            setLoading(false);
            setFollowing(response.data.following);
        } catch (error) {
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        }
    };
    const getUserByUsername = useCallback(() => {
        if (userProfileData) {
            setUser(userProfileData.user);
            setEditableInputs({
                quote: userProfileData.user.quote,
                work: userProfileData.user.work,
                school: userProfileData.user.school,
                location: userProfileData.user.location,
            });
            setEditableSocialInputs(userProfileData.user?.social);
        }
    }, [userProfileData]);

    useEffectOnce(() => {
        getUserFollowing();
    });
    useEffect(() => {
        getUserByUsername();
    }, [getUserByUsername]);
    return (
        <div className="size-full max-h-full flex flex-col gap-4 overflow-y-scroll ">
            {isEditing && (
                <InformationEdit
                    editableInputs={editableInputs}
                    editableSocialInputs={editableSocialInputs}
                    setIsEditing={setIsEditing}
                    setEditableInputs={setEditableInputs}
                    setEditableSocialInputs={setEditableSocialInputs}
                />
            )}
            <div className="w-full h-max bg-primary-white rounded-[10px] pt-[60px] pb-[20px] ">
                <CountContainer
                    profile={profile}
                    followersCount={user?.followersCount}
                    followingCount={user?.followingCount}
                    loading={loading}
                />
            </div>
            <div className="bg-primary-white rounded-[10px]">
                <BasicInfo
                    setEditableInputs={setEditableInputs}
                    editableInputs={editableInputs}
                    username={username}
                    profile={profile}
                    loading={loading}
                    setIsEditing={setIsEditing}
                />
            </div>
            <div className="bg-primary-white rounded-[10px]">
                <SocialLinks
                    setEditableSocialInputs={setEditableSocialInputs}
                    editableSocialInputs={editableSocialInputs}
                    username={username}
                    profile={profile}
                    loading={loading}
                    setIsEditing={setIsEditing}
                />
            </div>
        </div>
    );
};

export default Information;
