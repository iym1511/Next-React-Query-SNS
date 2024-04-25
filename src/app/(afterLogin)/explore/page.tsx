import SearchForm from "@/app/(afterLogin)/_component/SearchForm";
import style from "./explore.module.css"
import TrendSection from "./_component/TrendSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "탐색하기 / Z",
  description: "탐색해보세요.",
};


const Home = () => {
  return (
    <main className={style.main}>
      <div className={style.formZone}>
        <SearchForm />
      </div>
      <div className={style.trend}>
        <h3>나를 위한 트렌드</h3>
        <TrendSection />
      </div>
    </main>
  );
};

export default Home;
