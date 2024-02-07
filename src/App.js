import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./Navigation";
import Forex from "./Forex";
import Crypto from "./Crypto";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigation />}></Route>
        <Route path="crypto" element={<Crypto />} />
        <Route path="forex" element={<Forex />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
