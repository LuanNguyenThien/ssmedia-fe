import SocialLinks from "@/components/information/social-links/SocialLinks";
import { useEffect, useState, useCallback, memo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import BasicInfo from "./basic-info/BasicInfo";
import CountContainer from "./count-container/CountContainer";
import InformationEdit from "./InformationEdit";

// Memoized sub-components to prevent unnecessary re-renders
const MemoizedCountContainer = memo(CountContainer);
const MemoizedBasicInfo = memo(BasicInfo);
const MemoizedSocialLinks = memo(SocialLinks);
const MemoizedInformationEdit = memo(InformationEdit);

const Information = ({
    userProfileData,
    isCurrentUser,
    following,
    setRendered,
}) => {
    const { username } = useParams();
    const profile = useSelector((state) => state.user.profile);

    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Changed from useRef to useState for the editable inputs
    const [editableInputs, setEditableInputs] = useState({
        quote: "",
        work: "",
        school: "",
        location: "",
    });

    // Changed from useRef to useState for social inputs
    const [editableSocialInputs, setEditableSocialInputs] = useState({
        instagram: "",
        twitter: "",
        facebook: "",
        youtube: "",
    });

    // Memoized function that only changes when userProfileData changes
    const getUserByUsername = useCallback(() => {
        if (userProfileData?.user) {
            setUser(userProfileData.user);

            // Update state directly instead of using refs
            setEditableInputs({
                quote: userProfileData.user.quote || "",
                work: userProfileData.user.work || "",
                school: userProfileData.user.school || "",
                location: userProfileData.user.location || "",
            });

            setEditableSocialInputs(
                userProfileData.user?.social || {
                    instagram: "",
                    twitter: "",
                    facebook: "",
                    youtube: "",
                }
            );
        }
    }, [userProfileData]);

    // Only run effect when getUserByUsername changes
    useEffect(() => {
        getUserByUsername();
    }, [getUserByUsername]);

    // Memoized isCurrentUser value
    const isCurrentUserValue = useCallback(isCurrentUser, [isCurrentUser]);

    // Memoized handler for editing mode
    const handleSetIsEditing = useCallback((value) => {
        setIsEditing(value);
    }, []);

    return (
        <>
            {isEditing && (
                <MemoizedInformationEdit
                    editableInputs={editableInputs}
                    editableSocialInputs={editableSocialInputs}
                    setIsEditing={handleSetIsEditing}
                    setEditableInputs={setEditableInputs}
                    setEditableSocialInputs={setEditableSocialInputs}
                />
            )}
            <div className="w-full h-max bg-primary-white rounded-[10px] pt-[9vh] sm:pt-[5vh] lg:pt-[8vh] pb-[20px]">
                <MemoizedCountContainer
                    user={user}
                    setUser={setUser}
                    profile={profile}
                    followings={following}
                    followersCount={user?.followersCount}
                    followingCount={user?.followingCount}
                    isCurrentUser={isCurrentUserValue()}
                    setRendered={setRendered}
                />
            </div>
            <div className="bg-primary-white rounded-[10px]">
                <MemoizedBasicInfo
                    setEditableInputs={setEditableInputs}
                    editableInputs={editableInputs}
                    username={username}
                    profile={profile}
                    setIsEditing={handleSetIsEditing}
                />
            </div>
            <div className="bg-primary-white rounded-[10px] mb-5">
                <MemoizedSocialLinks
                    setEditableSocialInputs={setEditableSocialInputs}
                    editableSocialInputs={editableSocialInputs}
                    username={username}
                    profile={profile}
                    setIsEditing={handleSetIsEditing}
                />
            </div>
        </>
    );
};

// Memoize the entire component to prevent re-renders when parent props don't change
export default memo(Information);
