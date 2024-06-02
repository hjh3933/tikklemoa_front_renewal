import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <h2>hi</h2>
        <Routes>
          <Route path="/"></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
