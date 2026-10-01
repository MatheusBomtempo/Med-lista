import React, { useState, useEffect } from "react";
import "./SelectEspecialidade.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faStethoscope} from "@fortawesome/free-solid-svg-icons";

import { SearchOutlined } from "@ant-design/icons";
import { Button, Tooltip, Select } from "antd";

import { useNavigate } from "react-router-dom";

import { getDocs, collection } from "firebase/firestore";
import { database } from "../../firebase";
import { StyleProvider } from '@ant-design/cssinjs';
import { especialidades } from "../../utils/especialidades";

function SelectEspecialidade({ placeholder }) {
  let navigate = useNavigate();

  const [medico, setMedico] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedEspecialidade, setSelectedEspecialidade] = useState(null);

  const todosMedicos = collection(database, "medicos2");

  useEffect(() => {
    const getTodosMedicos = async () => {
      try {
        const data = await getDocs(todosMedicos);
        const medico = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMedico(medico);
      } catch (err) {
        console.error(err);
      }
    };
    getTodosMedicos();
  }, []);

  console.log(selectedEspecialidade);

  const handleSearch = () => {
    if (selectedEspecialidade === null) {
      var url = `/pesquisa`;
    } else {
      var url = `/pesquisa?q=${selectedEspecialidade}`;
    }
    navigate(url);
  };

  return (
    <>
      <div className="slct_group">
      <StyleProvider hashPriority="high"> 
        <Select
          showSearch
          style={{
            width: 200,
          }}
          className="slct"
          id="slct4"
          value={selectedEspecialidade}
          onChange={(value) => setSelectedEspecialidade(value)}
          placeholder="Especialidade"
          optionFilterProp="value"
          filterOption={(input, option) =>
            option.value.toLowerCase().includes(input.toLowerCase())
          }
          filterSort={(optionA, optionB) =>
            optionA.value
              .toLowerCase()
              .localeCompare(optionB.value.toLowerCase())
          }
          options={especialidades.map((especialidade) => ({
            value: especialidade,
            label: (
              <>
                <FontAwesomeIcon icon={faStethoscope} /> {especialidade}
              </>
            ),
          }))}
        />
        <Select
          showSearch
          style={{
            width: 200,
          }}
          className="slct2"
          placeholder="Cidade"
          optionFilterProp="value"
          filterOption={(input, option) =>
            option.value.toLowerCase().includes(input.toLowerCase())
          }
          filterSort={(optionA, optionB) =>
            optionA.value
              .toLowerCase()
              .localeCompare(optionB.value.toLowerCase())
          }
          options={[
            {
              value: "barbacena",
              label: "Barbacena",
            },
            // Adicione mais cidades aqui
          ]}
        />
        
        <Tooltip title="Pesquisar">
          <Button
            id="btn_pesquisar"
            shape="circle"
            onClick={handleSearch}
            icon={<SearchOutlined />}
          />
        </Tooltip>
        </StyleProvider>
      </div>
    </>
  );
}

export default SelectEspecialidade;
