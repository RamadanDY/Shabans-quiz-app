import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Home from "@/pages/Home"
import About from "@/pages/About"
 import QuizApp from "@/pages/QuizApp"

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/questions" element={<QuizApp />} />
      </Routes>
    </Router>
  )
}

export default App
