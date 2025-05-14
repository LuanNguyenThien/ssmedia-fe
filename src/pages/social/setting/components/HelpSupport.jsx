import React from 'react';
import { FaQuestionCircle, FaFileAlt, FaHeadset, FaBug, FaBook } from 'react-icons/fa';

const HelpSupport = () => {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-6">Help & Support</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <SupportCard 
                    icon={<FaQuestionCircle className="text-blue-600" />}
                    title="FAQ"
                    description="Find answers to frequently asked questions"
                    actionText="Browse FAQs"
                />
                
                <SupportCard 
                    icon={<FaHeadset className="text-blue-600" />}
                    title="Contact Support"
                    description="Get in touch with our support team"
                    actionText="Contact Us"
                />
                
                <SupportCard 
                    icon={<FaBug className="text-blue-600" />}
                    title="Report a Problem"
                    description="Let us know about any issues you encounter"
                    actionText="Report Issue"
                />
                
                <SupportCard 
                    icon={<FaBook className="text-blue-600" />}
                    title="User Guide"
                    description="Learn how to use our platform effectively"
                    actionText="View Guide"
                />
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Community Guidelines</h3>
                <p className="text-gray-600 mb-4">
                    Our community guidelines ensure a safe and positive experience for all users. 
                    Please familiarize yourself with these guidelines to understand what content 
                    and behavior is acceptable on our platform.
                </p>
                <button className="flex items-center text-blue-600 hover:text-blue-800">
                    <FaFileAlt className="mr-2" />
                    <span className="font-medium">Read Community Guidelines</span>
                </button>
            </div>
            
            <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Feedback</h3>
                <p className="text-gray-600 mb-4">
                    We're always looking to improve our platform. Share your thoughts and suggestions with us.
                </p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Send Feedback
                </button>
            </div>
        </div>
    );
};

const SupportCard = ({ icon, title, description, actionText }) => {
    return (
        <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
            <div className="text-2xl mb-3">
                {icon}
            </div>
            <h3 className="font-medium text-lg mb-2">{title}</h3>
            <p className="text-gray-600 mb-4">{description}</p>
            <button className="text-blue-600 font-medium hover:underline">
                {actionText}
            </button>
        </div>
    );
};

export default HelpSupport;
