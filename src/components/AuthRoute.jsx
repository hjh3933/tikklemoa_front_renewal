import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "../utils/tokenUtils";

const AuthRoute = ({ element: Component, ...rest }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
      localStorage.clear();
      alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
      navigate("/login");
    }
  }, [navigate]);

  return <Component {...rest} />;
};

export default AuthRoute;
