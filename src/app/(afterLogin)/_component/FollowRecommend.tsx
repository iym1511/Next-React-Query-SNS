"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import style from './followRecommend.module.css';
import { User } from '@/model/User';
import { useSession } from 'next-auth/react';
import cx from 'classnames';

type Prop = {
  user : User
}

export default function FollowRecommend({user}:Prop) {

  const queryClient = useQueryClient();
  const {data : session} = useSession();
  const followed = !!user.Followers?.find((v) => v.userId === session?.user?.email);

  const follow = useMutation({
    mutationFn : (userId:string) => {
      return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}/follow`, {
        credentials: 'include',
        method: 'post',
      })
    },
    onMutate(userId : string) {
      /** 데이터 가져오기 */
      const value:User[] | undefined = queryClient.getQueryData(['users', 'followRecommends']);
      if(value){
        const index = value.findIndex((v) => v.id === userId);
        /** 변경된 값 */
        const shallow = [...value]
      
        shallow[index] = {
          ...shallow[index],
            Followers : [
              {
                userId : session?.user?.email as string,
              }
            ],
            _count : {
              ...shallow[index]._count,
              Followers : shallow[index]._count?.Followers +1,
            }
        };
        console.log("index : ",index, "shallow",shallow);
        queryClient.setQueryData(['users', 'followRecommends'], shallow);
      }
    },
    onError() {

    }
  })
  
  const unfollow = useMutation({
    mutationFn : (userId: string) => {
      return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/${userId}/follow`,{
        method:'delete',
        credentials:'include'
      });

    },
    onMutate(userId: string) {
      /** 데이터 가져오기 */
      const value:User[] | undefined = queryClient.getQueryData(['users', 'followRecommends']);
      
      if(value){
        const index = value.findIndex((v) => v.id === userId);
        /** 변경된 값 */
        const shallow = [...value]
 
        shallow[index] = {
          ...shallow[index],
            Followers : shallow[index].Followers.filter((v)=> v.userId !== session?.user?.email), // 본인 제거
            _count : {
              ...shallow[index]._count,
              Followers : shallow[index]._count?.Followers - 1,
            }
        };
        console.log("index : ",index, "shallow",shallow);
        queryClient.setQueryData(['users', 'followRecommends'], shallow);
      }
    },
    onError(error) {
      console.error(error);
    }
  })

  const onFollow = () => {
    console.log("followed : ",followed)
    if(followed){
      // useMutation에서 매게변수로 쓰이는 인자 전달.
      unfollow.mutate(user.id);
    }else{
      follow.mutate(user.id);
    }
  };

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
      <div className={cx(style.followButtonSection, followed && style.followed)}>
        <button onClick={onFollow}>{followed ? '팔로잉' : '팔로우'}</button>
      </div>
    </div>
  )
}