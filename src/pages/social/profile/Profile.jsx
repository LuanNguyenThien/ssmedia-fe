import ChangePassword from "@components/change-password/ChangePassword";
import GalleryImage from "@components/gallery-image/GalleryImage";
import NotificationSettings from "@components/notification-settings/NotificationSettings";
import FollowerCard from "@pages/social/followers/FollowerCard";
import "@pages/social/profile/Profile.scss";
import { toggleDeleteDialog } from "@redux/reducers/modal/modal.reducer";
import { imageService } from "@services/api/image/image.service";
import { userService } from "@services/api/user/user.service";
import { tabItems } from "@services/utils/static.data";
import { Utils } from "@services/utils/utils.service";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { filter } from "lodash";
import ImageModal from "@components/image-modal/ImageModal";
import Dialog from "@components/dialog/Dialog";
import BackgroundHeader from "@components/background-header/BackgroundHeader";
import Timeline from "@components/timeline/Timeline";
import Information from "@/components/information/Information";

const titleOptions = ["Posts", "Replied", "Followers", "Following"];

const Profile = () => {
    //init
    const dispatch = useDispatch();

    const [searchParams] = useSearchParams();
    const { profile } = useSelector((state) => state.user);
    const { deleteDialogIsOpen, data } = useSelector((state) => state.modal);
    const { username } = useParams();

    //state

    const [user, setUser] = useState();
    const [selectedBackgroundImage, setSelectedBackgroundImage] = useState("");
    const [selectedProfileImage, setSelectedProfileImage] = useState("");
    const [bgUrl, setBgUrl] = useState("");
    const [galleryImages, setGalleryImages] = useState([]);
    const [imageUrl, setImageUrl] = useState("");
    const [displayContent, setDisplayContent] = useState("Posts");
    const [userProfileData, setUserProfileData] = useState(null);

    //
    const [rendered, setRendered] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [hasImage, setHasImage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showImageModal, setShowImageModal] = useState(false);

    const changeTabContent = (data) => {
        setDisplayContent(data);
    };

    const selectedFileImage = (data, type) => {
        setHasImage(!hasImage);
        if (type === "background") {
            setSelectedBackgroundImage(data);
        } else {
            setSelectedProfileImage(data);
        }
    };

    const cancelFileSelection = () => {
        setHasImage(!hasImage);
        setSelectedBackgroundImage("");
        setSelectedProfileImage("");
        setHasError(false);
    };

    const getUserProfileByUsername = useCallback(async () => {
        try {
            const response = await userService.getUserProfileByUsername(
                username,
                searchParams.get("id"),
                searchParams.get("uId")
            );
            setUser(response.data.user);
            setUserProfileData(response.data);
            setBgUrl(
                Utils.getImage(
                    response.data.user?.bgImageId,
                    response.data.user?.bgImageVersion
                )
            );
            setLoading(false);
        } catch (error) {
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        }
    }, [dispatch, searchParams, username]);

    const getUserImages = useCallback(async () => {
        try {
            const imagesResponse = await imageService.getUserImages(
                searchParams.get("id")
            );
            setGalleryImages(imagesResponse.data.images);
        } catch (error) {
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        }
    }, [dispatch, searchParams]);

    const saveImage =async (type) => {
        const reader = new FileReader();
        reader.addEventListener(
            "load",
            async () => addImage(reader.result, type),
            false
        );

        if (
            selectedBackgroundImage &&
            typeof selectedBackgroundImage !== "string"
        ) {
            reader.readAsDataURL(selectedBackgroundImage);
        } else if (
            selectedProfileImage &&
            typeof selectedProfileImage !== "string"
        ) {
            reader.readAsDataURL(selectedProfileImage);
        } else {
            await addImage(selectedBackgroundImage, type);
        }
    };

    const addImage = async (result, type) => {
        try {
            const url =
                type === "background"
                    ? "/images/background"
                    : "/images/profile";
            const response = await imageService.addImage(url, result);
            if (response) {
                Utils.dispatchNotification(
                    response.data.message,
                    "success",
                    dispatch
                );
                setHasError(false);
                setHasImage(false);
            }
        } catch (error) {
            setHasError(true);
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        }
    };

    const removeBackgroundImage = async (bgImageId) => {
        try {
            setBgUrl("");
            await removeImage(`/images/background/${bgImageId}`);
        } catch (error) {
            setHasError(true);
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        }
    };

    const removeImageFromGallery = async (imageId) => {
        try {
            dispatch(toggleDeleteDialog({ toggle: false, data: null }));
            const images = filter(
                galleryImages,
                (image) => image._id !== imageId
            );
            setGalleryImages(images);
            await removeImage(`/images/${imageId}`);
        } catch (error) {
            setHasError(true);
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        }
    };

    const removeImage = async (url) => {
        const response = await imageService.removeImage(url);
        Utils.dispatchNotification(response.data.message, "success", dispatch);
    };

    const renderContent = () => {
        switch (displayContent) {
            case "Posts":
                return <Timeline userProfileData={userProfileData} />;
            case "Replied":
                return <Timeline userProfileData={userProfileData} />;
            case "Followers":
                return <FollowerCard userData={user} />;
            case "Following":
                return <FollowerCard userData={user} />;
            default:
                return null;
        }
    };

    useEffect(() => {
        if (rendered) {
            getUserProfileByUsername();
            getUserImages();
        }
        if (!rendered) setRendered(true);
    }, [rendered, getUserProfileByUsername, getUserImages]);

    return (
        <>
            {showImageModal && (
                <ImageModal
                    image={`${imageUrl}`}
                    onCancel={() => setShowImageModal(!showImageModal)}
                    showArrow={false}
                />
            )}
            {deleteDialogIsOpen && (
                <Dialog
                    title="Are you sure you want to delete this image?"
                    showButtons={true}
                    firstButtonText="Delete"
                    secondButtonText="Cancel"
                    firstBtnHandler={() => removeImageFromGallery(data)}
                    secondBtnHandler={() =>
                        dispatch(
                            toggleDeleteDialog({ toggle: false, data: null })
                        )
                    }
                />
            )}
            <div className="profile-wrapper h-[86vh] max-h-[86vh] grid grid-cols-3 rounded-t-[30px] overflow-hidden bg-background-blur">
                <div className="profile-header w-full h-[14vh] col-span-3 relative">
                    <BackgroundHeader
                        user={user}
                        loading={loading}
                        hasImage={hasImage}
                        hasError={hasError}
                        url={bgUrl}
                        onClick={changeTabContent}
                        selectedFileImage={selectedFileImage}
                        saveImage={saveImage}
                        cancelFileSelection={cancelFileSelection}
                        removeBackgroundImage={removeBackgroundImage}
                        tabItems={tabItems(
                            username === profile?.username,
                            username === profile?.username
                        )}
                        tab={displayContent}
                        hideSettings={username === profile?.username}
                        galleryImages={galleryImages}
                    />
                </div>

                {/* main post section */}
                <div className="profile-content flex-1 h-[72vh] pt-4 px-4 col-span-3 grid grid-cols-3 ">
                    <div className="col-span-1 size-full max-h-full pr-4 rounded-[10px] flex flex-col gap-2 overflow-y-scroll">
                        <Information userProfileData={userProfileData} />
                    </div>
                    <div className="col-span-2 h-full flex flex-col justify-start bg-primary-white rounded-t-[10px] ">
                        <div className="w-full h-max flex items-center justify-between">
                            {titleOptions.map((item, index) => (
                                <div
                                    key={index}
                                    className={`flex-1 py-2 text-center border-b-2 border-gray-300 font-bold cursor-pointer hover:text-primary-black ${
                                        displayContent === item &&
                                        "text-primary-black border-primary"
                                    }`}
                                    onClick={() => {
                                        setDisplayContent(item);
                                    }}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                        <div className="size-full min-h-[500px] max-h-[500px] flex flex-col overflow-y-scroll bg-primary-white p-4">
                            {displayContent && renderContent()}
                        </div>

                        {/* {displayContent === "followers" && (
                            <FollowerCard userData={user} />
                        )}
                        {displayContent === "gallery" && (
                            <>
                                {galleryImages.length > 0 && (
                                    <>
                                        <div className="imageGrid-container">
                                            {galleryImages.map((image) => (
                                                <div key={image._id}>
                                                    <GalleryImage
                                                        showCaption={false}
                                                        showDelete={true}
                                                        imgSrc={Utils.getImage(
                                                            image?.imgId,
                                                            image.imgVersion
                                                        )}
                                                        onClick={() => {
                                                            setImageUrl(
                                                                Utils.getImage(
                                                                    image?.imgId,
                                                                    image.imgVersion
                                                                )
                                                            );
                                                            setShowImageModal(
                                                                !showImageModal
                                                            );
                                                        }}
                                                        onRemoveImage={(
                                                            event
                                                        ) => {
                                                            event.stopPropagation();
                                                            dispatch(
                                                                toggleDeleteDialog(
                                                                    {
                                                                        toggle: !deleteDialogIsOpen,
                                                                        data: image?._id,
                                                                    }
                                                                )
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                        {displayContent === "change password" && (
                            <ChangePassword />
                        )}
                        {displayContent === "notifications" && (
                            <NotificationSettings />
                        )} */}
                    </div>
                </div>
            </div>
        </>
    );
};
export default Profile;
