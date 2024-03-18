"use client";

import style from "../search.module.css";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Tab = () => {
  const [current, setCurrent] = useState("hot");
  const router = useRouter();
  const searchParams = useSearchParams();
  console.log(searchParams.get('q'))

  // 검색필터 사용시 if문이 true가 되어  q="제로초"&pf=on 이런식으로 붙음
  const onClickHot = () => {
    setCurrent("hot");
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('f');
    router.replace(`/search?${newSearchParams.toString()}`);
  };

  const onClickNew = () => {
    setCurrent("new");
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('f','live');
    // 기존의 주소를 사용하고 새 주소를 뒤에붙일때 toString()
    router.replace(`/search?${newSearchParams.toString()}`);
  };
  return (
    <div className={style.homeFixed}>
      <div className={style.homeTab}>
        <div onClick={onClickHot}>
          인기
          <div className={style.tabIndicator} hidden={current === "new"}></div>
        </div>
        <div onClick={onClickNew}>
          최신
          <div className={style.tabIndicator} hidden={current === "hot"}></div>
        </div>
      </div>
    </div>
  );
};

export default Tab;
