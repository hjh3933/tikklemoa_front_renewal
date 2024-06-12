import { useEffect, useState } from "react";
import "../styles/calendarStats.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PieChart from "./PieChart";

const CalendarStatsContent = ({ setToggle }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}`;

  // state
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [date, setDate] = useState(formattedDate);
  const navigate = useNavigate();

  // 월별 통계 조회
  const getMonthStats = async () => {
    const storedToken = localStorage.getItem("token");
    try {
      const dateStr = "2024-06";
      const res = await axios.get(process.env.REACT_APP_API_SERVER + `/getMonthTotal/${date}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      console.log(res.data);
      setMonthlyStats(res.data);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        localStorage.clear();
        alert("로그인이 만료되었습니다");
        navigate("/");
        window.location.reload();
      } else {
        console.error("월별통계를 불러오는 중 오류 발생:", error);
        alert("월별통계를 불러오는 중 오류가 발생했습니다.");
      }
    }
  };

  // 뱃지 예상 조회

  useEffect(() => {
    getMonthStats();
  }, []);

  const subcategoryColors = {
    식비: "#FF6384",
    교통: "#36A2EB",
    문화생활: "#FFCE56",
    "주거/통신": "#4BC0C0",
    건강: "#9966FF",
    교육: "#FF9F40",
    경조사: "#8BC34A",
    "패션/미용": "#E91E63",
    "가전/생활": "#00BCD4",
    기타: "#FFC107",
  };
  return (
    <>
      <div className="CalendarStatsCircle">
        {/* 원형 그래프 + 연도와 월 설정 */}
        <div>
          {monthlyStats.length > 0 ? (
            <>
              <div className="selectBox">
                <select name="" id="">
                  <option value="">년도</option>
                </select>
                <select name="" id="">
                  <option value="">월</option>
                </select>
              </div>
              <PieChart data={monthlyStats} colors={subcategoryColors} />
            </>
          ) : (
            // <p>데이터를 불러오는 중입니다...</p>
            <p>데이터가 존재하지 않습니다</p>
          )}
        </div>
      </div>
      <div className="CalendarStatsList">
        {/* 요소 상세, 다음달 뱃지 */}
        <div className="stats">
          {monthlyStats.map((el) => {
            return (
              <div className="statsList" key={el.subcategory}>
                <div
                  className="percentage"
                  style={{ backgroundColor: subcategoryColors[el.subcategory] }}
                >
                  {el.percentage}%
                </div>
                <div className="subcategory">{el.subcategory}</div>
                <div className="totalPrice">{el.totalPrice}원</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CalendarStatsContent;
