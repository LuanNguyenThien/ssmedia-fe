import PropTypes from "prop-types";

const BubbleSpinner = ({ bgColor }) => {
    return (
        <>
            <div className="">
                <div
                    className="bounce1"
                    style={{ backgroundColor: `${bgColor || "#50b5ff"}` }}
                ></div>
                <div
                    className="bounce2"
                    style={{ backgroundColor: `${bgColor || "#50b5ff"}` }}
                ></div>
                <div
                    className="bounce3"
                    style={{ backgroundColor: `${bgColor || "#50b5ff"}` }}
                ></div>
            </div>
        </>
    );
};
BubbleSpinner.propTypes = {
    bgColor: PropTypes.string,
};
export default BubbleSpinner;
