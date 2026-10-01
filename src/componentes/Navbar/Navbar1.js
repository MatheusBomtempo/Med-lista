import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './Navbar1.css';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../../contexts/contextsAuth/AuthContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import miniaureola from '../../imgs/miniAureolaLogo.svg';

function Navbar1() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const navigate = useNavigate();
  const { user, logout, username, userRole } = UserAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Verifica se o usuário é admin
    setIsAdmin(userRole === 'admin');
  }, [userRole]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.log(err);
    }
  };

  const logar = () => {
    navigate('/login');
  };

  const cadastrar = async () => {
    try {
      await logout();
      navigate('/cadastro');
    } catch (err) {
      console.log(err);
    }
  };

  const home = () => {
    navigate('/');
  };

  const dash = () => {
    if (isAdmin) {
      navigate(`/admin/${user.uid}`);
    } else {
      navigate(`/dashboard/${user.uid}`);
    }
  };

  const search = () => {
    navigate('/pesquisa');
  };

  const isAreaMedico = user?.email === undefined;

  return (
    <Navbar
      className="barra"
      fixed="top"
      collapseOnSelect
      expand="lg"
      variant="dark"
    >
      <Container>
        <Navbar.Brand href="/" onClick={home} className="logo nav-links">
          <img src={miniaureola} alt="LogoAperrance" className="mr-2"/>
          <span className="med">MED</span>
          <span className="lista">LISTA</span>{' '}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link id="ini" className="item nav-links" href="/">
              Início
            </Nav.Link>
            <Nav.Link id="ini" className="item nav-links" href="/sobre">
              Sobre
            </Nav.Link>
            <NavDropdown title="Especialidades" id="collasible-nav-dropdown">
              <NavDropdown.Item
                className="item"
                href="/pesquisa?q=Oftalmologia"
              >
                Oftalmologista
              </NavDropdown.Item>
              <NavDropdown.Item className="item" href="/pesquisa?q=Cardiologia">
                Cardiologista
              </NavDropdown.Item>
              <NavDropdown.Item
                className="item"
                href="/pesquisa?q=Otorrinolaringologia"
              >
                Otorrinolaringologia
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item className="item" href="" onClick={search}>
                Outras
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

          <Nav className="nav-rigth">
            <NavDropdown
              id="collasible-nav-dropdown-2"
              className={`userMenu${
                isAreaMedico ? '' : ' customDropdownClass'
              }`}
              title={
                user?.email ? (
                  <span style={{ border: 'none' }} className="p-0">
                    {windowWidth <= 992 ? (
                      username
                    ) : (
                      <>
                        {username} <FontAwesomeIcon icon={faCircleUser} />
                      </>
                    )}
                  </span>
                ) : (
                  <span>Área do Médico</span>
                )
              }
            >
              {user?.email ? (
                <>
                  <NavDropdown.Item
                    id="emailOver"
                    className="item"
                    onClick={dash}
                  >
                    {isAdmin ? 'Painel Admin' : 'Área do Médico'}
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                </>
              ) : (
                <NavDropdown.Item className="item" onClick={cadastrar}>
                  Cadastrar-se
                </NavDropdown.Item>
              )}

              {user?.email ? (
                <NavDropdown.Item className="item" onClick={handleLogout}>
                  Sair
                </NavDropdown.Item>
              ) : (
                <NavDropdown.Item className="item" onClick={logar}>
                  Entrar
                </NavDropdown.Item>
              )}

              {/* <NavDropdown.Item className='item' href="#action/3.2">
                Logar
              </NavDropdown.Item> */}
            </NavDropdown>

            {/* <Nav.Link  id='userclass' className='item nav-links' eventKey={2} href="#memes">
              <FontAwesomeIcon id="user" icon={faCircleUser} />
            </Nav.Link> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbar1;
