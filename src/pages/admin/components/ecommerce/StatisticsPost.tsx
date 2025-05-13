import {
  FaArrowDown as ArrowDownIcon,
  FaArrowUp as ArrowUpIcon,
  FaCubes as BoxIconLine,
  FaUsers as GroupIcon,
} from "react-icons/fa";
import Badge from "../ui/badge/Badge";
import { userService } from "@services/api/user/user.service";
import { postService } from "@services/api/post/post.service";
import React, { useState, useCallback, useEffect } from "react";
import useEffectOnce from "@hooks/useEffectOnce";
import { set } from "lodash";
export default function EcommerceMetrics() {

 const [total, setTotals] = useState(1);
 const [usertoday, setUserToday] = useState(0);
 const [grow, setGrown] = useState(0);
 const [postToday, setPostToday] = useState(0);
 const [growPost, setGrownPost] = useState(0);
 const [totalPost, setTotalPost] = useState(1);     
const getAllUsers = useCallback(async () => {
  
    
    const response = await userService.getAllUsersAdminRole(1);
    const responseData = await userService.getUsersToday();
    const responsePost = await postService.GetPostCount();
    setPostToday(responsePost.data.postsToday);
    console.log("responsePost", responsePost);
    setUserToday(responseData.data.count);
    setTotalPost(responsePost.data.totalPosts);
    setTotals(response.data.totalUsers);
    let percent = 0;
    
    
      percent =
        (responseData.data.count /
          (response.data.totalUsers - responseData.data.count)) *
        100;
        
    
    console.log("percent", percent);
    const roundedPercent = parseFloat(percent.toFixed(2));
          
    setGrown(roundedPercent);

    
    
    let percentpost = 0; 

    percentpost =
      (responsePost.data.postsToday /
        (responsePost.data.totalPosts - responsePost.data.postsToday)) *
      100;

    console.log("percent", percent);
    const roundedPercentpost = parseFloat(percentpost.toFixed(2));
    setGrownPost(roundedPercentpost);
   
}, []);

useEffectOnce(() => {
  getAllUsers();
});

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5  md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl ">
          <GroupIcon className="text-gray-800 size-6 " />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500">
              Post Today
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm ">
              {postToday}
            </h4>
          </div>
          
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl ">
          <BoxIconLine className="text-gray-800 size-6 " />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 ">
              Total Post
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm ">
              {totalPost}
            </h4>
          </div>

          <Badge color="success">
            <ArrowUpIcon />
            {growPost}%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
}
