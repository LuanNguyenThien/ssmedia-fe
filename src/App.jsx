import { AppRouter } from "@root/routes";
import { BrowserRouter } from "react-router-dom";
import "@root/App.scss";
import { socketService } from "@services/socket/socket.service";
import Toast from "@components/toast/Toast";
import { useSelector } from "react-redux";
import useEffectOnce from "@hooks/useEffectOnce";

const App = () => {
    const { notifications } = useSelector((state) => state);

    useEffectOnce(() => {
        socketService.setupSocketConnection();
    });

    return (
        <div>
            {notifications && notifications.length > 0 && (
                <Toast
                    position="top-right"
                    toastList={notifications}
                    autoDelete={true}
                />
            )}
            <BrowserRouter>
                <AppRouter />
            </BrowserRouter>
        </div>
    );
};
export default App;
