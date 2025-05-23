export const groups = [
    { id: 1, name: "Design Enthusiasts", members: 128, isJoined: true },
    { id: 2, name: "Web Development", members: 234, isJoined: true },
    { id: 3, name: "Digital Marketing", members: 95, isJoined: false },
    { id: 4, name: "Photography Club", members: 187, isJoined: true },
    { id: 5, name: "AI & Machine Learning", members: 156, isJoined: false },
    { id: 6, name: "React Developers", members: 342, isJoined: true },
    { id: 7, name: "UI/UX Designers", members: 267, isJoined: false },
    { id: 8, name: "Startup Founders", members: 89, isJoined: false },
    { id: 9, name: "Mobile App Development", members: 198, isJoined: true },
    { id: 10, name: "Data Science", members: 145, isJoined: false },
];

export const mockGroupsInformation  = {
    1: {
        id: "1",
        name: "Mathematics Community",
        groupAvatar:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuPpT9XBckqEx3-YtzMjGOnLCgZcWKpuWuJQ&s",
        description:
            "A place to share knowledge and discuss mathematics for all ages",
        shortDescription: "Mathematics learning community",
        category: "Education",
        tags: ["math", "education", "learning"],
        location: "Vietnam",
        visibility: "public",
        memberCount: 11,
        profilePicture: null,
        coverImage: null,
        privacy: {
            whoCanJoin: "anyone",
            whoCanPost: "members",
            whoCanSeeMembers: "everyone",
            whoCanSeePosts: "everyone",
        },
        contentSettings: {
            allowMemberPosts: true,
            allowEvents: true,
            allowPhotos: true,
            allowVideos: true,
            requirePostApproval: false,
        },
        rules: [
            "Be respectful to all members",
            "No spam or self-promotion",
            "Stay on topic - mathematics only",
            "No homework answers without explanation",
        ],
        admins: ["admin1", "admin2"],
        moderators: ["mod1", "mod2"],
        createdAt: "2023-01-15",
        isVerified: true,
        statistics: {
            totalPosts: 1234,
            totalMembers: 11243,
            activeMembers: 892,
            growthRate: 15.2,
        },
    },
    2: {
        id: "2",
        name: "Web Development Masters",
        groupAvatar:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuPpT9XBckqEx3-YtzMjGOnLCgZcWKpuWuJQ&s",

        description: "Advanced web development techniques and best practices",
        shortDescription: "Advanced web development community",
        category: "Technology",
        tags: ["web", "development", "programming"],
        location: "Global",
        visibility: "private",
        memberCount: 567,
        profilePicture: null,
        coverImage: null,
        privacy: {
            whoCanJoin: "admin_approval",
            whoCanPost: "members",
            whoCanSeeMembers: "members",
            whoCanSeePosts: "members",
        },
        contentSettings: {
            allowMemberPosts: true,
            allowEvents: true,
            allowPhotos: true,
            allowVideos: true,
            requirePostApproval: false,
        },
        rules: [
            "Share knowledge generously",
            "No beginner questions - intermediate+ only",
            "Code reviews welcome",
            "Professional discussions only",
        ],
        admins: ["admin1"],
        moderators: ["mod1"],
        createdAt: "2023-03-20",
        isVerified: false,
        statistics: {
            totalPosts: 456,
            totalMembers: 567,
            activeMembers: 234,
            growthRate: 8.5,
        },
    },
    3: {
        id: "3",
        name: "Secret Investors Club",
        groupAvatar:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuPpT9XBckqEx3-YtzMjGOnLCgZcWKpuWuJQ&s",
        description: "Exclusive investment strategies and market insights",
        shortDescription: "Exclusive investment community",
        category: "Finance",
        tags: ["investment", "finance", "trading"],
        location: "Private",
        visibility: "public",
        memberCount: 89,
        profilePicture: null,
        coverImage: null,
        privacy: {
            whoCanJoin: "invite_only",
            whoCanPost: "members",
            whoCanSeeMembers: "members",
            whoCanSeePosts: "members",
        },
        contentSettings: {
            allowMemberPosts: true,
            allowEvents: false,
            allowPhotos: false,
            allowVideos: true,
            requirePostApproval: true,
        },
        rules: [
            "Confidentiality is paramount",
            "No sharing outside the group",
            "Verified members only",
            "Professional conduct required",
        ],
        admins: ["admin1"],
        moderators: [],
        createdAt: "2023-06-10",
        isVerified: true,
        statistics: {
            totalPosts: 234,
            totalMembers: 89,
            activeMembers: 67,
            growthRate: 3.2,
        },
    },
};

export const mockMembershipStatus = {
    1: "member", // User is a member of group 1
    2: "pending", // User has pending request for group 2
    3: "not_member", // User is not a member of group 3
};
