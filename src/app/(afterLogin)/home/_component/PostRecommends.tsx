"use client";

import {
  InfiniteData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { getPostRecommends } from "../_lib/getPostRecommends";
import Post from "@/app/(afterLogin)/_component/Post";
import { User } from "@/model/User";
import { Post as IPost } from "@/model/Post";
import { Fragment } from "react";

const PostRecommends = () => {
  const { data } = useInfiniteQuery<
    IPost[],
    Object,
    InfiniteData<IPost[]>,
    [_1: string, _2: string],
    number
  >({
    queryKey: ["posts", "recommends"],
    queryFn: getPostRecommends,
    initialPageParam: 0, // 2차원 배열로 담겨 있다 [[1,2,3,4,5], [6,7,8,9,10], [11,12,13,14,15]]
    getNextPageParam: (lastPage) => lastPage.at(-1)?.postId, // 최근에 불러왔던 데이터 5개 마지막 페이지에 postId
    staleTime: 60 * 1000, // n분 뒤에 fresh -> stale 로
    gcTime: 300 * 1000, // 5분뒤 메모리 정리
  });

  // prop이 있으면 2차원 배열에 map의 key를 넣을때 Fragment사용
  return (
    <>
      {data?.pages.map((page, i) => (
        <Fragment key={i}>
          {page.map((post) => (
            <Post key={post.postId} post={post} />
          ))}
        </Fragment>
      ))}
    </>
  );
  
};

export default PostRecommends;
