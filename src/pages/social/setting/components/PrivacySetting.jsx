import React, { useState } from 'react';

const PrivacySetting = () => {
    const [privacySettings, setPrivacySettings] = useState({
        profileVisibility: 'friends',
        postVisibility: 'public',
        friendsListVisibility: 'friends',
        tagging: 'approval',
        searchEngineIndexing: true,
        twoFactorAuth: false
    });
    
    const handleChange = (setting, value) => {
        setPrivacySettings(prev => ({
            ...prev,
            [setting]: value
        }));
    };
    
    const handleToggle = (setting) => {
        setPrivacySettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
    };
    
    const saveSettings = () => {
        console.log('Saving privacy settings:', privacySettings);
        alert('Privacy settings saved successfully');
    };
    
    return (
        <div>
            <h2 className="text-xl font-semibold mb-6">Privacy Settings</h2>
            
            <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-medium mb-3">Profile Visibility</h3>
                    <p className="text-sm text-gray-600 mb-3">Control who can see your profile information</p>
                    <select 
                        value={privacySettings.profileVisibility}
                        onChange={(e) => handleChange('profileVisibility', e.target.value)}
                        className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="public">Public</option>
                        <option value="friends">Friends Only</option>
                        <option value="private">Private</option>
                    </select>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-medium mb-3">Post Visibility</h3>
                    <p className="text-sm text-gray-600 mb-3">Default audience for your posts</p>
                    <select 
                        value={privacySettings.postVisibility}
                        onChange={(e) => handleChange('postVisibility', e.target.value)}
                        className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="public">Public</option>
                        <option value="friends">Friends Only</option>
                        <option value="private">Only Me</option>
                    </select>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-medium mb-3">Friends List Visibility</h3>
                    <p className="text-sm text-gray-600 mb-3">Control who can see your friends list</p>
                    <select 
                        value={privacySettings.friendsListVisibility}
                        onChange={(e) => handleChange('friendsListVisibility', e.target.value)}
                        className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="public">Public</option>
                        <option value="friends">Friends Only</option>
                        <option value="private">Only Me</option>
                    </select>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-medium mb-3">Tagging Control</h3>
                    <p className="text-sm text-gray-600 mb-3">How you want to handle tags from others</p>
                    <select 
                        value={privacySettings.tagging}
                        onChange={(e) => handleChange('tagging', e.target.value)}
                        className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="anyone">Anyone can tag me</option>
                        <option value="friends">Only friends can tag me</option>
                        <option value="approval">Review tags before they appear</option>
                    </select>
                </div>
                
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                        <div>
                            <h4 className="font-medium">Search Engine Indexing</h4>
                            <p className="text-sm text-gray-600">Allow search engines to index your profile</p>
                        </div>
                        <div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={privacySettings.searchEngineIndexing} 
                                    onChange={() => handleToggle('searchEngineIndexing')} 
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                        <div>
                            <h4 className="font-medium">Two-Factor Authentication</h4>
                            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                        </div>
                        <div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={privacySettings.twoFactorAuth} 
                                    onChange={() => handleToggle('twoFactorAuth')} 
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </div>
                
                <div>
                    <button 
                        onClick={saveSettings}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrivacySetting;
