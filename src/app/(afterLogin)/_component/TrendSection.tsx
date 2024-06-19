"use client";

import { usePathname } from "next/navigation";
import Trend from "./Trend";
import style from "./trendSection.module.css";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { getTrends } from "@/app/(afterLogin)/_lib/getTrends";
import { IHashtag } from "@/model/Hashtag";

const TrendSection = () => {
  const { data : session } = useSession();

  const { data } = useQuery<IHashtag[]>({
    queryKey: ["trends"],
    queryFn: getTrends,
    staleTime : 60 * 1000, // n분 뒤에 fresh -> stale 로
    gcTime : 300 * 1000, // 5분뒤 메모리 정리
    enabled : !!session?.user
  });


  const pathname = usePathname();
  console.log(session);

  if (pathname === "/explore") {
    return null;
  }

  // 로그인 했을때 트렌드 보여줌
  if (session?.user) {
    return (
      <div className={style.trendBg}>
        <div className={style.trend}>
          <h3>나를 위한 트렌드</h3>
          {data?.map((trend) => (
            <Trend trend={trend} key={trend.tagId}/>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={style.trendBg}>
      <div className={style.noTrend}>
        트렌드를 가져올 수 없습니다.
      </div>
    </div>
  );
};

export default TrendSection;
