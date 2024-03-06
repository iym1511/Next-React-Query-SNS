"use client"
import { useQuery } from "@tanstack/react-query";
import Post from "@/app/(afterLogin)/_component/Post";
import { Post as IPost } from "@/model/Post";
import { getFollowingPosts } from "@/app/(afterLogin)/home/_lib/getFollowingPosts";
const FollowingPosts = () => {

  const { data } = useQuery<IPost[]>({
    queryKey: ["posts", "followings"],
    queryFn: getFollowingPosts,
    staleTime : 60 * 1000, // n분 뒤에 fresh -> stale 로
    gcTime : 300 * 1000, // 5분뒤 메모리 정리
  });
  return data?.map((post) => (
    <Post key={post.postId} post={post}/>
  ));

}
 
export default FollowingPosts;