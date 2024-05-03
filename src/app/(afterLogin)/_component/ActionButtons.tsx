"use client";
import { MouseEventHandler } from "react";
import style from "./post.module.css";
import cx from "classnames";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Post } from "@/model/Post";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useModalState } from "@/store/modal";

type Props = {
  white?: boolean;
  post: Post;
};

export default function ActionButtons({ white, post }: Props) {
  const queryClient = useQueryClient();
  const session = useSession();
  console.log("하트다", post.Hearts);
  // find 메서드결과값을 boolean으로 출력해줌 ! : boolean반대, !! : bolean반대의반대
  // const commented = !!post.Comments?.find(
  //   (v) => v.userId === session.data?.user?.email
  // );
  const modalStore = useModalState();
  const router = useRouter();

  const reposted = !!post.Reposts?.find(
    (v) => v.userId === session.data?.user?.email
  );
  const liked = !!post.Hearts?.find(
    (v) => v.userId === session.data?.user?.email
  );
  const { postId } = post;

  const heart = useMutation({
    mutationFn: () => {
      return fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${postId}/heart`,
        {
          method: "post",
          credentials: "include",
        }
      );
    },
    // 클릭한 하트 상태를 실시간으로 true로 만들어줌
    // post에서 검색결과,추천,팔로잉,답글 등등 쿼리키가 다양한대 어떤 쿼리키인지 무슨상황인지 알 수가 없다.
    // 그래서 전부 다 해줘야 한다.
    onMutate() {
      const queryCache = queryClient.getQueryCache();
      const queryKeys = queryCache.getAll().map((cache) => cache.queryKey);

      queryKeys.forEach((querykey) => {
        if (querykey[0] === "posts") {
          const value: Post | InfiniteData<Post[]> | undefined =
            queryClient.getQueryData(querykey); // 게시글
          console.log("벨류", value);

          // 싱글포스트 일 수도 있기때문에 조건문 걸어줌.
          // 값이 존재하고 그값이 'pages' 라는 속성을 가지고 있는지 확인
          if (value && "pages" in value) {
            // flat으로 2차원배열 평탄화(1차원배열)해서 접근
            // obj : 로그인된 아이디로 작성한 게시글 찾아줌
            const obj = value.pages.flat().find((v) => v.postId === postId);

            if (obj) {
              // pageIndex : 10개씩 뭉처있는 배열이 있는데
              // 몇번째 배열에 해당 게시글이 존재하는지 알려줌
              const pageIndex = value.pages.findIndex((page) =>
                page.includes(obj)
              );

              // 뭉처있는 게시글 사이에서 내가 좋아요 누른 게시글 postId가 맞는 index 를 찾아줌
              const index = value.pages[pageIndex].findIndex(
                (v) => v.postId === postId
              );
              const shallow = { ...value };
              console.log("리포스트테스트 : ", shallow.pages)

              // 옅은복사 (인덱스 페이지로 좋아요누른 페이지에 접근후 작업)
              value.pages = { ...value.pages }; // 좋아요 개수 상승된 값으로 변경
              // console.log("옅은복사 value.pages : ", value.pages)
              value.pages[pageIndex] = [...value.pages[pageIndex]];
              shallow.pages[pageIndex][index] = {
                ...shallow.pages[pageIndex][index],
                Hearts: [{ userId: session.data?.user?.email as string }],
                _count: {
                  ...shallow.pages[pageIndex][index]._count,
                  Hearts: shallow.pages[pageIndex][index]._count.Hearts + 1,
                },
              };
              // 옅은 복사해준것을 쿼리에 전송
              queryClient.setQueryData(querykey, shallow);
            }
          } else if (value) {
            // 싱글 포스트인 경우
            if (value.postId === postId) {
              const shallow = {
                ...value,
                Hearts: [{ userId: session.data?.user?.email as string }],
                _count: {
                  ...value._count,
                  Hearts: value._count.Hearts + 1,
                },
              };
              queryClient.setQueryData(querykey, shallow);
            }
          }
        }
      });
    },
    onError() {
      const queryCache = queryClient.getQueryCache();
      const queryKeys = queryCache.getAll().map((cache) => cache.queryKey);

      queryKeys.forEach((querykey) => {
        if (querykey[0] === "posts") {
          const value: Post | InfiniteData<Post[]> | undefined =
            queryClient.getQueryData(querykey); // 게시글

          // 싱글포스트 일 수도 있기때문에 조건문 걸어줌.
          // 값이 존재하고 그값이 'pages' 라는 속성을 가지고 있는지 확인
          if (value && "pages" in value) {
            // flat으로 2차원배열 평탄화(1차원배열)해서 접근
            const obj = value.pages.flat().find((v) => v.postId === postId);
            console.log(obj);

            if (obj) {
              // 존재는 하는지
              const pageIndex = value.pages.findIndex((page) =>
                page.includes(obj)
              );
              const index = value.pages[pageIndex].findIndex(
                (v) => v.postId === postId
              );
              const shallow = { ...value };

              // 옅은복사 (인덱스 페이지로 좋아요누른 페이지에 접근후 작업)
              value.pages = { ...value.pages };
              value.pages[pageIndex] = [...value.pages[pageIndex]];
              shallow.pages[pageIndex][index] = {
                ...shallow.pages[pageIndex][index],
                Hearts: shallow.pages[pageIndex][index].Hearts.filter(
                  (v) => v.userId !== session.data?.user?.email
                ),
                _count: {
                  ...shallow.pages[pageIndex][index]._count,
                  Hearts: shallow.pages[pageIndex][index]._count.Hearts - 1,
                },
              };
              // 옅은 복사해준것을 쿼리에 전송
              queryClient.setQueryData(querykey, shallow);
            }
          } else if (value) {
            // 싱글 포스트인 경우
            if (value.postId === postId) {
              const shallow = {
                ...value,
                Hearts: value.Hearts.filter(
                  (v) => v.userId !== session.data?.user?.email
                ),
                _count: {
                  ...value._count,
                  Hearts: value._count.Hearts - 1,
                },
              };
              queryClient.setQueryData(querykey, shallow);
            }
          }
        }
      });
    },
    onSettled() {},
  });

  const unheart = useMutation({
    mutationFn: () => {
      return fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${postId}/heart`,
        {
          method: "delete",
          credentials: "include",
        }
      );
    },

    onMutate() {
      const queryCache = queryClient.getQueryCache();
      const queryKeys = queryCache.getAll().map((cache) => cache.queryKey);

      queryKeys.forEach((querykey) => {
        if (querykey[0] === "posts") {
          const value: Post | InfiniteData<Post[]> | undefined =
            queryClient.getQueryData(querykey); // 게시글
          console.log("벨류", value);
          // 싱글포스트 일 수도 있기때문에 조건문 걸어줌.
          // 값이 존재하고 그값이 'pages' 라는 속성을 가지고 있는지 확인
          if (value && "pages" in value) {
            // flat으로 2차원배열 평탄화(1차원배열)해서 접근
            const obj = value.pages.flat().find((v) => v.postId === postId);

            if (obj) {
              // 존재는 하는지
              const pageIndex = value.pages.findIndex((page) =>
                page.includes(obj)
              );
              const index = value.pages[pageIndex].findIndex(
                (v) => v.postId === postId
              );
              const shallow = { ...value };
              console.log("언하트 섈로우 : ", shallow);
              // 옅은복사 (인덱스 페이지로 좋아요누른 페이지에 접근후 작업)
              value.pages = { ...value.pages };
              value.pages[pageIndex] = [...value.pages[pageIndex]];
              shallow.pages[pageIndex][index] = {
                ...shallow.pages[pageIndex][index],
                Hearts: shallow.pages[pageIndex][index].Hearts.filter(
                  (v) => v.userId !== session.data?.user?.email
                ),
                _count: {
                  ...shallow.pages[pageIndex][index]._count,
                  Hearts: shallow.pages[pageIndex][index]._count.Hearts - 1,
                },
              };
              // 옅은 복사해준것을 쿼리에 전송
              queryClient.setQueryData(querykey, shallow);
            }
          } else if (value) {
            // 싱글 포스트인 경우
            if (value.postId === postId) {
              const shallow = {
                ...value,
                Hearts: value.Hearts.filter(
                  (v) => v.userId !== session.data?.user?.email
                ),
                _count: {
                  ...value._count,
                  Hearts: value._count.Hearts - 1,
                },
              };
              queryClient.setQueryData(querykey, shallow);
            }
          }
        }
      });
    },
    onError() {
      const queryCache = queryClient.getQueryCache();
      const queryKeys = queryCache.getAll().map((cache) => cache.queryKey);

      queryKeys.forEach((querykey) => {
        if (querykey[0] === "posts") {
          const value: Post | InfiniteData<Post[]> | undefined =
            queryClient.getQueryData(querykey); // 게시글
          console.log("벨류", value);
          // 싱글포스트 일 수도 있기때문에 조건문 걸어줌.
          // 값이 존재하고 그값이 'pages' 라는 속성을 가지고 있는지 확인
          if (value && "pages" in value) {
            // flat으로 2차원배열 평탄화(1차원배열)해서 접근
            const obj = value.pages.flat().find((v) => v.postId === postId);

            if (obj) {
              // 존재는 하는지
              const pageIndex = value.pages.findIndex((page) =>
                page.includes(obj)
              );
              const index = value.pages[pageIndex].findIndex(
                (v) => v.postId === postId
              );
              const shallow = { ...value };

              // 옅은복사 (인덱스 페이지로 좋아요누른 페이지에 접근후 작업)
              value.pages = { ...value.pages };
              value.pages[pageIndex] = [...value.pages[pageIndex]];
              shallow.pages[pageIndex][index] = {
                ...shallow.pages[pageIndex][index],
                Hearts: [{ userId: session.data?.user?.email as string }],
                _count: {
                  ...shallow.pages[pageIndex][index]._count,
                  Hearts: shallow.pages[pageIndex][index]._count.Hearts + 1,
                },
              };
              // 옅은 복사해준것을 쿼리에 전송
              queryClient.setQueryData(querykey, shallow);
            }
          } else if (value) {
            // 싱글 포스트인 경우
            if (value.postId === postId) {
              const shallow = {
                ...value,
                Hearts: [{ userId: session.data?.user?.email as string }],
                _count: {
                  ...value._count,
                  Hearts: value._count.Hearts + 1,
                },
              };
              queryClient.setQueryData(querykey, shallow);
            }
          }
        }
      });
    },
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });

  const repost = useMutation({
    mutationFn: () => {
      return fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${post.postId}/reposts`,
        {
          method: "post",
          credentials: "include",
        }
      );
    },
    async onSuccess(response) {
      const data = await response.json();
      const queryCache = queryClient.getQueryCache();
      const queryKeys = queryCache.getAll().map((cache) => cache.queryKey);
      queryKeys.forEach((querykey) => {
        if (querykey[0] === "posts") {
          const value: Post | InfiniteData<Post[]> | undefined =
            queryClient.getQueryData(querykey); // 게시글
            
            // 싱글포스트 일 수도 있기때문에 조건문 걸어줌.
            // 값이 존재하고 그값이 'pages' 라는 속성을 가지고 있는지 확인
            if (value && "pages" in value) {
              // flat으로 2차원배열 평탄화(1차원배열)해서 접근
              // obj : 로그인된 아이디로 작성한 게시글 찾아줌
              const obj = value.pages.flat().find((v) => v.postId === postId);
              
              if (obj) {
                // pageIndex : 10개씩 뭉처있는 배열이 있는데
                // 몇번째 배열에 해당 게시글이 존재하는지 알려줌
                const pageIndex = value.pages.findIndex((page) =>
                  page.includes(obj)
              );

              // 뭉처있는 게시글 사이에서 내가 좋아요 누른 게시글 postId가 맞는 index 를 찾아줌
              const index = value.pages[pageIndex].findIndex(
                (v) => v.postId === postId
              );
              const shallow = { ...value };

              // 옅은복사 (인덱스 페이지로 좋아요누른 페이지에 접근후 작업)
              value.pages = { ...value.pages }; // 좋아요 개수 상승된 값으로 변경
              // console.log("옅은복사 value.pages : ", value.pages)
              value.pages[pageIndex] = [...value.pages[pageIndex]];
              shallow.pages[pageIndex][index] = {
                ...shallow.pages[pageIndex][index],
                Reposts: [{ userId: session.data?.user?.email as string }],
                _count: {
                  ...shallow.pages[pageIndex][index]._count,
                  Reposts: shallow.pages[pageIndex][index]._count.Reposts + 1,
                },
              };
              shallow.pages[0].unshift(data);
              console.log("리포스트테스트 추가부분 : ", shallow.pages);
              console.log("리포스트테스트 추가부분 value.pages : ", value.pages);
              // 옅은 복사해준것을 쿼리에 전송
              queryClient.setQueryData(querykey, shallow);
            }
          } else if (value) {
            // 싱글 포스트인 경우
            if (value.postId === postId) {
              const shallow = {
                ...value,
                Reposts: [{ userId: session.data?.user?.email as string }],
                _count: {
                  ...value._count,
                  Reposts: value._count.Reposts + 1,
                },
              };
              queryClient.setQueryData(querykey, shallow);
            }
          }
          
        }
      });
    },
  });

  const deleteRepost = useMutation({
    mutationFn: () => {
      return fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${post.postId}/reposts`,
        {
          method: "delete",
          credentials: "include",
        }
      );
    },
    onSuccess() {
      const queryCache = queryClient.getQueryCache();
      const queryKeys = queryCache.getAll().map((cache) => cache.queryKey);

      queryKeys.forEach((querykey) => {
        if (querykey[0] === "posts") {
          const value: Post | InfiniteData<Post[]> | undefined =
            queryClient.getQueryData(querykey); // 게시글
          
          // 싱글포스트 일 수도 있기때문에 조건문 걸어줌.
          // 값이 존재하고 그값이 'pages' 라는 속성을 가지고 있는지 확인
          if (value && "pages" in value) {
            // flat으로 2차원배열 평탄화(1차원배열)해서 접근
            const obj = value.pages.flat().find((v) => v.postId === postId);
            // 재게시글이 있는지 && 유저가 일치하는지
            const repost = value.pages.flat().find((v)=> v.Original?.postId === postId && v.User.id === session?.data?.user?.email);
            if (obj) {
              // 존재는 하는지
              const pageIndex = value.pages.findIndex((page) =>
                page.includes(obj)
              );
              const index = value.pages[pageIndex].findIndex(
                (v) => v.postId === postId
              );
              const shallow = { ...value };

              // 옅은복사 (인덱스 페이지로 좋아요누른 페이지에 접근후 작업)
              value.pages = { ...value.pages };
              value.pages[pageIndex] = [...value.pages[pageIndex]];
              shallow.pages[pageIndex][index] = {
                ...shallow.pages[pageIndex][index],
                Reposts: shallow.pages[pageIndex][index].Reposts.filter(
                  (v) => v.userId !== session.data?.user?.email
                ),
                _count: {
                  ...shallow.pages[pageIndex][index]._count,
                  Reposts: shallow.pages[pageIndex][index]._count.Reposts - 1,
                },
              };

              // 재게시 삭제
              // 재게시글이 어떤 페이지에 있는지 모르니까 모든페이지를 한번씩 돌아본다.
              // repost게시글 안에 postId와 현재 게시글의 postId가 일치하지않는 것을 게시글 목록에서 제거한다
              shallow.pages = shallow.pages.map((page) => {
                return page.filter((v) => v.postId !== repost?.postId)
              })
              // 옅은 복사해준것을 쿼리에 전송
              queryClient.setQueryData(querykey, shallow);
              console.log("리포스트테스트 삭제부분 : ", shallow.pages);
              console.log("리포스트테스트 삭제부분 value.pages : ", value.pages);
            }
          } else if (value) {
            // 싱글 포스트인 경우
            if (value.postId === postId) {
              const shallow = {
                ...value,
                Reposts: value.Reposts.filter(
                  (v) => v.userId !== session.data?.user?.email
                ),
                _count: {
                  ...value._count,
                  Reposts: value._count.Reposts - 1,
                },
              };
              queryClient.setQueryData(querykey, shallow);
            }
          }
        }
      });
    },
  });

  // 댓글
  const onClickComment: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    modalStore.setMode('comment');
    modalStore.setData(post);
    router.push('/compose/tweet');
  };

  // 재게시
  const onClickRepost: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    if (!reposted) {
      repost.mutate();
    } else {
      deleteRepost.mutate();
    }
  };

  // 좋아요
  const onClickHeart: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    if (liked) {
      unheart.mutate();
    } else {
      heart.mutate();
    }
  };

  return (
    <div className={style.actionButtons}>
      <div
        className={cx(
          style.commentButton,
          white && style.white
        )}
      >
        <button onClick={onClickComment}>
          <svg width={24} viewBox="0 0 24 24" aria-hidden="true">
            <g>
              <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path>
            </g>
          </svg>
        </button>
        <div className={style.count}>{post._count.Reposts || ""}</div>
      </div>
      <div
        className={cx(
          style.repostButton,
          reposted && style.reposted,
          white && style.white
        )}
      >
        <button onClick={onClickRepost}>
          <svg width={24} viewBox="0 0 24 24" aria-hidden="true">
            <g>
              <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path>
            </g>
          </svg>
        </button>
        <div className={style.count}>{post._count.Comments || ""}</div>
      </div>
      <div
        className={cx([
          style.heartButton,
          liked && style.liked,
          white && style.white,
        ])}
      >
        <button onClick={onClickHeart}>
          <svg width={24} viewBox="0 0 24 24" aria-hidden="true">
            <g>
              <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
            </g>
          </svg>
        </button>
        <div className={style.count}>{post._count.Hearts || ""}</div>
      </div>
    </div>
  );
}
