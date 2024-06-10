import { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/mypage.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  // state
  const [img, setImg] = useState("");
  const [nameCheckVal, setNameCheckVal] = useState(true);
  const [nickname, setNickname] = useState("");
  const [useridCheckVal, setUseridCheckVal] = useState(true);
  const [userid, setUserid] = useState("");
  const [badge, setBadge] = useState(null);
  // ref
  const idCheckRef = useRef();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // load 시 user 데이터 불러오기
  const getProfile = async () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken === null) {
      // 토큰 만료
      alert("로그인이 만료되었습니다");
      navigate("/");
      window.location.reload();
    }
    const res = await axios.get(process.env.REACT_APP_API_SERVER + "/getProfile", {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    });
    console.log(res.data);
    // state 설정
    setNickname(res.data.nickname);
    setBadge(res.data.badge);
    setUserid(res.data.userid);
    if (res.data.img === "default.img") {
      setImg(
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
      );
    } else {
      setImg(res.data.img);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  // 취소 버튼 클릭
  const clickCancel = () => {
    window.location.reload();
  };

  // 정규식
  const validateUserid = (userid) => {
    // 6글자 이상의 숫자와 문자가 혼합된 문자열인지 확인하는 정규식
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return regex.test(userid);
  };

  // 중복체크
  const nameCheck = async () => {
    try {
      // 공백 or 유효성 검사
      if (nickname.trim() === "") {
        return alert("닉네임을 입력하세요");
      }

      const data = {
        nickname: nickname,
      };
      const res = await axios.post(process.env.REACT_APP_API_SERVER + "/auth/checkName", data);
      console.log(res.data);
      if (res.data.result) {
        alert(res.data.msg);
        // 체크 모양 변경
        setNameCheckVal(true);
      }
    } catch (error) {
      console.error("Error checking name:", error);
      alert("Error checking name");
      setNameCheckVal(false); // 에러 발생 시 nameCheckVal을 false로 설정
    }
  };

  const idCheck = async () => {
    try {
      if (userid.trim() === "") {
        return alert("아이디를 입력하세요");
      }

      if (!validateUserid(userid)) {
        setUseridCheckVal(false);
        return;
      }

      const data = {
        userid: userid,
      };
      const res = await axios.post(process.env.REACT_APP_API_SERVER + "/auth/checkId", data);
      console.log(res.data);
      if (res.data.result) {
        alert(res.data.msg);
        // 체크 모양 변경
        setUseridCheckVal(true);
      }
    } catch (error) {
      console.error("Error checking id:", error);
      alert("Error checking id");
      setUseridCheckVal(false);
    }
  };

  const handleChangeName = (e) => {
    setNickname(e.target.value);
    setNameCheckVal(false);
  };
  const handleChangeId = (e) => {
    setUseridCheckVal(false);
    const newValue = e.target.value;
    setUserid(newValue);
    if (!validateUserid(newValue)) {
      idCheckRef.current.textContent = "아이디는 6글자 이상의 문자와 숫자 혼합 형식이어야합니다";
      return;
    } else {
      idCheckRef.current.textContent = "";
    }
  };

  // 이미지
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImg(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 정보수정 함수
  const updateUser = async () => {
    if (!nameCheckVal) {
      return alert("닉네임 중복검사가 필요합니다.");
    }
    if (!useridCheckVal) {
      return alert("아이디 중복검사가 필요합니다.");
    }
    // 회원수정
    const data = {
      nickname: nickname,
      userid: userid,
      img: img,
    };
    const res = await axios.patch(process.env.REACT_APP_API_SERVER + "/updateUser", data);
    console.log(res.data);
    if (res.data.result) {
      alert(res.data.msg);
    }
  };

  return (
    <>
      <Header></Header>
      <div className="Profile">
        <div className="profileBox">
          <div className="title">Profile</div>
          <div className="profileImg">
            <img
              src={img}
              alt="profileImg"
              onClick={handleImageClick}
              style={{ cursor: "pointer" }}
            />
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
          <div className="inputBox">
            <div className="leftBox">
              <div className="nameInput">
                <div>NAME</div>
              </div>
              <div className="idInput">
                <div>ID</div>
                <div className="id_msg"></div>
              </div>
            </div>
            <div className="rightBox">
              <div className="nameInput check">
                <input
                  type="text"
                  name="nickname"
                  id="nickname"
                  onChange={handleChangeName}
                  value={nickname}
                />
                <i
                  className="material-icons nameCheck"
                  onClick={nameCheck}
                  style={{
                    color: nameCheckVal === true ? "green" : "red",
                  }}
                >
                  check_circle
                </i>
              </div>
              <div className="idInput check">
                <input
                  type="text"
                  name="userid"
                  id="userid"
                  onChange={handleChangeId}
                  value={userid}
                />
                <i
                  className="material-icons idCheck"
                  onClick={idCheck}
                  style={{
                    color: useridCheckVal === true ? "green" : "red",
                  }}
                >
                  check_circle
                </i>
              </div>
              <div className="id_msg" ref={idCheckRef}></div>
            </div>
          </div>
          <div className="btnBox">
            <div className="updateBtn" onClick={updateUser}>
              수정
            </div>
            <div className="cancelBtn" onClick={clickCancel}>
              취소
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Profile;
