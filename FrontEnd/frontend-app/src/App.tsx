import { Routes, Route } from "react-router-dom"
import Auth from "./pages/auth/auth"
import Home from "./pages/home/home"

import "./App.css"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/home/*" element={<Home />} />
    </Routes>
  )
}