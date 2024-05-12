"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const RedirectToLogin = () => {
  const router = useRouter();
  useEffect(()=> {
    router.replace('/i/flow/login');
  },[]);
  return null;
}
 
export default RedirectToLogin;