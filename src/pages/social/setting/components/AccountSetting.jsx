import React, { useState } from "react";
import { authService } from "@services/api/auth/auth.service";

const AccountSetting = ({ userData, handleAccountChange }) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [lastValues, setLastValues] = useState({
        username: userData.username,
        email: userData.email,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(null);
        setError(null);
        try {
            await authService.updateInformation({
                uId: userData.uId,
                username: userData.username,
                email: userData.email,
            });
            setSuccess("Profile updated successfully.");
            setLastValues({
                username: userData.username,
                email: userData.email,
            });
        } catch (err) {
            setError(err?.response?.data?.message || "Update failed.");
        } finally {
            setLoading(false);
        }
    };

    const isUnchanged =
        userData.username === lastValues.username &&
        userData.email === lastValues.email;

    return (
        <div className="bg-white rounded-lg sm:p-6 max-w-xl mx-auto">
            <h2 className="text-xl font-bold mb-6">Account Settings</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={userData.username}
                            onChange={handleAccountChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleAccountChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4 mt-2">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60"
                        disabled={
                            loading ||
                            !userData.username ||
                            !userData.email ||
                            isUnchanged
                        }
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                    {success && (
                        <span className="text-green-600 text-sm">
                            {success}
                        </span>
                    )}
                    {error && (
                        <span className="text-red-600 text-sm">{error}</span>
                    )}
                </div>
                <div className="mt-4">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">
                        Profile Information
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        <DisplayField label="Work" value={userData.work} />
                        <DisplayField label="School" value={userData.school} />
                        <DisplayField
                            label="Location"
                            value={userData.location}
                        />
                        <DisplayField label="Quote" value={userData.quote} />
                        <DisplayField
                            label="Facebook"
                            value={userData.facebook}
                        />
                        <DisplayField
                            label="Instagram"
                            value={userData.instagram}
                        />
                        <DisplayField
                            label="Twitter"
                            value={userData.twitter}
                        />
                        <DisplayField
                            label="Youtube"
                            value={userData.youtube}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

const DisplayField = ({ label, value }) => (
    <div className="flex flex-col col-span-full">
        <span className="text-gray-500 text-xs font-medium mb-1">{label}</span>
        <span
            className="text-gray-800 bg-gray-50 rounded px-3 py-2 border border-gray-100 min-h-[40px] truncate max-w-full"
            title={value || ""}
        >
            {value || <span className="text-gray-400">Not set</span>}
        </span>
    </div>
);

export default AccountSetting;
