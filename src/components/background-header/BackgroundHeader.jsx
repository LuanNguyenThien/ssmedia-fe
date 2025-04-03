import Button from "@components/button/Button";
import ImageGridModal from "@components/image-grid-modal/ImageGridModal";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import "@components/background-header/BackgroundHeader.scss";
import BackgroundHeaderSkeleton from "@components/background-header/BackgroundHeaderSkeleton";
import Avatar from "components/avatar/Avatar";
import Input from "components/input/Input";

import { FaRegEdit } from "react-icons/fa";
import Spinner from "components/spinner/Spinner";
import { LuSquareDashedMousePointer } from "react-icons/lu";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import useDetectOutsideClick from "hooks/useDetectOutsideClick";

const BackgroundHeader = ({
    user,
    loading,
    url,
    onClick,
    tab,
    hasImage,
    tabItems,
    hasError,
    hideSettings,
    selectedFileImage,
    saveImage,
    cancelFileSelection,
    removeBackgroundImage,
    galleryImages,
}) => {
    const [selectedBackground, setSelectedBackground] = useState("");
    const [selectedProfileImage, setSelectedProfileImage] = useState("");
    const [showSpinner, setShowSpinner] = useState(false);

    const editToggleRef = useRef(null);
    const [isActive, setIsActive] =  useDetectOutsideClick(editToggleRef, false)

    const [showImagesModal, setShowImagesModal] = useState(false);
    const backgroundFileRef = useRef();
    const profileImageRef = useRef();

    //avatar state
    const [isHoverAvatar, setIsHoverAvatar] = useState(false);
    const backgroundFileInputClicked = () => {
        backgroundFileRef.current.click();
    };

    const profileFileInputClicked = () => {
        profileImageRef.current.click();
    };

    const hideSaveChangesContainer = () => {
        setSelectedBackground("");
        setSelectedProfileImage("");
        setShowSpinner(false);
    };

    const onAddProfileClick = () => setIsActive(!isActive);

    const BackgroundSelectDropdown = () => {
        return (
            <div
                className="absolute flex flex-col right-5 bottom-0 bg-primary-white py-2 px-4 gap-2 rounded-t-xl rounded-bl-xl z-[1000] text-primary-black text-sm"
                data-testid="menu"
            >
                {galleryImages.length > 0 && (
                    <div
                        className=" hover:text-primary-black/70 cursor-pointer  flex items-center gap-2"
                        onClick={() => {
                            setShowImagesModal(true);
                            setIsActive(false);
                        }}
                    >
                        <span className="text-xl ">
                            <LuSquareDashedMousePointer />
                        </span>
                        Select
                    </div>
                )}
                <div
                    className=" hover:text-primary-black/70 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                        backgroundFileInputClicked();
                        setIsActive(false);
                        setShowImagesModal(false);
                    }}
                >
                    <span className="text-xl ">
                        <MdOutlineDriveFolderUpload />
                    </span>
                    Upload
                </div>
            </div>
        );
    };

    useEffect(() => {
        if (!hasImage) {
            setShowSpinner(false);
        }
    }, [hasImage]);

    return (
        <>
            {/*  */}
            {showImagesModal && (
                <ImageGridModal
                    images={galleryImages}
                    closeModal={() => setShowImagesModal(false)}
                    selectedImage={(event) => {
                        setSelectedBackground(event);
                        selectedFileImage(event, "background");
                    }}
                />
            )}
            {loading ? (
                <BackgroundHeaderSkeleton tabItems={tabItems} />
            ) : (
                <div
                    className="profile-banner h-[18vh] w-full max-h-[18vh]"
                    data-testid="profile-banner"
                >
                    {/*edit popup images section  */}
                    {hasImage && (
                        <div
                            className="save-changes-container size-full absolute top-0 left-0"
                            data-testid="save-changes-container"
                        >
                            <div className="save-changes-box size-full relative">
                                <div className="size-full flex justify-center items-center">
                                    {showSpinner && !hasError && (
                                        <Spinner bgColor="white" />
                                    )}
                                </div>
                                <div className="save-changes-buttons absolute bottom-3 right-3 z-50">
                                    <div className="flex justify-between items-center px-4 gap-2">
                                        <Button
                                            label="Cancel"
                                            className="bg-primary-black/40 text-primary-white hover:bg-primary-black/60 transition-all rounded-xl py-2 px-4 text-sm"
                                            disabled={false}
                                            handleClick={() => {
                                                setShowSpinner(false);
                                                cancelFileSelection();
                                                hideSaveChangesContainer();
                                            }}
                                        />
                                        <Button
                                            label="Save Changes"
                                            className="bg-primary/40 text-primary-white hover:bg-primary/60 transition-all rounded-xl py-2 px-4 text-sm"
                                            disabled={false}
                                            handleClick={() => {
                                                setShowSpinner(true);
                                                const type = selectedBackground
                                                    ? "background"
                                                    : "profile";
                                                saveImage(type);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* background */}
                    <div
                        data-testid="profile-banner-image"
                        className="profile-banner-image size-full  overflow-hidden"
                        style={{
                            background: `${
                                !selectedBackground ? user?.avatarColor : ""
                            }`,
                        }}
                    >
                        {/* {url && hideSettings && (
                            <div
                                className="delete-btn"
                                data-testid="delete-btn"
                            >
                                <Button
                                    label="Remove"
                                    className="remove"
                                    disabled={false}
                                    handleClick={() => {
                                        removeBackgroundImage(user?.bgImageId);
                                    }}
                                />
                            </div>
                        )}
                        {!selectedBackground && !url && (
                            <h3>Add a background image</h3>
                        )} */}
                        {selectedBackground ? (
                            <img
                                src={`${selectedBackground}`}
                                alt="background"
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <img
                                src={`${url}`}
                                alt="background"
                                className="object-cover w-full h-full"
                            />
                        )}

                        {!hasImage && (
                            <div
                                ref={editToggleRef}
                                onClick={onAddProfileClick}
                                className="absolute bottom-3 right-3 text-2xl text-background-blur hover:text-background-blur/80 transition-all duration-200"
                            >
                                <FaRegEdit />
                                {isActive && <BackgroundSelectDropdown />}
                            </div>
                        )}
                    </div>

                    <div className="profile-banner-data w-1/3 flex flex-col top-1/2">
                        <div
                            data-testid="profile-pic"
                            className="profile-pic size-full flex justify-center items-center"
                        >
                            <div
                                onMouseEnter={() => setIsHoverAvatar(true)}
                                onMouseLeave={() => setIsHoverAvatar(false)}
                                className="size-max flex justify-center items-center "
                            >
                                <Avatar
                                    isHover={setIsHoverAvatar}
                                    name={user?.username}
                                    bgColor={user?.avatarColor}
                                    textColor="#ffffff"
                                    size={140}
                                    avatarSrc={
                                        selectedProfileImage ||
                                        user?.profilePicture
                                    }
                                />
                                {hideSettings && isHoverAvatar && (
                                    <div className="z-50 size-max absolute bg-primary-white p-2 rounded-full">
                                        <div
                                            className="profile-pic-select"
                                            data-testid="profile-pic-select"
                                        >
                                            <Input
                                                ref={profileImageRef}
                                                name="profile"
                                                type="file"
                                                className="hidden"
                                                onClick={() => {
                                                    if (
                                                        profileImageRef.current
                                                    ) {
                                                        profileImageRef.current.value =
                                                            null;
                                                    }
                                                }}
                                                handleChange={(event) => {
                                                    setSelectedProfileImage(
                                                        URL.createObjectURL(
                                                            event.target
                                                                .files[0]
                                                        )
                                                    );
                                                    selectedFileImage(
                                                        event.target.files[0],
                                                        "profile"
                                                    );
                                                }}
                                            />
                                        </div>
                                        <label
                                            onClick={() =>
                                                profileFileInputClicked()
                                            }
                                        >
                                            <FaCamera className="cameraa " />
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* <div className="profile-name flex justify-center w-full bg-pink-50 !text-black font-semibold text-2xl">
                            {user?.username}
                        </div> */}

                        {hideSettings && (
                            <div className="profile-select-image">
                                <Input
                                    ref={backgroundFileRef}
                                    name="background"
                                    type="file"
                                    className="inputFile"
                                    onClick={() => {
                                        if (backgroundFileRef.current) {
                                            backgroundFileRef.current.value =
                                                null;
                                        }
                                    }}
                                    handleChange={(event) => {
                                        setSelectedBackground(
                                            URL.createObjectURL(
                                                event.target.files[0]
                                            )
                                        );
                                        selectedFileImage(
                                            event.target.files[0],
                                            "background"
                                        );
                                    }}
                                />
                                {/* <label
                                    data-testid="add-cover-photo"
                                    onClick={() => onAddProfileClick()}
                                >
                                    <FaCamera className="camera" />{" "}
                                    <span>Add Cover Photo</span>
                                </label> */}
                            </div>
                        )}
                    </div>

                    {/* tabs */}
                    {/* <div className="profile-banner-items">
            <ul className="banner-nav">
              {tabItems.map((data) => (
                <div data-testid="tab-elements" key={data.key}>
                  {data.show && (
                    <li className="banner-nav-item" key={data.key}>
                      <div
                        className={`banner-nav-item-name ${tab === data.key.toLowerCase() ? 'active' : ''}`}
                        onClick={() => onClick(data.key.toLowerCase())}
                      >
                        {data.icon}
                        <p className="title">{data.key}</p>
                      </div>
                    </li>
                  )}
                </div>
              ))}
            </ul>
          </div> */}
                </div>
            )}
        </>
    );
};

BackgroundHeader.propTypes = {
    user: PropTypes.object,
    loading: PropTypes.bool,
    url: PropTypes.string,
    onClick: PropTypes.func,
    tab: PropTypes.string,
    hasImage: PropTypes.bool,
    tabItems: PropTypes.array,
    hasError: PropTypes.bool,
    hideSettings: PropTypes.bool,
    selectedFileImage: PropTypes.func,
    saveImage: PropTypes.func,
    cancelFileSelection: PropTypes.func,
    removeBackgroundImage: PropTypes.func,
    galleryImages: PropTypes.array,
};

export default BackgroundHeader;
