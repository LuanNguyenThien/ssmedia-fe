import { useNavigate } from "react-router-dom";

export default function AppealConfirmation() {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate("/"); // hoặc đường dẫn tương ứng với trang đăng nhập của bạn
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow text-center max-w-md">
        <h1 className="text-xl font-semibold text-green-600 mb-4">
          Đơn khiếu nại của bạn đã được tiếp nhận
        </h1>
        <p className="text-gray-700 mb-6">
          Cảm ơn bạn đã gửi thông tin. Chúng tôi sẽ xem xét và phản hồi sớm nhất
          có thể.
        </p>
        <button
          onClick={handleBackToLogin}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Quay lại trang đăng nhập
        </button>
      </div>
    </div>
  );
}
