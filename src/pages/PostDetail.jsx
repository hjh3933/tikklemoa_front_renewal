import axios from "axios";
import { useEffect, useState } from "react";
import "../styles/boardDetail.scss";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import PostDetailContent from "../components/PostDetailContent";
import { isTokenExpired } from "../utils/tokenUtils";

const PostDetail = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // const token = localStorage.getItem("token");
    // if (!token || isTokenExpired(token)) {
    //   localStorage.clear();
    //   alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
    //   navigate("/login");
    // }
    window.scrollTo(0, 0);
  }, [navigate]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const postId = queryParams.get("postId");
  //   console.log(postId);

  // state
  const [postDetails, setPostDetails] = useState();

  // get
  const getDetails = async () => {
    try {
      const storedToken = localStorage.getItem("token");
      const res = await axios.get(process.env.REACT_APP_API_SERVER + `/getPostDetail/${postId}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      // console.log(res.data);
      setPostDetails(res.data);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        localStorage.clear();
        alert("로그인이 만료되었습니다");
        navigate("/");
        window.location.reload();
      } else {
        console.error("쪽지 정보를 불러오는 중 오류 발생:", error);
        // alert("쪽지 정보를 불러오는 중 오류가 발생했습니다.");
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
          <PostDetailContent postDetails={postDetails} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PostDetail;
