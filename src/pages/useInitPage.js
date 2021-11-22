import { useEffect, useState } from 'react'
import { logout } from '../services/firebase';
import { getFunctions, httpsCallable } from "firebase/functions";
import { 
    getFirestore, 
    doc, 
    getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { emitCustomEvent } from 'react-custom-events';

const functions = getFunctions();
const verifyIdToken = httpsCallable(functions, 'verifyIdToken');
const database = getFirestore();
export const useInitPage = () => {
    const [state, setState] = useState(null); 
    
    useEffect(() => {
        window.scrollTo(0,0);
        const auth = getAuth();
        const currentUser = auth.currentUser;
        let isSubscribed = true;

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
                        if (isSubscribed){
                        setState(true);
                        }
                    }else{
                        logout()
                        .then(()=>{
                            if (isSubscribed){
                            setState(false);
                            }
                            emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                        })
                        .catch((error)=>{
                            if (isSubscribed){
                            setState(false);
                            }
                            emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                        });    
                    }
                }else{
                    logout()
                    .then(()=>{
                        if (isSubscribed){
                        setState(false);
                        }
                        emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                    })
                    .catch((error)=>{
                        if (isSubscribed){
                        setState(false);
                        }
                        emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                    });    
                }
            })
            .catch((error) => {
                logout()
                .then(()=>{
                    if (isSubscribed){
                    setState(false);
                    }
                    emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                })
                .catch((error)=>{
                    if (isSubscribed){
                    setState(false);
                    }
                    emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                });
            });
        }
        return () => {isSubscribed = false}  
    }, [])
    return {state}
}