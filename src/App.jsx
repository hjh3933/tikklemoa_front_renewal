import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import "./styles/app.scss";
import Commnunity from "./pages/Community";
import Mypage from "./pages/Mypage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />}></Route>
          <Route path="/community" element={<Commnunity />}></Route>
          <Route path="/profile" element={<Mypage />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
