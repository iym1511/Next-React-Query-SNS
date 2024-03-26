"use server";

import { signIn } from "@/auth";
import { redirect } from "next/navigation";
// import axios from "axios";

export default async (prevState: any,formData: FormData) => {
  // 입력값이 없거나 || 빈칸이 존재하지않을때
  if (!formData.get("id") || !(formData.get("id") as string)?.trim()) {
    return { message: "no_id" };
  }
  if (!formData.get("name") || !(formData.get("name") as string)?.trim()) {
    return { message: "no_name" };
  }
  if (!formData.get("password") || !(formData.get("password") as string)?.trim()) {
    return { message: "no_password" };
  }
  if (!formData.get("image")) {
    return { message: "no_image" };
  }
  formData.set("nickname", formData.get("name") as string);
  let shouldRedirect = false;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`,{
        method : 'post',
        body: formData,
        credentials: "include", // 쿠기 전달 가능캐 함
      });
      console.log("회원가입상태 : ",response.status);
      console.log(await response.json());
      
      // 회원가입시 이미 가입되어있을때
      if (response.status === 403) {
        return { message: "user_exists" };
      }

      shouldRedirect = true;

      await signIn("credentials", {
        username: formData.get('id'),
        password: formData.get('password'),
        redirect: false,
      })
      
    } catch (err) {
      console.error(err);
      return {message : null};
    }
    console.log("11")
    
    if (shouldRedirect) {
      console.log("리다이랙트");
      redirect("/home");
    }

    return { message: null};
};