import axios from "axios";
import { useEffect, useState } from "react";
import "../styles/boardDetail.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ImgModal from "./ImgModal";

const PostDetailContent = ({ postDetails }) => {
  const [badgeUrl, setBadgeUrl] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [modalSrc, setModalSrc] = useState(null);
  const [loginNickName, setLoginNickName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (postDetails) {
      const { badge, userImg } = postDetails;
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
      //console.log("id비교>>", nickname, loginNickName);
    }
  }, [postDetails]);

  if (!postDetails) {
    return <div>Loading...</div>;
  }

  const {
    recipient,
    badge,
    read,
    content,
    date,
    id, // postid
    img,
    imgUrls,
    nickname,
    title,
    userImg,
    userid, // user의 index id를 의미함
  } = postDetails;

  const openModal = (src) => {
    setModalSrc(src);
  };

  const closeModal = () => {
    setModalSrc(null);
  };

  const removePost = async () => {
    try {
      /* eslint-disable no-restricted-globals */
      const check = confirm("쪽지를 삭제하시겠습니까?");
      /* eslint-disable no-restricted-globals */
      if (!check) return;
      const token = localStorage.getItem("token");
      const data = {
        id: id,
      };
      const res = await axios.patch(`${process.env.REACT_APP_API_SERVER}/removePost`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.result) {
        alert(res.data.msg);
        navigate(-1);
        // window.location.reload();
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
  const deletePost = async () => {
    try {
      /* eslint-disable no-restricted-globals */
      const check = confirm("전송을 취소하시겠습니까?");
      /* eslint-disable no-restricted-globals */
      if (!check) return;
      const token = localStorage.getItem("token");
      const data = {
        id: id,
      };
      const res = await axios.delete(`${process.env.REACT_APP_API_SERVER}/deletePost`, {
        headers: { Authorization: `Bearer ${token}` },
        data: data,
      });

      if (res.data.result) {
        alert(res.data.msg);
        navigate(-1);
        // window.location.reload();
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

  const handleReply = () => {
    navigate(`/insertPost?recipient=${nickname}`);
  };

  return (
    <div className="BoardDetailContent">
      {modalSrc && <ImgModal src={modalSrc} alt="Modal Image" onClose={closeModal} />}
      <div className="boardBox">
        <div className="userBox postUserBox">
          <div className="user">
            <div>
              <img src={profileImg} alt="profileImg" className="profileImg" />
            </div>
            <div className="nickname">{nickname}</div>
            <div>
              <img src={badgeUrl} alt="badge" className="badgeImg" />
            </div>
            <i className="material-icons arrow">arrow_right_alt</i>
            <div>{recipient}</div>
            <div className="postNick">{nickname == loginNickName ? "발신" : "수신"}</div>
          </div>
          <div className="date">{dateStr}</div>
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
            {!read && (
              <div className="btn move" onClick={deletePost}>
                전송취소
              </div>
            )}
            <div onClick={removePost} className="btn">
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
            <div className="btn move" onClick={handleReply}>
              답장
            </div>
            <div onClick={removePost} className="btn">
              삭제
            </div>
          </div>
          <i className="material-icons logout" onClick={handleCancel}>
            logout
          </i>
        </div>
      )}
    </div>
  );
};

export default PostDetailContent;
