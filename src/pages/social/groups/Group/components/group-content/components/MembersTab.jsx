import { useState, useEffect } from "react";
import { FaLock } from "react-icons/fa";
import MemberOptions from "../MemberOptions";

export default function MembersTab({ group, canViewContent }) {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const isGroupAdmin = true;
    const currentUserRole = "admin";

    useEffect(() => {
        if (canViewContent) {
            // Mock API call to fetch group members
            setTimeout(() => {
                setMembers([
                    { id: "1", name: "John Doe", role: "admin", avatar: null },
                    {
                        id: "2",
                        name: "Jane Smith",
                        role: "moderator",
                        avatar: null,
                    },
                    {
                        id: "3",
                        name: "David Wilson",
                        role: "member",
                        avatar: null,
                    },
                    {
                        id: "4",
                        name: "Sarah Johnson",
                        role: "member",
                        avatar: null,
                    },
                ]);
                setLoading(false);
            }, 1000);
        }
    }, [canViewContent]);

    if (!canViewContent) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaLock className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Member list is protected
                </h3>
                <p className="text-gray-600">
                    You need to join the group to see the member list.
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-4">
                    Members ({group.memberCount.toLocaleString()})
                </h3>
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-full animate-skeleton-animation"></div>
                            <div className="flex-grow">
                                <div className="h-4 bg-gray-200 rounded w-32 animate-skeleton-animation"></div>
                                <div className="h-3 bg-gray-200 rounded w-20 mt-2 animate-skeleton-animation"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    // Handler functions
    const handleRemoveMember = (member) => {
        console.log("Removing member:", member);
        // Add your remove member logic here
        // Example: API call to remove member from group
    };

    const handleReportMember = (member) => {
        console.log("Reporting member:", member);
        // Add your report logic here
        // Could open a report modal
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-4">
                Members ({group.memberCount.toLocaleString()})
            </h3>
            <div className="space-y-3">
                {members.map((member) => (
                    <div
                        key={member.id}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
                    >
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                            {member.avatar ||
                                member.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-grow">
                            <h4 className="font-medium text-gray-800">
                                {member.name}
                            </h4>
                            <p className="text-sm text-gray-500 capitalize">
                                {member.role}
                            </p>
                        </div>
                        <MemberOptions
                            member={member}
                            isGroupAdmin={isGroupAdmin}
                            currentUserRole={currentUserRole}
                            onRemoveMember={handleRemoveMember}
                            onReportMember={handleReportMember}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
