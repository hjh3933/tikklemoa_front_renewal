import axios from "axios";
import { useEffect, useRef, useState } from "react";
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
  const fileInputRef = useRef(null);

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
  const [allImages, setAllImages] = useState([]);
  const [existingImgUrls, setExistingImgUrls] = useState([]);
  const [imgUrlsToRemove, setImgUrlsToRemove] = useState([]);

  useEffect(() => {
    if (boardDetails) {
      setTitle(boardDetails.title);
      setContent(boardDetails.content);
      setExistingImgUrls(boardDetails.imgUrls || []);
      setAllImages(boardDetails.imgUrls || []);
    }
  }, [boardDetails]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const newFilePreviews = newFiles.map((file) => URL.createObjectURL(file));
    if (existingImgUrls.length + files.length + newFiles.length > 5) {
      alert("이미지는 최대 5장까지 업로드할 수 있습니다.");
      return;
    }
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    setAllImages((prevImages) => [...prevImages, ...newFilePreviews]);
  };

  const handleRemoveImgUrl = (url) => {
    if (existingImgUrls.includes(url)) {
      setExistingImgUrls(existingImgUrls.filter((imgUrl) => imgUrl !== url));
      setImgUrlsToRemove([...imgUrlsToRemove, url]);
    } else {
      const index = allImages.indexOf(url);
      setFiles(files.filter((_, i) => i !== index - existingImgUrls.length));
    }
    setAllImages(allImages.filter((imgUrl) => imgUrl !== url));
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
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해 주세요.");
      return;
    }

    if (existingImgUrls.length + files.length > 5) {
      alert("이미지는 최대 5장까지 업로드할 수 있습니다.");
      return;
    }

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
        navigate("/community?page=1");
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

  const handleCancel = () => {
    navigate(-1);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
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
              <input
                type="text"
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="existingImgUrls">
              <div className="ten">이미지</div>
              <div className="imgBox">
                {allImages &&
                  allImages.map((url, index) => (
                    <div key={index} className="imgContainer">
                      <img src={url} alt={`img${index}`} className="existingImg" />
                      <button type="button" onClick={() => handleRemoveImgUrl(url)}>
                        X
                      </button>
                    </div>
                  ))}
                <div className="imgContainer addImgContainer" onClick={triggerFileInput}>
                  <i className="material-icons addIcon">add_photo_alternate</i>
                </div>
                <input
                  type="file"
                  className="input"
                  multiple
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  style={{ display: "none" }}
                />
              </div>
            </div>
            <div className="contentBox">
              <div className="content ten">글내용</div>
              <textarea
                value={content}
                className="input"
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="btnBox">
            <div onClick={handleSubmit}>{type === "update" ? "수정" : "작성"}</div>
            <div onClick={handleCancel}>취소</div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default InsertBoard;
