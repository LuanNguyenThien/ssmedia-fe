import { Lock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { PostUtils } from '@services/utils/post-utils.service';
import useLocalStorage from '@hooks/useLocalStorage';
import { userService } from "@services/api/user/user.service";
export default function AccountLocked() {

  const { profile } = useSelector((state) => state.user);
  const storedUsername = useLocalStorage("user", "get");
  const [banInfo, setBanInfo] = useState({});
  const [datetime, setDatetime] = useState();
  useEffect(() => {
    const fetchBanInfo = async () => {
      try {
        console.log("profile", profile);
        console.log("profile2", profile.authId);
        const authId = profile?.authId;

        if (!authId) return;

        const response = await userService.GetBanInfo(authId);
        console.log("Ban info:", response);
        setBanInfo(response.data.data);
      } catch (error) {
        console.error("Error fetching ban info:", error);
      }
    };

    fetchBanInfo();
  }, [profile]);

    const formatBanDate = (dateString) => {
      const date = new Date(dateString);
      const month = date.toLocaleString("default", { month: "long" });
      const day = date.getDate();
      const year = date.getFullYear();

      return `Ngày ${day} ${month} , ${year}`;
    };


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-sm max-w-md w-full p-6">
        <div className="flex justify-center mb-4">
          <div className="relative w-full max-w-md h-32">
            <div className="absolute inset-0 bg-purple-100 rounded-lg flex items-center justify-center">
              <div className="bg-purple-600 w-24 h-24 rounded-full flex items-center justify-center">
                <div className="bg-purple-500 w-20 h-20 rounded-full flex items-center justify-center">
                  <Lock className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-4">
            {profile.username}, tài khoản của bạn đã bị khóa
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
                Ngày khóa tài khoản: {formatBanDate(banInfo.bannedAt)}
              </h2>
              <p className="text-gray-600 text-sm">
                Lý do: {banInfo.banReason}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => (window.location.href = "/issua")}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-md transition-colors"
        >
          Kháng nghị
        </button>
      </div>
    </div>
  );
}
