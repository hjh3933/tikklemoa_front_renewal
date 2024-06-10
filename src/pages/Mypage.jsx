import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Profile from "../components/Profile";

const Mypage = () => {
  return (
    <>
      <Header></Header>
      <Profile />
      <Footer></Footer>
    </>
  );
};

export default Mypage;
