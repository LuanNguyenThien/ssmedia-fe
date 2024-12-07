import './PostInputItem.scss';
import { forwardRef } from 'react';

import PropTypes from 'prop-types';
const PostInputItem = forwardRef((props, ref) => (
  <div
    className="post-input"
    onClick={() => {
      props.onClick();
      ref.current.click();
    }}
  >
    <div className="post-input-icon">
      <img src={props.icon} className="" alt="" />
    </div>
    <input
      style={{ display: 'none' }}
      id="file-input"
      autoComplete="false"
      type={props.type}
      ref={ref}
      onChange={props.handleChange}
    />
    <span className="post-input-text">{props.text}</span>
  </div>
));

PostInputItem.displayName = 'PostInputItem';

PostInputItem.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string,
  handleChange: PropTypes.func.isRequired
};

export default PostInputItem;
