import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Bmi from "./components/Courses";
import Dietplans from "./components/PerRoadmaps";
import Injury from "./components/ResumeEnhancer";
import Exercise from "./components/CareerAgent";
import Nutrition from "./components/ResumeMaker";
import ResumePreview from "./components/ResumePreview";
import AuthPage from "./components/Login";
import InterviewPrep from "./components/Interview";
import TypingTest from "./components/Typing";
import MachineCode from "./components/CodingPractice";
import KanbanBoard from "./components/KanBan";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/courses" element={<Bmi />} />
        <Route path="/roadmaps" element={<Dietplans />} />
        <Route path="/enhance" element={<Injury />} />
        <Route path="/career" element={<Exercise />} />
        <Route path="/resume" element={<Nutrition />} />
        <Route path="/resume-preview" element={<ResumePreview />} />
        <Route path="/interview" element={<InterviewPrep />} />
        <Route path="/type" element={<TypingTest />} />
        <Route path="/code" element={<MachineCode />} />
        <Route path="/todo" element={<KanbanBoard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
