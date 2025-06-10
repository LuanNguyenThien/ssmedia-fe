import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { FaUserTimes } from "react-icons/fa";

// Components
import ImageModal from "@components/image-modal/ImageModal";
import Dialog from "@components/dialog/Dialog";
import BackgroundHeader from "@components/background-header/BackgroundHeader";
import Timeline from "@components/timeline/Timeline";
import TimelineAnswers from "@components/timeline/TimelineAnswer";
import Information from "@/components/information/Information";
import ModalContainer from "@components/modal/ModalContainer";
import ReportModal from "@/components/modal/ReportModal";

// Styles
import "@pages/social/profile/Profile.scss";

// Redux
import { toggleDeleteDialog } from "@redux/reducers/modal/modal.reducer";

// Services
import { imageService } from "@services/api/image/image.service";
import { userService } from "@services/api/user/user.service";
import { followerService } from "@services/api/followers/follower.service";
import { tabItems } from "@services/utils/static.data";
import { Utils } from "@services/utils/utils.service";
import Follower from "../followers/Followers";
import Following from "../following/Following";
import ProfileSkeleton from "./ProfileSkeleton";
import { postService } from "@/services/api/post/post.service";

// Hooks
// Removed useEffectOnce - we'll use useEffect with dependencies instead

const currentUserOptions = ["Posts", "Answers", "Followers", "Following"];
const otherUserOptions = ["Posts", "Answers", "Followers"];

