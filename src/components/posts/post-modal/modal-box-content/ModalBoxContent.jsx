import Avatar from "@components/avatar/Avatar";
import SelectDropdown from "@components/select-dropdown/SelectDropdown";
import useDetectOutsideClick from "@hooks/useDetectOutsideClick";
import { privacyList } from "@services/utils/static.data";
import { useRef, useState, useCallback, useEffect } from "react";
import { FaGlobe, FaLock, FaUserCheck } from "react-icons/fa";
import { useSelector } from "react-redux";
import { find } from "lodash";
import React from "react";

const ModalBoxContent = () => {
  // const privacyList = [
  //   {
  //     topText: "Public",
  //     subText: "Anyone on Chatty",
  //     icon: <FaGlobe className="globe-icon globe" />,
  //   },
  //   {
  //     topText: "Followers",
  //     subText: "Your followers on Chatty",
  //     icon: <FaUserCheck className="globe-icon globe" />,
  //   },
  //   {
  //     topText: "Private",
  //     subText: "For you only",
  //     icon: <FaLock className="globe-icon globe" />,
  //   },
  // ];
  
  const { profile } = useSelector((state) => state.user);
  const { privacy } = useSelector((state) => state.post);
  const { feeling } = useSelector((state) => state.modal);
  const privacyRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState({
    topText: "Public",
    subText: "Anyone on Chatty",
    icon: () =>
      React.createElement(FaGlobe, { className: "globe-icon globe" }),
  });
  const [tooglePrivacy, setTogglePrivacy] = useDetectOutsideClick(
    privacyRef,
    false
  );

  const displayPostPrivacy = useCallback(() => {
    if (privacy) {
      const postPrivacy = find(privacyList, (data) => data.topText === privacy);
      setSelectedItem(postPrivacy);
    }
  }, [privacy]);

  useEffect(() => {
    displayPostPrivacy();
  }, [displayPostPrivacy]);

  return (
    <div className="modal-box-content" data-testid="modal-box-content">
      <div className="user-post-image" data-testid="box-avatar">
        <Avatar
          name={profile?.username}
          bgColor={profile?.avatarColor}
          textColor="#ffffff"
          size={40}
          avatarSrc={profile?.profilePicture}
        />
      </div>
      <div className="modal-box-info">
        <h5 className="inline-title-display" data-testid="box-username">
          {profile?.username}
        </h5>
        {feeling?.name && (
          <p className="inline-display" data-testid="box-feeling">
            is feeling{" "}
            <img
              className="inline-block w-5 h-4 align-middle mx-1"
              src={`${feeling?.image}`}
              alt=""
            />
            <span className="font-semibold">{feeling?.name}</span>
          </p>
        )}
        <div
          data-testid="box-text-display"
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => setTogglePrivacy(!tooglePrivacy)}
        >
          {selectedItem.icon()}{" "}
          <div className="selected-item-text" data-testid="box-item-text">
            {selectedItem.topText}
          </div>
          <div ref={privacyRef}>
            <SelectDropdown
              isActive={tooglePrivacy}
              items={privacyList}
              setSelectedItem={setSelectedItem}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ModalBoxContent;
