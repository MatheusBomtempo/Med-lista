import "./CadastroMed.css";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Modal,
  Upload,
} from "antd";

import { useEffect, useState } from "react";
import Navbar from "../../componentes/Navbar/Navbar1";
import { database, storage } from "../../firebase";
import { useParams, useNavigate } from "react-router-dom";
import {
  ref,
  deleteObject,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { UserAuth } from "../../contexts/contextsAuth/AuthContext";

const EditarFoto = () => {
  const navigate = useNavigate();
  const { user } = UserAuth();
  const { userId } = useParams();
  const [image, setImage] = useState(null);
  const [modal, contextHolder] = Modal.useModal();
  const [medico, setMedico] = useState(null);

  useEffect(() => {
    const fetchMedico = async () => {
      const userDocRef = doc(database, `medicos2/${userId}`);
      const userDoc = await getDoc(userDocRef);
      setMedico(userDoc.data());
    };

    fetchMedico();
  }, [userId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      Modal.error({
        content: "O tamanho do arquivo deve ser de no máximo 5MB.",
      });
      return;
    }
    setImage(file);
  };

  const handleImageSubmit = () => {
    if (!image) {
      Modal.error({
        content: "Por favor, selecione uma imagem antes de confirmar.",
      });
      return;
    }

    if (image instanceof File) {
      const fileName = `${user.uid}`;
      const imageRef = ref(storage, `images/${fileName}`);
      uploadBytes(imageRef, image)
        .then(() => {
          getDownloadURL(imageRef)
            .then((url) => {
              if (user) {
                const userDocRef = doc(database, `medicos2/${user.uid}`);
                updateDoc(userDocRef, {
                  image_url: url,
                }).then(() => {
                  console.log(
                    "URL da imagem associado ao usuário com sucesso."
                  );
                  Modal.success({
                    content: "URL da imagem associado ao usuário com sucesso.",
                  });
                  navigate(`/dashboard/${user.uid}`);
                });
              }
            })
            .catch((error) => {
              console.log(error.message, "Erro ao obter o URL da imagem.");
              Modal.error({
                content: "Imagem inválida. Tente outro formato.",
              });
            });
        })
        .catch((error) => {
          console.log(error.message, "Erro ao fazer upload da imagem.");
          Modal.error({
            content: "Erro ao fazer upload da imagem. Tente outro formato.",
          });
        });
    }
  };

  const handleImageRemove = () => {
    Modal.confirm({
      title: "Tem certeza que deseja remover sua foto?",
      content: "Seu perfil ficará com a imagem em branco.",
      onOk() {
        if (user) {
          const fileName = `${user.uid}`;
          const imageRef = ref(storage, `images/${fileName}`);
          deleteObject(imageRef)
            .then(() => {
              const userDocRef = doc(database, `medicos2/${user.uid}`);
              updateDoc(userDocRef, {
                image_url: null,
              }).then(() => {
                console.log("Imagem removida com sucesso.");
                Modal.success({
                  content: "Imagem removida com sucesso.",
                });
                navigate(`/dashboard/${user.uid}`);
              });
            })
            .catch((error) => {
              console.log(error.message, "Erro ao remover a imagem.");
              Modal.error({
                content: "Erro ao remover a imagem. Tente novamente.",
              });
            });
        }
      },
      onCancel() {
        console.log("Cancelado");
      },
    });
  };

  return (
    <div className="container EditarFoto">
      <Navbar />

      <div className="formInside">
        <h1 className="text-center mb-12">Edição de foto do Médico</h1>
        <div className="foto">
          {medico && medico.image_url ? (
            <>
              <p>Foto atual:</p>
              <img src={medico.image_url} alt="User" />
            </>
          ) : (
            <p>Atualmente você não possui foto em seu perfil.</p>
          )}
        </div>
        <hr></hr>
        <Form
          onFinish={handleImageSubmit}
          labelCol={{
            span: 19,
          }}
          wrapperCol={{
            span: 34,
          }}
          layout="vertical"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: 1200,
            textAlign: "start",
            margin: 0,
          }}
        >
          <Form.Item label="Inserir Foto">
            <Upload
              beforeUpload={(file) => {
                handleImageChange({ target: { files: [file] } });
                return false;
              }}
              onChange={({ file }) => {
                if (file.status === "done") {
                  handleImageSubmit();
                }
              }}
            >
              <Button icon={<PlusOutlined />}>Selecionar Arquivo</Button>
            </Upload>
          </Form.Item>
          <Form.Item className="enviar">
            <Button type="primary" htmlType="submit" className="btn33" size="large">
              Atualizar Imagem
            </Button>
            <Button type="danger" onClick={handleImageRemove} className="btn33" size="large">
              Remover Imagem
            </Button>
            {contextHolder}
          </Form.Item>
          <div className="infoEditarFoto">
            <p>* Recomendamos que você insira uma imagem quadrada (1x1).</p>
            <p>* As imagens aceitas possuem limite de 5MB.</p>
            <span style={{ fontSize: '12px', color: '#666' }}>
              Caso necessite de diminuir o tamanho da imagem use <a href="https://tinypng.com/" target="_blank" rel="noopener noreferrer">TinyPNG </a>
              ou <a href="https://imagecompressor.com/" target="_blank" rel="noopener noreferrer">Image Compressor</a>
            </span>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default EditarFoto;
