import { BrowserRouter, Routes, Route } from "react-router-dom";
import DailyLog from "./pages/DailyLog"
import Dashboard from "./pages/Dashboard";
import Scheme from "./pages/Scheme";
import SavingsGoal from "./pages/SavingsGoal";
import FamilyShield from "./pages/FamilyShield";
import Layout from "./components/Layout";

function App(){
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/add-log" element={<Layout><DailyLog /></Layout>} />
          <Route path="/scheme" element={<Layout><Scheme /></Layout>} />
          <Route path="/savings-goal" element={<Layout><SavingsGoal /></Layout>} />
          <Route path="/family-shield" element={<FamilyShield />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;