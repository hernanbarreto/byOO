import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import imgNotFound from '../images/svg/undraw_not_found_-60-pq.svg'
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useAuth } from '../services/firebase';
import { logout } from '../services/firebase';
import { getFunctions, httpsCallable } from "firebase/functions";
import { emitCustomEvent } from 'react-custom-events';
import { 
    getFirestore, 
    doc, 
    getDoc } from "firebase/firestore";

const functions = getFunctions();
const verifyIdToken = httpsCallable(functions, 'verifyIdToken');
const database = getFirestore();

function NotFound () {
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

    const Img = styled('img')({
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
    });     

return (
    <div>
        <Container maxWidth="xl">
            <Box sx={{ flexGrow: 10 }}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 3, sm: 10, md: 15 }}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '100px',
                        marginBottom: '100px',
                    }}
                >
                    <Container maxWidth="xl">
                        <Img src={imgNotFound} />
                    </Container>
                    <Container maxWidth="xs">
                        <Stack
                            direction='column'
                            spacing={{ xs: 1 }}
                            style={{
                                alignItems: 'left',
                                justifyContent: 'left',
                            }}
                        >
                            <Typography variant='h2'>
                                <strong>¡Oops!</strong>
                            </Typography>
                            <Typography variant='h4'>
                                La página que buscas no existe.
                            </Typography>
                            <Typography variant='h6'>
                                <strong>Código de error: 404</strong>
                            </Typography>
                            <Typography variant='subtitle1'>
                                Revisá estos enlaces:
                            </Typography>
                            <Link to="/">
                                Buscar
                            </Link>
                            <Link to="/privacity">
                                Ayuda
                            </Link>
                        </Stack>
                    </Container>
                </Stack>
            </Box>
        </Container>
  </div>
)
}

export default NotFound;