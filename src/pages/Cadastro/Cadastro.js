import './Cadastro.css';

import Navbar1 from '../../componentes/Navbar/Navbar1';

import { Auth } from '../../componentes/authCadastro/Auth';

import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { UserAuth } from '../../contexts/contextsAuth/AuthContext';

function Cadastro() {
  const navigate = useNavigate();
  const { googleSignIn, facebookSignIn, user } = UserAuth();

  const handleFacebookSignIn = async () => {
    try {
      await facebookSignIn();
      navigate('/dashboardCadastro');
    } catch (error) {
      alert(error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    if (user != null) {
      navigate('/dashboardCadastro');
    }
  }, [user]);

  return (
    <>
      <Navbar1></Navbar1>
      
      <div className="container flex items-center justify-center">
        <div className="innerCont1 bg-fundo1	p-20 rounded-2xl shadow-lg">
          <h1 className="titulo text-center pb-2 text-verde">Cadastro</h1>
          {/* <h2>{user?.email}</h2> */}
          <div className="separador  flex gap-x-28  ">
            <div className="left" id="barra">
              <p className='text-center'>Cadastro exclusivo para médicos.<br></br> Pacientes não precisam realizar cadastros.</p>
              <Auth
                placeholderemail="E-mail"
                placeholderuser="Primeiro nome"
                placeholderpass="Senha"
                placeholderpass2="Confirme a senha"
              />
            </div>
            {/* <div className="right ">
              <button
                type="button"
                className="login-with-google-btn"
                onClick={handleGoogleSignIn}
              >
                Registrar-se com Google
              </button>

              <button
                type="button"
                className="login-with-google-btn"
                id="face"
                onClick={handleFacebookSignIn}
              >
                Registrar-se com Facebook
              </button>

               <button type="button" className="login-with-google-btn" disabled>
                            Sign in with Google
                            </button> 
            </div> */}
          </div>
        </div>
      </div>
      
      <div style={{ 
        marginTop: '40px', 
        padding: '20px', 
        textAlign: 'center',
        color: 'rgba(0, 0, 0, 0.45)',
        fontSize: '14px',
        lineHeight: '1.6',
        maxWidth: '1200px',
        margin: '40px auto 0'
      }}>
        <p style={{ margin: 0 }}>
          Encontrou algum problema no cadastro? Envie um email para{' '}
          <a 
            href="mailto:mfbomt@gmail.com" 
            style={{ color: 'rgba(0, 0, 0, 0.65)', textDecoration: 'underline' }}
          >
            mfbomt@gmail.com
          </a>
          {' '}e será respondido em poucas horas.
        </p>
        <p style={{ margin: '8px 0 0 0', fontWeight: 500 }}>
          ⚠️ O aplicativo está em beta. É muito importante que você nos envie um email caso encontre qualquer intercorrência.
        </p>
      </div>
      //{' '}
   
    </>
  );
}

export default Cadastro;
