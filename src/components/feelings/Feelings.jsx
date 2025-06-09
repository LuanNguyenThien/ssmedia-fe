import {
    addPostFeeling,
    toggleFeelingModal,
} from "@redux/reducers/modal/modal.reducer";
import { useDispatch, useSelector } from "react-redux";
import "@components/feelings/Feelings.scss";
import loadable from "@loadable/component";

const EmojiPickerComponent = loadable(
    () => import("@components/posts/comments/comment-input/EmojiPicker"),
    {
        fallback: <p id="loading">Loading...</p>,
    }
);

const Feelings = () => {
    const { feelingsIsOpen } = useSelector((state) => state.modal);
    const dispatch = useDispatch();

    const selectFeeling = (feeling) => {
        dispatch(addPostFeeling({ feeling }));
        dispatch(toggleFeelingModal(!feelingsIsOpen));
    };
    console.log(feelingsIsOpen);

    return (
        <div className="w-2xl max-w-1/2 z-10">
            <EmojiPickerComponent
                onEmojiClick={(emoji) => {
                    selectFeeling(emoji);
                }}
                onClose={() => dispatch(toggleFeelingModal(!feelingsIsOpen))}
            />
        </div>
        // <div className="feelings-container bg-black/50 rounded-lg z-50">
        //     <div className="feelings-container-picker">
        //         <p>Feelings</p>
        //         <hr />
        //         <ul className="feelings-container-picker-list">
        //             {feelingsList.map((feeling) => (
        //                 <li
        //                     data-testid="feelings-item"
        //                     className="feelings-container-picker-list-item"
        //                     key={feeling.index}
        //                     onClick={() => selectFeeling(feeling)}
        //                 >
        //                     <img src={feeling.image} alt="" />{" "}
        //                     <span>{feeling.name}</span>
        //                 </li>
        //             ))}
        //         </ul>
        //     </div>
        // </div>
    );
};
export default Feelings;
