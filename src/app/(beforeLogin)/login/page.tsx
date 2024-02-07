"use client";

import styles from "@/app/page.module.css";
import zLogo from "../../../../public/zlogo.png";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

// 리다이렉트 되는곳
const Login = () => {
  const router = useRouter();
  router.replace("/i/flow/login");
  return (
    <>
      <div className={styles.left}>
        <Image src={zLogo} alt="logo" />
      </div>
      <div className={styles.right}>
        <h1>지금 일어나고 있는 일</h1>
        <h2>지금 가입하세요.</h2>
        <Link href="/i/flow/signup" className={styles.signup}>
          계정 만들기
        </Link>
        <h3>이미 트위터에 가입하셨나요?</h3>
        <Link href="/login" className={styles.login}>
          로그인
        </Link>
        {/** /login 에서 /i/flow/login으로 리다이렉트 가 되기에
         *  /login 배경을 메인페이지와 동일하게 만들어 주어야 한다.
        */}
      </div>
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
