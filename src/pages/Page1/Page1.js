import React from "react";
import "./Page1.css";
import SelectEspecialidade from "../../componentes/SelectEspecialidade/SelectEspecialidade";
import LazyBackground from "../../componentes/LazyBackground/LazyBackground";
import aurelaImg from "../../imgs/aurela.svg";
import retang1Img from "../../imgs/retang1.svg";


// const FloatingWhatsApp = lazy(() =>
//   import("react-floating-whatsapp").then((module) => ({
//     default: module.FloatingWhatsApp,
//   }))
// );

const Page1 = () => {
  return (
    <div className="page1">
      <LazyBackground
        backgroundImage={aurelaImg}
        className="aurea1"
      />

      <div className="boxHome">
        <h2>
          Bem vindo ao <span className="med">MED</span>
          <span className="lista">LISTA</span>{" "}
        </h2>
        <div className="boxBg">
          <h1>Encontre seu médico:</h1>
          <SelectEspecialidade placeholder="Exemplo: João da Silva">
            {" "}
          </SelectEspecialidade>
        </div>
      </div>

      <LazyBackground
        backgroundImage={retang1Img}
        className="retangulo1"
        style={{
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* <Suspense fallback={<div>Loading...</div>}>
        <FloatingWhatsApp
          phoneNumber={process.env.REACT_APP_WHATSAPP_NUMBER ? `+${process.env.REACT_APP_WHATSAPP_NUMBER}` : "+5532985076447"}
          accountName={<span style={{ color: "white" }}>DeVence</span>}
          avatar={devenceLogo}
          statusMessage="Online"
          chatMessage="Olá! Como podemos te ajudar?"
          placeholder="Digite sua mensagem..."
          showPopup={true}
        />
      </Suspense> */}
    </div>
  );
};

export default Page1;
