"use client"

import { useQuery } from '@tanstack/react-query';
import style from './followRecommend.module.css';
import { User } from '@/model/User';

type Prop = {
  user : User
}

export default function FollowRecommend({user}:Prop) {

  const onFollow = () => {};

  return (
    <div className={style.container}>
      <div className={style.userLogoSection}>
        <div className={style.userLogo}>
          <img src={user.image} alt={user.id} />
        </div>
      </div>
      <div className={style.userInfo}>
        <div className={style.title}>{user.nickname}</div>
        <div className={style.count}>@{user.id}</div>
      </div>
      <div className={style.followButtonSection}>
        <button onClick={onFollow}>팔로우</button>
      </div>
    </div>
  )
}