import { createContext, useEffect, useContext, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail // Adicionando o método sendPasswordResetEmail
} from "firebase/auth";
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from "../../firebase";

const UserContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState(null); // Adiciona estado para role
  const [loading, setLoading] = useState(true); // Estado para indicar se está carregando

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
    // signInWithRedirect(auth, provider);
  };

  const facebookSignIn = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider);
    // signInWithRedirect(auth, provider);
  };

  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const sendResetPasswordEmail = (email) => { // Método para enviar email de redefinição de senha
    return sendPasswordResetEmail(auth, email);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if(currentUser) {
        const db = getFirestore();
        const userRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userRef);
        if(docSnap.exists()) {
          const userData = docSnap.data();
          setUsername(userData.username); // Atualizando o estado do username
          // Se não tiver role, considera usuário padrão (null ou undefined)
          // Se tiver role, armazena o valor
          setUserRole(userData.role || null);
        } else {
          // Se não existe documento, é usuário padrão
          setUserRole(null);
        }
      } else {
        setUserRole(null);
        setUsername("");
      }
      setLoading(false); // Marca como carregado após verificar o estado de autenticação
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider
      value={{ createUser, user, logout, signIn, googleSignIn, facebookSignIn, sendResetPasswordEmail, username, userRole, loading  }} // Adicionando userRole e loading ao contexto
    >
      {children}
    </UserContext.Provider>
  );
}

export { AuthProvider };

export const UserAuth = () => {
  return useContext(UserContext);
};
