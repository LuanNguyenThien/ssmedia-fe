import BasicInfoSkeleton from "components/informations/basic-info/BasicInfoSkeleton";
import InfoDisplay from "components/informations/display/InfoDisplay";
import PropTypes from "prop-types";

const BasicInfo = ({
    editableInputs,
    username,
    profile,
    loading,
    setEditableInputs,
    setIsEditing
}) => {
    const editableSocialInputs = {
        instagram: "",
        twitter: "",
        facebook: "",
        youtube: "",
    };

    return (
        <>
            {loading ? (
                <BasicInfoSkeleton />
            ) : (
                <InfoDisplay
                    title="Basic Info"
                    type="basic"
                    isCurrentUser={username === profile?.username}
                    editableInputs={editableInputs}
                    editableSocialInputs={editableSocialInputs}
                    loading={loading}
                    setEditableInputs={setEditableInputs}
                    setIsEditing={setIsEditing}
                />
            )}
        </>
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
