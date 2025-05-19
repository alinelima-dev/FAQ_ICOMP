//import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/adm/Login";
import Perguntas from "./pages/adm/Perguntas";
import Categorias from "./pages/adm/Categorias";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/user/Home";
import PerguntaCompleta from "./pages/user/PerguntaCompleta";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          {/* Rota pública */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pergunta/:id" element={<PerguntaCompleta />} />

          {/* Rotas protegidas */}
          <Route
            path="/adm/perguntas"
            element={
              <ProtectedRoute>
                <Perguntas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adm/categorias"
            element={
              <ProtectedRoute>
                <Categorias />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
