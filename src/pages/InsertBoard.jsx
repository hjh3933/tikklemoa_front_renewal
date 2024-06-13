import axios from "axios";
import { useEffect, useState } from "react";
import "../styles/insertBoard.scss";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";

const InsertBoard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");
  const { state } = location;
  const boardDetails = state?.boardDetails;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      alert("로그인 회원만 이용할 수 있습니다");
      navigate(`/login`);
    }
  }, [navigate]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [existingImgUrls, setExistingImgUrls] = useState([]);
  const [imgUrlsToRemove, setImgUrlsToRemove] = useState([]);

  useEffect(() => {
    if (boardDetails) {
      console.log("boardDetails:", boardDetails);
      setTitle(boardDetails.title);
      setContent(boardDetails.content);
      setExistingImgUrls(boardDetails.imgUrls || []);
    }
  }, [boardDetails]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleRemoveImgUrl = (url) => {
    setExistingImgUrls(existingImgUrls.filter((imgUrl) => imgUrl !== url));
    setImgUrlsToRemove([...imgUrlsToRemove, url]);
  };

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

  const handleSubmit = async () => {
    const formData = new FormData();
    const currentDateTime = getCurrentDateTime();

    const dto = {
      title,
      content,
      date: currentDateTime,
      id: boardDetails ? boardDetails.id : null,
      imgUrls: existingImgUrls.filter((url) => !imgUrlsToRemove.includes(url)), // 최종 남아있는 URL 목록
    };

    formData.append(
      "dto",
      new Blob([JSON.stringify(dto)], {
        type: "application/json",
      })
    );

    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const storedToken = localStorage.getItem("token");
      const res = await axios({
        method: type === "update" ? "patch" : "post",
        url: `${process.env.REACT_APP_API_SERVER}/${
          type === "update" ? "updateBoard" : "insertBoard"
        }`,
        data: formData,
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.result) {
        alert(type === "update" ? "게시글 수정이 완료되었습니다" : "게시글 작성이 완료되었습니다");
        navigate("/?page=1");
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        localStorage.clear();
        alert("로그인이 만료되었습니다");
        navigate("/");
        window.location.reload();
      } else {
        console.error("게시글 작성 중 오류 발생:", error);
        alert("게시글 작성 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <>
      <Header />
      <div className="InsertBoard">
        <div className="insertBoardBox">
          <h3>{type === "update" ? "게시글 수정" : "게시글 작성"}</h3>
          <div className="boardBox">
            <div className="titleBox">
              <div className="title ten">글제목</div>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            {type == "update" && (
              <div className="existingImgUrls">
                <div className="ten">이미지</div>
                <div className="imgBox">
                  {existingImgUrls &&
                    existingImgUrls.map((url, index) => (
                      <div key={index} className="imgContainer">
                        <img src={url} alt={`img${index}`} className="existingImg" />
                        <button type="button" onClick={() => handleRemoveImgUrl(url)}>
                          X
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
            <div className="fileBox">
              <div className="file ten">첨부파일</div>
              <input type="file" multiple onChange={handleFileChange} />
            </div>
            <div className="contentBox">
              <div className="content ten">글내용</div>
              <textarea value={content} onChange={(e) => setContent(e.target.value)}></textarea>
            </div>
          </div>
          <div className="btnBox">
            <div onClick={handleSubmit}>{type === "update" ? "수정" : "작성"}</div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default InsertBoard;
