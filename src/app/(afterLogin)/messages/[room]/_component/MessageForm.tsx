"use client";
import style from './messageForm.module.css';
import TextareaAutosize from "react-textarea-autosize";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import useSocket from '../_lib/useSocket';
import { useSession } from 'next-auth/react';

interface Props {
  id : string
}

const MessageForm = ({ id }:Props) => {

  const [content, setContent] = useState('');
  // 이것만 추가하면 소켓 연결이 됨
  const [socket] = useSocket();
  const { data: session } = useSession();

  const onChangeContent = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // soket.io
    // 서버에서의 약속 'sendMessage' 로 보내면 실시간으로 채팅이 간다는 이벤트 이름
    socket?.emit('sendMessage', {
      senderId: session?.user?.email,
      receiverId : id,
      content,
    });
    setContent('');
  }

  const onEnter = () => {
 
  }

  // 서버로 부터 데이터를 실시간으로 받아올 수 있다.
  // socket을 사용할땐 항상 off로 꺼줘야 한다 그렇지 않으면 이벤트 리스너가 계속 연결되기 때문
  useEffect(()=> {
    socket?.on('receiveMessage', (data) => {
      console.log('data : ',data);
    });
    return () => {
      socket?.off('receiveMessage');
    }
  },[socket])

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