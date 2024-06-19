"use client"

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {useRouter} from "next/navigation";
import 'dayjs/locale/ko';
import style from '../message.module.css'
import { Room as RoomType } from '@/model/Room';
import { useSession } from 'next-auth/react';


// 한글 플러그인
dayjs.locale('ko');
dayjs.extend(relativeTime)

type Props = {
  room : RoomType,
}

const Room = ({room} : Props) => {

  const { data : session} = useSession();
  const router = useRouter();

  const onClick = () => {
    router.push(`/messages/${room.room}`);
  }
  

  const user = room.Receiver.id === session?.user?.email ? room.Sender : room.Receiver;
  
  return (
    <div className={style.room} onClickCapture={onClick}>
      <div className={style.roomUserImage}>
        <img src={user.image} alt="" />
      </div>
      <div className={style.roomChatInfo}>
        <div className={style.roomUserInfo}>
          <b>{user.nickname}</b>
          &nbsp;
          <span>@{user.id}</span>
          &nbsp;
          .
          &nbsp;
          <span className={style.postDate}>
            {/* at(-1) : 마지막 메시지 */}
            {dayjs(room.createdAt).fromNow(true)}
          </span>
        </div>
        <div className={style.roomUserInfo}>
          {room.content}
        </div>
      </div>
    </div>
  );
};

export default Room;