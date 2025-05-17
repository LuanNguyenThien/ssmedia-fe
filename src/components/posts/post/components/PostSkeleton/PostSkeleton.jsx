import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import "@components/posts/post/components/PostSkeleton/PostSkeleton.scss"

const PostSkeleton = () => {
  return (
    <div className="post-skeleton" data-testid="posts-skeleton">
      <div className="post-header">
        <div className="avatar-container">
          <Skeleton circle height={40} width={40} baseColor="#EFF1F6" />
        </div>
        <div className="user-info">
          <Skeleton width={120} height={20} baseColor="#EFF1F6" />
          <Skeleton width={70} height={14} baseColor="#EFF1F6" />
        </div>
      </div>

      <div className="post-content">
        <div className="post-background">
          <Skeleton width={70} height={14} baseColor="#EFF1F6" />
          <span className="separator">&middot;</span>
          <Skeleton width={70} height={14} baseColor="#EFF1F6" />
        </div>

        <div className="post-actions">
          <Skeleton width={120} height={25} baseColor="#EFF1F6" />
          <Skeleton width={120} height={25} baseColor="#EFF1F6" />
        </div>
      </div>
    </div>
  )
}

export default PostSkeleton
