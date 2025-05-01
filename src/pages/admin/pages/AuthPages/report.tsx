import { Lock } from "lucide-react";

export default function AccountLocked() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-sm max-w-md w-full p-6">
        <div className="flex justify-center mb-4">
          <div className="relative w-full max-w-md h-32">
            <div className="absolute inset-0 bg-purple-100 rounded-lg flex items-center justify-center">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute w-16 h-20 bg-purple-600 rounded-md"></div>
                <div className="absolute w-20 h-16 bg-purple-500 rounded-md -rotate-12 ml-4"></div>
                <div className="absolute w-10 h-10 bg-blue-400 rounded-sm z-10 flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
                </div>
                <div className="absolute -right-4 -top-4">
                  <div className="w-8 h-8 border-4 border-purple-800 rounded-full"></div>
                </div>
                <div className="absolute left-0 top-0 w-16 h-4">
                  <div className="border-2 border-white w-16 h-0 rotate-45 origin-left"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-4">
            ơi, tài khoản của bạn đã bị khóa
          </h1>
          <p className="text-gray-600 mb-6">
            Chúng tôi phát hiện hoạt động bất thường trên tài khoản của bạn. Như
            vậy nghĩa là ai đó đã sử dụng tài khoản này mà bạn không biết.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="bg-blue-500 rounded-full p-2 mr-4 flex-shrink-0">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-medium mb-1">
                Ngày khóa tài khoản: Tháng 4 5, 2021
              </h2>
              <p className="text-gray-600 text-sm">
                Để bảo vệ bạn, chúng tôi sẽ ẩn trang cá nhân của bạn với mọi
                người trên Facebook và bạn cũng không thể sử dụng tài khoản của
                mình.
              </p>
            </div>
          </div>
        </div>

        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-md transition-colors">
          Tìm hiểu thêm
        </button>
      </div>
    </div>
  );
}
