import PropTypes from "prop-types";
import { useEffect, useCallback, useRef, useState } from "react";
import { cloneDeep } from "lodash";

import "@components/toast/Toast.scss";
import { Utils } from "@services/utils/utils.service";
import { useDispatch } from "react-redux";

const Toast = (props) => {
    const isMobile = Utils.isMobileDevice();
    const { toastList, position, autoDelete, autoDeleteTime = 3000 } = props;
    const [list, setList] = useState(toastList);
    const listData = useRef([]);
    const dispatch = useDispatch();

    const deleteToast = useCallback(() => {
        listData.current = cloneDeep(list);
        listData.current.splice(0, 1);
        setList([...listData.current]);
        if (!listData.current.length) {
            list.length = 0;
            Utils.dispatchClearNotification(dispatch);
        }
    }, [list, dispatch]);

    useEffect(() => {
        setList([...toastList]);
    }, [toastList]);

    useEffect(() => {
        const tick = () => {
            deleteToast();
        };

        if (autoDelete && toastList.length && list.length) {
            const interval = setInterval(tick, autoDeleteTime);
            return () => clearInterval(interval);
        }
    }, [toastList, autoDelete, autoDeleteTime, list, deleteToast]);

    // Get position classes for desktop
    const getPositionClasses = (pos) => {
        const positions = {
            'top-right': 'top-3 right-3 animate-slide-in-right',
            'top-left': 'top-3 left-3 animate-slide-in-left',
            'bottom-right': 'bottom-3 right-3 animate-slide-in-right',
            'bottom-left': 'bottom-3 left-3 animate-slide-in-left'
        };
        return positions[pos] || 'top-3 right-3 animate-slide-in-right';
    };

    if (isMobile) {
        return (
            <div className="fixed top-0 left-0 right-0 z-[999999] p-3 space-y-2">
                {list.map((toast) => (
                    <div
                        data-testid="toast-notification"
                        key={Utils.generateString(10)}
                        className="relative w-full bg-white rounded-lg shadow-lg border-l-4 p-4 transform transition-all duration-300 ease-in-out animate-slide-down"
                        style={{ 
                            backgroundColor: toast.backgroundColor,
                            borderLeftColor: toast.backgroundColor 
                        }}
                    >
                        {/* Close button */}
                        <button
                            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-white hover:bg-black hover:bg-opacity-20 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                            onClick={() => deleteToast()}
                            aria-label="Close notification"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    deleteToast();
                                }
                            }}
                        >
                            <span className="text-sm font-bold">×</span>
                        </button>

                        {/* Content container */}
                        <div className="flex items-start space-x-3 pr-6">
                            {/* Icon */}
                            <div className="flex-shrink-0">
                                <img 
                                    src={toast.icon} 
                                    alt={`${toast.type} icon`}
                                    className="w-6 h-6 object-contain"
                                />
                            </div>

                            {/* Message */}
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium leading-5 break-words">
                                    {toast.description}
                                </p>
                            </div>
                        </div>

                        {/* Progress bar for auto-delete */}
                        {autoDelete && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-20 rounded-b-lg overflow-hidden">
                                <div 
                                    className="h-full bg-white bg-opacity-60 animate-progress-bar"
                                    style={{
                                        animationDuration: `${autoDeleteTime}ms`,
                                        animationTimingFunction: 'linear',
                                        animationFillMode: 'forwards'
                                    }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className={`fixed z-[999999] ${getPositionClasses(position)} space-y-3`}>
            {list.map((toast) => (
                <div
                    data-testid="toast-notification"
                    key={Utils.generateString(10)}
                    className="relative w-96 bg-white rounded-lg shadow-xl border-l-4 p-4 transform transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105"
                    style={{ 
                        backgroundColor: toast.backgroundColor,
                        borderLeftColor: toast.backgroundColor 
                    }}
                >
                    {/* Close button */}
                    <button
                        className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center text-white hover:bg-black hover:bg-opacity-20 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 hover:scale-110"
                        onClick={() => deleteToast()}
                        aria-label="Close notification"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                deleteToast();
                            }
                        }}
                    >
                        <span className="text-base font-bold">×</span>
                    </button>

                    {/* Content container */}
                    <div className="flex items-start space-x-4 pr-8">
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-1">
                            <img 
                                src={toast.icon} 
                                alt={`${toast.type} icon`}
                                className="w-7 h-7 object-contain"
                            />
                        </div>

                        {/* Message */}
                        <div className="flex-1 min-w-0">
                            <p className={`text-white font-semibold leading-6 break-words ${
                                toast.description.length <= 73 ? 'text-sm' : 'text-xs'
                            }`}>
                                {toast.description}
                            </p>
                        </div>
                    </div>

                    {/* Progress bar for auto-delete */}
                    {autoDelete && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-20 rounded-b-lg overflow-hidden">
                            <div 
                                className="h-full bg-white bg-opacity-70 animate-progress-bar"
                                style={{
                                    animationDuration: `${autoDeleteTime}ms`,
                                    animationTimingFunction: 'linear',
                                    animationFillMode: 'forwards'
                                }}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

Toast.propTypes = {
    toastList: PropTypes.array,
    position: PropTypes.string,
    autoDelete: PropTypes.bool,
    autoDeleteTime: PropTypes.number,
};

export default Toast;
