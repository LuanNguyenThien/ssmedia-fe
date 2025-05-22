import Skeleton from 'react-loading-skeleton';

const ProfileSectionSkeleton = () => {
  return (
    <div className="w-full bg-background-blur/40 rounded-2xl p-6 flex flex-col items-center shadow-md">
      {/* Profile picture skeleton */}
      <Skeleton 
        circle 
        height={64} 
        width={64} 
        baseColor="#EFF1F6" 
        className="mb-2"
      />
      
      {/* Username and verification icon */}
      <div className="flex items-center gap-2 mb-1">
        <Skeleton 
          width={80} 
          height={24} 
          baseColor="#EFF1F6"
        />
        <Skeleton 
          circle 
          width={16} 
          height={16} 
          baseColor="#EFF1F6" 
        />
      </div>
      
      {/* Handle/username */}
      <Skeleton 
        width={100} 
        height={16} 
        baseColor="#EFF1F6" 
        className="mb-4"
      />
      
      {/* Stats section */}
      <div className="flex w-full justify-between mt-2">
        {/* Followers */}
        <div className="flex flex-col items-center flex-1">
          <Skeleton 
            width={30} 
            height={20} 
            baseColor="#EFF1F6" 
          />
          <Skeleton 
            width={50} 
            height={12} 
            baseColor="#EFF1F6" 
          />
        </div>
        
        {/* Following */}
        <div className="flex flex-col items-center flex-1">
          <Skeleton 
            width={30} 
            height={20} 
            baseColor="#EFF1F6" 
          />
          <Skeleton 
            width={50} 
            height={12} 
            baseColor="#EFF1F6" 
          />
        </div>
        
        {/* Posts */}
        <div className="flex flex-col items-center flex-1">
          <Skeleton 
            width={30} 
            height={20} 
            baseColor="#EFF1F6" 
          />
          <Skeleton 
            width={50} 
            height={12} 
            baseColor="#EFF1F6" 
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileSectionSkeleton;
