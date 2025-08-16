import { useSelector } from 'react-redux';
import EditPost from '@components/posts/post-modal/post-edit/EditPost1';
import PostTab from '@components/posts/post-modal/post-add/PostTab';

const ModalContainer = () => {
  const { isOpen, type } = useSelector((state) => state.modal);

  if (!isOpen) return null;

  return (
    <>
      {type === 'edit' && <EditPost />}
      {type === 'add' && <PostTab />}
    </>
  );
};

export default ModalContainer; 