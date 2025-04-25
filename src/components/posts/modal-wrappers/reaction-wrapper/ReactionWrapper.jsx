import PropTypes from 'prop-types';
import '@components/posts/modal-wrappers/reaction-wrapper/ReactionWrapper.scss';
import { RxCross2 } from "react-icons/rx";

const ReactionWrapper = ({ children, closeModal }) => {
  return (
    <>
      <div className="modal-wrapper" data-testid="modal-wrapper">
        <div className="modal-wrapper-container size-full sm:size-2/5 p-1 flex flex-col gap-4">
          <div className="modal-wrapper-container-header">
            {children[0]}
            <RxCross2 className="text-2xl hover:text-red-400 transition-all" onClick={closeModal}/>
          </div>
       
          <div className="modal-wrapper-container-body size-full" >
            {children[1]}
          </div>
        </div>
        <div className="modal-bg" data-testid="modal-bg"></div>
      </div>
    </>
  );
};

ReactionWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  closeModal: PropTypes.func
};

export default ReactionWrapper;
