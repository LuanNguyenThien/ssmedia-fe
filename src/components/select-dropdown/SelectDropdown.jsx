import PropTypes from "prop-types";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { updatePostItem } from "@redux/reducers/post/post.reducer";
import "@components/select-dropdown/SelectDropdown.scss";

const SelectDropdown = ({ isActive, setSelectedItem, items = [] }) => {
    const dropdownRef = useRef(null);
    const dispatch = useDispatch();
    const selectItem = (item) => {
        setSelectedItem(item);
        dispatch(updatePostItem({ privacy: item.topText }));
    };

    return (
        <div className="menu-container" data-testid="menu-container">
            <nav
                ref={dropdownRef}
                className={`menu ${isActive ? "active" : "inactive"}`}
            >
                <ul className="flex flex-col p-2">
                    {items.map((item, index) => (
                        <li
                            data-testid="select-dropdown"
                            key={index}
                            onClick={() => selectItem(item)}
                            className="gap-2"
                        >
                            <div className="menu-icon">{item.icon()}</div>
                            <div className="menu-text">
                                <div className="menu-text-header">
                                    {item.topText}
                                </div>
                                <div className="sub-header">{item.subText}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

SelectDropdown.propTypes = {
    isActive: PropTypes.bool,
    setSelectedItem: PropTypes.func,
    items: PropTypes.array,
};

export default SelectDropdown;
