import ContentEditable from "react-contenteditable";
import { RxCross2 } from "react-icons/rx";

export const InfoField = ({
    icon,
    value,
    placeholder,
    onChange,
    isEditing,
    label,
    link,
}) => {
    const content = value || "";

    return (
        <div className="size-full flex items-center gap-2">
            <div className="h-full flex items-center">{icon}</div>
            <div className="flex items-center gap-2 w-full">
                {!isEditing ? (
                    <>
                        {label && value && <>{label} </>}
                        {value ? (
                            link ? (
                                <a
                                    className="link"
                                    href={value}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                >
                                    {value}
                                </a>
                            ) : (
                                <span>{value}</span>
                            )
                        ) : (
                            <div className="no-information">{placeholder}</div>
                        )}
                    </>
                ) : (
                    <>
                        <ContentEditable
                            className="size-full border px-4 py-2 rounded-md text-primary-black/80 focus:ring-1"
                            data-placeholder={placeholder}
                            tagName="div"
                            disabled={!isEditing}
                            html={content}
                            style={{ maxHeight: "70px", overflowY: "auto" }}
                            onChange={(e) => onChange(e.target.value)}
                            onPaste={(e) => {
                                e.preventDefault();
                                const pastedText =
                                    e.clipboardData.getData("Text");
                                document.execCommand(
                                    "insertText",
                                    false,
                                    pastedText
                                );
                            }}
                        />
                        <RxCross2
                            onClick={() => {
                                onChange("");
                            }}
                        />
                    </>
                )}
            </div>
        </div>
    );
};
