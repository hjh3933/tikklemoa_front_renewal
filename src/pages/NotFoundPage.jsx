import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

const NotFoundPage = () => {
  return (
    <>
      <Header></Header>
      <div className="errorDiv">
        <div className="imgDiv">
          <img src="/images/NotFoundImg.webp" alt="" />
        </div>
        <h3 className="errorTitle">404 Not Found...</h3>
      </div>
      <Footer></Footer>
    </>
  );
};

export default NotFoundPage;
