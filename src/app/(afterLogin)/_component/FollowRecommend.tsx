"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import style from './followRecommend.module.css';
import { User } from '@/model/User';

type Prop = {
  user : User
}

export default function FollowRecommend({user}:Prop) {
  const followed = false;
  const queryClient = useQueryClient();

  const follow = useMutation({
    mutationFn : (userId:string) => {
      return  fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/${userId}/follow`,{
        method:'post',
        credentials:'include'
      });
    },
    onMutate() {
      // const queryCache = queryClient.getQueryCache();
      // const queryKeys = queryCache.getAll().map((cache) => cache.queryKey);
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
      const value:User[] | undefined = queryClient.getQueryData(['users', 'followRecommends']);
      if(value){
        const index = value.findIndex((v) => v.id === userId);
        const shallow = [...value]
      
        shallow[index] = {
          ...shallow[index],
          _count: {
            // 수정 요망 (내가적은거)
            Followers : shallow[index]._count.Followers + 1,
            Followings : shallow[index]._count.Followings + 1,
          }

        };
        console.log("index : ",index, "shallow",shallow);
      }
      queryClient.setQueryData(['users', 'followRecommends'], value);
    },
    onError() {
      
    }
  })

  const onFollow = () => {
    if(followed){
      unfollow.mutate();
    }else{
      follow.mutate();
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
      <div className={style.followButtonSection}>
        <button onClick={onFollow}>팔로우</button>
      </div>
    </div>
  )
}