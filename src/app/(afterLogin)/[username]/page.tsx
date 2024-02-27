import style from './profile.module.css';
import Post from "@/app/(afterLogin)/_component/Post";
import BackButton from "@/app/(afterLogin)/_component/BackButton";
import { auth } from '@/auth';
import { redirect, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default async function Profile() {

  const session = await auth();

  const user = {
    id: 'zerohch0',
    nickname: '제로초',
    image: '/5Udwvqim.jpg'
  };


  return (
    <main className={style.main}>
      <div className={style.header}>
        <BackButton />
        <h3 className={style.headerTitle}>{user.nickname}</h3>
      </div>
      <div className={style.userZone}>
        <div className={style.userImage}>
          <img src={user.image} alt={user.id}/>
        </div>
        <div className={style.userName}>
          <div>{user.nickname}</div>
          <div>@{user.id}</div>
        </div>
        { session?.user ? (
          <button className={style.followButton}>팔로우</button>
        ):(
          <Link className={style.followButton} href={session?.user ? '' : '/i/flow/login'}>팔로우</Link>
        )
        }
      </div>
      <div>
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
      </div>
    </main>
  )
}