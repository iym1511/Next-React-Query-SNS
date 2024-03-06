"use client"

import { useContext } from "react";
import { TabContext } from "./TabProvider";
import PostRecommends from "./PostRecommends";
import FollowingPosts from "./FollowingPosts";

const TabDecier = () => {
  const { tab } = useContext(TabContext);
  if(tab === 'rec'){
    return <PostRecommends />
  }
  return <FollowingPosts/>;
}
 
export default TabDecier;