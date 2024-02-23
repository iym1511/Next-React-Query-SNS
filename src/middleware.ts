export { auth as middleware} from "./auth" // 미들웨어 역할

/** 미들웨어를 적용할 라우트 (로그인을 해야만 접속되는 페이지)*/
/** 로그인 안했을때 접속제한 */
export const config = {
  matcher: ['/compose/tweet', '/home', '/expolore', '/messages', '/search'],
}
