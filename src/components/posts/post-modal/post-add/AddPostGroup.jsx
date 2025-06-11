import PostWrapper from "@components/posts/modal-wrappers/post-wrapper/PostWrapper";
import ModalBoxContent from "@components/posts/post-modal/modal-box-content/ModalBoxContent";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import "@components/posts/post-modal/post-add/AddPost.scss";
import { PostUtils } from "@services/utils/post-utils.service";
import { postService } from "@services/api/post/post.service";
import Spinner from "@components/spinner/Spinner";
import TabsBar from "./components/TabsBar";
import { useParams } from "react-router-dom";
import { Utils } from "@services/utils/utils.service";
import GroupPostTabsBar from "./components/GroupPostTabsBar";

export default function AddPost() {
    const { feeling } = useSelector((state) => state.modal);
    const { privacy } = useSelector((state) => state.post);
    const { profile } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [postData, setPostData] = useState({
        htmlPost: "",
        post: "",
        bgColor: "#ffffff",
        privacy: "",
        feelings: "",
        profilePicture: "",
    });
    const { groupId } = useParams();
    const [disable, setDisable] = useState(true);
    const dispatch = useDispatch();
    const editor = useCreateBlockNote({ uploadFile });

    const handleEditorDataChange = async () => {
        const blocks = await editor.blocksToHTMLLossy(editor.document);
        const doc = new DOMParser().parseFromString(blocks, "text/html");
        const images = doc.body.querySelectorAll("img");

        // Giả sử vùng chứa là 400px (hoặc lấy ref thực tế nếu có)
        const containerWidth = 400;

        // Duyệt từng ảnh, kiểm tra naturalWidth
        await Promise.all(
            Array.from(images).map(
                (img) =>
                    new Promise((resolve) => {
                        if (img.width > containerWidth) {
                            img.setAttribute("width", 1200);
                            img.removeAttribute("data-preview-width");
                        }
                        resolve();
                    })
            )
        );
        const newBlocks = doc.body.innerHTML;
        const plainText = Array.from(
            doc.body.querySelectorAll(
                "h1,h2,h3, p, div, blockquote, li, span, strong"
            )
        )
            .map((element) => element.textContent.trim())
            .join(" ");
        PostUtils.postInputEditable(plainText, postData, setPostData);
        PostUtils.postInputHtml(newBlocks, postData, setPostData);
        setDisable(newBlocks.trim().length === 0);
    };

    const closePostModal = () => {
        PostUtils.closePostModal(dispatch);
    };

    useEffect(() => {
        const trimmed = postData.htmlPost.trim();
        // Disable nếu rỗng hoặc chỉ chứa <br> (có thể là <br> hoặc <br></br>)
        setDisable(
            trimmed.length <= 0 ||
                trimmed === "<br>" ||
                trimmed === "<br/>" ||
                trimmed === "<br></br>" ||
                trimmed === "<p></p><p></p>" ||
                trimmed === "<p></p>" ||
                trimmed === '<p class="none"></p>' ||
                trimmed === '<p></p><p class="none"></p>' ||
                trimmed === '<p class="none"></p><p class="none"></p>'
        );
    }, [postData]);

    const createPost = async () => {
        setLoading(true);
        try {
            if (Object.keys(feeling).length) {
                postData.feelings = feeling?.name;
            }
            postData.privacy = privacy || "Public";
            postData.profilePicture = profile?.profilePicture;
            // Xóa <br>, <br/>, <br></br> ở cuối post
            if (typeof postData.htmlPost === "string") {
                // Thêm class="none" vào <p></p> rỗng ở cuối
                postData.htmlPost = postData.htmlPost
                    .replace(/(<br\s*\/?>|<br><\/br>)+$/gi, "")
                    .replace(/(<p>\s*<\/p>)+$/gi, '<p class="none"></p>');
            }
            const response = await postService.createPostGroup(groupId, postData);
            if (response) {
                setLoading(false);
                closePostModal();
                Utils.dispatchNotification(
                    "Post shared successfully to the group!",
                    "success",
                    dispatch
                );
            }
        } catch (error) {
            console.error("Error creating group post:", error);
            setLoading(false);
            Utils.dispatchNotification(
                error.response?.data?.message || "Failed to create post",
                "error",
                dispatch
            );
        }
    };

    async function uploadFile(file) {
        const MAX_FILE_SIZE = 35 * 1024 * 1024;
        if (file.size > MAX_FILE_SIZE) {
            alert("File size exceeds the limit of 35MB.");
            throw new Error("File size exceeds 35MB limit");
        }
        const body = new FormData();
        body.append("file", file);
        const ret = await fetch("https://tmpfiles.org/api/v1/upload", {
            method: "POST",
            body: body,
        });
        return (await ret.json()).data.url.replace(
            "tmpfiles.org/",
            "tmpfiles.org/dl/"
        );
    }
    
    return (
        <>
            <PostWrapper>
                <div></div>
                <div className="modal-box !w-screen !h-[90vh] sm:!h-[80vh]">
                    {loading && (
                        <div
                            className="modal-box-loading"
                            data-testid="modal-box-loading"
                        >
                            <span>Posting...</span>
                            <Spinner />
                        </div>
                    )}
                    <GroupPostTabsBar closePostModal={closePostModal} />
                    <ModalBoxContent />

                    <div className="modal-box-form  flex-1 max-h-96 !mb-[10%]">
                        <div className="editable overflow-y-scroll flex-item h-full">
                            <BlockNoteView
                                editor={editor}
                                onChange={handleEditorDataChange}
                                theme="light"
                            />
                        </div>
                    </div>

                    <div
                        className="modal-box-butto h-[10%] absolute px-2 bottom-0 w-full py-2"
                        data-testid="edit-button"
                    >
                        <button
                            disabled={disable}
                            onClick={() => createPost()}
                            className={`modal-box-butto cursor-pointer max-w-[100vw] size-full bg-primary hover:bg-primary-dark transition-colors flex justify-center items-center rounded-[15px] px-4 py-2 text-white ${
                                disable ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            data-testid="edit-button"
                        >
                            Create Post
                        </button>
                    </div>
                </div>
            </PostWrapper>
        </>
    );
}
