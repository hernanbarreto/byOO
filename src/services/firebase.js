import React, { useState, useEffect, useContext, createContext } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { 
  doc, 
  updateDoc, 
  arrayRemove,
  getDoc, 
  getFirestore, 
  connectFirestoreEmulator} from "firebase/firestore";

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
  provider: new ReCaptchaV3Provider(process.env.REACT_APP_RECAPTCHA_TOKEN),
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

export const logout = async () =>{
  const database = getFirestore();
  const infoUser = doc(database, "users", auth.currentUser.uid);
  const docSnap = await getDoc(infoUser);
  if (docSnap.exists()) {
    const filtered = docSnap.data().sessions.filter(function(element){
        return element.id === auth.currentUser.stsTokenManager.refreshToken;
    });
    if (filtered.length !== 0){
      await updateDoc(infoUser, {
          sessions: arrayRemove(filtered[0])
      })
      .then(()=>{
          return auth.signOut() 
      })
      .catch(()=>{
        return auth.signOut() 
      });
    }else{
      return auth.signOut() 
    }
  }else{
    return auth.signOut() 
  }
}


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