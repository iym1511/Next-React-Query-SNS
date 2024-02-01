import Link from "next/link";

// app페이지에 걸리지 않을때 404 not found 페이지
const Notfound = () => {
  return (  
    <div>
      <div>이 페이지는 존재하지 않습니다. 다른 페이지를 검색해 보세요.</div>
      <Link href="/search">검색</Link>
    </div>
  );
}

export default Notfound;