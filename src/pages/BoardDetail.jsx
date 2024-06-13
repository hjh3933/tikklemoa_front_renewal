import axios from "axios";
import { useEffect, useState } from "react";
import "../styles/boardDetail.scss";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import BoardDetailContent from "../components/BoardDetailContent";

const BoardDetail = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      alert("로그인 회원만 이용할 수 있습니다");
      navigate(`/login`);
    }
  }, [navigate]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const boardId = queryParams.get("boardId");
  //   console.log(boardId);

  // state
  const [boardDetails, setBoardDetails] = useState();
  const [commentList, setCommentList] = useState([]);

  // get
  const getDetails = async () => {
    try {
      const storedToken = localStorage.getItem("token");
      const res = await axios.get(process.env.REACT_APP_API_SERVER + `/getBoardDetail/${boardId}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      const result = await axios.get(
        process.env.REACT_APP_API_SERVER + `/getBoardComments/${boardId}`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      //   console.log(res.data);
      console.log(result.data);
      setBoardDetails(res.data);
      setCommentList(result.data);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        localStorage.clear();
        // alert("로그인이 만료되었습니다");
        // navigate("/");
        window.location.reload();
      } else {
        console.error("게시글 정보를 불러오는 중 오류 발생:", error);
        alert("게시글 정보를 불러오는 중 오류가 발생했습니다.");
      }
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  return (
    <>
      <Header />
      <div className="BoardDetail">
        <div className="BoardDetailBox">
          {/* 중앙 정렬될 컨텐츠 */}
          <BoardDetailContent boardDetails={boardDetails} />
          <div>{/* 댓글 목록, 등록, 삭제 */}</div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BoardDetail;
