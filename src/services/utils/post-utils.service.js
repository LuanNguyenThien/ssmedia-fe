import { closeModal } from '@redux/reducers/modal/modal.reducer';
import { clearPost, updatePostItem } from '@redux/reducers/post/post.reducer';
import { postService } from '@services/api/post/post.service';
import { socketService } from '@services/socket/socket.service';
import { Utils } from '@services/utils/utils.service';
import { cloneDeep, find, findIndex, remove } from 'lodash';

export class PostUtils {
  static selectBackground(
    bgColor,
    postData,
    setTextAreaBackground,
    setPostData
  ) {
    postData.bgColor = bgColor;
    setTextAreaBackground(bgColor);
    setPostData(postData);
  }

  static postInputEditable(textContent, postData, setPostData) {
    postData.post = textContent;
    setPostData(postData);
  }
  static postInputHtml(textContent, postData, setPostData) {
    postData.htmlPost = textContent;
    setPostData(postData);
  }

  static closePostModal(dispatch) {
    dispatch(closeModal());
    dispatch(clearPost());
  }

  static clearImage(
    postData,
    post,
    inputRef,
    dispatch,
    setSelectedPostImage,
    setPostImage,
    setPostData
  ) {
    postData.gifUrl = "";
    postData.image = "";
    postData.video = "";
    setSelectedPostImage(null);
    setPostImage("");
    setTimeout(() => {
      if (inputRef?.current) {
        inputRef.current.textContent = !post ? postData?.post : post;
        if (post) {
          postData.post = post;
        }
        setPostData(postData);
      }
      PostUtils.positionCursor("editable");
    });
    dispatch(
      updatePostItem({
        gifUrl: "",
        image: "",
        imgId: "",
        imgVersion: "",
        video: "",
        videoId: "",
        videoVersion: "",
      })
    );
  }

  static postInputData(imageInputRef, postData, post, setPostData) {
    setTimeout(() => {
      if (imageInputRef?.current) {
        imageInputRef.current.textContent = !post ? postData?.post : post;
        if (post) {
          postData.post = post;
        }
        setPostData(postData);
        PostUtils.positionCursor("editable");
      }
    });
  }

  static dispatchNotification(
    message,
    type,
    setApiResponse,
    setLoading,
    dispatch
  ) {
    setApiResponse(type);
    setLoading(false);
    Utils.dispatchNotification(message, type, dispatch);
  }

  static async sendPostWithFileRequest(
    type,
    postData,
    imageInputRef,
    setApiResponse,
    setLoading,
    dispatch
  ) {
    try {
      if (imageInputRef?.current) {
        imageInputRef.current.textContent = postData.post;
      }
      const response =
        type === "image"
          ? await postService.createPostWithImage(postData)
          : await postService.createPostWithVideo(postData);
      if (response) {
        setApiResponse("success");
        setLoading(false);
      }
    } catch (error) {
      PostUtils.dispatchNotification(
        error.response.data.message,
        "error",
        setApiResponse,
        setLoading,
        dispatch
      );
    }
  }

  static async sendUpdatePostWithFileRequest(
    type,
    postId,
    postData,
    setApiResponse,
    setLoading,
    dispatch
  ) {
    try {
      const response =
        type === "image"
          ? await postService.updatePostWithImage(postId, postData)
          : await postService.updatePostWithVideo(postId, postData);
      if (response) {
        PostUtils.dispatchNotification(
          response.data.message,
          "success",
          setApiResponse,
          setLoading,
          dispatch
        );
        setTimeout(() => {
          setApiResponse("success");
          setLoading(false);
        }, 3000);
        PostUtils.closePostModal(dispatch);
      }
    } catch (error) {
      PostUtils.dispatchNotification(
        error.response.data.message,
        "error",
        setApiResponse,
        setLoading,
        dispatch
      );
    }
  }

  static async sendUpdatePostRequest(
    postId,
    postData,
    setApiResponse,
    setLoading,
    dispatch
  ) {
    const response = await postService.updatePost(postId, postData);
    if (response) {
      PostUtils.dispatchNotification(
        response.data.message,
        "success",
        setApiResponse,
        setLoading,
        dispatch
      );
      setTimeout(() => {
        setApiResponse("success");
        setLoading(false);
      }, 3000);
      PostUtils.closePostModal(dispatch);
    }
  }

  static checkPrivacy(post, profile, following) {
    const isPrivate =
      post?.privacy === "Private" && post?.userId === profile?._id;
    const isPublic = post?.privacy === "Public";
    const isFollower =
      (post?.privacy === "Followers" &&
        Utils.checkIfUserIsFollowed(following, post?.userId, profile?._id)) ||
      post?.userId === profile?._id;
    return isPrivate || isPublic || isFollower;
  }

  static positionCursor(elementId) {
    const element = document.getElementById(`${elementId}`);
    const selection = window.getSelection();
    const range = document.createRange();
    selection.removeAllRanges();
    range.selectNodeContents(element);
    range.collapse(false);
    selection.addRange(range);
    element.focus();
  }

  static socketIOPost(posts, setPosts, profile) {
    posts = cloneDeep(posts);
    socketService?.socket?.on("add post", (post) => {
      if (profile._id === post.userId) {
        posts = [post, ...posts];
        setPosts(posts);
      }
    });

    socketService?.socket?.on("update post", (post) => {
      PostUtils.updateSinglePost(posts, post, setPosts);
    });

    socketService?.socket?.on("delete post", (postId) => {
      const index = findIndex(posts, (postData) => postData._id === postId);
      if (index > -1) {
        posts = cloneDeep(posts);
        remove(posts, { _id: postId });
        setPosts(posts);
      }
    });

    socketService?.socket?.on("update like", (reactionData) => {
      const postData = find(posts, (post) => post._id === reactionData?.postId);
      if (postData) {
        postData.reactions = reactionData.postReactions;
        PostUtils.updateSinglePost(posts, postData, setPosts);
      }
    });

    socketService?.socket?.on("update comment", (commentData) => {
      const postData = find(posts, (post) => post._id === commentData?.postId);
      if (postData) {
        postData.commentsCount = commentData.commentsCount;
        PostUtils.updateSinglePost(posts, postData, setPosts);
      }
    });
  }

  static updateSinglePost(posts, post, setPosts) {
    posts = cloneDeep(posts);
    const index = findIndex(posts, ["_id", post?._id]);
    if (index > -1) {
      posts.splice(index, 1, post);
      setPosts(posts);
    }
  }
}
