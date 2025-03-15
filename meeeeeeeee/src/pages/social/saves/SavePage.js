import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '@pages/social/saves/SavePage.scss';
import Suggestions from '@components/suggestions/Suggestions';
import { getUserSuggestions } from '@redux/api/suggestion';
import useEffectOnce from '@hooks/useEffectOnce';
import PostForm from '@components/posts/post-form/PostForm';
import Posts from '@components/posts/Posts';
import { Utils } from '@services/utils/utils.service';
import { postService } from '@services/api/post/post.service';
import { getPosts, getFavPosts } from '@redux/api/posts';
import { orderBy, uniqBy } from 'lodash';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { PostUtils } from '@services/utils/post-utils.service';
import useLocalStorage from '@hooks/useLocalStorage';
import { addReactions } from '@redux/reducers/post/user-post-reaction.reducer';
import { followerService } from '@services/api/followers/follower.service';

const SavePage = () => {
  const { allPosts } = useSelector((state) => state);
  const [postSaves, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const bodyRef = useRef(null);
  const bottomLineRef = useRef();
  let appPosts = useRef([]);
  const dispatch = useDispatch();
  const storedUsername = useLocalStorage('username', 'get');
  const [deleteSelectedPostId] = useLocalStorage('selectedPostId', 'delete');
  useInfiniteScroll(bodyRef, bottomLineRef, fetchPostData);
  const PAGE_SIZE = 10;

  function fetchPostData() {
    let pageNum = currentPage;
    if (currentPage <= Math.round(totalPostsCount / PAGE_SIZE)) {
      pageNum += 1;
      setCurrentPage(pageNum);
      getAllFavPosts();
    }
  }

  const getAllFavPosts = async () => {
    try {
      const response = await postService.getAllFavPosts(currentPage);
      if (response.data.favposts.length >= 0) {
        appPosts = [...postSaves, ...response.data.favposts];
        const allPosts = uniqBy(appPosts, '_id');
        const orderedPosts = orderBy(allPosts, ['createdAt'], ['desc']);
        setPosts(orderedPosts);
      }
      setLoading(false);
    } catch (error) {
      Utils.dispatchNotification(error, 'error', dispatch);
    }
  };

  const getUserFollowing = async () => {
    try {
      const response = await followerService.getUserFollowing();
      setFollowing(response.data.following);
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  const getReactionsByUsername = async () => {
    try {
      const response = await postService.getReactionsByUsername(storedUsername);
      dispatch(addReactions(response.data.reactions));
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  useEffectOnce(() => {
    getUserFollowing();
    getReactionsByUsername();
    deleteSelectedPostId();
    getAllFavPosts();
    // dispatch(getFavPosts());
    // dispatch(getUserSuggestions());
  });

  // useEffect(() => {
  //   setLoading(allPosts?.isLoading);
  //   const orderedPosts = orderBy(allPosts?.posts, ['createdAt'], ['desc']);
  //   setPosts(orderedPosts);
  //   setTotalPostsCount(allPosts?.totalPostsCount);
  // }, [allPosts]);

  // useEffect(() => {
  //   PostUtils.socketIOPost(postSaves, setPosts);
  // }, [postSaves]);

  return (
    <div className="saves" data-testid="saves">
      {(loading || postSaves.length > 0) && (
        <div className="saves-content">
          <div className="saves-post" ref={bodyRef} >
            <Posts allPosts={postSaves} postsLoading={loading} userFollowing={following} />
            <div ref={bottomLineRef} style={{ marginBottom: '60px', height: '60px' }}></div>
          </div>
        </div>
      )}
      {!loading && postSaves.length === 0 && (
        <div className="empty-page" data-testid="empty-page" ref={bodyRef}>
          No post saved available
          <div ref={bottomLineRef} ></div>
        </div>
      )}
    </div>
  );
};

export default SavePage;
