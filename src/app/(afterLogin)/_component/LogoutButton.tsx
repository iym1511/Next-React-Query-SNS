"use client"

import { signOut, useSession } from "next-auth/react";
import style from "./logoutButton.module.css";
import { useRouter } from "next/navigation";
import { Session } from "@auth/core/types";
import { useQueryClient } from "@tanstack/react-query";

type Props=  {
  me : Session | null
}

export default function LogoutButton({me} : Props) {

  const router = useRouter();
  const queryClient = useQueryClient();
  // 회원가입을 하자마자 로그인 하면 이 값이 없어지므로
  // 상위 컴포넌트에서 auth 의 session을 props 받아서 사용
  // const { data: me } = useSession();
  // console.log(me)

   // 해당 키값쪽 데이터의 캐시를 날려줌
  const onLogout = () => {
    queryClient.invalidateQueries({
      queryKey : ["posts"],
    });
    queryClient.invalidateQueries({
      queryKey : ["users"],
    });
    signOut({redirect : false})
    .then(() => {
      // 백엔드 서버 로그아웃
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/logout`,{
        method: 'post',
        credentials: 'include'
      })
      router.replace('/');
    })
  };

  // 로그인된 사용자가 없으면 로그아웃 UI None
  if(!me?.user) {
    return null;
  }

  return (
    <button className={style.logOutButton} onClick={onLogout}>
      <div className={style.logOutUserImage}>
        <img src={me.user?.image!} alt={me.user?.email as string}/>
      </div>
      <div className={style.logOutUserName}>
        <div>{me.user?.name}</div>
        <div>@{me.user?.email}</div>
      </div>
    </button>
  )
}