import React, { useEffect } from 'react'
import { useAuth, logout } from '../../services/firebase';
import { getFunctions, httpsCallable } from "firebase/functions";
import { emitCustomEvent } from 'react-custom-events';
import { 
    getFirestore, 
    doc, 
    getDoc } from "firebase/firestore";

const functions = getFunctions();
const verifyIdToken = httpsCallable(functions, 'verifyIdToken');
const database = getFirestore();

function Privacity() {
    const {currentUser} = useAuth();

    useEffect(() => {
        window.scrollTo(0,0);

        if (currentUser){
            verifyIdToken(currentUser.accessToken)
            .then(async (payload) => {
                const infoUser = doc(database, "users", currentUser.uid);
                const docSnap = await getDoc(infoUser);
                if (docSnap.exists()){
                    const filtered = docSnap.data().sessions.filter(function(element){
                        return element.id === currentUser.accessToken;
                    });
                    if (filtered.length !== 0){
                    }else{
                        logout()
                        .then(()=>{
                            emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                        })
                        .catch((error)=>{
                            console.log(error);
                            emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                        });    
                    }
                }else{
                    logout()
                    .then(()=>{
                        emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                    })
                    .catch((error)=>{
                        emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                    });    
                }
            })
            .catch((error) => {
              if (error.code === 'auth/id-token-revoked') {
                logout()
                .then(()=>{
                    emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                })
                .catch((error)=>{
                    emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                });
              } else {
                logout()
                .then(()=>{
                    emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                })
                .catch((error)=>{
                    emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                });
              }
            });
        }
    }, []);

    return (
        <div>
            <h1>Política de privacidad</h1>
        </div>
    )
}

export default Privacity
