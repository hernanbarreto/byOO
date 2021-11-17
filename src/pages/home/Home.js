import React, { useEffect } from 'react';
import './Home.css';
import Banner from './banner/Banner';
import { useAuth } from '../../services/firebase';
import { auth } from '../../services/firebase';
import { getFunctions, httpsCallable } from "firebase/functions";
import { emitCustomEvent } from 'react-custom-events';

const functions = getFunctions();
const verifyIdToken = httpsCallable(functions, 'verifyIdToken');

function Home() {
    const {currentUser} = useAuth();

    useEffect(() => {
        window.scrollTo(0,0);
    }, []);

    useEffect(() => {
        if (currentUser){
            verifyIdToken(currentUser.accessToken)
            .then((payload) => {
            })
            .catch((error) => {
                console.log(error);
              if (error.code === 'auth/id-token-revoked') {
                auth.signOut().then(()=> {
                    emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                }).catch((error) => {
                    emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                })        
              } else {
                auth.signOut().then(()=> {
                    emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                }).catch((error) => {
                    emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                })        
              }
            });
        }
    }, [currentUser]);

    return (
        <div className='home'>
           < Banner />            
        </div>
    )
}

export default Home
