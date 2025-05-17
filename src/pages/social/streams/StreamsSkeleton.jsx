import "@pages/social/streams/Streams.scss";
import SuggestionsSkeletons from "@components/suggestions/SuggestionsSkeleton";
import PostFormSkeleton from "@components/posts/post-form/PostFormSkeleton";
import PostSkeleton from "@/components/posts/post/components/PostSkeleton/PostSkeleton";

const StreamsSkeleton = () => {
    return (
        <div className="streams-content col-span-full ">
            <div className="streams-post px-2 sm:px-6 bg-background-blur rounded-3xl sm:pt-6">
                <PostFormSkeleton />
                {[1, 2, 3, 4, 5, 6].map((index) => (
                    <div key={index}>
                        <PostSkeleton />
                    </div>
                ))}
            </div>
            <div className="streams-suggestions pl-2">
                <SuggestionsSkeletons />
            </div>
        </div>
    );
};

export default StreamsSkeleton;
