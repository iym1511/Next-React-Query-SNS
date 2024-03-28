"use client"

import {ChangeEventHandler, FormEventHandler, useRef, useState} from "react";
import style from './postForm.module.css';
import { useSession } from "next-auth/react";
import { Session } from "@auth/core/types";
import TextareaAutosize from 'react-textarea-autosize';

type Props = {
  me : Session | null
}

export default function PostForm({me}:Props) {
  const imageRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState<Array<{dataUrl : string, file : File} | null>>([]);

  const onChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setContent(e.target.value);
  } 

  const onUpload: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    if(e.target.files){
      Array.from(e.target.files).forEach((file,i) => {
        const reader = new FileReader();
        // reader.readAsDataURL() 가 호출되면 실행
        reader.onloadend = () => {
          setPreview((prevPreview) => {
            const prev = [...prevPreview];
            prev[i] = {
              dataUrl : reader.result as string,
              file
            }
            return prev;
          });
        };

        // DataURL은 이미지데이터를 문자열로 나타낸 것으로 img src에 사용할 수 있다.
        reader.readAsDataURL(file); // 하나의 파일마다 DataURL 이라는 걸로 읽는다. / 무조건 string으로 반환
      });

    }
  }

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('content', content);
    preview.forEach((p,i) => {
      p && formData.append('images', p.file)
    })

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`, {
      method: 'post',
      credentials: 'include',
      body: formData,
    })
  }

  // imageRef.current가 null 또는 undefined인 경우에는 그냥 undefined를 반환하고, 그렇지 않은 경우에는 click()
  const onClickButton = () => {
    // null 값일 수 있기 떄문에 옵셔널채이닝으로 작성
    imageRef.current?.click();
  }

  const onRemoveImage = (index: number) => () => {
    setPreview((prevPreview) => {
      const prev = [...prevPreview];
      prev[index] = null;
      return prev;
    })
  };

  return (
    <form className={style.postForm} onSubmit={onSubmit}>
      <div className={style.postUserSection}>
        <div className={style.postUserImage}> 
          <img src={me?.user?.image as string} alt={me?.user?.email as string} />
        </div>
      </div>
      <div className={style.postInputSection}>
        <TextareaAutosize value={content} onChange={onChange} placeholder="무슨 일이 일어나고 있나요?"/>
        <div style={{display:"flex", flex:"1"}}>
          {preview.map((v,index) => (
            v && (<div key={index} onClick={onRemoveImage(index)}>
                    <img style={{width:'100%', objectFit:'contain', maxHeight:'100px'}} src={v.dataUrl} alt="미리보기"/>
                  </div>)
          ))}
        </div>
        <div className={style.postButtonSection}>
          <div className={style.footerButtons}>
            <div className={style.footerButtonLeft}>
              <input type="file" name="imageFiles" multiple hidden ref={imageRef} onChange={onUpload}/>
              <button className={style.uploadButton} type="button" onClick={onClickButton}>
                <svg width={24} viewBox="0 0 24 24" aria-hidden="true">
                  <g>
                    <path
                      d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path>
                  </g>
                </svg>
              </button>
            </div>
            <button className={style.actionButton} disabled={!content}>게시하기</button>
          </div>
        </div>
      </div>
    </form>
  )
}