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
  });
  return data?.map((post) => (
    <Post key={post.postId} post={post}/>
  ));
};

export default PostRecommends;
