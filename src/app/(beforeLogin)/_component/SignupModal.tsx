"use client";

import BackButton from "@/app/(afterLogin)/_component/BackButton";
import style from "./signup.module.css";
import onSubmit from "../_lib/signup";
import { useFormState, useFormStatus } from "react-dom";

/* 글로벌 서비스를 할때 언어별 오류메시지 */
const showMessage = (message?: string | null) => {
  if (message === "no_id") {
    return "아이디를 입력하세요";
  }
  if (message === "no_name") {
    return "닉네임을 입력하세요";
  }
  if (message === "no_password") {
    return "비밀번호를 입력하세요";
  }
  if (message === "no_image") {
    return "이미지를 업로드하세요";
  }
  if (message === "no_exists") {
    return "이미 사용중인 아이디입니다";
  }
  return "";
};

export default function SignupModal() {
  // [state(함수에서 return되는 값), formAction(사용할 함수)]  =  (폼 스테이트에서 관리하는 함수, 반환값 기본형태)
  const [state, formAction] = useFormState(onSubmit, { message: null });
  // 처리중일때 가입버튼 활성x
  const { pending } = useFormStatus();
  console.log(pending);
  console.log(state?.message);
  console.log(state);

  return (
    <>
      <div className={style.modalBackground}>
        <div className={style.modal}>
          <div className={style.modalHeader}>
            <BackButton />
            <div>계정을 생성하세요.</div>
          </div>
          <form action={formAction}>
            <div className={style.modalBody}>
              <div className={style.inputDiv}>
                <label className={style.inputLabel} htmlFor="id">
                  아이디
                </label>
                <input
                  id="id"
                  name="id"
                  className={style.input}
                  type="text"
                  placeholder=""
                  required
                />
              </div>
              <div className={style.inputDiv}>
                <label className={style.inputLabel} htmlFor="name">
                  닉네임
                </label>
                <input
                  id="name"
                  name="name"
                  className={style.input}
                  type="text"
                  placeholder=""
                  required
                />
              </div>
              <div className={style.inputDiv}>
                <label className={style.inputLabel} htmlFor="password">
                  비밀번호
                </label>
                <input
                  id="password"
                  name="password"
                  className={style.input}
                  type="password"
                  placeholder=""
                  required
                />
              </div>
              <div className={style.inputDiv}>
                <label className={style.inputLabel} htmlFor="image">
                  프로필
                </label>
                <input
                  id="image"
                  name="image"
                  required
                  className={style.input}
                  type="file"
                  accept="image/*"
                />
              </div>
            </div>
            <div className={style.modalFooter}>
              <button
                type="submit"
                className={style.actionButton}
                disabled={pending}
              >
                가입하기
              </button>
              <div className={style.error}>{showMessage(state?.message)}</div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
