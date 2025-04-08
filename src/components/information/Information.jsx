import SocialLinks from "@/components/information/social-links/SocialLinks";
import { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import BasicInfo from "./basic-info/BasicInfo";
import CountContainer from "./count-container/CountContainer";
import InformationEdit from "./InformationEdit";

const Information = ({ userProfileData, isCurrentUser, following, setRendered }) => {
    const { username } = useParams();
    const { profile } = useSelector((state) => state.user);

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

    const [user, setUser] = useState();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

   
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

 
    useEffect(() => {
        getUserByUsername();
    }, [getUserByUsername]);
    return (
        <>
            {isEditing && (
                <InformationEdit
                    editableInputs={editableInputs}
                    editableSocialInputs={editableSocialInputs}
                    setIsEditing={setIsEditing}
                    setEditableInputs={setEditableInputs}
                    setEditableSocialInputs={setEditableSocialInputs}
                />
            )}
            <div className="w-full h-max bg-primary-white rounded-[10px] pt-[9vh] sm:pt-[5vh] lg:pt-[8vh] pb-[20px] ">
                <CountContainer
                    user={user}
                    profile={profile}
                    followings={following}
                    followersCount={user?.followersCount}
                    followingCount={user?.followingCount}
                    loading={loading}
                    isCurrentUser={isCurrentUser()}
                    setRendered={setRendered}
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
            <div className="bg-primary-white rounded-[10px] mb-5">
                <SocialLinks
                    setEditableSocialInputs={setEditableSocialInputs}
                    editableSocialInputs={editableSocialInputs}
                    username={username}
                    profile={profile}
                    loading={loading}
                    setIsEditing={setIsEditing}
                />
            </div>
        </>
    );
};

export default Information;
