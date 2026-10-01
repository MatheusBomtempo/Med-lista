// import React, { useContext } from 'react';
import React  from 'react';
import './Auth.css';
import { Link } from 'react-router-dom';
// import { auth, googleProvider, firestore, database } from '../../firebase';
// import {
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
// } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faCircleUser,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
// import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { UserAuth } from '../../contexts/contextsAuth/AuthContext';
import { useState } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Input, Tooltip } from 'antd';

export const Auth = (props) => {
  const key = process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6Lfo6okpAAAAAEe3FiJzfEPpmmJOQULB0r82ftfk';

  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erroSenha, setErroSenha] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captchaIsDone, setCaptchaIsDone] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordTooShort, setPasswordTooShort] = useState(false);

  const { createUser } = UserAuth();
  const navigate = useNavigate();

  const onChange = () => {
    console.log('captcha validado');
    setCaptchaIsDone(true);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setPasswordsMatch(e.target.value === confirmPassword);
    setPasswordTooShort(password.length < 5);
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordsMatch(e.target.value === password);
  };

  const handleClick = () => {
    if (!captchaIsDone) {
      alert('verifique o captcha');
    } else if (confirmPassword !== password) {
      setErroSenha('senhas não batem');
    } else if (password.length < 5) {
      setErroSenha('senha deve ter mais de 6 caracteres');
    } else {
      setIsLoading(true);
      // Perform some asynchronous task here
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!captchaIsDone){
      alert('verifique o captcha')
      }else if(confirmPassword !== password){
        setErroSenha('senhas não batem')
      }else if(password.length < 5){
        setErroSenha('senha deve ter mais de 6 caracteres')
      }
    
    else{

    try {
      await createUser(email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          const db = getFirestore();
          const userRef = doc(db, 'users', user.uid);
          setDoc(userRef, { username }, { merge: true });

          navigate('/dashboardCadastro');
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode === 'auth/email-already-in-use') {
            alert(
              'E-mail já cadastrado. Tente fazer login ou utilize outro endereço de e-mail.'
            );
          } else {
            alert(errorCode, errorMessage);
          }
        });
    } catch (e) {
     alert(e.message);
    }
  }};

  return (
    <form className="caixa" onSubmit={handleSubmit}>
      <Input
        required
        onChange={(e) => setEmail(e.target.value)}
        placeholder={props.placeholderemail}
        className="inputt"
        prefix={
          <FontAwesomeIcon
            id="icons"
            className="site-form-item-icon"
            icon={faEnvelope}
          />
        }
        suffix={
          <Tooltip title="Extra information">
            <InfoCircleOutlined
              style={{
                color: 'rgba(0,0,0,.45)',
              }}
            />
          </Tooltip>
        }
      />

      <Input
        required
        placeholder={props.placeholderuser}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="inputt"
        prefix={
          <FontAwesomeIcon
            id="icons"
            className="site-form-item-icon"
            icon={faCircleUser}
          />
        }
        suffix={
          <Tooltip title="Extra information">
            <InfoCircleOutlined
              style={{
                color: 'rgba(0,0,0,.45)',
              }}
            />
          </Tooltip>
        }
      />

      <Input.Password
        required
        value={password}
        onChange={handlePassword}
        placeholder={props.placeholderpass}
        visibilityToggle={{
          visible: passwordVisible,
          onVisibleChange: setPasswordVisible,
        }}
        className="inputt"
        prefix={
          <FontAwesomeIcon
            id="icons"
            className="site-form-item-icon"
            icon={faLock}
          />
        }
        suffix={
          <Tooltip title="Extra information">
            <InfoCircleOutlined
              style={{
                color: 'rgba(0,0,0,.45)',
              }}
            />
          </Tooltip>
        }
      />

      <Input.Password
        required  
        value={confirmPassword}
        onChange={handleConfirmPassword}
        placeholder={props.placeholderpass2}
        visibilityToggle={{
          visible: passwordVisible,
          onVisibleChange: setPasswordVisible,
        }}
        className="inputt"
        prefix={
          <FontAwesomeIcon
            id="icons"
            className="site-form-item-icon"
            icon={faLock}
          />
        }
        suffix={
          <Tooltip title="Extra information">
            <InfoCircleOutlined
              style={{
                color: 'rgba(0,0,0,.45)',
              }}
            />
          </Tooltip>
        }
      />

      <div className="captcha">
        <ReCAPTCHA
          sitekey={key}
          onChange={(value) => {
            setCaptchaIsDone(value);
          }}
        />
      </div>

      <div className="matchsenha">
        {passwordsMatch ? '' : <p>As senhas não correspondem.</p>}

        {passwordTooShort && <p>A senha deve ter pelo menos 6 caracteres.</p>}
      </div>

      <div className="divbtn">
        <button type="submit" onClick={handleClick}>
          {isLoading ? (
            <div className="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          ) : (
            'Cadastrar'
          )}
        </button>
      </div>

      <div className="pergunta">
        <Link to="/login">
          <p>
            Já possui <span>login?</span>
          </p>
        </Link>
      </div>
    </form>
  );
};
