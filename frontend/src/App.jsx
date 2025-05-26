import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DogList from "../components/DogList";
import DogProfile from "../components/DogProfile";
import DogForm from "../components/DogForm";
import DogEdit from "../components/DogEdit";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DogList />} />
        <Route path="/dog/:id" element={<DogProfile />} />
        <Route path="/create" element={<DogForm />} />
        <Route path="/edit/:id" element={<DogEdit />} />
      </Routes>
    </Router>
  );
}

export default App;
