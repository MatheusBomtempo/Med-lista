import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import ScrollToTop from "./componentes/ScrollToTop/ScrollToTop";
// import { getDocs, collection } from "firebase/firestore";
// import { database } from "./firebase";
// import { useState, useEffect } from "react";

import CadastroMed from "./pages/CadastroMed/CadastroMed";
import Home from "./pages/home/Home";
import Pesquisa from "./pages/Pesquisa/Pesquisa";
import Cadastro from "./pages/Cadastro/Cadastro";
import { AuthProvider } from "./contexts/contextsAuth/AuthContext";
import Login from "./pages/Login/Login";
import RotaPrivada from "./contexts/contextsAuth/RotaPrivada";
import RotaAdmin from "./contexts/contextsAuth/RotaAdmin";
import Dashboard from "./pages/Dashboard/Dashboard";
import PerfilMed from "./pages/PerfilMed/PerfilMed";
import DashboardCadastro from "./pages/DashboardCadastro/DashboardCadastro";
import Avalia from "./pages/Avalia/Avalia";
import ResetSenha from "./pages/ResetSenha/ResetSenha";
import Admin from "./pages/Admin/Admin";
import CadastroAdmin from "./pages/CadastroAdmin/CadastroAdmin";
import NotFound from "./pages/NotFound/NotFound";
import Sobre from "./pages/Sobre/Sobre";
import Suporte from "./pages/Suporte/Suporte";

// import { UserAuth } from './contexts/contextsAuth/AuthContext';

function App() {
  // const {user} = UserAuth();

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/login" element={<Login />} />
            <Route path="/redefinirSenha" element={<ResetSenha />} />
            <Route
              path="/cadastro-admin"
              element={
                <RotaAdmin>
                  <CadastroAdmin />
                </RotaAdmin>
              }
            />

            <Route path="/PerfilMed/:userId" element={<PerfilMed sectionId="firstbox"/>} />
            <Route path="/avaliacao/:userId" element={<Avalia />} />

            <Route
              path="/CadastroMedico"
              element={
                <RotaPrivada>
                  <CadastroMed />
                </RotaPrivada>
              }
            />
            <Route
              path="/dashboard/:userId"
              element={
                <RotaPrivada>
                  <Dashboard />
                </RotaPrivada>
              }
            />
            <Route
              path="/admin/:userId"
              element={
                <RotaAdmin>
                  <Admin />
                </RotaAdmin>
              }
            />

            <Route
              path="/dashboardCadastro"
              element={
                <RotaPrivada>
                  <DashboardCadastro />
                </RotaPrivada>
              }
            />

            <Route path="/pesquisa" element={<Pesquisa />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/suporte" element={<Suporte />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ScrollToTop>
      </Router>
    </AuthProvider>
  );
}

export default App;
