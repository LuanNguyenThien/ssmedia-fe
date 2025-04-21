import '@pages/social/streams/Streams.scss';
import SuggestionsSkeletons from '@components/suggestions/SuggestionsSkeleton';
import PostFormSkeleton from '@components/posts/post-form/PostFormSkeleton';
import PostSkeleton from '@components/posts/post/PostSkeleton';

const StreamsSkeleton = () => {
  return (
    <div className="streams-content col-span-full">
        <div className="streams-post px-10 bg-background-blur rounded-3xl">
          <PostFormSkeleton />
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index}>
              <PostSkeleton />
            </div>
          ))}
        </div>
        <div className="streams-suggestions">
          <SuggestionsSkeletons />
        </div>
      </div>
  );
};

export default StreamsSkeleton;
