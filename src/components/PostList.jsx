import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PostList = ({ post }) => {
  // 관리필요한 데이터 badge, date
  const [badgeUrl, setBadgeUrl] = useState("");
  const [date, setDate] = useState("");
  const nickname = localStorage.getItem("nickname");

  useEffect(() => {
    const badgeUrl = `/images/badge${post.badge}.png`;
    setBadgeUrl(badgeUrl);
    setDate(post.date.replace(".0", ""));
  }, []);

  return (
    <Link to={`/postDetail?postId=${post.id}`} className="BoardList">
      <div className="userAndTitle">
        <div className="listContent">{post.title}</div>
        <div className="user listContent">
          <div>{post.nickname}</div>
          <div>
            <img src={badgeUrl} alt="badge_img" />
          </div>
        </div>
      </div>
      <div className="dateAndLikes">
        <div className="dateInfo listContent">{date}</div>
        <div className="readOrNot listContent">{post.read ? "읽음" : "안읽음"}</div>{" "}
      </div>
    </Link>
  );
};

export default PostList;
