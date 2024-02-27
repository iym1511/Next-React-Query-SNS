import { NextResponse } from "next/server";
import { auth } from "./auth";

export async function middleware() {
  const session = await auth();
  if(!session) {
    return NextResponse.redirect(`http://localhost:3000/i/flow/login`)
  }
}

/** 미들웨어를 적용할 라우트 (로그인을 해야만 접속되는 페이지)*/
/** 로그인 안했을때 접속제한 */
export const config = {
  matcher: ['/compose/tweet', '/home', '/explore', '/messages', '/search'],
}
