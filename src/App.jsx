import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import "./styles/app.scss";
import Commnunity from "./pages/Community";
import Mypage from "./pages/Mypage";
import MyCalendar from "./pages/MyCalendar";
import InsertBoard from "./pages/InsertBoard";
import BoardDetail from "./pages/BoardDetail";
import InsertPost from "./pages/InsertPost";
import PostDetail from "./pages/PostDetail";
import IndexPage from "./pages/IndexPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/community" element={<Commnunity />}></Route>
          <Route path="/login" element={<MainPage />}></Route>
          <Route path="/calendar" element={<MyCalendar />}></Route>
          <Route path="/profile" element={<Mypage />}></Route>
          <Route path="/insertBoard" element={<InsertBoard />}></Route>
          <Route path="/insertPost" element={<InsertPost />}></Route>
          <Route path="/boardDetail" element={<BoardDetail />}></Route>
          <Route path="/postDetail" element={<PostDetail />}></Route>
          <Route path="/" element={<IndexPage />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
