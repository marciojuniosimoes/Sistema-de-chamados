import { async } from '@firebase/util';
import { initializeAuth } from 'firebase/auth';
import { createContext, useState, useEffect } from 'react';

import firebase from '../services/fireBaseConections';

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function loadStorage() {
      const storageUser = localStorage.getItem('Sistema');
      if (storageUser) {
        setUser(JSON.parse(storageUser));
        setLoading(false);
      }
      setLoading(false);
    }
    loadStorage();
  }, []);

  //Fazendo Login do usuário
  async function LogandoUsuario(email, password) {
    setLoadingAuth(true);
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async (value) => {
        let uid = value.user.uid;

        const perfilUsuario = await firebase
          .firestore()
          .collection('users')
          .doc(uid)
          .get();

        let dados = {
          uid: uid,
          nome: perfilUsuario.data().nome,
          avatarUrl: perfilUsuario.data().avatarUrl,
          email: value.user.email,
        };
        setUser(dados);
        storageUser(dados);
        setLoadingAuth(false);
      })
      .catch((error) => {
        console.log(error);
        setLoadingAuth(false);
      });
  }

  //Fazendo cadastro Usuário
  async function cadastrarUsuario(email, password, nome) {
    setLoading(true);
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async (value) => {
        let uid = value.user.uid;

        await firebase
          .firestore()
          .collection('users')
          .doc(uid)
          .set({
            nome: nome,
            avatarUrl: null,
          })
          .then(() => {
            let data = {
              uid: uid,
              nome: nome,
              email: value.user.email,
              avatarUrl: null,
            };
            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
          });
      })
      .catch((error) => {
        console.log(error);
        setLoadingAuth(false);
      });
  }

  function storageUser(data) {
    localStorage.setItem('Sistema', JSON.stringify(data));
  }
  //deslogando usuário
  async function Sair() {
    await firebase.auth().signOut();
    localStorage.removeItem('Sistema');
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        cadastrarUsuario,
        Sair,
        LogandoUsuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export default AuthProvider;
