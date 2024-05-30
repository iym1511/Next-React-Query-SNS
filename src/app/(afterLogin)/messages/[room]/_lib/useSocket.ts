import { Socket, io } from "socket.io-client";
import { useCallback, useEffect, useState } from "react";

let socket: Socket | null;

const useSocket = () => {

  // 웹 소켓 연결을 종료하는 함수
  const disconnect = useCallback(()=> {
    socket?.disconnect();
    socket = null;
  },[]);

  useEffect(()=>{
    // 중복 연결방지를 위해 socket이 없때만 작동
    if(!socket){
      // 서버와 웹소켓 연결
      const socketResult = io(`${process.env.NEXT_PUBLIC_BASE_URL}/messages`, {
        transports: ['websocket'] // 대충 구형 신경안쓰고 신형 브라우저 고려함
      })
      // 에러 처리
      socketResult.on('connect_error',(err)=>{
        console.error(err);
        console.log(`connect_error due to ${err.message}`);
      })
      socket = socketResult;
    }
  },[])

  return [socket, disconnect];
}
 
export default useSocket;