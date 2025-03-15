import { useState , useEffect} from 'react';
import { MdKeyboardArrowLeft } from "react-icons/md";

import Login from '@pages/auth/login/Login';
import Register from '@pages/auth/register/Register';
import useLocalStorage from '@hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import { Utils } from '@services/utils/utils.service';

export default function AuthTabs1() {
  const [activeTab, setActiveTab] = useState('login');
  const keepLoggedIn = useLocalStorage('keepLoggedIn', 'get');
  const [environment, setEnvironment] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const env = Utils.appEnvironment();
    setEnvironment(env);
    if (keepLoggedIn) navigate('/app/social/streams');
  }, [keepLoggedIn, navigate]);

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-auto">
      {/* Left Column - Auth Form */}
      <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col">
        <div className="mb-12">
          <a href="#" className="flex items-center text-gray-800 font-medium">
            <MdKeyboardArrowLeft className="mr-2 h-5 w-5" />
            CORALS
          </a>
        </div>

        <div className="max-w-md mx-auto w-full">
          {activeTab === 'register' ? (
            <Register onSwitchToLogin={() => setActiveTab('login')} />
          ) : (
            <Login onSwitchToRegister={() => setActiveTab('register')} />
          )}
        </div>
      </div>

      {/* Right Column - Video Layout */}
      <div className="w-full md:w-1/2 hidden md:flex flex-col p-6">
        <div className="relative w-full flex-1">
          {/* Video lớn bên trái (3/4) */}
          <div className="absolute top-6 left-6 w-3/4 h-[45%] bg-gray-100 rounded-lg overflow-hidden">
            <video className="w-full h-full object-cover" autoPlay loop muted>
              <source src="/notion-video.mp4" type="video/mp4" />
              Trình duyệt của bạn không hỗ trợ video.
            </video>
          </div>
          {/* Video nhỏ chéo bên phải (2/3) */}
          <div className="absolute bottom-6 right-6 w-2/3 h-[40%] bg-gray-100 rounded-lg overflow-hidden shadow-lg">
            <video className="w-full h-full object-cover" autoPlay loop muted>
              <source src="/notion-video-1.mp4" type="video/mp4" />
              Trình duyệt của bạn không hỗ trợ video.
            </video>
          </div>
        </div>
      </div>
    </div>
  );
}
