import React from "react";
import "./PerfilMed.css";
import Rating from "../../componentes/rating/Rating";
import { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faLocationDot,
  faStethoscope,
  faHouseChimneyMedical,
  faBuildingColumns,
  faCertificate,
  faScroll,
} from "@fortawesome/free-solid-svg-icons";

import { faInstagram } from "@fortawesome/free-brands-svg-icons";

import {
  getDoc,
  getDocs,
  collection,
  doc,
  updateDoc,
  addDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { database } from "../../firebase";
import Navbar1 from "../../componentes/Navbar/Navbar1";
import { useParams } from "react-router-dom";

import Comments from "../../componentes/comments/Comments";
import Loader from "../../componentes/Loader/Loader";

const PerfilMed = ({ sectionId }) => {
  const { userId } = useParams();
  const [medico, setMedico] = useState(null);
  const [userImageUrl, setUserImageUrl] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [instagramLoading, setInstagramLoading] = useState(true);

  useEffect(() => {
    const getMedicoAndComments = async () => {
      try {
        const medicoRef = doc(database, "medicos2", userId);
        const medicoDoc = await getDoc(medicoRef);

        if (medicoDoc.exists()) {
          const medicoData = medicoDoc.data();
          setMedico(medicoData);
          setUserImageUrl(medicoData.image_url || null);

          const commentsRef = collection(medicoRef, "comments");
          const commentsSnapshot = await getDocs(commentsRef);

          let totalRating = 0;
          let totalComments = 0;

          commentsSnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.rating) {
              totalRating += data.rating;
              totalComments++;
            }
          });

          const averageRating =
            totalComments > 0 ? totalRating / totalComments : 0;

          if (medicoData.rateavg !== averageRating) {
            await updateDoc(medicoRef, {
              rateavg: averageRating,
            });
          }
          // Registrar visualização (sempre que o perfil é carregado)
          const hasVisitedKey = `hasVisited_${userId}_${new Date().toDateString()}`;
          const hasVisited = localStorage.getItem(hasVisitedKey);

          if (!hasVisited) {
            await updateDoc(medicoRef, {
              acessos: (medicoData.acessos || 0) + 1,
            });

            // Registrar histórico de visualização
            const historicoRef = collection(medicoRef, "historicoVisualizacoes");
            await addDoc(historicoRef, {
              data: serverTimestamp(),
              tipo: "visualizacao",
            });

            localStorage.setItem(hasVisitedKey, "true");
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    getMedicoAndComments();
  }, [userId]);

  useEffect(() => {
    setMapLoading(true);
    setInstagramLoading(true);
  }, [userId]);

  if (!medico) {
    return <Loader />;
  }

  let conveniosFormatted = "";
  if (medico.convenio && Array.isArray(medico.convenio)) {
    conveniosFormatted = medico.convenio.join(", ");
  }

  let atendeFormatted = "";
  if (medico.atende && Array.isArray(medico.atende)) {
    atendeFormatted = medico.atende.join(", ");
  }

  
  return (
    <div className="container resultados1">
      <nav>
        <Navbar1></Navbar1>
      </nav>
      <section className="conteudo" id={sectionId || ""}>
        <div className="box">
          <div className="flexfoto">
            <div className="foto">
              {userImageUrl && <img src={userImageUrl} alt="User" />}
            </div>
            <div className="header">
              <div className="headerinner">
                <h4 className="especiali">{medico.especialidade}</h4>
                <h4 className="crm">
                  CRM:{medico.CRM}-{medico.UfCRM}
                </h4>
              </div>
              <h2>
                <span>
                  {" "}
                  {medico.sexo} {medico.nome}
                </span>
              </h2>
              <div className="estrelinhas">
                <Rating userId={userId} />
              </div>
            </div>
          </div>

          <hr className="separadorr"></hr>

          <div className="atributos">
            <div className="contatos">
              <h1 className="tituloAtributos">Contatos:</h1>

              <div className="flex flex-col">
                {medico.telefone1 && typeof medico.telefone1 === "string" ? (
                  <span className="flex justify-start content-center items-center">
                    <FontAwesomeIcon id="phone" icon={faPhone} />
                    <h2 className="atributo">
                      {medico.telefone1.replace(/(\d{2})/, "($1)")}
                    </h2>
                  </span>
                ) : null}

                {/* Check if medico.telefone2 exists and is a string */}
                {medico.telefone2 && typeof medico.telefone2 === "string" ? (
                  <span className="flex justify-start content-center items-center mt-4">
                    <FontAwesomeIcon id="phone" icon={faPhone} />
                    <h2 className="atributo">
                      {medico.telefone2.replace(/(\d{2})/, "($1)")}
                    </h2>
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <hr className="separadorr"></hr>

          <div className="atributos">
            <div className="consultorios">
              <h1 className="tituloAtributos">Consultórios:</h1>

              <div className=" flex flex-col gap-8">
                <span className="flex justify-start content-center items-center">
                  <FontAwesomeIcon id="localDot" icon={faLocationDot} />
                  <h2 className="atributo">{medico.local}, MG</h2>
                </span>

                {typeof medico?.clinicaEndereco === "string" &&
                  medico?.clinicaEndereco.trim() !== "" && (
                    <span className="flex justify-start content-center items-center">
                      <FontAwesomeIcon id="phone" icon={faLocationDot} />
                      <h2 className="atributo">{medico.clinicaEndereco} </h2>
                    </span>
                  )}

                <span className="flex justify-start content-center items-center">
                  <FontAwesomeIcon id="phone" icon={faStethoscope} />
                  <h2 className="atributo">{atendeFormatted} </h2>
                </span>

                {/* Mapa embed: usa clinicaEndereco se disponível, caso contrário usa local + hospital + atende */}
                {((typeof medico?.clinicaEndereco === "string" &&
                  medico?.clinicaEndereco.trim() !== "") ||
                  (medico?.local && atendeFormatted)) && (
                  <div style={{ width: "100%", marginTop: "16px", borderRadius: "8px", overflow: "hidden", position: "relative", backgroundColor: "#f5f5f5", minHeight: "300px" }}>
                    {mapLoading && (
                      <div className="map-loading-container">
                        <div className="map-loading-spinner"></div>
                        <p className="map-loading-text">Carregando mapa...</p>
                      </div>
                    )}
                    <iframe
                      width="100%"
                      height="300"
                      style={{ border: 0, opacity: mapLoading ? 0 : 1, transition: "opacity 0.3s ease-in-out" }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(
                        typeof medico?.clinicaEndereco === "string" &&
                          medico?.clinicaEndereco.trim() !== ""
                          ? medico.clinicaEndereco
                          : `hospital ${atendeFormatted} ${medico.local}, MG`
                      )}&output=embed`}
                      title="Localização da clínica"
                      onLoad={() => setMapLoading(false)}
                    ></iframe>
                  </div>
                )}
              </div>
            </div>
          </div>

          <hr className="separadorr"></hr>

          <div className="atributos">
            <div className="consultorios">
              <h1 className="tituloAtributos">Convênios:</h1>

              <div className=" flex flex-col gap-8">
                <span className="flex justify-start content-center items-center">
                  <FontAwesomeIcon id="localDot" icon={faHouseChimneyMedical} />
                  <h2 className="atributo">{conveniosFormatted}</h2>
                </span>

                {/* <span className="flex justify-start content-center items-center">
                  <FontAwesomeIcon id="phone" icon={faLocationDot} />
                  <h2 className="atributo">{medico.clinicaEndereco} </h2>
                </span> */}
              </div>
            </div>
          </div>

          <hr className="separadorr"></hr>

          <div className="atributos">
            <div className="consultorios">
              <h1 className="tituloAtributos">Experiência:</h1>

              <div className=" flex flex-col gap-8">
                <span className="flex justify-start content-center items-center">
                  <FontAwesomeIcon id="localDot" icon={faBuildingColumns} />
                  <h2 className="atributo">{medico.estudou}</h2>
                </span>

                {medico.certificacoes && Array.isArray(medico.certificacoes) && medico.certificacoes.length > 0 && (
                  <span className="flex justify-start content-center items-start">
                    <FontAwesomeIcon id="localDot" icon={faCertificate} />
                    <div className="flex flex-col">
                      {medico.certificacoes.map((certificacao, index) => (
                        <div key={index} className="flex flex-col cert">
                          <h2 className="atributo">- {certificacao}</h2>
                        </div>
                      ))}
                    </div>
                  </span>
                )}

                {medico.curriculo && (
                  <span className="flex justify-start content-center items-center">
                    <FontAwesomeIcon id="localDot" icon={faScroll} />
                    <h2 className="atributo">
                      <a 
                        target="_blank" 
                        href={medico.curriculo} 
                        rel="noreferrer"
                        onClick={async () => {
                          try {
                            const medicoRef = doc(database, "medicos2", userId);
                            await updateDoc(medicoRef, {
                              cliquesLattes: increment(1),
                            });
                            
                            // Registrar histórico de clique
                            const historicoRef = collection(medicoRef, "historicoVisualizacoes");
                            await addDoc(historicoRef, {
                              data: serverTimestamp(),
                              tipo: "clique_lattes",
                            });
                          } catch (error) {
                            console.error("Erro ao registrar clique no Lattes:", error);
                          }
                        }}
                      >
                        Currículo de {medico.nome}
                      </a>
                    </h2>
                  </span>
                )}

                {/* <span className="flex justify-start content-center items-center">
                  <FontAwesomeIcon id="phone" icon={faLocationDot} />
                  <h2 className="atributo">{medico.clinicaEndereco} </h2>
                </span> */}
              </div>
            </div>
          </div>

          {medico.instagram && (
            <>
              <hr className="separadorr"></hr>
              <div className="atributos">
                <div className="consultorios">
                  <h1 className="tituloAtributos">Redes Sociais:</h1>

                  <div className=" flex flex-col gap-8">
                    <span className="flex justify-start content-center items-center">
                      <FontAwesomeIcon id="localDot" icon={faInstagram} />
                      <h2 className="atributo">
                        <a
                          target="_blank"
                          href={`https://instagram.com/${medico.instagram}`} 
                          rel="noreferrer"
                          onClick={async () => {
                            try {
                              const medicoRef = doc(database, "medicos2", userId);
                              await updateDoc(medicoRef, {
                                cliquesInstagram: increment(1),
                              });
                              
                              // Registrar histórico de clique
                              const historicoRef = collection(medicoRef, "historicoVisualizacoes");
                              await addDoc(historicoRef, {
                                data: serverTimestamp(),
                                tipo: "clique_instagram",
                              });
                            } catch (error) {
                              console.error("Erro ao registrar clique no Instagram:", error);
                            }
                          }}
                        >
                          @{medico.instagram}
                        </a>
                      </h2>
                    </span>
                    
                    {/* Widget do Instagram */}
                    <div style={{ width: "100%", marginTop: "16px", borderRadius: "8px", overflow: "hidden", position: "relative", backgroundColor: "#f5f5f5", minHeight: "600px" }}>
                      {instagramLoading && (
                        <div className="map-loading-container">
                          <div className="map-loading-spinner"></div>
                          <p className="map-loading-text">Carregando Instagram...</p>
                        </div>
                      )}
                      <iframe
                        src={`https://www.instagram.com/${medico.instagram}/embed/`}
                        width="100%"
                        height="600"
                        style={{ border: 0, borderRadius: "8px", opacity: instagramLoading ? 0 : 1, transition: "opacity 0.3s ease-in-out" }}
                        scrolling="no"
                        allowTransparency="true"
                        allow="encrypted-media"
                        title={`Instagram de @${medico.instagram}`}
                        onLoad={() => setInstagramLoading(false)}
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* <ul>
            {medico.map((medicos2) => (
              <li key={medico.id}>{medico.atende}</li>
            ))}
          </ul> */}
        </div>
      </section>

      <section className="conteudo">
        <Comments></Comments>
      </section>

      <section className="conteudo">
        <div className="box">
          <div className="flexfoto">
            <h2>Visitas no perfil de {medico.nome} </h2>
          </div>
          <hr className="separadorr"></hr>
          <div className="comReview">
            <p>
              {medico.acessos !== undefined ? (
                <>
                  {medico.acessos === 0
                    ? "1 visita"
                    : `${medico.acessos} ${
                        medico.acessos === 1 ? "visita" : "visitas"
                      }`}
                </>
              ) : (
                "1 visita ao perfil."
              )}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
export default PerfilMed;