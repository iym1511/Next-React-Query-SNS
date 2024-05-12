"use client";
import { TabContext } from './TabProvider';
import style from './tab.module.css';
import {useContext} from "react";

export default function Tab() {
  const {tab, setTab} = useContext(TabContext)

  const onClickRec = () => {
    setTab('rec');
  }
  const onClickFol = () => {
    setTab('fol');
  }

  // tab이 해당되는 것이 아니면 hidden으로 언더바css 제거 or 생성 해줌
  return (
    <div className={style.homeFixed}>
      <div className={style.homeText}>홈</div>
      <div className={style.homeTab}>
        <div onClick={onClickRec}>
          추천
          <div className={style.tabIndicator} hidden={tab === 'fol'}></div>
        </div>
        <div onClick={onClickFol}>
          팔로우 중
          <div className={style.tabIndicator} hidden={tab === 'rec'}></div>
        </div>
      </div>
    </div>
  )
}