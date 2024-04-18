"use client";

import style from "@/app/(afterLogin)/[username]/profile.module.css";
import BackButton from "@/app/(afterLogin)/_component/BackButton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@/model/User";
import { getUser } from "@/app/(afterLogin)/[username]/_lib/getUser";
import cx from "classnames";
import { useSession } from "next-auth/react";
import { MouseEventHandler } from "react";

type Props = {
  username: string;
};
export default function UserInfo({ username }: Props) {
  const { data: user, error } = useQuery<
    User,
    Object,
    User,
    [_1: string, _2: string]
  >({
    queryKey: ["users", username],
    queryFn: getUser,
    staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
    gcTime: 300 * 1000,
  });

  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const follow = useMutation({
    mutationFn: (userId: string) => {
      return fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}/follow`,
        {
          credentials: "include",
          method: "post",
        }
      );
    },
    onMutate(userId: string) {
      /** 데이터 가져오기 */
      const value: User[] | undefined = queryClient.getQueryData([
        "users",
        "followRecommends",
      ]);
      if (value) {
        const index = value.findIndex((v) => v.id === userId);
        /** 변경된 값 */
        const shallow = [...value];

        shallow[index] = {
          ...shallow[index],
          Followers: [
            {
              userId: session?.user?.email as string,
            },
          ],
          _count: {
            ...shallow[index]._count,
            Followers: shallow[index]._count?.Followers + 1,
          },
        };
        console.log("index : ", index, "shallow", shallow);
        queryClient.setQueryData(["users", "followRecommends"], shallow);
      }

      /** 개인 프로필 팔로우 상태 (post)*/
      const value2: User | undefined = queryClient.getQueryData(["users", userId]);
      if (value2) {
        /** 변경된 값 */
        const shallow = {
          ...value2,
          Followers: [{ userId: session?.user?.email as string }],
          _count: {
            ...value2._count,
            Followers: value2._count?.Followers + 1,
          },
        };
        queryClient.setQueryData(["users", userId], shallow);
      }
    },
    onError(error, userId: string) {
      /** 데이터 가져오기 */
      const value: User[] | undefined = queryClient.getQueryData([
        "users",
        "followRecommends",
      ]);

      if (value) {
        const index = value.findIndex((v) => v.id === userId);
        /** 변경된 값 */
        const shallow = [...value];

        shallow[index] = {
          ...shallow[index],
          Followers: shallow[index].Followers.filter(
            (v) => v.userId !== session?.user?.email
          ), // 본인 제거
          _count: {
            ...shallow[index]._count,
            Followers: shallow[index]._count?.Followers - 1,
          },
        };
        console.log("index : ", index, "shallow", shallow);
        queryClient.setQueryData(["users", "followRecommends"], shallow);
      }

      /** 개인 프로필 팔로우 상태 (delete)*/
      const value2: User | undefined = queryClient.getQueryData([
        "users",
        userId,
      ]);
      if (value2) {
        /** 변경된 값 */
        const shallow = {
          ...value2,
          Followers: value2.Followers.filter(
            (v) => v.userId != session?.user?.email
          ),
          _count: {
            ...value2._count,
            Followers: value2._count?.Followers - 1,
          },
        };
        queryClient.setQueryData(["users", userId], shallow);
      }
    },
  });

  const unfollow = useMutation({
    mutationFn: (userId: string) => {
      return fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/${userId}/follow`,
        {
          method: "delete",
          credentials: "include",
        }
      );
    },
    onMutate(userId: string) {
      /** 데이터 가져오기 */
      const value: User[] | undefined = queryClient.getQueryData([
        "users",
        "followRecommends",
      ]);

      if (value) {
        const index = value.findIndex((v) => v.id === userId);
        /** 변경된 값 */
        const shallow = [...value];

        shallow[index] = {
          ...shallow[index],
          Followers: shallow[index].Followers.filter(
            (v) => v.userId !== session?.user?.email
          ), // 본인 제거
          _count: {
            ...shallow[index]._count,
            Followers: shallow[index]._count?.Followers - 1,
          },
        };
        console.log("index : ", index, "shallow", shallow);
        queryClient.setQueryData(["users", "followRecommends"], shallow);
      }

      /** 개인 프로필 팔로우 상태 (delete)*/
      const value2: User | undefined = queryClient.getQueryData([
        "users",
        userId,
      ]);
      if (value2) {
        /** 변경된 값 */
        const shallow = {
          ...value2,
          Followers: value2.Followers.filter(
            (v) => v.userId != session?.user?.email
          ),
          _count: {
            ...value2._count,
            Followers: value2._count?.Followers - 1,
          },
        };
        queryClient.setQueryData(["users", userId], shallow);
      }
    },
    onError(error, userId: string) {
      /** 데이터 가져오기 */
      const value: User[] | undefined = queryClient.getQueryData([
        "users",
        "followRecommends",
      ]);
      if (value) {
        const index = value.findIndex((v) => v.id === userId);
        /** 변경된 값 */
        const shallow = [...value];

        shallow[index] = {
          ...shallow[index],
          Followers: [
            {
              userId: session?.user?.email as string,
            },
          ],
          _count: {
            ...shallow[index]._count,
            Followers: shallow[index]._count?.Followers + 1,
          },
        };
        console.log("index : ", index, "shallow", shallow);
        queryClient.setQueryData(["users", "followRecommends"], shallow);
      }

      /** 개인 프로필 팔로우 상태 (post)*/
      const value2: User | undefined = queryClient.getQueryData([
        "users",
        userId,
      ]);
      if (value2) {
        /** 변경된 값 */
        const shallow = {
          ...value2,
          Followers: [{ userId: session?.user?.email as string }],
          _count: {
            ...value2._count,
            Followers: value2._count?.Followers + 1,
          },
        };
        queryClient.setQueryData(["users", userId], shallow);
      }
    },
  });

  const onFollow: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (followed) {
      // useMutation에서 매게변수로 쓰이는 인자 전달.
      unfollow.mutate(user.id);
    } else {
      follow.mutate(user.id);
    }
  };

  if (error) {
    return (
      <>
        <div className={style.header}>
          <BackButton />
          <h3 className={style.headerTitle}>프로필</h3>
        </div>
        <div className={style.userZone}>
          <div className={style.userImage}></div>
          <div className={style.userName}>
            <div>@{username}</div>
          </div>
        </div>
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
          계정이 존재하지 않음
        </div>
      </>
    );
  }
  if (!user) {
    return null;
  }

  const followed = user.Followers?.find(
    (v) => v.userId === session?.user?.email
  );
    console.log("팔로우드",followed);

  return (
    <>
      <div className={style.header}>
        <BackButton />
        <h3 className={style.headerTitle}>{user.nickname}</h3>
      </div>
      <div className={style.userZone}>
        <div className={style.userImage}>
          <img src={user.image} alt={user.id} />
        </div>
        <div className={style.userName}>
          <div>{user.nickname}</div>
          <div>@{user.id}</div>
        </div>
        
        {user.id !== session?.user?.email && 
          <button onClick={onFollow} className={cx(style.followButton, followed && style.followed)}>
            {followed ? "팔로잉" : "팔로우"}
          </button>
        }
      </div>
    </>
  );
}
