"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import Post from "@/app/(afterLogin)/_component/Post";
import { Post as IPost } from "@/model/Post";
import { getComments } from "../_lib/getComments";

type Props = {
  id: string;
};
export default function Comments({ id }: Props) {
  const { data, error } = useQuery<
    IPost[],
    Object,
    IPost[],
    [_1: string, _2: string, _3: string]
  >({
    queryKey: ["posts", id, "comments"],
    queryFn: getComments,
    staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
    gcTime: 300 * 1000,
  });

  return data?.map((post) => <Post key={post.postId} post={post} />);
}
