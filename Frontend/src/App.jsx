import { BrowserRouter, Routes, Route } from "react-router-dom";
import DailyLog from "./pages/DailyLog"
import Dashboard from "./pages/Dashboard";

function App(){
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-log" element={<DailyLog />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;