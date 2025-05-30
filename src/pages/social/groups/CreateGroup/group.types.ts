export interface GroupMember {
    userId: string;
    username: string;
    profilePicture?: string;
    role: "admin" | "moderator" | "member";
    joinedAt: Date;
    lastActive?: Date;
    isActive: boolean;
}

export interface GroupPrivacy {
    whoCanJoin: "anyone" | "invite_only" | "admin_approval";
    whoCanPost: "members" | "admins_only" | "moderators_and_admins";
    whoCanSeeMembers: "everyone" | "members" | "admins_only";
    whoCanSeePosts: "everyone" | "members" | "admins_only";
    whoCanInvite: "everyone" | "members" | "admins_only";
    whoCanCreateEvents: "members" | "moderators_and_admins" | "admins_only";
}

export interface GroupContentSettings {
    allowMemberPosts: boolean;
    allowEvents: boolean;
    allowPhotos: boolean;
    allowVideos: boolean;
    allowLinks: boolean;
    allowPolls: boolean;
    requirePostApproval: boolean;
    requireMemberApproval: boolean;
    autoModeration: boolean;
    allowDiscussions: boolean;
    allowAnnouncements: boolean;
}

export interface GroupStatistics {
    totalMembers: number;
    activeMembers: number; // members active in last 30 days
    totalPosts: number;
    totalComments: number;
    totalLikes: number;
    totalShares: number;
    totalEvents: number;
    growthRate: number; // percentage growth in last month
    engagementRate: number; // posts/comments per member
}

export interface GroupRule {
    id: string;
    title: string;
    description: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface GroupAnnouncement {
    id: string;
    title: string;
    content: string;
    authorId: string;
    isPinned: boolean;
    createdAt: Date;
    updatedAt: Date;
    expiresAt?: Date;
}

export interface GroupAnalytics {
    dailyActivity: {
        date: string;
        posts: number;
        comments: number;
        members: number;
    }[];
    topContributors: {
        userId: string;
        username: string;
        postCount: number;
        commentCount: number;
    }[];
    popularTags: { tag: string; count: number }[];
    memberDemographics: {
        ageGroups: { range: string; count: number }[];
        locations: { country: string; count: number }[];
        joinSources: { source: string; count: number }[];
    };
    contentMetrics: {
        avgPostsPerDay: number;
        avgCommentsPerPost: number;
        avgLikesPerPost: number;
        mostActiveHours: number[];
        mostActiveDays: string[];
    };
}

export interface Group {
    // Basic Information
    id: string;
    name: string;
    description: string;
    shortDescription?: string;
    category: string;
    subcategory?: string;
    tags: string[];
    location?: string;
    website?: string;
    email?: string;
    phone?: string;

    // Media
    groupAvatar?: string;
    groupCover?: string;
    gallery?: string[]; // array of image URLs
    videos?: string[]; // array of video URLs

    // Privacy & Visibility
    visibility: "public" | "private" | "secret";
    privacy: GroupPrivacy;
    isVerified: boolean;
    isFeatured: boolean;
    isArchived: boolean;
    isDeleted: boolean;

    // Content Settings
    contentSettings: GroupContentSettings;

    // Membership
    members: GroupMember[];
    memberCount: number;
    memberLimit?: number; // null/undefined = unlimited
    pendingRequests: string[]; // user IDs waiting for approval
    invitations: string[]; // user IDs with pending invitations
    bannedUsers: string[]; // user IDs that are banned

    // Administrative
    createdBy: string; // user ID of creator
    admins: string[]; // user IDs of admins
    moderators: string[]; // user IDs of moderators
    createdAt: Date;
    updatedAt: Date;
    lastActivity: Date;

    // Rules & Guidelines
    rules: GroupRule[];
    guidelines?: string;
    welcomeMessage?: string;

    // Features
    hasEvents: boolean;
    hasAnnouncements: boolean;
    hasPolls: boolean;
    hasMarketplace: boolean;
    hasResources: boolean;
    hasCalendar: boolean;

    // Events & Announcements
    announcements?: GroupAnnouncement[];
    pinnedPosts?: string[]; // post IDs

    // Statistics & Analytics
    statistics: GroupStatistics;
    analytics?: GroupAnalytics; // only for admins

    // SEO & Discovery
    slug: string; // URL-friendly name
    keywords: string[];
    language: string;
    allowDiscovery: boolean; // can be found in search
    searchableByEmail: boolean;
    searchableByPhone: boolean;

    // Moderation
    moderationSettings?: {
        autoApproveMembers: boolean;
        autoApprovePosts: boolean;
        spamFiltering: boolean;
        profanityFiltering: boolean;
        linkFiltering: boolean;
        bannedWords: string[];
        trustedMembers: string[]; // user IDs with auto-approval
    };

    // Notifications
    notificationSettings?: {
        newMemberNotification: boolean;
        newPostNotification: boolean;
        newCommentNotification: boolean;
        newEventNotification: boolean;
        reportNotification: boolean;
        digestFrequency: "none" | "daily" | "weekly" | "monthly";
    };
}

// Additional utility types
export interface CreateGroupRequest {
    name: string;
    description: string;
    category: string;
    tags?: string[];
    location?: string;
    visibility: "public" | "private" | "secret";
    privacy: Partial<GroupPrivacy>;
    contentSettings?: Partial<GroupContentSettings>;
    rules?: string[];
    profilePicture?: File;
    coverImage?: File;
    memberLimit?: number;
    language?: string;
    allowDiscovery?: boolean;
}

export interface UpdateGroupRequest extends Partial<CreateGroupRequest> {
    id: string;
}

export interface GroupSearchFilters {
    category?: string;
    tags?: string[];
    location?: string;
    visibility?: "public" | "private";
    memberCountRange?: { min?: number; max?: number };
    hasEvents?: boolean;
    isVerified?: boolean;
    language?: string;
    sortBy?: "relevance" | "member_count" | "created_date" | "activity";
    sortOrder?: "asc" | "desc";
}

export interface GroupMembershipAction {
    groupId: string;
    userId: string;
    action:
        | "join"
        | "leave"
        | "invite"
        | "remove"
        | "ban"
        | "unban"
        | "promote"
        | "demote";
    reason?: string;
    targetRole?: "member" | "moderator" | "admin";
}

export default Group;
