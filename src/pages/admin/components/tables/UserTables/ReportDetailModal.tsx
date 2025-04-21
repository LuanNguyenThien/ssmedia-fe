import React from "react";

interface ReportedUser {
  user: {
    name: string;
    image: string;
    role: string;
  };
  projectName: string;
  description: string;
}

interface Props {
  selectedUser: ReportedUser | null;
  onClose: () => void;
}

const ReportDetailModal: React.FC<Props> = ({ selectedUser, onClose }) => {
  if (!selectedUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-2xl"
        >
          ×
        </button>

        <div className="flex items-center gap-4 mb-4">
          <img
            src={selectedUser.user.image}
            alt={selectedUser.user.name}
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              {selectedUser.user.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selectedUser.user.role}
            </p>
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Lý do báo cáo
          </label>
          <input
            type="text"
            value={selectedUser.projectName}
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white"
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Mô tả chi tiết
          </label>
          <textarea
            value={selectedUser.description}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white"
            disabled
          />
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailModal;
