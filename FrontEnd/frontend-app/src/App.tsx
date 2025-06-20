import { Routes, Route } from "react-router-dom"
import Auth from "./pages/auth/auth"
import Home from "./pages/home/home"
import CreateQuotesPanel from "./pages/home/add-quotes-panel";

import "./App.css"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/home/*" element={<Home />} />
      <Route path="/home/quotes/add" element={<CreateQuotesPanel />} />
      <Route path="/home/quotes/edit/:id" element={<CreateQuotesPanel mode="editar"/>} />
    </Routes>
  )
}