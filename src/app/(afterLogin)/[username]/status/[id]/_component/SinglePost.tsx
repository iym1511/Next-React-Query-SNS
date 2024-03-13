"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import Post from "@/app/(afterLogin)/_component/Post";
import { Post as IPost } from "@/model/Post";
import { getSinglePost } from "../_lib/getSinglePost";

type Props = {
  id: string;
};
export default function SinglePost({ id }: Props) {
  // 개인 페이지라 게시글 하나만 가져오기 때문에 IPost에 배열[] 제거
  const { data: post, error } = useQuery<
    IPost,
    Object,
    IPost,
    [_1: string, _2: string]
  >({
    queryKey: ["posts", id],
    queryFn: getSinglePost,
    staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
    gcTime: 300 * 1000,
  });

  if (error) {
    return (
      <div
        style={{
          height: 100,
          alignItems: "center",
          fontSize: 31,
          fontWeight: "bold",
          justifyContent: "center",
          display: "flex",
        }}
      >
        게시글을 찾을 수 없습니다.
      </div>
    );
  }
  console.log(post)
  // 에러 없는데 post없으면 로딩중
  if (!post) {
    return null;
  }

  return <Post key={post.postId} post={post} />;
}
