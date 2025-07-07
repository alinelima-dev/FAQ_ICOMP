//import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/adm/Login";
import Perguntas from "./pages/adm/Perguntas";
import Categorias from "./pages/adm/Categorias";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/user/Home";
import PerguntaCompleta from "./pages/user/PerguntaCompleta";
import { SnackbarProvider } from "@contexts/SnackbarContext";
import TrocarSenha from "@pages/adm/TrocarSenha";
import { UserProvider } from "@contexts/UserContext";
import { IoCProvider } from "@contexts/IoCContext";

function App() {
  return (
    <div>
      <SnackbarProvider>
        <IoCProvider>
          <UserProvider>
            <Router>
              <Routes>
                {/* Rota pública */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/pergunta/:id" element={<PerguntaCompleta />} />
                <Route path="/trocar-senha" element={<TrocarSenha />} />

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
          </UserProvider>
        </IoCProvider>
      </SnackbarProvider>
    </div>
  );
}

export default App;
