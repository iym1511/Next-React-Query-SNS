"use client"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import Post from "@/app/(afterLogin)/_component/Post";
import { Post as IPost } from "@/model/Post";
import { getFollowingPosts } from "@/app/(afterLogin)/home/_lib/getFollowingPosts";
import styles  from '../home.module.css'

const FollowingPosts = () => {

  const { data } = useSuspenseQuery<IPost[]>({
    queryKey: ["posts", "followings"],
    queryFn: getFollowingPosts,
    staleTime : 60 * 1000, // n분 뒤에 fresh -> stale 로
    gcTime : 300 * 1000, // 5분뒤 메모리 정리
  });

  // 데이터 가져오는동안 로딩
  // if(isPending){
  //   return (
  //     <div style={{ display: 'flex', justifyContent: 'center' }}>
  //       <svg className={styles.loader} height="100%" viewBox="0 0 32 32" width={40} >
  //         <circle cx="16" cy="16" fill="none" r="14" strokeWidth="4"
  //                 style={{stroke: 'rgb(29, 155, 240)', opacity: 0.2}}></circle>
  //         <circle cx="16" cy="16" fill="none" r="14" strokeWidth="4"
  //                 style={{stroke: 'rgb(29, 155, 240)', strokeDasharray: 80, strokeDashoffset: 60}}></circle>
  //       </svg>
  //     </div>
  //   )
  // }

  return data?.map((post) => (
    <Post key={post.postId} post={post}/>
  ));

}
 
export default FollowingPosts;