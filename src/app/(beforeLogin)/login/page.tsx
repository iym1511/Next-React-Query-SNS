import { redirect } from "next/navigation";
import Main from "../_component/Main";
import { auth } from "@/auth";
import RedirectToLogin from "./_component/RedirectToLogin";

// 리다이렉트 되는곳
const Login = async () => {
  const session = await auth();

  if(session?.user){
    redirect('/home');
    return null;
  }

  return (
    <>
      {/* 컴포넌트가 마운트 되자마자 실행 */}
      <RedirectToLogin/>
      <Main />
      {/** /login 에서 /i/flow/login으로 리다이렉트 가 되기에
       *  /login 배경을 메인페이지와 동일하게 만들어 주어야 한다.
       */}
    </>
  );
};

export default Login;

// router.push 일때
// 바로 이전 페이지인 /login으로 돌아가기때문에 뒤로가기를 눌러도 계속 리다이렉트된다.
// localhost:3001 -> localhost:3001/login -> localhost:3001/i/flow/login

// router.replace 일때
// 이전 history를 없애기 때문에 맨 처음화면으로 감
// localhost:3001 -> localhost:3001/i/flow/login
