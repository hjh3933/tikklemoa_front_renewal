import { useEffect, useState } from "react";
import "../styles/myBoardContent.scss";
import axios from "axios";
import BoardList from "./BoardList";
import { useLocation, useNavigate } from "react-router-dom";
import PostList from "./PostList";

const MyPostContent = ({ setToggle2 }) => {
  // 현재 페이지 가져오기
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const page = parseInt(queryParams.get("page")) || 1;

  // state
  const [myPostType, setMyPostType] = useState("recipient"); // sender or recipient
  const [boardList, setBoardList] = useState([]);
  const [currentPage, setCurrentPage] = useState(page);
  const postsPerPage = 5;

  const getBoardList = async () => {
    const storedToken = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_SERVER}/getPosts?type=${myPostType}`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      console.log(res.data);
      setBoardList(res.data);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        localStorage.clear();
        alert("로그인이 만료되었습니다");
        navigate("/");
        window.location.reload();
      } else {
        console.error("게시글을 불러오는 중 오류 발생:", error);
        alert("게시글을 불러오는 중 오류가 발생했습니다.");
      }
    }
  };

  useEffect(() => {
    getBoardList();
  }, [myPostType]);

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  // 페이지 변경 함수
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    navigate(`?page=${pageNumber}`);
  };

  // 현재 페이지의 게시글 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = boardList.slice(indexOfFirstPost, indexOfLastPost);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(boardList.length / postsPerPage);

  return (
    <div className="MyBoardContent">
      <div className="myBoardBox">
        <div className="myContent_header">
          <div
            className={`header ${myPostType === "recipient" ? "active" : ""}`}
            onClick={() => setMyPostType("recipient")}
          >
            수신함
          </div>
          <div
            className={`header ${myPostType === "sender" ? "active" : ""}`}
            onClick={() => setMyPostType("sender")}
          >
            발신함
          </div>
        </div>
        <div className="boardListBox">
          {currentPosts.length === 0 ? (
            <div className="noSearchData">쪽지가 없습니다</div>
          ) : (
            currentPosts.map((post) => <PostList key={post.id} post={post} />)
          )}
        </div>
        <div className="page">
          <div className="pagination">
            {[...Array(totalPages).keys()].map((number) => (
              <div
                key={number + 1}
                onClick={() => handlePageChange(number + 1)}
                className={currentPage === number + 1 ? "active" : ""}
              >
                {number + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="myBoardBtnBox">
        <div className="goBoard" onClick={() => setToggle2(true)}>
          게시글
        </div>
        <div className="goPost nowPage" onClick={() => setToggle2(false)}>
          쪽지
        </div>
      </div>
    </div>
  );
};

export default MyPostContent;
