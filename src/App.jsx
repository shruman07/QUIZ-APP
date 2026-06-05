import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QuizProvider } from "./context/QuizContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SetupPage from "./pages/SetupPage";
import QuizPage from "./pages/QuizPage";
import ResultsPage from "./pages/ResultsPage";
import DashboardPage from "./pages/DashboardPage";
import "./styles/index.css";

export default function App() {
  return (
    <BrowserRouter>
      <QuizProvider>
        <Navbar />
        <Routes>
          <Route path="/"          element={<HomePage />} />
          <Route path="/setup"     element={<SetupPage />} />
          <Route path="/quiz"      element={<QuizPage />} />
          <Route path="/results"   element={<ResultsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*"          element={<HomePage />} />
        </Routes>
      </QuizProvider>
    </BrowserRouter>
  );
}
