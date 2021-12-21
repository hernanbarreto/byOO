import { useEffect, useState } from 'react'
import { logout } from '../services/firebase';
//import { getFunctions, httpsCallable } from "firebase/functions";
import { 
    getFirestore, 
    doc, 
    getDoc,} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { emitCustomEvent } from 'react-custom-events';

//const functions = getFunctions();
//const verifyIdToken = httpsCallable(functions, 'verifyIdToken');
const database = getFirestore();

export const useInitPage = () => {
    const [state, setState] = useState(null); 
    const auth = getAuth();
    
//    useEffect(() => {
//        window.scrollTo(0,0);
//        const currentUser = auth.currentUser;
//        let isSubscribed = true;
//        if (currentUser){
//            console.log(auth.currentUser);
//            console.log('actual token: ', auth.currentUser.accessToken);
//            console.log('refresh token: ', auth.currentUser.stsTokenManager.refreshToken);
//            verifyIdToken(currentUser.accessToken)
//            .then(async (result) => {
//                if (result.data.uid !== undefined){
//                    const infoUser = doc(database, "users", currentUser.uid);
//                    const docSnap = await getDoc(infoUser);
//                    if (docSnap.exists()){
//                        const filtered = docSnap.data().sessions.filter(function(element){
//                            return element.id === currentUser.accessToken;
//                        });
//                    
//                        if (filtered.length !== 0){
//                            if (isSubscribed){
//                            setState(true);
//                            }
//                        }else{
//                            logout()
//                            .then(()=>{
//                                if (isSubscribed){
//                                setState(false);
//                                }
//                                console.log('actual token: ', auth.currentUser.accessToken);
//                                console.log('refresh token: ', auth.currentUser.stsTokenManager.refreshToken);
//                                emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
//                            })
//                            .catch((error)=>{
//                                if (isSubscribed){
//                                setState(false);
//                                }
//                                console.log('aca');
//                                emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
//                            });    
//                        }
//                    }else{
//                        logout()
//                        .then(()=>{
//                            if (isSubscribed){
//                            setState(false);
//                            }
//                            console.log('aca');
//                            emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
//                        })
//                        .catch((error)=>{
//                            if (isSubscribed){
//                            setState(false);
//                            }
//                            console.log('aca');
//                            emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
//                        });    
//                    }
//                }else{
//                    console.log(result.data.errorInfo.code);
//                    if (result.data.errorInfo.code === 'auth/id-token-expired'){
//                        console.log(currentUser);
//                        console.log('actual token: ', auth.currentUser.accessToken);
//                        console.log('refresh token: ', auth.currentUser.stsTokenManager.refreshToken);
//                        setState(true);
//                    }else{
//                        logout()
//                        .then(()=>{
//                            if (isSubscribed){
//                            setState(false);
//                            }
//                            console.log('aca');
//                            emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
//                        })
//                        .catch((error)=>{
//                            console.log(error);
//                            if (isSubscribed){
//                            setState(false);
//                            }
//                            emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
//                        });   
//
//                    }
//                }
//            });
//        }
//        return () => {isSubscribed = false}  
//    }, [auth.currentUser])

useEffect(() => {
    window.scrollTo(0,0);
    let isSubscribed = true;
    const currentUser = auth.currentUser;

    async function fetchData(){
        if (currentUser){
            const infoUser = doc(database, "users", currentUser.uid);
            const docSnap = await getDoc(infoUser);
            if (docSnap.exists()){
                const filtered = docSnap.data().sessions.filter(function(element){
                    return element.id === auth.currentUser.stsTokenManager.refreshToken;
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
                        console.log('aca');
                        emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                    });    
                }
            }else{
                logout()
                .then(()=>{
                    if (isSubscribed){
                    setState(false);
                    }
                    console.log('aca');
                    emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                })
                .catch((error)=>{
                    if (isSubscribed){
                    setState(false);
                    }
                    console.log('aca');
                    emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                });    
            }
        }
    }
    fetchData();
    return () => {isSubscribed = false}  
}, [auth.currentUser]);

    return {state}
}