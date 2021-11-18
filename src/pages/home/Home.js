import React, { useEffect } from 'react';
import './Home.css';
import Banner from './banner/Banner';
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

function Home() {
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
                            console.log(1);
                            emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                        })
                        .catch((error)=>{
                            console.log(2);
                            emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                        });    
                    }
                }else{
                    logout()
                    .then(()=>{
                        console.log(3);
                        emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                    })
                    .catch((error)=>{
                        console.log(4);
                        emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                    });    
                }
            })
            .catch((error) => {
              if (error.code === 'auth/id-token-revoked') {
                logout()
                .then(()=>{
                    console.log(5);
                    emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                })
                .catch((error)=>{
                    console.log(6);
                    emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                });
              } else {
                logout()
                .then(()=>{
                    console.log(7);
                    emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                })
                .catch((error)=>{
                    console.log(8);
                    emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                });
              }
            });
        }
    }, []);

    return (
        <div className='home'>
           < Banner />            
        </div>
    )
}

export default Home
