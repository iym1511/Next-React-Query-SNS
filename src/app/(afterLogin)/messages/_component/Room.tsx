"use client"

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {useRouter} from "next/navigation";
import 'dayjs/locale/ko';
import style from '../message.module.css'
import { faker } from "@faker-js/faker";

// 한글 플러그인
dayjs.locale('ko');
dayjs.extend(relativeTime)

const Room = () => {

  const router = useRouter();

  const user = {
    id:'hero',
    nickname: '영웅',
    Messages: [
      {
        roomId: 123,
        content:'안녕하세요',
        createdAt: new Date()
      },
      {
        roomId: 123,
        content:'안녕히 가셈',
        createdAt: new Date()
      }
    ]
  }

  const onClick = () => {
    router.push(`/messages/${user.Messages.at(-1)?.roomId}`);
  }


  return (
    <div className={style.room} onClickCapture={onClick}>
      <div className={style.roomUserImage}>
        <img src={faker.image.avatar()} alt="" />
      </div>
      <div className={style.roomChatInfo}>
        <div className={style.roomUserInfo}>
          <b>{user.nickname}</b>
          &nbsp;
          <span>@{user.id}</span>
          .
          &nbsp;
          <span className={style.postDate}>
            {/* at(-1) : 마지막 메시지 */}
            {dayjs(user.Messages?.at(-1)?.createdAt).fromNow(true)}
          </span>
        </div>
        <div className={style.roomUserInfo}>
          {user.Messages?.at(-1)?.content}
        </div>
      </div>
    </div>
  );
};

export default Room;