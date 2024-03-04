"use client";

import { useQuery } from "@tanstack/react-query";
import { getPostRecommends } from "../_lib/getPostRecommends";
import Post from "@/app/(afterLogin)/_component/Post";
import { User } from "@/model/User";
import { Post as IPost } from "@/model/Post";

const PostRecommends = () => {
  const { data } = useQuery<IPost[]>({
    queryKey: ["posts", "recommends"],
    queryFn: getPostRecommends,
    staleTime : 60 * 1000, // n분 뒤에 fresh -> stale 로
    gcTime : 300 * 1000 // 5분뒤 메모리 정리
  });
  return data?.map((post) => (
    <Post key={post.postId} post={post}/>
  ));
};

export default PostRecommends;
