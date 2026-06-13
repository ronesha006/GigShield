import { BrowserRouter, Routes, Route } from "react-router-dom";
import DailyLog from "./pages/DailyLog"
import Dashboard from "./pages/Dashboard";
import Scheme from "./pages/Scheme";

function App(){
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-log" element={<DailyLog />} />
          <Route path="/scheme" element={<Scheme />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;