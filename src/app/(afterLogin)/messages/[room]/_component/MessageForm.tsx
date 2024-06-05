"use client";
import style from './messageForm.module.css';
import TextareaAutosize from "react-textarea-autosize";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import useSocket from '../_lib/useSocket';
import { useSession } from 'next-auth/react';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { Message } from '@/model/Message';
import { useMessageStore } from '@/store/message';

interface Props {
  id : string
}

const MessageForm = ({ id }:Props) => {
  const [content, setContent] = useState('');
  const setGoDown = useMessageStore().setGoDown;
  // 이것만 추가하면 소켓 연결이 됨
  const [socket] = useSocket();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const onChangeContent = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!session?.user?.email){
      return;
    }
    const ids = [session.user.email, id];
    ids.sort();
    // soket.io
    // 서버에서의 약속 'sendMessage' 로 보내면 실시간으로 채팅이 간다는 이벤트 이름
    socket?.emit('sendMessage', {
      senderId: session?.user?.email,
      receiverId : id,
      content,
    });

    // 리액트 쿼리 데이터에 추가
    const exMessages = queryClient.getQueryData(['rooms', {senderId: session?.user?.email, receiverId: id} ,'messages']) as InfiniteData<Message[]>;
    if(exMessages && typeof exMessages === "object"){ // exMessages가 있고 타입검사 확인
      // exMessages 객체에서 pages 부분만 업데이트
      const newMessages = {
        ...exMessages,
        pages: [
          ...exMessages.pages
        ],
      };
      const lastPage = newMessages.pages.at(-1); // 배열 마지막 부분(채팅배열이 위치한 곳)
      const newLastPage = lastPage ? [...lastPage] : []; 
      let lastMessageId = lastPage?.at(-1)?.messageId; // 채팅배열 마지막부분 id
      newLastPage.push({
        senderId: session.user.email,
        receiverId: id,
        content,
        room: ids.join('-'), // 배열 마디를 - 로 연결
        messageId: lastMessageId ? lastMessageId + 1 : 1, // 메시지 아이디 증가
        createdAt: new Date(),
      });
      newMessages.pages[newMessages.pages.length - 1] = newLastPage; // 채팅배열쪽에 추가
      queryClient.setQueryData(['rooms', {senderId: session?.user?.email, receiverId: id} ,'messages'], newMessages); // 채팅 저장
      setGoDown(true);
    }
    setContent('');
  }

  const onEnter = () => {
 
  }


  return ( 
    <div className={style.formZone}>
      <form className={style.form} onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e)
      }}>
        <TextareaAutosize value={content} onChange={onChangeContent} onKeyDown={onEnter} placeholder="새 쪽지 작성하기"/>
        <button className={style.submitButton} type="submit" disabled={!content?.trim()}>
          <svg viewBox="0 0 24 24" width={18} aria-hidden="true"
               className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03">
            <g>
              <path
                d="M2.504 21.866l.526-2.108C3.04 19.719 4 15.823 4 12s-.96-7.719-.97-7.757l-.527-2.109L22.236 12 2.504 21.866zM5.981 13c-.072 1.962-.34 3.833-.583 5.183L17.764 12 5.398 5.818c.242 1.349.51 3.221.583 5.183H10v2H5.981z"></path>
            </g>
          </svg>
        </button>
      </form>
    </div>
  );
}
 
export default MessageForm;