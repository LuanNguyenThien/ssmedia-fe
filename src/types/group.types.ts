export type GroupVisibility = 'public' | 'private' | 'secret';

export type GroupMembershipStatus = 'not_member' | 'pending' | 'member' | 'admin' | 'moderator' | 'banned';

export interface GroupPrivacy {
  whoCanJoin: 'anyone' | 'admin_approval' | 'invite_only';
  whoCanPost: 'members' | 'admins_only';
  whoCanSeeMembers: 'everyone' | 'members';
  whoCanSeePosts: 'everyone' | 'members';
}

export interface GroupContentSettings {
  allowMemberPosts: boolean;
  allowEvents: boolean;
  allowPhotos: boolean;
  allowVideos: boolean;
  requirePostApproval: boolean;
}

export interface GroupStatistics {
  totalPosts: number;
  totalMembers: number;
  activeMembers: number;
  growthRate: number;
}

export interface Group {
  id: string;
  name: string;
  groupAvatar: string | null;
  description: string;
  shortDescription: string;
  category: string;
  tags: string[];
  location: string;
  visibility: GroupVisibility;
  memberCount: number;
  profilePicture: string | null;
  coverImage: string | null;
  privacy: GroupPrivacy;
  contentSettings: GroupContentSettings;
  rules: string[];
  admins: string[];
  moderators: string[];
  createdAt: string;
  isVerified: boolean;
  statistics?: GroupStatistics;
}

export interface GroupMember {
  id: string;
  name: string;
  role: 'admin' | 'moderator' | 'member';
  avatar: string | null;
}

export interface GroupMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
}

export interface GroupEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  attendees: number;
} 