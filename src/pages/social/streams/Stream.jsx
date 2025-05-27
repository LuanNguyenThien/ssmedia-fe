import { useSelector } from "react-redux";
import Streams from "./Streams";
import StreamsSkeleton from "./StreamsSkeleton";
import PersonalizeModal from "@/components/personalize/PersonalizeModal";

// Stream component: shows skeleton while posts are loading, otherwise shows Streams
const Stream = () => {
    const { profile } = useSelector((state) => state.user);
    // // Use Redux loading state for posts
    // const isLoading = useSelector((state) => state.allPosts?.isLoading);

    // if (isLoading) {
    //     return <StreamsSkeleton />;
    // }
    return (
        <>
            {profile?.user_hobbies?.subject && <PersonalizeModal />}
            <Streams />
        </>
    );
};

export default Stream;
