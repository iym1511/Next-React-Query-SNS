import Trend from "./Trend";
import style from "./trendSection.module.css"

const TrendSection = () => {
  return ( 
    <div className={style.trendBg}>
      <div className={style.trend}>
        <h3>나를 위한 트렌드</h3>
        <Trend />
        <Trend />
        <Trend />
        <Trend />
        <Trend />
        <Trend />
        <Trend />
        <Trend />
        <Trend />
        <Trend />
      </div>
    </div>
   );
}
 
export default TrendSection;