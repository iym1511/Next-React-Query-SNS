"use client"
import { useQuery } from "@tanstack/react-query";
import { getTrends } from "../../_lib/getTrends";
import { IHashtag } from "@/model/Hashtag";
import Trend from "../../_component/Trend";

const TrendSection = () => {
  const { data } = useQuery<IHashtag[]>({
    queryKey: ["trends"],
    queryFn: getTrends,
    staleTime: 60 * 1000, // n분 뒤에 fresh -> stale 로
    gcTime: 300 * 1000, // 5분뒤 메모리 정리
  });

  return data?.map((trend) => <Trend trend={trend} key={trend.tagId} />);
};

export default TrendSection;
