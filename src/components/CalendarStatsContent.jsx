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
  const [nextBadge, setNextBadge] = useState("");
  const [nextBadgeUrl, setNextBadgeUrl] = useState("");
  const [date, setDate] = useState(formattedDate);
  const navigate = useNavigate();

  const consumptionFeedback = {
    One: "이번 달은 절약의 달인이셨네요!<br>알뜰하게 사셨습니다.",
    Two: "이번 달은 조금 여유롭게 지내셨군요!<br>적절한 소비를 하셨습니다.",
    Three: "이번 달은 좀 더 편안하게 사셨군요!<br>합리적인 소비를 하셨습니다.",
    Four: "이번 달은 사치스러운 기분이셨나요?<br>과소비 경계!",
    Five: "이번 달은 왕처럼 사셨군요!<br>과소비의 왕!",
  };

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

  // 뱃지 예상 조회 함수
  const getBadge = async () => {
    const storedToken = localStorage.getItem("token");
    try {
      const dateStr = "2024-06";
      const res = await axios.get(process.env.REACT_APP_API_SERVER + "/getNextBadge", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      const badgeUrl = `/images/badge${res.data.nextBadge}.png`;
      setNextBadgeUrl(badgeUrl);
      setNextBadge(res.data);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        localStorage.clear();
        alert("로그인이 만료되었습니다");
        navigate("/");
        window.location.reload();
      } else {
        console.error("뱃지 예상을 불러오는 중 오류 발생:", error);
        alert("뱃지 예상을 불러오는 중 오류가 발생했습니다.");
      }
    }
  };

  const FeedbackComponent = ({ level }) => {
    return (
      <div>
        <p dangerouslySetInnerHTML={{ __html: consumptionFeedback[level] }} />
      </div>
    );
  };

  useEffect(() => {
    getBadge();
  }, []);

  useEffect(() => {
    getMonthStats();
  }, [date]);

  const handleYearChange = (e) => {
    const selectedYear = e.target.value;
    setDate((prevDate) => {
      const [, month] = prevDate.split("-");
      return `${selectedYear}-${month}`;
    });
  };

  const handleMonthChange = (e) => {
    const selectedMonth = e.target.value.padStart(2, "0");
    setDate((prevDate) => {
      const [year] = prevDate.split("-");
      return `${year}-${selectedMonth}`;
    });
  };

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

  const selectedYear = date.split("-")[0];
  const selectedMonth = date.split("-")[1];

  return (
    <>
      <div className="CalendarStatsCircle">
        {/* 원형 그래프 + 연도와 월 설정 */}
        <div className="statsCircleBox">
          <div className="selectBox">
            <select onChange={handleYearChange} value={selectedYear}>
              {Array.from({ length: 10 }, (_, i) => year - i).map((yearOption) => (
                <option key={yearOption} value={yearOption}>
                  {yearOption}
                </option>
              ))}
            </select>
            <select onChange={handleMonthChange} value={selectedMonth}>
              {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0")).map(
                (monthOption) => (
                  <option key={monthOption} value={monthOption}>
                    {monthOption}
                  </option>
                )
              )}
            </select>
          </div>
          {monthlyStats.length > 0 ? (
            <PieChart data={monthlyStats} colors={subcategoryColors} />
          ) : (
            <div className="noStats">
              <div className="imgBox">
                <img src="/images/crying.webp" alt="Crying cute image" />
              </div>
              <div className="no_data">{selectedMonth}월에는 지출 내역이 없어요...</div>
            </div>
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
        {formattedDate === date && (
          <div className="nextBadge">
            <div className="badge_left">
              <div className="ques">다음달 내 예상 등급은?</div>
              <div>
                {selectedMonth}월 총 수입: {nextBadge.totalPlus}원
              </div>
              <div>
                {selectedMonth}월 총 지출: {nextBadge.totalMinus}원
              </div>
            </div>
            <div className="badge_right">
              <div>
                <FeedbackComponent level={nextBadge.nextBadge} />
              </div>
              {/* <div>{consumptionFeedback[nextBadge.nextBadge]}</div> */}
              <div className="imgBox">
                <img src={nextBadgeUrl} alt="badge_image" />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CalendarStatsContent;
