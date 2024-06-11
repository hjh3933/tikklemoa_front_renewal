import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CalendarModal = ({ isOpen, onClose, mode, data, selectedDate, refreshData }) => {
  // state
  const [category, setCategory] = useState("MINUS");
  const [price, setPrice] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [details, setDetails] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const expenseSubcategories = [
    "식비",
    "교통",
    "문화생활",
    "주거/통신",
    "건강",
    "교육",
    "경조사",
    "패션/미용",
    "가전/생활",
    "기타",
  ];
  const incomeSubcategories = ["급여", "용돈", "부수입", "금융소득", "기타"];

  const subcategories = category === "MINUS" ? expenseSubcategories : incomeSubcategories;

  const handleCategoryClick = (newCategory) => {
    setCategory(newCategory);
  };

  // 캘린더 입력 or 수정
  const handleSubmit = async () => {
    const storedToken = localStorage.getItem("token");
    if (!price || !subcategory) {
      alert("금액과 카테고리를 입력해주세요.");
      return;
    }

    const postData = {
      id: data ? data.id : undefined,
      category,
      date,
      price: parseInt(price, 10),
      subcategory,
      details,
    };

    try {
      let res;
      if (mode === "plus") {
        res = await axios.post(process.env.REACT_APP_API_SERVER + "/insertCalendar", postData, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
      } else if (mode === "edit") {
        res = await axios.patch(process.env.REACT_APP_API_SERVER + "/updateCalendar", postData, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
      }
      if (res.data.result) {
        alert(res.data.msg);
        onClose();
        refreshData();
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        localStorage.clear();
        alert("로그인이 만료되었습니다");
        navigate("/");
        window.location.reload();
      } else {
        console.error("캘린더 데이터 전송 중 오류 발생:", error);
        alert("캘린더 데이터 전송 중 오류가 발생했습니다.");
      }
    }
  };

  const deleteContent = async () => {
    const storedToken = localStorage.getItem("token");
    /* eslint-disable no-restricted-globals */
    const result = confirm("내역을 삭제하시겠습니까?");
    /* eslint-disable no-restricted-globals */
    const postData = {
      id: data ? data.id : undefined,
    };
    try {
      if (result) {
        const res = await axios.delete(process.env.REACT_APP_API_SERVER + "/deleteCalendar", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
          data: postData,
        });
        if (res.data.result) {
          alert(res.data.msg);
          onClose();
          refreshData();
        }
      } else {
        return;
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        localStorage.clear();
        alert("로그인이 만료되었습니다");
        navigate("/");
        window.location.reload();
      } else {
        console.error("캘린더 데이터 삭제 중 오류 발생:", error);
        alert("캘린더 데이터 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  useEffect(() => {
    if (!isOpen) {
      // 모달이 닫힐 때 input, textarea 초기화
      setCategory("MINUS");
      setPrice("");
      setSubcategory("");
      setDetails("");
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const dateTime = `${selectedDate} ${hours}:${minutes}:${seconds}`;
      setDate(dateTime);
    } else if (mode === "edit" && data) {
      // edit 모드일 때 data 값으로 초기화
      setCategory(data.category);
      setPrice(data.price.toString());
      setSubcategory(data.subcategory);
      setDetails(data.details);
      setDate(data.date.replace(".0", ""));
    }
  }, [isOpen, mode, data, selectedDate]);

  if (!isOpen) return null;

  return (
    <div className="calendar_modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>{mode === "plus" ? "Add" : "Edit"}</h2>
        <div className="plusContentBox">
          <div className="categorySelect">
            <div
              className={`category ${category === "MINUS" ? "nowSelect" : ""}`}
              onClick={() => handleCategoryClick("MINUS")}
            >
              지출
            </div>
            <div
              className={`category ${category === "PLUS" ? "nowSelect" : ""}`}
              onClick={() => handleCategoryClick("PLUS")}
            >
              수입
            </div>
          </div>
          <input type="text" value={date} readOnly />
          <input
            type="number"
            placeholder="금액"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <div className="subcategory">
            {subcategories.map((subcat) => (
              <div key={subcat}>
                <input
                  type="radio"
                  id={subcat}
                  name="subcategory"
                  value={subcat}
                  checked={subcat === subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                />
                <label htmlFor={subcat}>{subcat}</label>
              </div>
            ))}
          </div>
          <textarea
            placeholder="세부 사항"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
          <div className="btnBox">
            {mode === "plus" ? (
              <div className="insertBtn" onClick={handleSubmit}>
                추가
              </div>
            ) : (
              <>
                <div className="insertBtn" onClick={handleSubmit}>
                  수정
                </div>
                <div className="insertBtn" onClick={deleteContent}>
                  삭제
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
