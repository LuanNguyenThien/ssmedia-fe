import Skeleton from 'react-loading-skeleton';
import '@pages/social/notifications/Notification.scss';

const NotificationSkeleton = () => {
  return (
    <>
      <div className="notifications-container col-span-10 px-4" data-testid="notification-skeleton">
        <div className="w-full flex justify-center items-center">
          <div className="w-1/2 h-[0.1px] bg-primary-black/20 mt-2"></div>
        </div>
        <div className="flex items-center justify-between py-4">
          <span className="text-2xl font-bold">Notifications</span>
          <div className="flex items-center gap-2">
            <Skeleton baseColor="#EFF1F6" width={100} height={30} className="rounded-full" />
          </div>
        </div>
        <div className="notifications-box">
          {[1, 2, 3, 4, 5].map((notification, index) => (
            <div className="notification-box w-full items-center justify-start gap-3 bg-background-blur/50 hover:bg-primary/10 rounded-[20px] px-4 py-2 my-3" key={index}>
              <div className="notification-box-sub-card">
                <div className="notification-box-sub-card-media">
                  <div className="notification-box-sub-card-media-image-icon">
                    <Skeleton baseColor="#EFF1F6" circle height={40} width={40} />
                  </div>
                  <div className="notification-box-sub-card-media-body">
                    <h6
                      className="title"
                      style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}
                    >
                      <Skeleton baseColor="#EFF1F6" width={200} height={20} />
                      <small className="subtitle">
                        <Skeleton baseColor="#EFF1F6" width={40} className="trash" />
                      </small>
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default NotificationSkeleton;
