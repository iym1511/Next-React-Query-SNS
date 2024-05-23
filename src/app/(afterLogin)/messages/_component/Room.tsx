"use client"

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {useRouter} from "next/navigation";
import 'dayjs/locale/ko';
import style from '../message.module.css'
import { faker } from "@faker-js/faker";
import { Room as RoomType } from '@/model/Room';


// 한글 플러그인
dayjs.locale('ko');
dayjs.extend(relativeTime)

type Props = {
  room : RoomType,
}

const Room = ({room} : Props) => {

  const router = useRouter();

  const onClick = () => {
    router.push(`/messages/${room.room}`);
  }


  return (
    <div className={style.room} onClickCapture={onClick}>
      <div className={style.roomUserImage}>
        <img src={room.Receiver.image} alt="" />
      </div>
      <div className={style.roomChatInfo}>
        <div className={style.roomUserInfo}>
          <b>{room.Receiver.id}</b>
          &nbsp;
          <span>@{room.Receiver.id}</span>
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