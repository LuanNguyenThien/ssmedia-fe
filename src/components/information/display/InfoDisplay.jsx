import BasicInfoSkeleton from "@/components/information/basic-info/BasicInfoSkeleton";
import { FaRegEdit } from "react-icons/fa";
import { profileInfo } from "@assets/assets";
import { InfoItem } from "./InfoItem";
import { SocialInfoItem } from "./SocialInfoItem";

const InfoDisplay = ({
    title,
    type,
    isCurrentUser,
    editableInputs,
    editableSocialInputs,
    loading,
    isEditing,
    setIsEditing,
}) => {
    const renderBasicInfo = () => (
        <div className="flex flex-col justify-start items-start w-full gap-3 text-sm font-bold text-primary-black">
            <InfoItem
                icon={profileInfo.work}
                value={editableInputs.work}
                title={"Works at"}
            />
            <InfoItem
                icon={profileInfo.study}
                value={editableInputs.school}
                title={"Went to"}
            />
            <InfoItem
                icon={profileInfo.location}
                value={editableInputs.location}
                title={"Lives in"}
            />
        </div>
    );

    const renderSocialInfo = () => (
        <div className="flex flex-col justify-start items-start w-full gap-3 text-sm font-normal underline text-primary-black">
            <SocialInfoItem
                icon={profileInfo.social_facebook}
                value={editableSocialInputs.facebook}
            />
            <SocialInfoItem
                icon={profileInfo.social_instagram}
                value={editableSocialInputs.instagram}
            />
            <SocialInfoItem
                icon={profileInfo.social_twitter}
                value={editableSocialInputs.twitter}
            />
            <SocialInfoItem
                icon={profileInfo.social_youtube}
                value={editableSocialInputs.youtube}
            />
        </div>
    );

    if (loading) return <BasicInfoSkeleton />;

    return (
        <div
            className="size-full flex flex-col justify-start items-start p-4 bg-primary-white border border-gray-100 rounded-[10px] "
            data-testid="side-container"
        >
            <div className="w-full flex items-center justify-between pb-2">
                <p className="font-semibold">{title}</p>
                {isCurrentUser && (
                    <div
                        className="text-sm text-primary-black cursor-pointer hover:text-primary-black/50"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        <FaRegEdit />
                    </div>
                )}
            </div>

            {type === "basic" ? renderBasicInfo() : renderSocialInfo()}
        </div>
    );
};

export default InfoDisplay;
