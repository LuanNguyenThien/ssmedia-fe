// import { AuthTabs, ForgotPassword, ResetPassword } from '@pages/auth';
// import Error from '@pages/error/Error';
// import ProtectedRoute from '@pages/ProtectedRoute';
// import { useRoutes } from 'react-router-dom';
// import { Suspense, lazy } from 'react';
// import StreamsSkeleton from '@pages/social/streams/StreamsSkeleton';
// import NotificationSkeleton from '@pages/social/notifications/NotificationSkeleton';
// import CardSkeleton from '@components/card-element/CardSkeleton';
// import PhotoSkeleton from '@pages/social/photos/PhotoSkeleton';
// import ProfileSkeleton from '@pages/social/profile/ProfileSkeleton';
// import ChatSkeleton from '@pages/social/chat/ChatSkeleton';
// import VideoSkeleton from '@pages/social/videos/VideoSkeleton';
// import { ChakraProvider } from '@chakra-ui/react';
// import Group from '@pages/social/groups/group';

// const Social = lazy(() => import('@pages/social/Social'));
// const Chat = lazy(() => import('@pages/social/chat/Chat'));
// const Followers = lazy(() => import('@pages/social/followers/Followers'));
// const Following = lazy(() => import('@pages/social/following/Following'));
// const Notification = lazy(() => import('@pages/social/notifications/Notification'));
// const People = lazy(() => import('@pages/social/people/People'));
// const Photos = lazy(() => import('@pages/social/photos/Photos'));
// const Videos = lazy(() => import('@pages/social/videos/Videos'));
// const Profile = lazy(() => import('@pages/social/profile/Profile'));
// const ProfileUser = lazy(() => import('@pages/social/profile/ProfileUser'));
// const Streams = lazy(() => import('@pages/social/streams/Streams'));
// const PostDetail = lazy(() => import('@pages/social/streams/PostDetail'));
// const SavePage = lazy(() => import('@pages/social/saves/SavePage'));
// const SearchPage = lazy(() => import('@pages/social/search/SearchPage'));



// export const AppRouter = () => {
//   const elements = useRoutes([
//     {
//       path: "/",
//       element: (
//         <ChakraProvider>
//           <AuthTabs />
//         </ChakraProvider>
//       ),
//     },
//     {
//       path: "/forgot-password",

//       element: (
//         <ChakraProvider>
//           <ForgotPassword />
//         </ChakraProvider>
//       ),
//     },
//     {
//       path: "/reset-password",
//       element: <ResetPassword />,
//     },
//     {
//       path: "/app/social",
//       element: (
//         <ProtectedRoute>
//           <Social />
//         </ProtectedRoute>
//       ),
//       children: [
//         {
//           path: "streams",
//           element: (
//             <Suspense fallback={<StreamsSkeleton />}>
//               <Streams />
//             </Suspense>
//           ),
//         },
//         {
//           path: "search",
//           element: (
//             <Suspense fallback={<StreamsSkeleton />}>
//               <SearchPage />
//             </Suspense>
//           ),
//         },
//         {
//           path: "save",
//           element: (
//             <Suspense fallback={<StreamsSkeleton />}>
//               <SavePage />
//             </Suspense>
//           ),
//         },
//         {
//           path: "post/:postId",
//           element: (
//             <Suspense fallback={<StreamsSkeleton />}>
//               <PostDetail />
//             </Suspense>
//           ),
//         },
//         {
//           path: "chat/messages",
//           element: (
//             <ChakraProvider>
//               <Suspense fallback={<ChatSkeleton />}>
//                 <Chat />
//               </Suspense>
//             </ChakraProvider>
//           ),
//         },
//         {
//           path: "people",
//           element: (
//             <ChakraProvider>
//               <Suspense fallback={<CardSkeleton />}>
//                 <People />
//               </Suspense>
//             </ChakraProvider>
//           ),
//         },
//         {
//           path: "followers",
//           element: (
//             <ChakraProvider>
//               <Suspense fallback={<CardSkeleton />}>
//                 <Followers />
//               </Suspense>
//             </ChakraProvider>
//           ),
//         },
//         {
//           path: "following",
//           element: (
//             <ChakraProvider>
//               <Suspense fallback={<CardSkeleton />}>
//                 <Following />
//               </Suspense>
//             </ChakraProvider>
//           ),
//         },
//         {
//           path: "photos",
//           element: (
//             <Suspense fallback={<PhotoSkeleton />}>
//               <Photos />
//             </Suspense>
//           ),
//         },
//         {
//           path: "videos",
//           element: (
//             <Suspense fallback={<VideoSkeleton />}>
//               <Videos />
//             </Suspense>
//           ),
//         },
//         {
//           path: "notifications",
//           element: (
//             <Suspense fallback={<NotificationSkeleton />}>
//               <Notification />
//             </Suspense>
//           ),
//         },
//         {
//           path: "groups",
//           element: (
//             <Suspense>
//               <Group />
//             </Suspense>
//           ),
//         },
//         {
//           path: "profile/:username",
//           element: (
//             <Suspense fallback={<ProfileSkeleton />}>
//               <Profile />
//             </Suspense>
//           ),
//         },
//         {
//           path: "profileUser/:username",
//           element: (
//             <Suspense fallback={<ProfileSkeleton />}>
//               <ProfileUser />
//             </Suspense>
//           ),
//         },
//       ],
//     },
    
