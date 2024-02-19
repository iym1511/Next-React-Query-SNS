import Post from "@/app/(afterLogin)/_component/Post";
import CommentForm from "@/app/(afterLogin)/[username]/status/[id]/_component/CommentForm";
import ActionButtons from "@/app/(afterLogin)/_component/ActionButtons";
import style from './photoModal.module.css';
import PhotoModalCloseButton
  from "@/app/(afterLogin)/@modal/[username]/status/[id]/photo/[photoId]/_component/PhotoModalCloseButton";
import {faker} from "@faker-js/faker";

export default function Default() {
  const photo = {
    imageId: 1,
    link: faker.image.urlLoremFlickr(), // 랜덤 이미지
    Post: {
      content: faker.lorem.text() // 랜덤 텍스트
    }
  }

  // 컴포넌트에 Prop해줄때 그냥 변수만 넘기면 boolean형태로 사용가능하다
  // ex) white == white = {true} 
  return (
    <div className={style.container}>
      <PhotoModalCloseButton />
      <div className={style.imageZone}>
        <img src={photo.link} alt={photo.Post?.content} />
        <div className={style.image} style={{backgroundImage: `url(${photo.link})`}} />
        <div className={style.buttonZone}>
          <div className={style.buttonInner}>
            <ActionButtons white/>
          </div>
        </div>
      </div>
      <div className={style.commentZone}>
        <Post noImage/> 
        <CommentForm />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
      </div>
    </div>
  );
}