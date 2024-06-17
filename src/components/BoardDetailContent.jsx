import axios from "axios";
import { useEffect, useState } from "react";
import "../styles/boardDetail.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ImgModal from "./ImgModal";

const BoardDetailContent = ({ boardDetails }) => {
  const [badgeUrl, setBadgeUrl] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [modalSrc, setModalSrc] = useState(null);
  const [loginNickName, setLoginNickName] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikesCount, setCurrentLikesCount] = useState(0);
  const [messageVisible, setMessageVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (boardDetails) {
      const { badge, userImg } = boardDetails;
      const tokenNick = localStorage.getItem("nickname");

      const profileImgUrl =
        userImg === "default.img"
          ? "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
          : userImg;
      setProfileImg(profileImgUrl);
      const badgeImageUrl = `/images/badge${badge}.png`;
      setBadgeUrl(badgeImageUrl);
      setDateStr(date.replace(".0", ""));
      setLoginNickName(tokenNick);
      setIsLiked(likeOrNot);
      setCurrentLikesCount(likesCount);
      //console.log("id비교>>", nickname, loginNickName);
    }
  }, [boardDetails]);

  if (!boardDetails) {
    return <div>Loading...</div>;
  }

  const {
    badge,
    content,
    date,
    id,
    img,
    imgUrls,
    likeOrNot,
    likesCount,
    nickname,
    title,
    userImg,
    userid, // user의 index id를 의미함
  } = boardDetails;

  const openModal = (src) => {
    setModalSrc(src);
  };

  const closeModal = () => {
    setModalSrc(null);
  };

  const handleLikeClick = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = {
        id: id,
      };
      const res = await axios.post(`${process.env.REACT_APP_API_SERVER}/clickLikes`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 요청이 성공하면 isLiked을 반전시키고, 좋아요 수를 증가 또는 감소시킴
      if (res.data.result) {
        setIsLiked(!isLiked);
        setCurrentLikesCount(isLiked ? currentLikesCount - 1 : currentLikesCount + 1);
        // console.log(res.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        localStorage.clear();
        alert("로그인이 만료되었습니다");
        navigate("/");
        window.location.reload();
      } else {
        console.error("좋아요 요청 중 오류 발생:", error);
      }
    }
  };

  const deleteBoard = async () => {
    try {
      /* eslint-disable no-restricted-globals */
      const check = confirm("게시글을 정말 삭제하시겠습니까?");
      /* eslint-disable no-restricted-globals */
      if (!check) return;
      const token = localStorage.getItem("token");
      const data = {
        id: id,
      };
      const res = await axios.delete(`${process.env.REACT_APP_API_SERVER}/deleteBoard`, {
        headers: { Authorization: `Bearer ${token}` },
        data: data,
      });

      if (res.data.result) {
        alert(res.data.msg);
        navigate("/community?page=1");
        window.location.reload();
      } else {
        alert(res.data.msg);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        localStorage.clear();
        alert("로그인이 만료되었습니다");
        navigate("/");
        window.location.reload();
      } else {
        console.error("좋아요 요청 중 오류 발생:", error);
      }
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleNicknameClick = () => {
    setMessageVisible(!messageVisible);
  };

  return (
    <div className="BoardDetailContent">
      {modalSrc && <ImgModal src={modalSrc} alt="Modal Image" onClose={closeModal} />}
      <div className="boardBox">
        <div className="userBox">
          <div className="user">
            <div>
              <img src={profileImg} alt="profileImg" className="profileImg" />
            </div>
            <div className="nickname" onClick={handleNicknameClick} style={{ cursor: "pointer" }}>
              {nickname}
            </div>
            {messageVisible && nickname != loginNickName && (
              <>
                <div
                  className="messageLink"
                  onClick={() => navigate(`/insertPost?recipient=${nickname}`)}
                >
                  쪽지전송
                </div>
              </>
            )}
            <div>
              <img src={badgeUrl} alt="badge" className="badgeImg" />
            </div>
          </div>
          <div className="date">{new Date(dateStr).toLocaleString()}</div>
        </div>
        <div className="titleBox">
          {/* <div className="title">글제목</div> */}
          <div className="cont title">{title}</div>
        </div>
        <div className="imgBox">
          {/* <div className="file">첨부파일</div> */}
          <div className="cont">
            {imgUrls &&
              imgUrls.map((url, index) => (
                <img key={index} src={url} alt={`img${index}`} onClick={() => openModal(url)} />
              ))}
          </div>
        </div>
        <div className="contentBox">
          {/* <div className="content">글내용</div> */}
          <div className="cont content">{content}</div>
        </div>
      </div>
      {nickname == loginNickName ? (
        <div className="btnBox">
          <div className="centerBox">
            <Link
              to={{
                pathname: "/insertBoard",
                search: "?type=update",
              }}
              state={{ boardDetails: boardDetails }}
              className="btn move"
            >
              수정
            </Link>
            <div onClick={deleteBoard} className="btn">
              삭제
            </div>
          </div>
          <i
            className="material-icons exit"
            style={{ color: "gray", cursor: "pointer" }}
            onClick={handleCancel}
          >
            logout
          </i>
        </div>
      ) : (
        <div className="btnBox">
          <div className="centerBox">
            <i
              className="material-icons"
              style={{ color: isLiked ? "red" : "lightgray", cursor: "pointer" }}
              onClick={handleLikeClick}
            >
              favorite
            </i>
            <span>{currentLikesCount}</span>
          </div>
          <i className="material-icons logout" onClick={handleCancel}>
            logout
          </i>
        </div>
      )}
    </div>
  );
};

export default BoardDetailContent;
