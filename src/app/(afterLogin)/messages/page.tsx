import style from "./message.module.css";
import Room from './_component/Room'
import { Metadata } from "next";
import getRooms from "./_lib/getRooms";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "쪽지 / Z",
  description: "쪽지",
}


const Home = async () => {
  const session = await auth();
  // 데이터를 배열로 반환해주어야 하기 때문에 false일때도 배열로 지정
  const rooms = session?.user?.email ? await getRooms(session?.user?.email) : [];

  return (
    <main className={style.main}>
      <div className={style.header}>
        <h3>쪽지</h3>
      </div>
      {
        rooms.map((room)=> (
          <Room key={room.room} room={room}/>
        ))
      }
    </main>
  );
};

export default Home;
