import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FaTimes, FaExclamationTriangle, FaFlag } from "react-icons/fa";
import { defaultUserReasons, defaultPostReasons } from "./report.constants.js";
const ReportModal = ({
    isOpen = false,
    onClose,
    onSubmit,
    title = "Report Content",
    subtitle = "Help us understand what's happening",
    icon = FaFlag,
    iconColor = "text-red-500",
    iconBgColor = "bg-red-50",
    reasonsLabel = "Why are you reporting this?",
    descriptionLabel = "Additional details (optional)",
    descriptionPlaceholder = "Please provide any additional context that would help us understand your report...",
    submitButtonText = "Submit Report",
    cancelButtonText = "Cancel",
    customReasons = null,
    className = "",
    maxDescriptionLength = 500,
    type = "post",
}) => {
    const [selectedReason, setSelectedReason] = useState({
        id: "",
        label: "",
        description: "",
    });
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOtherReason, setIsOtherReason] = useState(false);

    const IconComponent = icon;

    const getDefaultReasons = () => {
        switch (type) {
            case "user":
                return defaultUserReasons;
            case "post":
            default:
                return defaultPostReasons;
        }
    };

    const reasons = customReasons || getDefaultReasons();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedReason.id) return;

        setIsSubmitting(true);
        try {
            if (selectedReason.label === "Other") {
                await onSubmit({
                    reason: selectedReason.label,
                    reasonDescription: description,
                    timestamp: new Date().toISOString(),
                });
            } else {
                await onSubmit({
                    reason: selectedReason.label,
                    reasonDescription: selectedReason.description,
                });
            }
            handleClose();
        } catch (error) {
            console.error("Error submitting report:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setSelectedReason({
            id: "",
            label: "",
            description: "",
        });
        setDescription("");
        setIsSubmitting(false);
        onClose();
    };

    useEffect(() => {
        if (selectedReason.id === "other") {
            setIsOtherReason(true);
        } else {
            setIsOtherReason(false);
        }
    }, [selectedReason]);

    const isValid = selectedReason.id.length > 0;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
                className={`bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-gray-100 ${className}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <div
                            className={`w-10 h-10 ${iconBgColor} rounded-full flex items-center justify-center`}
                        >
                            <IconComponent className={`w-5 h-5 ${iconColor}`} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {title}
                            </h2>
                            {subtitle && (
                                <p className="text-sm text-gray-500 mt-1">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                        aria-label="Close modal"
                        disabled={isSubmitting}
                    >
                        <FaTimes className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <form
                    onSubmit={handleSubmit}
                    className="flex-1 overflow-y-auto"
                >
                    <div className="px-6 py-6 space-y-6">
                        {/* Reason Selection */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {reasonsLabel}
                            </h3>
                            <div className="space-y-3">
                                {reasons.map((reason) => (
                                    <label
                                        key={reason.id}
                                        className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50 ${
                                            selectedReason.id === reason.id
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="reason"
                                            value={reason.id}
                                            checked={
                                                selectedReason.id === reason.id
                                            }
                                            onChange={() =>
                                                setSelectedReason({
                                                    id: reason.id,
                                                    label: reason.label,
                                                    description:
                                                        reason.description,
                                                })
                                            }
                                            className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                            disabled={isSubmitting}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-900">
                                                {reason.label}
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                {reason.description}
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {descriptionLabel}
                            </h3>
                            <div className="relative">
                                <textarea
                                    value={description}
                                    onChange={(e) => {
                                        if (
                                            e.target.value.length <=
                                            maxDescriptionLength
                                        ) {
                                            setDescription(e.target.value);
                                        }
                                    }}
                                    placeholder={descriptionPlaceholder}
                                    rows={4}
                                    className="w-full p-4 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all resize-none"
                                    disabled={!isOtherReason}
                                />
                                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                                    {description.length}/{maxDescriptionLength}
                                </div>
                            </div>
                        </div>

                        {/* Warning Notice */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <FaExclamationTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-amber-800">
                                    <p className="font-medium mb-1">
                                        Please report responsibly
                                    </p>
                                    <p>
                                        False reports may result in restrictions
                                        on your account. Make sure your report
                                        is accurate and in good faith.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                                disabled={isSubmitting}
                            >
                                {cancelButtonText}
                            </button>
                            <button
                                type="submit"
                                disabled={!isValid || isSubmitting}
                                className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                                    !isValid || isSubmitting
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md"
                                }`}
                            >
                                {isSubmitting
                                    ? "Submitting..."
                                    : submitButtonText}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

ReportModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    icon: PropTypes.elementType,
    iconColor: PropTypes.string,
    iconBgColor: PropTypes.string,
    reasonsLabel: PropTypes.string,
    descriptionLabel: PropTypes.string,
    descriptionPlaceholder: PropTypes.string,
    submitButtonText: PropTypes.string,
    cancelButtonText: PropTypes.string,
    customReasons: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
        })
    ),
    className: PropTypes.string,
    maxDescriptionLength: PropTypes.number,
    type: PropTypes.oneOf(["post", "user"]),
};

export default ReportModal;
