import AddPost from "@components/posts/post-modal/post-add/AddPost";
import AddQuestion from "@components/posts/post-modal/post-add/AddQuestion";
import { useSelector } from "react-redux";

export default function ModalManager() {
    const { modalType } = useSelector((state) => state.modal);
    return (
        <>
            {modalType === "createpost" && <AddPost />}
            {modalType === "createquestion" && <AddQuestion />}
        </>
    );
}
