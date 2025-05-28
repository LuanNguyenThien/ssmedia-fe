import {
    FaGlobe,
    FaHeart,
    FaImages,
    FaKey,
    FaLock,
    FaRegBell,
    FaUser,
    FaUserCheck,
} from "react-icons/fa";
import { feelings, reactions, icons } from "@/assets/assets";
import React from "react";

export const bgColors = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#00bcd4",
    "#cddc39",
    "#ffffff"
];

export const avatarColors = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
    "#795548",
    "#9e9e9e",
    "#607d8b",
];

export const sideBarItems = [
    {
        index: 1,
        name: "Streams",
        url: "/app/social/streams",
        iconName: icons.home,
    },
    {
        index: 2,
        name: "Chat",
        url: "/app/social/chat/messages",
        iconName: icons.chats,
    },
    {
        index: 3,
        name: "Group",
        url: "/app/social/groups",
        iconName: icons.groups,
    },
    {
        index: 4,
        name: "People",
        url: "/app/social/people",
        iconName: icons.people,
    },
    {
        index: 5,
        name: "Profile",
        url: "/app/social/profile",
        iconName: icons.profile,
    },
    {
        index: 6,
        name: "Save",
        url: "/app/social/save",
        iconName: icons.saves,
    },
];

export const feelingsList = [
    { index: 0, name: "happy", image: feelings.happyFeelings },
    { index: 1, name: "excited", image: feelings.excited },
    { index: 2, name: "blessed", image: feelings.blessed },
    { index: 3, name: "loved", image: feelings.loved },
];

export const privacyList = [
    {
        topText: "Public",
        subText: "Anyone on Chatty",
        icon: () =>
            React.createElement(FaGlobe, { className: "globe-icon globe" }),
    },
    {
        topText: "Followers",
        subText: "Your followers on Chatty",
        icon: () =>
            React.createElement(FaUserCheck, { className: "globe-icon globe" }),
    },
    {
        topText: "Private",
        subText: "For you only",
        icon: () =>
            React.createElement(FaLock, { className: "globe-icon globe" }),
    },
];

export const reactionsMap = {
    like: reactions.like,
    love: reactions.love,
    angry: reactions.angry,
    happy: reactions.happy,
    sad: reactions.sad,
    wow: reactions.wow,
};

export const reactionsColor = {
    like: "#50b5ff",
    love: "#f33e58",
    angry: "#e9710f",
    happy: "#f7b124",
    sad: "#f7b124",
    wow: "#f7b124",
};

export const emptyPostData = {
    _id: "",
    post: "",
    bgColor: "",
    privacy: "",
    feelings: "",
    gifUrl: "",
    profilePicture: "",
    image: "",
    userId: "",
    username: "",
    email: "",
    avatarColor: "",
    commentsCount: "",
    reactions: [],
    imgVersion: "",
    imgId: "",
    createdAt: "",
    video: "",
};

export const notificationItems = [
    {
        index: 0,
        title: "Direct Messages",
        description: "New direct messages notifications.",
        toggle: true,
        type: "messages",
    },
    {
        index: 1,
        title: "Follows",
        description: "New followers notifications.",
        toggle: true,
        type: "follows",
    },
    {
        index: 2,
        title: "Post Reactions",
        description: "New reactions for your posts notifications.",
        toggle: true,
        type: "reactions",
    },
    {
        index: 3,
        title: "Comments",
        description: "New comments for your posts notifications.",
        toggle: true,
        type: "comments",
    },
];

export const tabItems = (showPassword, showNotification) => [
    {
        key: "Timeline",
        show: true,
        icon: React.createElement(FaUser, {
            className: "banner-nav-item-name-icon",
        }),
    },
    {
        key: "Followers",
        show: true,
        icon: React.createElement(FaHeart, {
            className: "banner-nav-item-name-icon",
        }),
    },
    {
        key: "Gallery",
        show: true,
        icon: React.createElement(FaImages, {
            className: "banner-nav-item-name-icon",
        }),
    },
    {
        key: "Change Password",
        show: showPassword,
        icon: React.createElement(FaKey, {
            className: "banner-nav-item-name-icon",
        }),
    },
    {
        key: "Notifications",
        show: showNotification,
        icon: React.createElement(FaRegBell, {
            className: "banner-nav-item-name-icon",
        }),
    },
];