//     {
//       path: "*",
//       element: <Error />,
//     },
//   ]);

//   return elements;
// };

import { AuthTabs, ForgotPassword, ResetPassword } from "@pages/auth";
import Error from "@pages/error/Error";
import ProtectedRoute from "@pages/ProtectedRoute";
import ProtectedAdminRoute from "@pages/ProtectedAdminRoute";
import { useRoutes } from "react-router-dom";
import { Suspense, lazy } from "react";
import StreamsSkeleton from "@pages/social/streams/StreamsSkeleton";
import NotificationSkeleton from "@pages/social/notifications/NotificationSkeleton";
import PhotoSkeleton from "@pages/social/photos/PhotoSkeleton";
import ProfileSkeleton from "@pages/social/profile/ProfileSkeleton";
import ChatSkeleton from "@pages/social/chat/ChatSkeleton";
import VideoSkeleton from "@pages/social/videos/VideoSkeleton";
import PostSkeleton from "@/components/posts/post/components/PostSkeleton/PostSkeleton";
import { ChakraProvider } from "@chakra-ui/react";
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
const GroupPage = lazy(() => import("@pages/social/groups/group"));
const SettingPage = lazy(() => import("@pages/social/setting/Setting"));

const AdminLayout = lazy(() => import("@pages/admin/layout/AppLayout"));
const BasicTables = lazy(() => import("@pages/admin/pages/TablesUser/BasicTables"));
const ReportUserTable = lazy(() =>
  import("@pages/admin/pages/TablesUser/ReportUserTable")
);
const BanUserTable = lazy(() =>
  import("@pages/admin/pages/TablesUser/BanUserTable")
);

const AppealTable = lazy(() =>
  import("@pages/admin/pages/TablesUser/AppealTable")
);

const ReportPostTable = lazy(() =>
  import("@pages/admin/pages/TablesPost/ReportPostTable")
);
const HirePostTable = lazy(() =>
  import("@pages/admin/pages/TablesPost/HirePostTable")
);

const BarChart = lazy(() =>
  import("@pages/admin/pages/Charts/BarChart")
);

const UserProfiles = lazy(() =>
  import("@pages/admin/pages/UserProfiles") );

const Home = lazy(() =>
  import("@pages/admin/pages/Dashboard/Home") );

const LineChart = lazy(() => import("@pages/admin/pages/Charts/LineChart"));

const SignIn = lazy(() => import("@pages/admin/pages/AuthPages/SignIn"));
const SignUp = lazy(() => import("@pages/admin/pages/AuthPages/SignUp"));

const Checkpoint = lazy(() => import("@pages/social/streams/report"));
const IssueReport = lazy(() => import("@pages/social/streams/ReportIssue"));
const AppealConfirmation = lazy(() =>
  import("@pages/social/streams/approval")
);

const withSuspense = (Component) => (
  <Suspense fallback={<div>Loading...</div>}>{Component}</Suspense>
);
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
      path: "/checkpoint",
      element: <Checkpoint />,
    },
    {
      path: "/issua",
      element: <IssueReport />,
    },
    {
      path: "/aarovel",
      element: <AppealConfirmation />,
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
            <Suspense fallback={<SearchPage />}>
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
              <GroupPage />
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
        {
            path: "setting/:username",
            element: (
                <Suspense>
                    <SettingPage />
                </Suspense>
            ),
        },
      ],
    },
    {
      path: "/admin/signup",
      element: <SignUp />,
    },
    {
      path: "/admin/signin",
      element: <SignIn />,
    },
    {
      path: "/admin",
      element: (
        <ProtectedAdminRoute>
          <AdminLayout />
        </ProtectedAdminRoute>
      ),
      children: [
        {
          path: "",
          element: withSuspense(<Home />),
        },
        {
          path: "user",
          element: withSuspense(<BasicTables />),
        },
        {
          path: "reportuser",
          element: withSuspense(<ReportUserTable />),
        },
        {
          path: "hideuser",
          element: withSuspense(<BanUserTable />),
        },
        {
          path: "appeal",
          element: withSuspense(<AppealTable />),
        },
        {
          path: "reportpost",
          element: withSuspense(<ReportPostTable />),
        },
        {
          path: "hirepost",
          element: withSuspense(<HirePostTable />),
        },
        {
          path: "Posts",
          element: withSuspense(<BarChart />),
        },
        {
          path: "Users",
          element: withSuspense(<LineChart />),
        },
        {
          path: "profile",
          element: withSuspense(<UserProfiles />),
        },
      ],
    },
    {
      path: "*",
      element: <Error />,
    },
  ]);

  return elements;
};