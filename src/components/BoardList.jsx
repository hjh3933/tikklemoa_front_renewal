import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BoardList = ({ board }) => {
  // 관리필요한 데이터 badge, date, likes
  const [likes, setLikes] = useState();
  const [badgeUrl, setBadgeUrl] = useState("");
  const [date, setDate] = useState("");

  const getLikes = async () => {
    try {
      const res = await axios.get(process.env.REACT_APP_API_SERVER + `/auth/getLikes/${board.id}`);
      const badgeUrl = `/images/badge${board.badge}.png`;
      setLikes(res.data);
      setBadgeUrl(badgeUrl);
      setDate(board.date.replace(".0", ""));
    } catch (error) {
      console.error("좋아요를 불러오는 중 오류 발생:", error);
      alert("좋아요를 불러오는 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    getLikes();
  }, []);

  return (
    <Link to={`/boardDetail?boardId=${board.id}`} className="BoardList">
      <div className="listContent">{board.title}</div>
      <div className="user listContent">
        <div>{board.nickname}</div>
        <div>
          <img src={badgeUrl} alt="badge_img" />
        </div>
      </div>
      <div className="dateInfo listContent">{date}</div>
      <div className="likes listContent">
        <i className="material-icons">favorite</i>
        <div>{likes}</div>
      </div>
    </Link>
  );
};

export default BoardList;
