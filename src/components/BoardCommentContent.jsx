import axios from "axios";
import { useEffect, useRef, useState } from "react";
import "../styles/boardComment.scss";
import { useNavigate } from "react-router-dom";

const getCurrentDateTime = () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
};

const BoardCommentContent = ({ commentList, boardId, getDetails }) => {
  const [dateStr, setDateStr] = useState("");
  const [loginNickName, setLoginNickName] = useState("");
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const commentListRef = useRef(null);

  useEffect(() => {
    const tokenNick = localStorage.getItem("nickname");
    setLoginNickName(tokenNick);
    // console.log(loginNickName);
  }, []);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async () => {
    if (newComment.trim() === "") {
      inputRef.current.focus();
      return;
    }
    const formattedDateStr = getCurrentDateTime();

    setDateStr(formattedDateStr);

    try {
      const storedToken = localStorage.getItem("token");
      const data = {
        boardid: boardId,
        date: formattedDateStr,
        content: newComment,
      };

      const res = await axios.post(process.env.REACT_APP_API_SERVER + "/insertComment", data, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      console.log(res.date);

      if (res.data.result) {
        // 작성 성공
        getDetails();
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        localStorage.clear();
        alert("로그인이 만료되었습니다");
        navigate("/");
        window.location.reload();
      } else {
        console.error("댓글 작성 중 오류 발생:", error);
        alert("댓글 작성 중 오류가 발생했습니다.");
      }
    }
    setNewComment("");
  };

  const handleCommentDelete = async (commentId) => {
    /* eslint-disable no-restricted-globals */
    const result = confirm("댓글을 삭제하시겠습니까?");
    /* eslint-enable no-restricted-globals */
    if (!result) return;
    try {
      const storedToken = localStorage.getItem("token");
      const data = {
        id: commentId,
      };
      const res = await axios.delete(`${process.env.REACT_APP_API_SERVER}/deleteComment`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
        data: data,
      });

      if (res.data.result) {
        // 삭제 성공
        getDetails();
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        localStorage.clear();
        alert("로그인이 만료되었습니다");
        navigate("/");
        window.location.reload();
      } else {
        console.error("댓글 삭제 중 오류 발생:", error);
        alert("댓글 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  //   useEffect(() => {
  //     // 댓글 리스트가 업데이트될 때마다 스크롤을 가장 아래로 이동
  //     if (commentListRef.current) {
  //       commentListRef.current.scrollTop = commentListRef.current.scrollHeight;
  //     }
  //   }, [commentList]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCommentSubmit();
    }
  };

  // 댓글을 날짜순으로 오름차순 정렬
  const sortedComments = [...commentList].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="BoardCommentContent">
      <div className="comment-list" ref={commentListRef}>
        {sortedComments.map((comment) => {
          const badgeUrl = `/images/badge${comment.badge}.png`;
          const profileImgUrl =
            comment.img === "default.img"
              ? "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              : comment.img;
          return (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <img
                  src={profileImgUrl}
                  alt={`${comment.nickname} profile`}
                  className="profile-img"
                />
                <div className="comment-info">
                  <div className="nickname">
                    {comment.nickname}
                    <img src={badgeUrl} alt="badge" className="badge-img" />
                    {comment.nickname === loginNickName && (
                      <button
                        className="delete-button"
                        onClick={() => handleCommentDelete(comment.id)}
                      >
                        x
                      </button>
                    )}
                  </div>
                  <div className="date">{new Date(comment.date).toLocaleString()}</div>
                </div>
              </div>
              <div className="comment-content">{comment.content}</div>
            </div>
          );
        })}
      </div>
      <div className="comment-input">
        <input
          ref={inputRef}
          type="text"
          value={newComment}
          onChange={handleCommentChange}
          placeholder="댓글을 입력하세요..."
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleCommentSubmit}>댓글 등록</button>
      </div>
    </div>
  );
};

export default BoardCommentContent;
