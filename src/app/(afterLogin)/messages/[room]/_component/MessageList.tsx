"use client";

import { DefaultError, InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import style from "@/app/(afterLogin)/messages/[room]/chatRoom.module.css";
import cx from 'classnames'
import dayjs from 'dayjs';
import getMessages from "../_lib/getMessages";
import { useSession } from "next-auth/react";
import { Message } from "@/model/Message";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef, useState } from "react";
import { useMessageStore } from "@/store/message";

interface Props {
  id : string
}

const MessageList = ({id}:Props) => {

  const { data : session } = useSession();
  const listRef = useRef<HTMLDivElement>(null);
  const [pageRendered, setPageRendered] = useState(false);
  const shouldGoDown = useMessageStore().shouldGoDown;
  const setGoDown = useMessageStore().setGoDown;

  const { data: messages, isFetching, hasPreviousPage, fetchPreviousPage } = useInfiniteQuery<Message[], DefaultError, InfiniteData<Message[]>, [string, {
    senderId: string,
    receiverId: string,
  }, string], number>({
      queryKey: ['rooms', {senderId: session?.user?.email!, receiverId:id} ,'messages'],
      queryFn: getMessages,
      initialPageParam : 0,
      getPreviousPageParam: (firstPage) => firstPage.at(0)?.messageId,  // 리버스 인피니트 스크롤
      getNextPageParam: (lastPage) => lastPage.at(-1)?.messageId,  // 사용하진 않지만 필수항목
      enabled: !!(session?.user?.email && id), // !(): false, !!(): true
    }
  );

  const { ref, inView } = useInView({
    threshold: 0,
    delay: 0
  })

  useEffect(()=> {
    // 리버스 이라서 이전 데이터 가져옴
    if(inView) {
      !isFetching && hasPreviousPage && fetchPreviousPage();
    }
  },[inView, isFetching, hasPreviousPage, fetchPreviousPage])

  let hasMessages = !!messages;
  useEffect(()=> {
    if(hasMessages) {
      console.log(listRef.current);
      if(listRef.current){
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
      setPageRendered(true);
    }
  },[hasMessages])

  useEffect(() => {
    if(shouldGoDown) {
      if(listRef.current){
        listRef.current.scrollTop = listRef.current.scrollHeight;
        setGoDown(false);
      }
    }
  },[shouldGoDown])

  return ( 
    <div className={style.list} ref={listRef}>
      {/* 인피니트 스크롤 */}
    { pageRendered && <div ref={ref} style={{ height: 50, backgroundColor: "yellow"}} /> }
    {messages?.pages.map((page) => page.map((m) => {
        if (m.senderId === session?.user?.email) { // 내 메시지 면
          return (
            <div key={m.messageId} className={cx(style.message, style.myMessage)}>
              <div className={style.content}>{m.content}</div>
              <div className={style.date}>{dayjs(m.createdAt).format('YYYY년 MM월 DD일 A HH시 mm분')}</div>
            </div>
          );
        } else {
          return (
            <div key={m.messageId} className={cx(style.message, style.yourMessage)}>
              <div className={style.content}>{m.content}</div>
              <div className={style.date}>{dayjs(m.createdAt).format('YYYY년 MM월 DD일 A HH시 mm분')}</div>
            </div>
          );
        }
      }))
    }
  </div>
   );
}
 
export default MessageList;