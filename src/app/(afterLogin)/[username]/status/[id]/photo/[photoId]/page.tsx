// 인터셉팅 당할 컴포넌트
// photo 클릭 시 상세페이지 @modal 배경담당

import Home from "@/app/(afterLogin)/home/page";
// import PhotoPage from "@/app/(afterLogin)/[username]/status/[id]/page";

type Props = {
  params: {
    username: string,
    id: string,
    photoId: string
  }
}

// params = [] (슬러그)형태의 폴더 주소값을 받아올 수 있다.
const Page = ({params}: Props) => {
  console.log(params);
  return ( 
    <Home />
  );
}
 
export default Page;