"use client"

import { signOut, useSession } from "next-auth/react";
import style from "./logoutButton.module.css";
import { useRouter } from "next/navigation";
import { Session } from "@auth/core/types";

type Props=  {
  me : Session | null
}

export default function LogoutButton({me} : Props) {

  const router = useRouter();
  // 회원가입을 하자마자 로그인 하면 이 값이 없어지므로
  // 상위 컴포넌트에서 auth 의 session을 props 받아서 사용
  // const { data: me } = useSession();
  // console.log(me)
  const onLogout = () => {
    signOut({redirect : false})
    .then(() => {
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