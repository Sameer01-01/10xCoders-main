import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Bmi from "./components/Courses";
import Dietplans from "./components/PerRoadmaps";
import Injury from "./components/ResumeEnhancer";
import Exercise from "./components/CareerAgent";
import Nutrition from "./components/ResumeMaker";
import ResumePreview from "./components/ResumePreview";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />  
        <Route path="/home" element={<Home />} />
        <Route path="/bmi" element={<Bmi />} />
        <Route path="/diet" element={<Dietplans />} />
        <Route path="/injury" element={<Injury />} />
        <Route path="/exercise" element={<Exercise />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/resume-preview" element={<ResumePreview />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
