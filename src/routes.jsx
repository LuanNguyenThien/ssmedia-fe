import { AuthTabs, ForgotPassword, ResetPassword } from "@pages/auth";
import Error from "@pages/error/Error";
import ProtectedRoute from "@pages/ProtectedRoute";
import { useRoutes } from "react-router-dom";
import { Suspense, lazy } from "react";
import StreamsSkeleton from "@pages/social/streams/StreamsSkeleton";
import NotificationSkeleton from "@pages/social/notifications/NotificationSkeleton";
import CardSkeleton from "@components/card-element/CardSkeleton";
import PhotoSkeleton from "@pages/social/photos/PhotoSkeleton";
import ProfileSkeleton from "@pages/social/profile/ProfileSkeleton";
import ChatSkeleton from "@pages/social/chat/ChatSkeleton";
import VideoSkeleton from "@pages/social/videos/VideoSkeleton";
import PostSkeleton from "@components/posts/post/PostSkeleton";
import { ChakraProvider } from "@chakra-ui/react";
import Group from "@pages/social/groups/group";

const Social = lazy(() => import("@pages/social/Social"));
const Chat = lazy(() => import("@pages/social/chat/Chat"));
// const Followers = lazy(() => import("@pages/social/followers/Followers"));
// const Following = lazy(() => import("@pages/social/following/Following"));
const Notification = lazy(() =>
    import("@pages/social/notifications/Notification")
);
const People = lazy(() => import("@pages/social/people/People"));
const Photos = lazy(() => import("@pages/social/photos/Photos"));
const Videos = lazy(() => import("@pages/social/videos/Videos"));
const Profile = lazy(() => import("@pages/social/profile/Profile"));
const Streams = lazy(() => import("@pages/social/streams/Streams"));
const PostDetail = lazy(() => import("@pages/social/streams/PostDetail"));
const SavePage = lazy(() => import("@pages/social/saves/SavePage"));
const SearchPage = lazy(() => import("@pages/social/search/SearchPage"));
const DashBoard = lazy(() => import("@pages/admin/dashboard/dashboard"));
export const AppRouter = () => {
    const elements = useRoutes([
        {
            path: "/",
            element: (
                <ChakraProvider>
                    <AuthTabs />
                </ChakraProvider>
            ),
        },
        {
            path: "/forgot-password",
            element: (
                <ChakraProvider>
                    <ForgotPassword />
                </ChakraProvider>
            ),
        },
        {
            path: "/reset-password",
            element: <ResetPassword />,
        },
        {
            path: "/app/social",
            element: (
                <ProtectedRoute>
                    <Social />
                </ProtectedRoute>
            ),
            children: [
                {
                    path: "streams",
                    element: (
                        <Suspense fallback={<StreamsSkeleton />}>
                            <Streams />
                        </Suspense>
                    ),
                },
                {
                    path: "search",
                    element: (
                        <Suspense fallback={<StreamsSkeleton />}>
                            <SearchPage />
                        </Suspense>
                    ),
                },
                {
                    path: "save",
                    element: (
                        <Suspense fallback={<SavePage />}>
                            <SavePage />
                        </Suspense>
                    ),
                },
                {
                    path: "post/:postId",
                    element: (
                        <Suspense fallback={<PostSkeleton />}>
                            <PostDetail />
                        </Suspense>
                    ),
                },
                {
                    path: "chat/messages",
                    element: (
                        <Suspense fallback={<ChatSkeleton />}>
                            <Chat />
                        </Suspense>
                    ),
                },
                {
                    path: "people",
                    element: (
                        <Suspense fallback={<People />}>
                            <People />
                        </Suspense>
                    ),
                },
                // {
                //     path: "followers",
                //     element: (
                //         <Suspense fallback={<CardSkeleton />}>
                //             <Followers />
                //         </Suspense>
                //     ),
                // },
                // {
                //     path: "following",
                //     element: (
                //         <Suspense fallback={<CardSkeleton />}>
                //             <Following />
                //         </Suspense>
                //     ),
                // },
                {
                    path: "photos",
                    element: (
                        <Suspense fallback={<PhotoSkeleton />}>
                            <Photos />
                        </Suspense>
                    ),
                },
                {
                    path: "videos",
                    element: (
                        <Suspense fallback={<VideoSkeleton />}>
                            <Videos />
                        </Suspense>
                    ),
                },
                {
                    path: "notifications",
                    element: (
                        <Suspense fallback={<NotificationSkeleton />}>
                            <Notification />
                        </Suspense>
                    ),
                },
                {
                    path: "groups",
                    element: (
                        <Suspense>
                            <Group />
                        </Suspense>
                    ),
                },
                {
                    path: "profile/:username",
                    element: (
                        <Suspense fallback={<ProfileSkeleton />}>
                            <Profile />
                        </Suspense>
                    ),
                },
            ],
        },
        {
            path: "/admin",
            element: (
                <ChakraProvider>
                    <DashBoard />
                </ChakraProvider>
            ),
        },
        {
            path: "*",
            element: <Error />,
        },
    ]);

    return elements;
};
