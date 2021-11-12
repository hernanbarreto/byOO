import React, { useState, useEffect, useContext, createContext } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FB_API,
  authDomain: process.env.REACT_APP_FB_DOMAIN,
  projectId: process.env.REACT_APP_FB_PROJECT,
  storageBucket: process.env.REACT_APP_FB_BUCKET,
  messagingSenderId: process.env.REACT_APP_FB_SENDER,
  appId: process.env.REACT_APP_FB_APP,
  measurementId: process.env.REACT_APP_FB_MEASUREMENT,
};

const app = initializeApp(firebaseConfig);

const { initializeAppCheck, ReCaptchaV3Provider } = require("firebase/app-check");
initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6Le7jxodAAAAAC_tetS-U3biYLG8UDGDZ6Fb9gzs"),
  isTokenAutoRefreshEnabled: true
});


const AuthContext = createContext();
export const useAuth = () =>{
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  function getUser() {
    return auth.currentUser
  }

  const value = {
    currentUser,
    getUser,
  }

  return (
    <AuthContext.Provider value={value}>
      { !loading && children }
    </AuthContext.Provider>
  )

}  

export const auth = getAuth();

//connectAuthEmulator(auth, "http://localhost:9099");
//
//const functions = getFunctions();
//connectFunctionsEmulator(functions, "localhost", 5001);
//
//const database = getFirestore();
//connectFirestoreEmulator(database, 'localhost', 8090);
//
//const storage = getStorage();
//connectStorageEmulator(storage, "localhost", 9199);