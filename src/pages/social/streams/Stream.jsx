import Streams from "./Streams";
import StreamsSkeleton from "./StreamsSkeleton";

// Stream component: shows skeleton while posts are loading, otherwise shows Streams
const Stream = () => {
    // // Use Redux loading state for posts
    // const isLoading = useSelector((state) => state.allPosts?.isLoading);

    // if (isLoading) {
    //     return <StreamsSkeleton />;
    // }
    return <Streams />;
};

export default Stream;
