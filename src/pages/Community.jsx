import { Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../styles/community.scss";
import BoardList from "../components/BoardList";

const Commnunity = () => {
  // 현재 페이지 가져오기
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const page = parseInt(queryParams.get("page")) || 1;

  // state
  const [boardList, setBoardList] = useState([]);
  const [currentPage, setCurrentPage] = useState(page);
  const [searchType, setSearchType] = useState("content"); // 기본 검색 타입 설정
  const [searchText, setSearchText] = useState("");
  const postsPerPage = 10;

  const getBoardList = async () => {
    try {
      const res = await axios.get(process.env.REACT_APP_API_SERVER + "/auth/getAllBoards");
      // console.log(res.data);
      setBoardList(res.data);
    } catch (error) {
      console.error("게시글을 불러오는 중 오류 발생:", error);
      // alert("게시글을 불러오는 중 오류가 발생했습니다.");
    }
  };

  const searchBoard = async () => {
    try {
      const res = await axios.get(
        process.env.REACT_APP_API_SERVER +
          `/auth/getSearchBoards?type=${searchType}&searchText=${searchText}`
      );
      setBoardList(res.data);
      setCurrentPage(1);
      navigate(`?page=1`);
    } catch (error) {
      console.error("검색 중 오류 발생:", error);
      alert("검색 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    getBoardList();
  }, []);

  useEffect(() => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, [page]);

  // 페이지 변경 함수
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    navigate(`?page=${pageNumber}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchBoard();
    }
  };

  // 현재 페이지의 게시글 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = boardList.slice(indexOfFirstPost, indexOfLastPost);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(boardList.length / postsPerPage);

  return (
    <>
      <Header></Header>
      <div className="Commnunity">
        <div className="communityBox">
          <div className="boardTop">
            <div className="addBoardBox">
              <Link
                to={{
                  pathname: "/insertBoard",
                  search: "?type=insert",
                }}
                className="addBoard"
              >
                글작성
              </Link>
            </div>
            <div className="searchBox">
              <select
                name="type"
                id="type"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="content">제목 및 내용</option>
                <option value="author">작성자</option>
              </select>
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="검색어를 입력하세요"
                onKeyDown={handleKeyDown}
              />
              <i className="material-icons" onClick={searchBoard}>
                search
              </i>
            </div>
          </div>
          <div className="boardListBox">
            {currentPosts.length === 0 ? (
              <div className="noSearchData">게시글이 없습니다</div>
            ) : (
              currentPosts.map((board) => <BoardList key={board.id} board={board} />)
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
      </div>
      <Footer></Footer>
    </>
  );
};

export default Commnunity;
