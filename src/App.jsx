import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles/app.scss";
import MainPage from "./pages/MainPage";
import Commnunity from "./pages/Community";
import Mypage from "./pages/Mypage";
import MyCalendar from "./pages/MyCalendar";
import InsertBoard from "./pages/InsertBoard";
import BoardDetail from "./pages/BoardDetail";
import InsertPost from "./pages/InsertPost";
import PostDetail from "./pages/PostDetail";
import IndexPage from "./pages/IndexPage";
import AuthRoute from "./components/AuthRoute";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 비로그인 + 로그인 접근가능 */}
          <Route path="/community" element={<Commnunity />}></Route>
          <Route path="/login" element={<MainPage />}></Route>
          <Route path="/" element={<IndexPage />}></Route>
          {/* 로그인 회원만 접근가능 */}
          <Route path="/calendar" element={<AuthRoute element={MyCalendar} />} />
          <Route path="/profile" element={<AuthRoute element={Mypage} />} />
          <Route path="/insertBoard" element={<AuthRoute element={InsertBoard} />} />
          <Route path="/insertPost" element={<AuthRoute element={InsertPost} />} />
          <Route path="/boardDetail" element={<AuthRoute element={BoardDetail} />} />
          <Route path="/postDetail" element={<AuthRoute element={PostDetail} />} />
          {/* 404 페이지 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
