import React, { useRef } from "react";
import "./DashboardCadastro.css";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../contexts/contextsAuth/AuthContext";
import { useState } from "react";

import Navbar1 from "../../componentes/Navbar/Navbar1";

const DashboardCadastro = () => {
  const { user, logout } = UserAuth();
  const closeRef = useRef();
  const navigate = useNavigate();

  const [isRender, setIsRender] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      console.log("You are logged out");
    } catch (e) {
      console.log(e.message);
    }
  };

  const closeComp = () => {
    navigate("/pesquisa");
  };

  function MedOuPac() {
    return (
      <div ref={closeRef} className="posMed">
        <div className="medOrUser">
          <h2>Você é medico ou paciente?</h2>
          <button onClick={closeComp}>Paciente</button>
          <button onClick={toggleComponentVisibility}>Médico</button>
        </div>
      </div>
    );
  }

  function FacaCadas() {
    return (
      <div className="posMed">
        <div className="medOrUser">
          <h2>Você deseja fazer o cadastro completo do seu perfil agora?</h2>
          <button
            onClick={() => {
              navigate("/CadastroMedico");
            }}
          >
            Sim
          </button>
          <button onClick={closeComp}>Talvez depois</button>
        </div>
      </div>
    );
  }

  const toggleComponentVisibility = () => {
    setIsRender(!isRender);
  };

  return (
    <>
      <Navbar1 />
      <FacaCadas />
    </>
  );
};

export default DashboardCadastro;
