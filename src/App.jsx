import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import "./styles/app.scss";
import Commnunity from "./pages/Community";
import Mypage from "./pages/Mypage";
import MyCalendar from "./pages/MyCalendar";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Commnunity />}></Route>
          <Route path="/login" element={<MainPage />}></Route>
          <Route path="/calendar" element={<MyCalendar />}></Route>
          <Route path="/profile" element={<Mypage />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
