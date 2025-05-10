import BasicInfoSkeleton from "@/components/information/basic-info/BasicInfoSkeleton";
import InfoDisplay from "@/components/information/display/InfoDisplay";
import PropTypes from "prop-types";

const BasicInfo = ({
    editableInputs,
    username,
    profile,
    setEditableInputs,
    setIsEditing,
}) => {
    const editableSocialInputs = {
        instagram: "",
        twitter: "",
        facebook: "",
        youtube: "",
    };

    return (
        <InfoDisplay
            title="Basic Info"
            type="basic"
            isCurrentUser={username === profile?.username}
            editableInputs={editableInputs}
            editableSocialInputs={editableSocialInputs}
            setEditableInputs={setEditableInputs}
            setIsEditing={setIsEditing}
        />
    );
};

BasicInfo.propTypes = {
    username: PropTypes.string,
    profile: PropTypes.object,
    loading: PropTypes.bool,
    editableInputs: PropTypes.object,
    setEditableInputs: PropTypes.func,
};

export default BasicInfo;
