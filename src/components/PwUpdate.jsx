import { useEffect, useRef, useState } from "react";
import "../styles/mypage.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PwUpdate = ({ setToggle }) => {
  // state
  const [userpwCheckVal, setUserpwCheckVal] = useState(false);
  const [newUserpwCheckVal, setNewUserpwCheckVal] = useState(false);
  const [userpw, setUserpw] = useState("");
  const [newUserpw, setNewUserpw] = useState("");
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [delVisible, setDelVisible] = useState(false);
  const navigate = useNavigate();

  // ref
  const pwCheckRef = useRef();
  const newPwCheckRef = useRef();
  const useridRef = useRef();

  // 정규식
  const validateUserpw = (userpw) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return regex.test(userpw);
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

  const handleChangeNewPw = (e) => {
    setNewUserpwCheckVal(false);
    const newValue = e.target.value;
    setNewUserpw(newValue);
    if (!validateUserpw(newValue)) {
      newPwCheckRef.current.textContent =
        "비밀번호는 6글자 이상의 문자와 숫자 혼합 형식이어야합니다";
      setNewUserpwCheckVal(false);
      return;
    } else {
      newPwCheckRef.current.textContent = "";
      setNewUserpwCheckVal(true);
    }
  };

  // 정보수정 함수
  const updateUser = async () => {
    if (!userpwCheckVal) {
      return alert("올바른 형식의 비밀번호를 입력해주세요.");
    }
    if (!newUserpwCheckVal) {
      return alert("올바른 형식의 비밀번호를 입력해주세요.");
    }

    const data = {
      userpw: userpw,
      newUserpw: newUserpw,
    };

    try {
      const storedToken = localStorage.getItem("token");
      const res = await axios.patch(process.env.REACT_APP_API_SERVER + "/updatePw", data, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      // console.log(res.data);
      if (res.data.result) {
        // 수정 성공
        setUserpw("");
        setNewUserpw("");
      }
      alert(res.data.msg);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        localStorage.clear();
        alert("로그인이 만료되었습니다");
        navigate("/");
        window.location.reload();
      } else {
        console.error("비밀번호 수정 중 오류 발생:", error);
        alert("비밀번호 수정 중 오류가 발생했습니다.");
      }
    }
  };

  // 회원탈퇴 함수
  const deleteUser = async () => {
    if (!delVisible) {
      // false면 true로
      setDelVisible(!delVisible);
      return;
    } else {
      /* eslint-disable no-restricted-globals */
      const result = confirm(
        "회원을 탈퇴하면 작성한 게시물과 댓글, 캘린더가 삭제됩니다. 정말 탈퇴하시겠습니까?"
      );
      /* eslint-enable no-restricted-globals */
      if (result) {
        // true면 탈퇴 작업 진행
        if (useridRef.current.value.trim() === "") {
          return alert("아이디를 입력해주세요.");
        } else if (!userpwCheckVal) {
          return alert("올바른 형식의 비밀번호를 입력해주세요.");
        }
        const data = {
          userid: useridRef.current.value,
          userpw: userpw,
        };

        try {
          const storedToken = localStorage.getItem("token");
          const res = await axios.delete(process.env.REACT_APP_API_SERVER + "/deleteUser", {
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
            data: data,
          });
          if (res.data.result) {
            // 삭제 성공
            localStorage.clear();
            alert(res.data.msg);
            // + 메인 페이지로 이동
            navigate("/");
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
            console.error("회원 탈퇴 중 오류 발생:", error);
            alert("회원 탈퇴 중 오류가 발생했습니다.");
          }
        }
      } else {
        return;
      }
    }
  };

  return (
    <>
      <div className="Profile">
        <div className="profileBox">
          <div className="titleBox">
            {delVisible ? (
              <div className="title">DELETE USER</div>
            ) : (
              <div className="title">NEW PASSWORD</div>
            )}
          </div>
          <div className="inputBox">
            <div className="leftBox">
              {delVisible && (
                <div className="idInput">
                  <div>ID</div>
                </div>
              )}
              <div className="pwInput">
                <div>PW</div>
                <div className="pw_msg"></div>
              </div>
              {!delVisible && (
                <div className="pwInput">
                  <div>NEW</div>
                  <div className="pw_msg"></div>
                </div>
              )}
            </div>
            <div className="rightBox">
              {delVisible && (
                <div className="idInput check">
                  <input type="text" name="userid" id="userid" ref={useridRef} />
                  <i className="material-icons idCheckNull">visibility</i>
                </div>
              )}
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
              {!delVisible && (
                <>
                  <div className="pwInput check">
                    {visible2 ? (
                      <input
                        type="text"
                        name="newUserpw"
                        id="newUserpw"
                        onChange={handleChangeNewPw}
                      />
                    ) : (
                      <input
                        type="password"
                        name="newUserpw"
                        id="newUserpw"
                        onChange={handleChangeNewPw}
                      />
                    )}

                    <i className="material-icons pwCheck" onClick={() => setVisible2(!visible2)}>
                      {visible2 ? "visibility" : "visibility_off"}
                    </i>
                  </div>
                  <div className="pw_msg" ref={newPwCheckRef}></div>
                </>
              )}
            </div>
          </div>
          <div className="btnBox">
            {!delVisible && (
              <div className="updateBtn" onClick={updateUser}>
                수정
              </div>
            )}
            <div className="cancelBtn" onClick={deleteUser}>
              탈퇴
            </div>
            {delVisible && (
              <div className="cancelBtn" onClick={() => setDelVisible(!delVisible)}>
                취소
              </div>
            )}
          </div>
        </div>
        <div className="profileBtnBox">
          <div className="goProfile" onClick={() => setToggle(true)}>
            프로필
          </div>
          <div className="goPwUpdate nowPage" onClick={() => setToggle(false)}>
            비밀번호 변경
          </div>
        </div>
      </div>
    </>
  );
};

export default PwUpdate;
