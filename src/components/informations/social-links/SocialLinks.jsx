import BasicInfoSkeleton from "@components/informations/basic-info/BasicInfoSkeleton";
import InfoDisplay from "@components/informations/display/InfoDisplay";
import PropTypes from "prop-types";

const SocialLinks = ({
    editableSocialInputs,
    username,
    profile,
    loading,
    setEditableSocialInputs,
    setIsEditing
}) => {
    const editableInputs = {
        quote: "",
        work: "",
        school: "",
        location: "",
    };
    const editableSocialLinks = editableSocialInputs ?? {
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
                    title="Social Links"
                    type="social"
                    isCurrentUser={username === profile?.username}
                    editableInputs={editableInputs}
                    editableSocialInputs={editableSocialLinks}
                    loading={loading}
                    setEditableSocialInputs={setEditableSocialInputs}
                    setIsEditing={setIsEditing}
                />
            )}
        </>
    );
};

SocialLinks.propTypes = {
    username: PropTypes.string,
    profile: PropTypes.object,
    loading: PropTypes.bool,
    editableSocialInputs: PropTypes.object,
    setEditableSocialInputs: PropTypes.func,
};

export default SocialLinks;
