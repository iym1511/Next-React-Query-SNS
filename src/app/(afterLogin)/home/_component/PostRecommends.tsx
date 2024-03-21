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
import { Fragment, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import styles from '../home.module.css';

const PostRecommends = () => {
  // isFetching 리액트 쿼리가 데이터를 가져오는순간(로딩)
  const { data, fetchNextPage, hasNextPage, isFetching, isPending, isLoading } =
    useInfiniteQuery<
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

  const { ref, inView } = useInView({
    threshold: 0, // ref영역이 보이고 나서 몇 픽셀 정도의 이벤트가 호출되는가(보이자마자 호출할거라서 0)
    delay: 2, // 화면에 보이고 나서 얼마있다가 다시 데이터를 불러올것인가
  });

  // ref영역이 보이면 inView가 true가 되면서 useEffect 작동
  // !isFetching을 제한두면 데이터를 가져오고 있지않을때 실수로 같은데이터를 여러번 가져오는것을 방지
  useEffect(() => {
    if (inView) {
      !isFetching && hasNextPage && fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  // 데이터 가져오는동안 로딩
  if(isPending){
    setTimeout(()=>{},3000)
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg className={styles.loader} height="100%" viewBox="0 0 32 32" width={40} >
          <circle cx="16" cy="16" fill="none" r="14" strokeWidth="4"
                  style={{stroke: 'rgb(29, 155, 240)', opacity: 0.2}}></circle>
          <circle cx="16" cy="16" fill="none" r="14" strokeWidth="4"
                  style={{stroke: 'rgb(29, 155, 240)', strokeDasharray: 80, strokeDashoffset: 60}}></circle>
        </svg>
      </div>
    )
  }

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
      <div ref={ref} style={{ height: "10px" }}></div>
    </>
  );
};

export default PostRecommends;
