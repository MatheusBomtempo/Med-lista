import React, { useState, memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import DefaultUser from "../../imgs/defaulUser.jpg";
import Rating from "../../componentes/rating/RatingPesquisa";
import Loader from "../../componentes/Loader/Loader";
import LazyImage from "../LazyImage/LazyImage";

const Resultados = memo(({ filteredData, navigate, isLoading }) => {
  const [visibleDoctors, setVisibleDoctors] = useState(8);

  const handleLoadMore = () => {
    setVisibleDoctors(visibleDoctors + 4);
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="resultOut">
      <div className="resultados">
        {filteredData
          .filter((medicos2) => medicos2.exibirPerfil)
          .slice(0, visibleDoctors)
          .map((medicos2) => {
            const atendeFormatado = Array.isArray(medicos2.atende)
              ? medicos2.atende.join(", ")
              : medicos2.atende;
            return (
              <div
                key={medicos2.id}
                className="box"
                onClick={() => {
                  navigate(`/PerfilMed/${medicos2.id}`);
                }}
              >
                <div className="flexfoto">
                  <div className="foto">
                    <LazyImage
                      src={medicos2.image_url}
                      defaultSrc={DefaultUser}
                      alt={`Foto de ${medicos2.nome}`}
                    />
                  </div>
                  <div className="header">
                    <div className="headerinner">
                      <h4 className="especiali">{medicos2.especialidade}</h4>
                      <h4 className="crm">
                        CRM:{medicos2.CRM}-{medicos2.UfCRM}
                      </h4>
                    </div>
                    <h2>
                      <span className="maxLetras">
                        {medicos2.sexo} {medicos2.nome}
                      </span>
                    </h2>
                    <div className="estrelinhas">
                      <Rating key={medicos2.id} userId={medicos2.id} />
                    </div>
                  </div>
                </div>
                <div className="atributos">
                  <h3 className="local">
                    Local:
                    <span className="espacinho">{medicos2.local}</span>
                  </h3>
                  <h3>
                    Atende:
                    <span className="espacinho">{atendeFormatado}</span>
                  </h3>
                </div>
                <div className="butaum">
                  <button>Ver mais</button>
                </div>
              </div>
            );
          })}

      </div>

      {visibleDoctors < filteredData.length && (
          <div><button id="verMaisPesq" onClick={handleLoadMore}>
            Ver mais <FontAwesomeIcon icon={faPlus} />
          </button></div>
        )}
    </div>
  );
});

Resultados.displayName = "Resultados";

export default Resultados;
