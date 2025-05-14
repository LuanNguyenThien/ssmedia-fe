import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '@components/spinner/Spinner';
import '@pages/social/streams/Streams.scss';
import Suggestions from '@components/suggestions/Suggestions1';
import { getUserSuggestions } from '@redux/api/suggestion';
import useEffectOnce from '@hooks/useEffectOnce';
import PostForm from '@components/posts/post-form/PostForm';
import Posts from '@components/posts/Posts';
import { Utils } from '@services/utils/utils.service';
import { postService } from '@services/api/post/post.service';
import { getPosts } from '@redux/api/posts';
import { uniqBy } from 'lodash';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { PostUtils } from '@services/utils/post-utils.service';
import useLocalStorage from '@hooks/useLocalStorage';
import { addReactions } from '@redux/reducers/post/user-post-reaction.reducer';
import { followerService } from '@services/api/followers/follower.service';

const Streams = () => {
  const { allPosts } = useSelector((state) => state);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(2);
  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const bodyRef = useRef(null);
  const bottomLineRef = useRef();
  const appPosts = useRef([]);
  const dispatch = useDispatch();
  const storedUsername = useLocalStorage('username', 'get');
  const [deleteSelectedPostId] = useLocalStorage('selectedPostId', 'delete');
  useInfiniteScroll(bodyRef, bottomLineRef, fetchPostData);
  const PAGE_SIZE = 10;
  const [loadingMore, setLoadingMore] = useState(false);
  const { profile } = useSelector((state) => state.user);

  function fetchPostData() {
    if (loadingMore || currentPage > Math.ceil(totalPostsCount / PAGE_SIZE)) return;

    setLoadingMore(true);
    getAllPosts().finally(() => setLoadingMore(false));
  }

  const getAllPosts = async () => {
    try {
      const response = await postService.getAllPosts(currentPage);
      if (response.data.posts.length > 0) {
        appPosts.current = [...posts, ...response.data.posts];
        const allPosts = uniqBy(appPosts.current, '_id');
        // const orderedPosts = orderBy(allPosts, ['createdAt'], ['desc']);
        setPosts(allPosts);
        setCurrentPage((prevPage) => prevPage + 1); // Increment page only when data is valid
      }
      setLoading(false);
    } catch (error) {
      Utils.dispatchNotification(error.response?.data?.message || 'Failed to load posts.', 'error', dispatch);
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
    dispatch(getPosts());
    dispatch(getUserSuggestions());
  });

  useEffect(() => {
    setLoading(allPosts?.isLoading);
    // const orderedPosts = orderBy(allPosts?.posts, ['createdAt'], ['desc']);
    setPosts(allPosts?.posts);
    setTotalPostsCount(allPosts?.totalPostsCount);
  }, [allPosts]);

  useEffect(() => {
    PostUtils.socketIOPost(posts, setPosts, profile);
  }, [posts, profile]);

  useEffect(() => {
    const viewportHeight = window.innerHeight;
    console.log('Viewport Height:', viewportHeight);
    const headerDesktopElement = document.querySelector('div.header-desktop');
    const headerElement = document.querySelector('div.header-mb');
    const footerElement = document.querySelector('div.footer-mb');

    document.documentElement.style.setProperty('--root-height', `${viewportHeight}px`);
    if (headerElement && footerElement) {
      const headerHeight = headerElement.offsetHeight;
      const footerHeight = footerElement.offsetHeight;
      const totalHeight = headerHeight + footerHeight;
      document.documentElement.style.setProperty('--header-footer-height', `${totalHeight}px`);
    } else {
      const headerHeight = headerDesktopElement.offsetHeight;
      const footerHeight = 0; // Assuming no footer in this case
      const totalHeight = headerHeight + footerHeight;
      document.documentElement.style.setProperty('--header-footer-height', `${totalHeight}px`);
    }
  }, []);

  return (
    <div className="streams-content col-span-full">
      <div
        className="streams-post px-10 bg-background-blur rounded-3xl"
        ref={bodyRef}
      >
        <PostForm />
        <Posts
          allPosts={posts}
          postsLoading={loading}
          userFollowing={following}
        />
        <div>
          {currentPage > Math.ceil(totalPostsCount / PAGE_SIZE) && (
            <div className="no-chat" data-testid="no-chat">
              You have read all posts.
            </div>
          )}
        </div>
        <div
          ref={bottomLineRef}
          style={{ marginBottom: "20px", height: "30px" }}
        >
          {loadingMore && <Spinner />}
        </div>
      </div>
      <div className="streams-suggestions">
        <Suggestions />
      </div>
    </div>
  );
};

export default Streams;
