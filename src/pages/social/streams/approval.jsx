"use client";

import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function AppealConfirmation() {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate("/");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md mx-4 border border-gray-100">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-emerald-500" />
        </div>

        <h1 className="text-2xl font-bold text-emerald-600 mb-4">
          Đơn khiếu nại của bạn đã được tiếp nhận
        </h1>

        <p className="text-gray-600 mb-8 leading-relaxed">
          Cảm ơn bạn đã gửi thông tin. Chúng tôi sẽ xem xét và phản hồi sớm nhất
          có thể.
        </p>

        <button
          onClick={handleBackToLogin}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300"
        >
          Quay lại trang đăng nhập
        </button>
      </div>
    </div>
  );
}
