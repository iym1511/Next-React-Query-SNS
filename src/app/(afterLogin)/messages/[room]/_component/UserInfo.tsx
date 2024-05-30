"use client";

import { getUser } from "@/app/(afterLogin)/[username]/_lib/getUser";
import BackButton from "@/app/(afterLogin)/_component/BackButton";
import style from "@/app/(afterLogin)/messages/message.module.css";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface Props {
  id: string;
}

const UserInfo = ({ id }: Props) => {
  const { data: user } = useQuery({
    queryKey: ["users", id],
    queryFn: getUser,
  });

  // 유저 채팅 데이터가 없는 경우 null 처리
  if (!user) {
    return null;
  }

  return (
    <>
      <div className={style.header}>
        <BackButton />
        <div>
          <h2>{user.nickname}</h2>
        </div>
      </div>
      <Link href={user.nickname} className={style.userInfo}>
        <img src={user.image} alt={user.id} />
        <div>
          <b>{user.nickname}</b>
        </div>
        <div>@{user.id}</div>
      </Link>
    </>
  );
};

export default UserInfo;
