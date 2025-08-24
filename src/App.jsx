import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Main from "./pages/Main";
import Character from "./pages/Character";
import Fight from "./pages/Fight";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/main" element={<Main />} />
        <Route path="/character" element={<Character />} />
        <Route path="/fight" element={<Fight />} />
      </Routes>
    </Router>
  );
}
