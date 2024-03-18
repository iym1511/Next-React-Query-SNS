"use client";
import style from "@/app/(afterLogin)/_component/rightSearchZone.module.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SearchForm from "./SearchForm";

const RightSearchZone = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();


  // defaultChecked 말고 다른 버튼 눌렀을때 표시
  const onChangeFollow = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('pf','on');
    router.replace(`/search?${newSearchParams.toString()}`);
  };

  // defaultChecked 버튼 눌렀을때 주소값 되돌아옴
  const onChangeAll = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('pf');
    router.replace(`/search?${newSearchParams.toString()}`);
  };

  if (pathname === "/explore") {
    return null;
  }
  if (pathname === "/search") {
    return (
      <div>
        <h5 className={style.filterTitle}>검색 필터</h5>
        <div className={style.filterSection}>
          <div>
            <label>사용자</label>
            <div className={style.radio}>
              <div>모든 사용자</div>
              <input
                type="radio"
                name="pf"
                defaultChecked
                onChange={onChangeAll}
              />
            </div>
            <div className={style.radio}>
              <div>내가 팔로우하는 사람들</div>
              <input
                type="radio"
                name="pf"
                value="on"
                onChange={onChangeFollow}
              />
            </div>
          </div>
          <div>
            <label>위치</label>
            <div className={style.radio}>
              <div>어디에서나</div>
              <input
                type="radio"
                name="pf2"
                defaultChecked
                onChange={onChangeAll}
              />
            </div>
            <div className={style.radio}>
              <div>현 위치 주변</div>
              <input
                type="radio"
                name="pf2"
                value="on"
                onChange={onChangeFollow}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "60px", width: "inherit" }}>
      <SearchForm />
    </div>
  );
};

export default RightSearchZone;
