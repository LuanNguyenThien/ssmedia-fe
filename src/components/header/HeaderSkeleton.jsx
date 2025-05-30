import Skeleton from 'react-loading-skeleton';

const HeaderSkeleton = () => {
  return (
    <div className="header-nav-wrapper bg-secondary" data-testid="header-skeleton">
      <div className="header-navbar grid grid-cols-5 header-desktop">
        {/* Logo section */}
        <div className="col-span-1">
          <div className="flex items-center">
            <Skeleton baseColor="#EFF1F6" circle height={35} width={35} />
            <Skeleton baseColor="#EFF1F6" width={60} height={20} style={{ marginLeft: '5px' }} />
          </div>
        </div>

        {/* Section title and search */}
        <div className="col-span-3 flex justify-between items-center gap-4">
          <Skeleton baseColor="#EFF1F6" width={100} height={20} />
          <div className="w-full max-w-lg">
            <Skeleton baseColor="#EFF1F6" height={38} borderRadius={20} />
          </div>
        </div>

        {/* Navigation items */}
        <ul className="header-nav w-full h-6 col-span-1 flex justify-end gap-4">
          {/* Message */}
          <li className="header-nav-item active-item">
            <Skeleton baseColor="#EFF1F6" circle height={28} width={28} />
          </li>
          
          {/* Notification */}
          <li className="header-nav-item active-item">
            <Skeleton baseColor="#EFF1F6" circle height={32} width={32} />
          </li>
          
          {/* Profile */}
          <li className="header-nav-item">
            <div className="flex items-center relative">
              <Skeleton baseColor="#EFF1F6" circle height={35} width={35} />
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HeaderSkeleton;
