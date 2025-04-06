const ConfirmModal = ({ handleConfirm, handleCancel }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-[10000] p-2">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full ">
                <h2 className="text-xl font-semibold mb-4">Confirm Action</h2>
                <p className="mb-4">Are you sure you want to proceed?</p>
                <div className="flex justify-end space-x-2">
                    <div
                        onClick={handleCancel}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </div>
                    <div
                        onClick={handleConfirm}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Confirm
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
