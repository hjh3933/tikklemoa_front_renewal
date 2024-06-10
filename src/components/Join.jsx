import { useRef, useState } from "react";
import "../styles/join.scss";
import axios from "axios";

const Join = ({ setToggle }) => {
  // state
  const [visible, setVisible] = useState(false);
  const [nameCheckVal, setNameCheckVal] = useState(false);
  const [nickname, setNickname] = useState("");
  const [useridCheckVal, setUseridCheckVal] = useState(false);
  const [userid, setUserid] = useState("");
  const [userpwCheckVal, setUserpwCheckVal] = useState(false);
  const [userpw, setUserpw] = useState("");
  // ref
  const idCheckRef = useRef();
  const pwCheckRef = useRef();

  // 정규식
  const validateUserid = (userid) => {
    // 6글자 이상의 숫자와 문자가 혼합된 문자열인지 확인하는 정규식
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return regex.test(userid);
  };
  const validateUserpw = (userpw) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return regex.test(userpw);
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
  const handleChangePw = (e) => {
    setUserpwCheckVal(false);
    const newValue = e.target.value;
    setUserpw(newValue);
    if (!validateUserpw(newValue)) {
      pwCheckRef.current.textContent = "비밀번호는 6글자 이상의 문자와 숫자 혼합 형식이어야합니다";
      setUserpwCheckVal(false);
      return;
    } else {
      pwCheckRef.current.textContent = "";
      setUserpwCheckVal(true);
    }
  };

  // 회원가입 함수
  const joinUser = async () => {
    if (!nameCheckVal) {
      return alert("닉네임 중복검사가 필요합니다.");
    }
    if (!useridCheckVal) {
      return alert("아이디 중복검사가 필요합니다.");
    }
    if (!userpwCheckVal) {
      return alert("올바른 형식의 비밀번호를 입력해주세요.");
    }
    // 회원가입 요청
    const data = {
      nickname: nickname,
      userid: userid,
      userpw: userpw,
    };
    const res = await axios.post(process.env.REACT_APP_API_SERVER + "/auth/signup", data);
    // console.log(res.data);
    if (res.data.result) {
      alert(res.data.msg);
      setToggle(true);
    }
  };

  return (
    <div className="Join">
      <div className="joinBox">
        <div className="inputBox">
          <div className="leftBox">
            <div className="nameInput">
              <div>NAME</div>
            </div>
            <div className="idInput">
              <div>ID</div>
              <div className="id_msg"></div>
            </div>
            <div className="pwInput">
              <div>PW</div>
              <div className="pw_msg"></div>
            </div>
          </div>
          <div className="rightBox">
            <div className="nameInput check">
              <input type="text" name="nickname" id="nickname" onChange={handleChangeName} />
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
              <input type="text" name="userid" id="userid" onChange={handleChangeId} />
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
            <div className="pwInput check">
              {visible ? (
                <input type="text" name="userpw" id="userpw" onChange={handleChangePw} />
              ) : (
                <input type="password" name="userpw" id="userpw" onChange={handleChangePw} />
              )}

              <i className="material-icons pwCheck" onClick={() => setVisible(!visible)}>
                {visible ? "visibility" : "visibility_off"}
              </i>
            </div>
            <div className="pw_msg" ref={pwCheckRef}></div>
          </div>
        </div>
        <div className="joinBtn" onClick={joinUser}>
          JOIN
        </div>
        <div className="loginOrJoin">
          <div className="getLogin" onClick={() => setToggle(true)}>
            로그인
          </div>
          <dir>|</dir>
          <div className="getJoin" onClick={() => setToggle(false)}>
            회원가입
          </div>
        </div>
      </div>
    </div>
  );
};

export default Join;
