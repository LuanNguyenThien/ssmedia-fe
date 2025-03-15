import './PostButtonItem.scss';
import PropTypes from 'prop-types';

const PostButtonItem = ({ text, icon, onClick }) => {
  return (
    <div className="post-button" onClick={onClick}>
      <div className="post-button-icon">
        <img src={icon} className="" alt="" />
      </div>
      <span className="post-button-text">{text}</span>
    </div>
  );
};

PostButtonItem.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default PostButtonItem;