const Profile = () => {
    const dispatch = useDispatch();
    const { profile } = useSelector((state) => state.user);
    const { deleteDialogIsOpen, deleteDialogType, data } = useSelector(
        (state) => state.modal
    );
    const { username } = useParams();
    const [searchParams] = useSearchParams();

    // State management
    const [user, setUser] = useState(null);
    const [userProfileData, setUserProfileData] = useState(null);
    const [following, setFollowing] = useState([]);
    const [galleryImages, setGalleryImages] = useState([]);

    const [bgUrl, setBgUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [selectedBackgroundImage, setSelectedBackgroundImage] = useState("");
    const [selectedProfileImage, setSelectedProfileImage] = useState("");

    const [displayContent, setDisplayContent] = useState("Posts");
    const [titleOptions, setTitleOptions] = useState([
        "Posts",
        "Answers",
        "Followers",
        "Following",
    ]);

    const [hasError, setHasError] = useState(false);
    const [hasImage, setHasImage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);

    // Check if current user is viewing their own profile - memoized to prevent unnecessary recalculations
    const isCurrentUser = useCallback(() => {
        if (!profile) return false;
        return username === profile?.username;
    }, [username, profile]);

    // Get user profile data - memoized to prevent unnecessary API calls
    const getUserProfileByUsername = useCallback(async () => {
        try {
            setLoading(true);
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
        } catch (error) {
            Utils.dispatchNotification(
                error.response?.data?.message || "Error loading profile",
                "error",
                dispatch
            );
        } finally {
            setLoading(false);
        }
    }, [dispatch, searchParams, username]);

    // Get user images - memoized to prevent unnecessary API calls
    const getUserImages = useCallback(async () => {
        try {
            const imagesResponse = await imageService.getUserImages(
                searchParams.get("id")
            );
            setGalleryImages(imagesResponse.data.images);
        } catch (error) {
            Utils.dispatchNotification(
                error.response?.data?.message || "Error loading images",
                "error",
                dispatch
            );
        }
    }, [dispatch, searchParams]);

    // Get user following - extracted as a separate function for reuse
    const getUserFollowing = useCallback(async () => {
        try {
            setLoading(true);
            const response = await followerService.getUserFollowing();
            setFollowing(response.data.following);
            setLoading(false);
        } catch (error) {
            Utils.dispatchNotification(
                error.response?.data?.message || "Error loading following data",
                "error",
                dispatch
            );
            setLoading(false);
        }
    }, [dispatch]);

    // Handle tab content change
    const changeTabContent = useCallback((data) => {
        setDisplayContent(data);
    }, []);

    // Handle file selection
    const selectedFileImage = useCallback((data, type) => {
        setHasImage(true);
        if (type === "background") {
            setSelectedBackgroundImage(data);
        } else {
            setSelectedProfileImage(data);
        }
    }, []);

    // Cancel file selection
    const cancelFileSelection = useCallback(() => {
        setHasImage(false);
        setSelectedBackgroundImage("");
        setSelectedProfileImage("");
        setHasError(false);
    }, []);

    // Save image - handling both background and profile images
    const saveImage = useCallback(
        async (type) => {
            const selectedImage =
                type === "background"
                    ? selectedBackgroundImage
                    : selectedProfileImage;

            if (!selectedImage) return;

            // Handle File objects vs. string URLs
            if (typeof selectedImage !== "string") {
                const reader = new FileReader();
                reader.onload = async () => {
                    await addImage(reader.result, type);
                };
                reader.readAsDataURL(selectedImage);
            } else {
                await addImage(selectedImage, type);
            }
        },
        [selectedBackgroundImage, selectedProfileImage]
    );

    // Add image API call
    const addImage = useCallback(
        async (result, type) => {
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

                    // Refresh profile data to show the new image
                    getUserProfileByUsername();
                }
            } catch (error) {
                setHasError(true);
                Utils.dispatchNotification(
                    error.response?.data?.message || "Error uploading image",
                    "error",
                    dispatch
                );
            }
        },
        [dispatch, getUserProfileByUsername]
    );

    // Remove background image
    const removeBackgroundImage = useCallback(
        async (bgImageId) => {
            try {
                setBgUrl("");
                await removeImage(`/images/background/${bgImageId}`);
                getUserProfileByUsername();
            } catch (error) {
                setHasError(true);
                Utils.dispatchNotification(
                    error.response?.data?.message ||
                        "Error removing background",
                    "error",
                    dispatch
                );
            }
        },
        [dispatch, getUserProfileByUsername]
    );

    // Remove image from gallery
    const removeImageFromGallery = useCallback(
        async (imageId) => {
            try {
                dispatch(
                    toggleDeleteDialog({
                        toggle: false,
                        data: null,
                        dialogType: "",
                    })
                );
                setGalleryImages((prevImages) =>
                    prevImages.filter((image) => image._id !== imageId)
                );
                await removeImage(`/images/${imageId}`);
            } catch (error) {
                setHasError(true);
                Utils.dispatchNotification(
                    error.response?.data?.message || "Error removing image",
                    "error",
                    dispatch
                );
            }
        },
        [dispatch]
    );

    // Generic image removal API call
    const removeImage = useCallback(
        async (url) => {
            const response = await imageService.removeImage(url);
            Utils.dispatchNotification(
                response.data.message,
                "success",
                dispatch
            );
        },
        [dispatch]
    );

    // Memoized content renderer based on selected tab
    const renderContent = useCallback(() => {
        switch (displayContent) {
            case "Posts":
                return <Timeline userProfileData={userProfileData} />;
            case "Answers":
                return <TimelineAnswers loading={loading} />;
            case "Followers":
                return <Follower userData={user} />;
            case "Following":
                return <Following followings={following} />;
            default:
                return null;
        }
    }, [displayContent, userProfileData, user, following]);

    // Toggle image modal
    const toggleImageModal = useCallback(() => {
        setShowImageModal((prev) => !prev);
    }, []);

    // Replace useEffectOnce with useEffect and add dependencies
    // This will refetch data when username or searchParams change
    useEffect(() => {
        getUserProfileByUsername();
        getUserImages();
        getUserFollowing();
        setDisplayContent("Posts");
    }, [
        username,
        searchParams,
        getUserProfileByUsername,
        getUserImages,
        getUserFollowing,
        isCurrentUser,
    ]);

    // Update title options based on current user status
    useEffect(() => {
        setTitleOptions(
            isCurrentUser() ? currentUserOptions : otherUserOptions
        );
    }, [isCurrentUser]);

    useEffect(() => {
        const viewportHeight = window.innerHeight;
        console.log("Viewport Height:", viewportHeight);
        const headerDesktopElement =
            document.querySelector("div.header-desktop");
        const headerElement = document.querySelector("div.header-mb");
        const footerElement = document.querySelector("div.footer-mb");

        document.documentElement.style.setProperty(
            "--root-height",
            `${viewportHeight}px`
        );
        if (headerElement && footerElement) {
            const headerHeight = headerElement.offsetHeight;
            const footerHeight = footerElement.offsetHeight;
            const totalHeight = headerHeight + footerHeight;
            document.documentElement.style.setProperty(
                "--header-footer-height",
                `${totalHeight}px`
            );
        } else {
            const headerHeight = headerDesktopElement.offsetHeight;
            const footerHeight = 0; // Assuming no footer in this case
            const totalHeight = headerHeight + footerHeight;
            document.documentElement.style.setProperty(
                "--header-footer-height",
                `${totalHeight}px`
            );
        }
    }, []);

    const handleReport = useCallback(async (reason) => {
        // const reportData = {
        //     postId: searchParams.get("id") || "",
        //     content: reason.reason,
        //     details: reason.reasonDescription,
        // };
        const reportData = {
            reportedUserId: searchParams.get("id") || "",
            reason: reason.reason,
            description: reason.reasonDescription,
        };
        try {
            const response = await userService.reportUser(reportData);
            console.log(response);
            Utils.dispatchNotification(
                response.data.message,
                "success",
                dispatch
            );
        } catch (error) {
            Utils.dispatchNotification(
                error.response?.data?.message || "Error reporting post",
                "error",
                dispatch
            );
        } finally {
            setShowReportModal(false);
        }
    }, []);

    return (
        <>
            {showReportModal && (
                <ReportModal
                    isOpen={showReportModal}
                    onClose={() => setShowReportModal(false)}
                    onSubmit={handleReport}
                    type="user"
                    title="Report User"
                    subtitle="Report inappropriate user behavior"
                    icon={FaUserTimes}
                    iconColor="text-orange-500"
                    iconBgColor="bg-orange-50"
                />
            )}
            <ModalContainer />
            {showImageModal && (
                <ImageModal
                    image={imageUrl}
                    onCancel={toggleImageModal}
                    showArrow={false}
                />
            )}

            {deleteDialogIsOpen && deleteDialogType === "image" && data && (
                <Dialog
                    title="Are you sure you want to delete this image?"
                    showButtons={true}
                    firstButtonText="Delete"
                    secondButtonText="Cancel"
                    firstBtnHandler={() => removeImageFromGallery(data)}
                    secondBtnHandler={() =>
                        dispatch(
                            toggleDeleteDialog({
                                toggle: false,
                                data: null,
                                dialogType: "",
                            })
                        )
                    }
                />
            )}

            {loading ? (
                <ProfileSkeleton />
            ) : (
                <div className="profile-wrapper col-span-10 grid grid-cols-3 rounded-t-[30px] overflow-y-scroll lg:overflow-auto bg-background-blur">
                    <div className="profile-header w-full lg:h-[60vh] col-span-3 relative">
                        <BackgroundHeader
                            user={user}
                            isCurrentUser={isCurrentUser}
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
                            selectedImage={setImageUrl}
                            showImageModal={toggleImageModal}
                        />
                    </div>

                    {/* main post section */}
                    {!Utils.checkIfUserIsBlocked(
                        profile?.blockedBy,
                        userProfileData?.user._id
                    ) || userProfileData?.user._id === profile?._id ? (
                        <div className="profile-content flex-1 h-[72vh] pt-4 sm:px-4 col-span-3 flex flex-col lg:grid grid-cols-3">
                            <div className="col-span-1 w-full h-max lg:h-full lg:pr-4 rounded-[10px] flex flex-col gap-2 lg:overflow-y-scroll">
                                <Information
                                    following={following}
                                    isCurrentUser={isCurrentUser}
                                    userProfileData={userProfileData}
                                    setRendered={getUserProfileByUsername}
                                    setShowReportModal={() =>
                                        setShowReportModal(true)
                                    }
                                />
                            </div>
                            <div className="profile-user-content col-span-2 h-full flex flex-col justify-start bg-primary-white rounded-t-[10px]">
                                <div className="w-full h-max flex items-center justify-between">
                                    {titleOptions.map((item, index) => (
                                        <div
                                            key={index}
                                            className={`flex-1 text-sm py-2 text-center border-b-2 border-gray-300 font-bold cursor-pointer hover:text-primary-black ${
                                                displayContent === item &&
                                                "text-primary-black border-primary"
                                            }`}
                                            onClick={() =>
                                                setDisplayContent(item)
                                            }
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </div>
                                <div className="size-full flex flex-col overflow-y-scroll bg-gray-50 py-2 sm:px-4 profile-content-posts">
                                    {renderContent()}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="profile-content flex-1 h-[72vh] w-full pt-4 sm:px-4 col-span-3 flex justify-start items-start ">
                            <div className="w-full h-max bg-primary-white p-6 rounded-[10px] flex flex-col items-center justify-center text-center">
                                <span className="text-lg font-semibold text-gray-800">
                                    This profile is currently unavailable.
                                </span>
                                <p className="text-sm text-gray-600 mt-2">
                                    The user may have deactivated their account
                                    or changed their privacy settings.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default Profile;
