import "./Pesquisa.css";
import React, {
  Suspense,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faStar,
  faFilterCircleXmark,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
// import DefaultUser from "../../imgs/defaulUser.jpg";

import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { getDocs, collection, doc, getDoc } from "firebase/firestore";
import { database } from "../../firebase";
import {
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import queryString from "query-string";
import Navbar1 from "../../componentes/Navbar/Navbar1";
import ScrollToTop from "../../componentes/ScrollToTop/ScrollToTop";
import ErrorBoundary from "../../componentes/ErrorBoundary/ErrorBoundary";
import Loader from "../../componentes/Loader/Loader";

const Pesquisa = () => {
  let navigate = useNavigate();

  let location = useLocation();
  const queryParams = queryString.parse(location.search);

  const Resultados = React.lazy(() =>
    import("../../componentes/Resultados/Resultados")
  );

  let [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query"));

  const [medico, setMedico] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");

  const [selectedEspecialidade, setSelectedEspecialidade] = useState(null);
  const [conv, setConv] = useState("");
  const [cidad, setCidad] = useState("");
  const [selectedRating, setSelectedRating] = useState(null);
  const [convenios, setConvenios] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);

  const todosMedicos = collection(database, "medicos2");
  const [userImageUrl, setUserImageUrl] = useState(null);

  // Refs para os dropdowns
  const dropdown1Ref = useRef(null);
  const dropdown2Ref = useRef(null);
  const dropdown3Ref = useRef(null);
  const dropdown4Ref = useRef(null);

  useEffect(() => {
    const getTodosMedicos = async () => {
      try {
        const data = await getDocs(todosMedicos);
        const medicosData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setMedico(medicosData);
        setFilteredData(medicosData);
      } catch (err) {
        console.error(err);
      }
    };

    getTodosMedicos();
  }, []);

  useEffect(() => {
    const fetchConvenios = async () => {
      try {
        const conveniosDocRef = doc(database, 'listas', 'convenios');
        const conveniosDoc = await getDoc(conveniosDocRef);

        if (conveniosDoc.exists()) {
          const conveniosData = conveniosDoc.data();
          setConvenios(conveniosData.nome || []);
        }
      } catch (err) {
        console.error('Erro ao buscar convênios:', err);
      }
    };

    fetchConvenios();
  }, []);

  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const especialidadesDocRef = doc(database, 'listas', 'especialidades');
        const especialidadesDoc = await getDoc(especialidadesDocRef);

        if (especialidadesDoc.exists()) {
          const especialidadesData = especialidadesDoc.data();
          setEspecialidades(especialidadesData.nome || []);
        }
      } catch (err) {
        console.error('Erro ao buscar especialidades:', err);
      }
    };

    fetchEspecialidades();
  }, []);

  const applyFilters = useCallback(() => {
    let filteredData = medico;

    if (wordEntered.trim() !== "") {
      filteredData = filteredData.filter((medicos2) =>
        medicos2.nome.toLowerCase().includes(wordEntered.toLowerCase())
      );
    }

    if (selectedEspecialidade !== null) {
      filteredData = filteredData.filter(
        (medicos2) => medicos2.especialidade === selectedEspecialidade
      );
    }

    if (conv !== "") {
      filteredData = filteredData.filter(
        (medicos2) => medicos2.convenio && medicos2.convenio.includes(conv)
      );
    }

    if (cidad !== "") {
      filteredData = filteredData.filter(
        (medicos2) => medicos2.cidade && medicos2.cidade.includes(cidad)
      );
    }
    if (selectedRating !== null) {
      filteredData = filteredData.filter(
        (medicos2) => Math.ceil(medicos2.rateavg) === selectedRating
      );
    }

    setFilteredData(filteredData);
  }, [wordEntered, selectedEspecialidade, conv, cidad, medico, selectedRating]);

  const handleFilter = (event) => {
    const searchWord = event?.target?.value.trim().toLowerCase() || "";
    setWordEntered(searchWord);
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const q = params.get("q");
    applyFilters();

    if (q) {
      setSelectedEspecialidade(q || "");
    }
  }, [searchParams, applyFilters]);

  const resetFilter = () => {
    setSelectedEspecialidade(null);
    setConv("");
    setCidad("");
    setSelectedRating(null);
    setSearchParams("");
  };

  useEffect(() => {
    applyFilters();
  }, [wordEntered, selectedEspecialidade, conv, cidad, applyFilters]);

  const handleEspecialidadeChange = (especialidade) => {
    setSelectedEspecialidade(especialidade);
    setSearchParams({ q: especialidade });
    setShow(false);
  };

  const handleConvChange = (eventKey) => {
    setConv(eventKey);
    setShow2(false);
  };

  const handleCidadeChange = (eventKey) => {
    setCidad(eventKey);
    setShow3(false);
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleFullScreenMenu = () => {
    if (isMenuOpen) {
      setShow(false);
      setShow2(false);
      setShow3(false);
      setShow4(false);
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        if (isMenuOpen) {
          setShow(false);
          setShow2(false);
          setShow3(false);
          setShow4(false);
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Fechar dropdown 1 (Especialidade)
      if (show && dropdown1Ref.current && !dropdown1Ref.current.contains(event.target)) {
        setShow(false);
      }
      // Fechar dropdown 2 (Convênio)
      if (show2 && dropdown2Ref.current && !dropdown2Ref.current.contains(event.target)) {
        setShow2(false);
      }
      // Fechar dropdown 3 (Cidade)
      if (show3 && dropdown3Ref.current && !dropdown3Ref.current.contains(event.target)) {
        setShow3(false);
      }
      // Fechar dropdown 4 (Avaliação)
      if (show4 && dropdown4Ref.current && !dropdown4Ref.current.contains(event.target)) {
        setShow4(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, show2, show3, show4]);

  return (
    <div className="container mx:auto tudoPesquisa">
      <ScrollToTop></ScrollToTop>
      <nav>
        <Navbar1></Navbar1>
      </nav>

      <div className="group1">
        <div
          className={`filtros lateral ${isMenuOpen ? "active" : ""}`}
          ref={sidebarRef}
        >
          <div ref={dropdown1Ref}>
            <Dropdown show={show}>
              <Dropdown.Toggle
                variant="success"
                id="dropdown-basic"
                className="filter"
                onClick={() => setShow(!show)}
              >
                {selectedEspecialidade ? selectedEspecialidade : "Especialidade"}
              </Dropdown.Toggle>
              <Dropdown.Menu
                style={{
                  maxHeight: "200px",
                  overflowY: "auto",
                  overflowX: "none",
                }}
              >
                {especialidades.length > 0 ? (
                  especialidades.map((especialidade, index) => (
                    <Dropdown.Item
                      key={index}
                      value={especialidade}
                      onClick={() => handleEspecialidadeChange(especialidade)}
                      className="lettersize"
                    >
                      {especialidade}
                    </Dropdown.Item>
                  ))
                ) : (
                  <Dropdown.Item disabled className="lettersize">
                    Carregando especialidades...
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div ref={dropdown2Ref}>
            <Dropdown onSelect={handleConvChange} show={show2}>
              <Dropdown.Toggle
                variant="success"
                id="dropdown-basic"
                className="filter"
                onClick={() => setShow2(!show2)}
              >
                {conv ? conv : "Convênio"}
              </Dropdown.Toggle>
              <Dropdown.Menu
                style={{
                  maxHeight: "200px",
                  overflowY: "auto",
                  overflowX: "none",
                }}
              >
                {convenios.length > 0 ? (
                  convenios.map((convenio, index) => (
                    <Dropdown.Item
                      key={index}
                      className="lettersize"
                      eventKey={convenio}
                    >
                      {convenio}
                    </Dropdown.Item>
                  ))
                ) : (
                  <Dropdown.Item disabled className="lettersize">
                    Carregando convênios...
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div ref={dropdown3Ref}>
            <Dropdown show={show3} onSelect={handleCidadeChange}>
              <Dropdown.Toggle
                variant="success"
                id="dropdown-basic"
                className="filter"
                onClick={() => setShow3(!show3)}
              >
                {cidad ? cidad : "Cidade"}
              </Dropdown.Toggle>
              <Dropdown.Menu
                style={{
                  maxHeight: "200px",
                  overflowY: "auto",
                  overflowX: "none",
                }}
              >
                <Dropdown.Item className="lettersize" eventKey="Barbacena">
                  Barbacena
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div ref={dropdown4Ref}>
            <Dropdown show={show4}>
              <Dropdown.Toggle
                variant="success"
                id="dropdown-basic"
                className="filter"
                onClick={() => setShow4(!show4)}
              >
                {selectedRating
                  ? Array(selectedRating)
                      .fill()
                      .map((_, i) => (
                        <FontAwesomeIcon key={i} id="estrela" icon={faStar} />
                      ))
                  : "Avaliação"}
              </Dropdown.Toggle>
              <Dropdown.Menu
                style={{
                  maxHeight: "200px",
                  overflowY: "auto",
                  overflowX: "none",
                }}
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Dropdown.Item
                    key={rating}
                    onClick={() => {
                      setSelectedRating(rating);
                      setShow4(false);
                    }}
                    className="lettersize"
                  >
                    {Array(rating)
                      .fill()
                      .map((_, i) => (
                        <FontAwesomeIcon key={i} id="estrela" icon={faStar} />
                      ))}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <Button
            variant="outline-secondary"
            className="filter xMrk"
            onClick={resetFilter}
          >
            <FontAwesomeIcon id="filterDown" icon={faFilterCircleXmark} className="mr-1" />
            Limpar filtros
          </Button>
          {/* </div> */}
        </div>

        <div className="btnsMobile">
          <Button
            variant="outline-secondary"
            className="filter xMrk"
            id="mobileScreenMenu1"
            onClick={resetFilter}
          >
            <FontAwesomeIcon id="filterDown" icon={faFilterCircleXmark} className="mr-1"/>
            Limpar filtros
          </Button>
          <Button
            variant="outline-secondary"
            className="filter xMrk"
            id="mobileScreenMenu"
            onClick={toggleFullScreenMenu}
          >
            <FontAwesomeIcon id="filterDown" icon={faSliders} />
          </Button>
        </div>

        <div className="bg">
          <div className="textInput tamanho">
            <InputGroup id="input1" className="mb-3">
              <FontAwesomeIcon id="lupa" icon={faMagnifyingGlass} />
              <Form.Control
                id="input2"
                placeholder="Insira um Nome"
                aria-label="doutores"
                aria-describedby="basic-addon2"
                onChange={handleFilter}
              />
              <Button
                variant="outline-secondary"
                id="button-addon2"
                onClick={applyFilters}
              >
                Pesquisar
              </Button>
            </InputGroup>
          </div>

          <Suspense fallback={<Loader></Loader>}>
            <ErrorBoundary>
              <Resultados filteredData={filteredData} navigate={navigate} />
            </ErrorBoundary>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Pesquisa;
