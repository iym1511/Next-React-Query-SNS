import { faker } from "@faker-js/faker";
import style from "./chatRoom.module.css";
import cx from 'classnames'
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import MessageForm from "./_component/MessageForm";
import { auth } from "@/auth";
import { getUserServer } from "../../[username]/_lib/getUserServer";
import { QueryClient } from "@tanstack/react-query";
import UserInfo from "./_component/UserInfo";
import WebSocketComponent from "./_component/WebSocketComponent";


// 한글 플러그인
dayjs.locale('ko');
dayjs.extend(relativeTime)

type Props = {
  params : { room : string }
}

const ChatRoom = async ({ params }: Props) => {
  // room이 상대방과 내 아이디이기 때문에 ids에서 내 아이디만 걸러줄 수 있다.
  const session = await auth();
  const queryClient = new QueryClient();
  const ids = params.room.split('-').filter((v) => v !== session?.user?.email);
  if(!ids[0]){
    return null;
  }
  
  await queryClient.prefetchQuery({queryKey: ['users', ids[0]], queryFn: getUserServer})
  

  const user = {
    id: "hero",
    nickname: "영웅",
    image: faker.image.avatar(),
  };


  const messages = [
    {
      messageId: 1,
      roomId: 123,
      id: "zerohch0",
      content: "안녕하세요",
      createdAt: new Date(),
    },
    {
      messageId: 2,
      roomId: 123,
      id: "hero",
      content: "안녕히 가셈",
      createdAt: new Date(),
    },
  ];

  return (
    <main className={style.main}>
      <WebSocketComponent />
      <UserInfo id={ids[0]}/>
      <div className={style.list}>
        {messages.map((m, i) => {
          if (m.id === "zerohch0") {
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
        })}
      </div>
      <MessageForm id={ids[0]}/>
    </main>
  );
};

export default ChatRoom;
