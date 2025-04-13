import { useState } from "react";
import { userService } from "@services/api/user/user.service";
import { Utils } from "@services/utils/utils.service";
import { FaRegEdit } from "react-icons/fa";
import { InfoField } from "./display/InfoField";
import { useDispatch } from "react-redux";
import { DynamicSVG } from "@components/sidebar/components/SidebarItems";
import { profileInfo } from "@assets/assets";

const InformationEdit = ({
    setIsEditing,
    editableInputs,
    editableSocialInputs,
    setEditableInputs,
    setEditableSocialInputs,
}) => {
    const dispatch = useDispatch();
    const [isEdit, setIsEdit] = useState({
        basic: false,
        social: false,
        status: false,
    });
    const noBasicInfo = {
        workMsg: "Work information not provided.",
        schoolMsg: "Education details not available.",
        locationMsg: "Location not specified.",
    };

    const noSocialInfo = {
        instagramMsg: "Instagram profile not linked.",
        twitterMsg: "Twitter account not connected.",
        facebookMsg: "Facebook profile not added.",
        youtubeMsg: "YouTube channel not linked.",
    };

    const renderBasicInfo = () => (
        <>
            <InfoField
                icon={
                    <DynamicSVG svgData={profileInfo.work} className="size-4" />
                }
                value={editableInputs.work}
                placeholder={noBasicInfo.workMsg}
                onChange={(value) =>
                    setEditableInputs({ ...editableInputs, work: value })
                }
                isEditing={isEdit.basic}
                label="Works at"
            />
            <InfoField
                icon={
                    <DynamicSVG
                        svgData={profileInfo.study}
                        className="size-4"
                    />
                }
                value={editableInputs.school}
                placeholder={noBasicInfo.schoolMsg}
                onChange={(value) =>
                    setEditableInputs({ ...editableInputs, school: value })
                }
                isEditing={isEdit.basic}
                label="Went to"
            />
            <InfoField
                icon={
                    <DynamicSVG
                        svgData={profileInfo.location}
                        className="size-4"
                    />
                }
                value={editableInputs.location}
                placeholder={noBasicInfo.locationMsg}
                onChange={(value) =>
                    setEditableInputs({ ...editableInputs, location: value })
                }
                isEditing={isEdit.basic}
                label="Lives in"
            />
        </>
    );

    const renderSocialInfo = () => (
        <>
            <InfoField
                icon={
                    <div className="size-4 flex items-center justify-center">
                        <img
                            src={profileInfo.social_facebook}
                            className="size-full object-cover"
                            alt=""
                        />
                    </div>
                }
                value={editableSocialInputs.facebook}
                placeholder={noSocialInfo.facebookMsg}
                onChange={(value) =>
                    setEditableSocialInputs({
                        ...editableSocialInputs,
                        facebook: value,
                    })
                }
                isEditing={isEdit.social}
                link
            />
            <InfoField
                icon={
                    <div className="size-4">
                        <img src={profileInfo.social_instagram} alt="" />
                    </div>
                }
                value={editableSocialInputs.instagram}
                placeholder={noSocialInfo.instagramMsg}
                onChange={(value) =>
                    setEditableSocialInputs({
                        ...editableSocialInputs,
                        instagram: value,
                    })
                }
                isEditing={isEdit.social}
                link
            />
            <InfoField
                icon={
                    <div className="size-4">
                        <img src={profileInfo.social_twitter} alt="" />
                    </div>
                }
                value={editableSocialInputs.twitter}
                placeholder={noSocialInfo.twitterMsg}
                onChange={(value) =>
                    setEditableSocialInputs({
                        ...editableSocialInputs,
                        twitter: value,
                    })
                }
                isEditing={isEdit.social}
                link
            />

            <InfoField
                icon={
                    <div className="size-4">
                        <img src={profileInfo.social_youtube} alt="" />
                    </div>
                }
                value={editableSocialInputs.youtube}
                placeholder={noSocialInfo.youtubeMsg}
                onChange={(value) =>
                    setEditableSocialInputs({
                        ...editableSocialInputs,
                        youtube: value,
                    })
                }
                isEditing={isEdit.social}
                link
            />
        </>
    );

    const saveButton = ({ setIsEdit, updateInfo }) => {
        return (
            <div className="flex gap-2 items-center">
                <button
                    className="bg-background-blur text-primary-black/50 px-2 py-1 rounded-md hover:text-primary-black/70"
                    onClick={() => {
                        setIsEdit();
                    }}
                >
                    Cancel
                </button>
                <button
                    className="bg-primary text-primary-white px-2 py-1 rounded-md hover:bg-primary/80"
                    onClick={() => {
                        updateInfo();
                        setIsEdit();
                    }}
                >
                    Save
                </button>
            </div>
        );
    };

    const updateBasicInfo = async () => {
        try {
            const response = await userService.updateBasicInfo(editableInputs);
            Utils.dispatchNotification(
                response.data.message,
                "success",
                dispatch
            );
        } catch (error) {
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        }
    };

    const updateSocialLinks = async () => {
        try {
            const response = await userService.updateSocialLinks(
                editableSocialInputs
            );
            Utils.dispatchNotification(
                response.data.message,
                "success",
                dispatch
            );
        } catch (error) {
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        }
    };

    return (
        <div className="fixed inset-0 w-screen h-screen backdrop-blur-sm flex justify-center items-center z-50">
            <div className="h-auto max-h-[80%] overflow-y-scroll w-1/3 bg-primary-white gap-4 flex flex-col justify-start items-start px-10 pb-6 rounded-[10px]">
                <div className="w-full flex items-center justify-between pt-6">
                    <span className="text-2xl font-bold text-primary-black">
                        Edit Information
                    </span>
                    <button
                        className="text-red-500 hover:text-red-200 text-[16px] font-bold"
                        onClick={() => setIsEditing(false)}
                    >
                        Cancel
                    </button>
                </div>

                <div className="w-full flex flex-col justify-start items-start gap-2">
                    <div className="w-full flex justify-between items-center">
                        <span className="font-bold text-lg text-primary-black ">
                            Bio
                        </span>

                        {isEdit.status ? (
                            saveButton({
                                setIsEdit: () =>
                                    setIsEdit({
                                        ...isEdit,
                                        status: !isEdit.status,
                                    }),
                                updateInfo: updateBasicInfo,
                            })
                        ) : (
                            <FaRegEdit
                                className="text-primary-black cursor-pointer hover:text-primary-black/50"
                                onClick={() =>
                                    setIsEdit({
                                        ...isEdit,
                                        status: !isEdit.status,
                                    })
                                }
                            />
                        )}
                    </div>
                    <textarea
                        disabled={!isEdit.status}
                        onChange={(e) =>
                            setEditableInputs({
                                ...editableInputs,
                                quote: e.target.value,
                            })
                        }
                        value={editableInputs.quote}
                        className={`w-full text-slate-600 border border-slate-300 appearance-none rounded-lg px-3.5 py-2.5 outline-none focus:bg-primary-white focus:border-primary focus:ring-2 focus:ring-indigo-100
                            ${
                                !isEdit.status
                                    ? "cursor-not-allowed bg-background-blur"
                                    : ""
                            }`}
                        name=""
                        id=""
                        placeholder="Describe yourself..."
                    ></textarea>
                </div>
                <div className="w-full flex flex-col justify-start items-start gap-2">
                    <div className="w-full flex justify-between items-center">
                        <span className="font-bold text-lg text-primary-black ">
                            Information
                        </span>
                        {isEdit.basic ? (
                            saveButton({
                                setIsEdit: () =>
                                    setIsEdit({
                                        ...isEdit,
                                        basic: !isEdit.basic,
                                    }),
                                updateInfo: updateBasicInfo,
                            })
                        ) : (
                            <FaRegEdit
                                className="text-primary-black cursor-pointer hover:text-primary-black/50"
                                onClick={() =>
                                    setIsEdit({
                                        ...isEdit,
                                        basic: !isEdit.basic,
                                    })
                                }
                            ></FaRegEdit>
                        )}
                    </div>
                    {renderBasicInfo()}
                </div>
                <div className="w-full flex flex-col justify-start items-start gap-2">
                    <div className="w-full flex justify-between items-center">
                        <span className="font-bold text-lg text-primary-black ">
                            Social Links
                        </span>

                        {isEdit.social ? (
                            saveButton({
                                setIsEdit: () =>
                                    setIsEdit({
                                        ...isEdit,
                                        social: !isEdit.social,
                                    }),
                                updateInfo: updateSocialLinks,
                            })
                        ) : (
                            <FaRegEdit
                                className="text-primary-black cursor-pointer hover:text-primary-black/50"
                                onClick={() =>
                                    setIsEdit({
                                        ...isEdit,
                                        social: !isEdit.social,
                                    })
                                }
                            ></FaRegEdit>
                        )}
                    </div>
                    {renderSocialInfo()}
                </div>
            </div>
        </div>
    );
};

export default InformationEdit;
