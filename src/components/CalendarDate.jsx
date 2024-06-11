import { useEffect, useState } from "react";
import "../styles/calendarSet.scss";
import "../styles/calendarDate.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CalendarModal from "./CalendarModal";

const CalendarDate = ({ selectedDate }) => {
  // 오늘날짜 가져오기
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedSelectedDate = `${year}-${month}-${day}`;

  // state
  const navigate = useNavigate();
  const [dateData, setDateData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("plus");
  const [modalData, setModalData] = useState(null);

  //selectedDate 값으로 일별 소비내역 요청 함수
  const getDateContent = async () => {
    const storedToken = localStorage.getItem("token");
    try {
      if (selectedDate === null) {
        const res = await axios.get(
          `${process.env.REACT_APP_API_SERVER}/getDate/${formattedSelectedDate}`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
        // console.log("내역>>", res.data);
        setDateData(res.data);
      } else {
        const res = await axios.get(`${process.env.REACT_APP_API_SERVER}/getDate/${selectedDate}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        // console.log("내역>>", res.data);
        setDateData(res.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        localStorage.clear();
        alert("로그인이 만료되었습니다");
        navigate("/");
        window.location.reload();
      } else {
        console.error("일별 소비내역을 불러오는 중 오류 발생:", error);
        alert("일별 소비내역을 불러오는 중 오류가 발생했습니다.");
      }
    }
  };

  useEffect(() => {
    getDateContent();
  }, [selectedDate]);

  // 모달 관리
  const openModal = (mode, data = null) => {
    setModalMode(mode);
    setModalData(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="CalendarDate">
        <div className="selectedDate">{selectedDate}일 내역</div>
        <div className="plusBox">
          <div className="plus" onClick={() => openModal("plus")}>
            <i className="material-icons plusIcon">add</i>
          </div>
        </div>
        <div className="content_box">
          {dateData.map((el) => {
            const truncatedDetails =
              el.details.length > 5 ? `${el.details.slice(0, 5)}...` : el.details;
            return (
              <div className="content" key={el.id}>
                {el.category == "MINUS" ? (
                  <div className="category">지출</div>
                ) : (
                  <div className="category">수입</div>
                )}

                <div className="subcategory">{el.subcategory}</div>
                <div className="price">{el.price}</div>
                <div className="details">{truncatedDetails}</div>
                <div>
                  <i className="material-icons" onClick={() => openModal("edit", el)}>
                    more_horiz
                  </i>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <CalendarModal
        isOpen={isModalOpen}
        onClose={closeModal}
        mode={modalMode}
        data={modalData}
        selectedDate={selectedDate}
        refreshData={getDateContent}
      />
    </>
  );
};

export default CalendarDate;
