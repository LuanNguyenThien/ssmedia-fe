import SocialLinks from "@/components/information/social-links/SocialLinks";
import { useEffect, useState, useCallback, memo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import BasicInfo from "./basic-info/BasicInfo";
import CountContainer from "./count-container/CountContainer";
import InformationEdit from "./InformationEdit";
import PersonalizeTabs from "./personalize/PersonalizeTabs";
import PersonalizeModal from "../personalize/PersonalizeModal";
import { Utils } from "@/services/utils/utils.service";
import { userService } from "@/services/api/user/user.service";
import ThanksScreen from "../personalize/ThanksScreen";
import { INTERESTS } from "../personalize/constant";

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
    setShowReportModal,
}) => {
    const { username } = useParams();
    const profile = useSelector((state) => state.user.profile);

    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingPersonalize, setIsEditingPersonalize] = useState(false);
    const [isShowThanksScreen, setIsShowThanksScreen] = useState(false);
    const [selectedTopics, setSelectedTopics] = useState([]);

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
        if (userProfileData) {
            setUser(userProfileData);

            // Update state directly instead of using refs
            setEditableInputs({
                quote: userProfileData.quote || "",
                work: userProfileData.work || "",
                school: userProfileData.school || "",
                location: userProfileData.location || "",
            });

            setEditableSocialInputs(
                userProfileData?.social || {
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

    const handleEditPersonalize = () => {
        setIsEditingPersonalize(true);
    };

    const handleUpdateUserHobbies = async (selected) => {
        const updateData = {
            subject: INTERESTS.filter((interest) =>
                selected.includes(interest.label.toLowerCase())
            ).map((interest) => interest.value),
        };
        const response = await userService.updatePersonalHobby({
            subject: Utils.convertArrayToString(updateData.subject),
        });
        if (response) {
            setIsEditingPersonalize(false);
            setIsShowThanksScreen(true);
        }
    };

    useEffect(() => {
        const selectedTopics =
            profile?.user_hobbies?.subject &&
            profile?.user_hobbies?.subject.split(" ").filter((topic) => {
                const interest = INTERESTS.find(
                    (interest) => interest.label.toLowerCase() === topic
                );
                return interest?.label;
            });
        setSelectedTopics(selectedTopics);
    }, [profile?.user_hobbies?.subject]);

    return (
        <>
            {isEditingPersonalize && (
                <PersonalizeModal
                    title="Make your experience more personalized"
                    description="Change for your own experience by selecting your interests"
                    alreadyPersonalized={selectedTopics}
                    onClose={() => setIsEditingPersonalize(false)}
                    onContinue={handleUpdateUserHobbies}
                />
            )}
            {isShowThanksScreen && (
                <ThanksScreen
                    title="Nice done!"
                    text="Enjoy your new personalized experience"
                    onClose={() => {
                        setIsShowThanksScreen(false);
                        window.location.reload();
                    }}
                />
            )}
            {isEditing && (
                <MemoizedInformationEdit
                    editableInputs={editableInputs}
                    editableSocialInputs={editableSocialInputs}
                    setIsEditing={handleSetIsEditing}
                    setEditableInputs={setEditableInputs}
                    setEditableSocialInputs={setEditableSocialInputs}
                />
            )}
            <div className="w-full h-max bg-primary-white rounded-[10px] pt-[8dvh] lg:pt-[8vh] pb-[20px]">
                <MemoizedCountContainer
                    user={user}
                    setUser={setUser}
                    profile={profile}
                    followings={following}
                    followersCount={user?.followersCount}
                    followingCount={user?.followingCount}
                    isCurrentUser={isCurrentUserValue()}
                    setRendered={setRendered}
                    handleReportUser={setShowReportModal}
                />
            </div>
            <PersonalizeTabs
                user={user}
                isCurrentUser={isCurrentUserValue()}
                items={profile?.user_hobbies?.subject}
                onEdit={handleEditPersonalize}
                onAdd={handleEditPersonalize}
            />
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
