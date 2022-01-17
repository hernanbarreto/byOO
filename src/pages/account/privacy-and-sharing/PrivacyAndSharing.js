import React, { useEffect, useState, useCallback } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import social from '../../../images/svg/undraw_Social_bio_re_0t9u.svg';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import { useHistory } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {  Divider } from '@material-ui/core';
import { useAuth } from '../../../services/firebase';
import '../../login/Login.css';
import Skeleton from '@mui/material/Skeleton';
import { logout } from '../../../services/firebase';
import { emitCustomEvent } from 'react-custom-events';
import { useInitPage } from '../../useInitPage';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import {
    updateDoc,
    doc, 
    getDoc,
    getFirestore,} from "firebase/firestore";
import CustomizedSwitch from '../../custom/CustomSwitch';


const database = getFirestore();

function PrivacyAndSharing(details) {
    const [ openMsg, setOpenMsg] = useState(false);
    const [severityInfo, setSeverityInfo] = useState('success');
    const [msg, setMsg] = useState('');
    const handleCloseMsg = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpenMsg(false);
    };

    const history = useHistory ();
    const mobilAccess = !useMediaQuery('(min-width:769px)', { noSsr: true });
    const {state} = useInitPage();
    const {currentUser} = useAuth();
    const [isMounted, setIsMounted] = useState(true);

    const Img = styled('img')({
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100px',
    });    

    const handleCuenta = () => {
        history.push('/account-settings');          
    }

    const breadcrumbs = [
        <Link
          key={1}
          underline="none"
          onClick={handleCuenta}
          sx={{
            color: '#222222 !important',
            textDecoration: "underline #222222",
            fontSize: '16px',
            cursor: 'pointer'
        }} 
        >
            Cuenta
        </Link>,
        <Typography color="text.primary" key={2}>
            Privacidad y uso compartido
        </Typography>,
    ];    

    const [loadingCreated, setLoadingCreated] = useState(true);

    const [sharedFacebook, setSharedFacebook] = useState(false);
    const [sharedInstagram, setSharedInstagram] = useState(false);
    const [sharedGoogle, setSharedGoogle] = useState(false);

    const handleUpdateProfile = useCallback(async () => {
        const infoUser = doc(database, "users", currentUser.uid);
        try{                                  
            const docSnap = await getDoc(infoUser);
            if (docSnap.exists()) {
                if (isMounted){
                    setSharedFacebook(docSnap.data().privacy_and_sharing.facebook);
                    setSharedInstagram(docSnap.data().privacy_and_sharing.instagram);
                    setSharedGoogle(docSnap.data().privacy_and_sharing.google);

                    setLoadingCreated(false);
                }
            }else{
                logout()
                .then(()=>{
                    emitCustomEvent('showMsg', 'Ha ocurrido un error al intentar acceder a los datos de tu cuenta/error');
                    console.log('error')
                })
                .catch((error)=>{
                    emitCustomEvent('showMsg', 'Ha ocurrido un error al intentar acceder a los datos de tu cuenta/error');
                    console.log('error')
                });
            }
        }catch{
        } 
    },[currentUser, isMounted]);

    const clearStates = useCallback(() => {
        if(isMounted){
            setLoadingCreated(true);

            setSharedFacebook(false);
            setSharedInstagram(false);
            setSharedGoogle(false);
        }
    },[isMounted]);

    useEffect(() => {
        setIsMounted(true);
        if (state !== null){
            if (state){
                clearStates();
                handleUpdateProfile();
            }
        }
        return () => {setIsMounted(false)}
    }, [state, handleUpdateProfile, clearStates]);

    return (
        <div>
            <Container maxWidth='lg'>
                <Box sx={{minHeight: '100vh'}}>
                    <Paper
                        variant='string' 
                        sx={{ 
                            pt: '50px', 
                            pb: '50px', 
                        }}
                    >
                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            spacing={{ xs: 3 }}
                            style={{
                                marginTop: '30px',
                                marginBottom: '30px',
                            }}
                        >
                            <Container maxWidth="md">
                                <Box>
                                    {!mobilAccess ?
                                        <Breadcrumbs
                                            separator={<NavigateNextIcon fontSize="small" />}
                                            aria-label="breadcrumb"
                                        >
                                            {breadcrumbs}
                                        </Breadcrumbs>
                                    :
                                    <Link
                                        component={ArrowBackIosIcon}
                                        onClick={handleCuenta}
                                        sx={{
                                            color: '#000000 !important',
                                            fontSize: '25px',
                                        }} 
                                    />
                                    }
                                    <Typography
                                        fontSize={{
                                            lg: 30,
                                            md: 30,
                                            sm: 25,
                                            xs: 25,
                                        }}                                                                                
                                        sx={{
                                            marginTop: '40px',
                                            marginBottom: '20px',
                                        }}
                                    >
                                        <strong>Privacidad y uso compartido</strong>
                                    </Typography>
                                    <Divider/>
                                    <Typography
                                        fontSize={{
                                            lg: 19,
                                            md: 19,
                                            sm: 15,
                                            xs: 15,
                                        }}                                                                                
                                        sx={{
                                            marginTop: '30px',
                                            marginBottom: '5px',
                                        }}
                                    >
                                        <strong>Compartir mi actividad en Facebook</strong>
                                    </Typography>
                                    {!loadingCreated ?
                                    <CustomizedSwitch
                                        label='Si activás esta opción, vas a compartir tu actividad en Facebook, lo que puede incluir tu nombre de usuario, tu foto de perfil y tus servicios.'
                                        strong={false}
                                        checked={sharedFacebook}
                                        onGetChange={async (e)=>{
                                            const infoUser = doc(database, "users", currentUser.uid);
                                            try{                                  
                                                await updateDoc(infoUser, {
                                                    'privacy_and_sharing.facebook': e,
                                                })
                                                .then(()=>{
                                                    if (isMounted){
                                                        setSharedFacebook(e);                                            
                                                    }
                                                })
                                                .catch(()=>{
                                                    if (isMounted){
                                                        setMsg('Ha ocurrido un error al intentar actualizar tu información');
                                                        setSeverityInfo('error');
                                                        setOpenMsg(true); 
                                                    }                                       
                                                });
                                            }catch{
                                                if (isMounted){
                                                    setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                                                    setSeverityInfo('error');
                                                    setOpenMsg(true);
                                                }                                        
                                            } 
                                        }}
                                    /> 
                                    :
                                    <>
                                    <Skeleton variant="text" width="100%"/>
                                    <Skeleton variant="text" width="100%"/>
                                    <Skeleton variant="text" width="100%"/>
                                    </>
                                    }
                                    <Divider
                                        style={{
                                            marginTop: '30px',
                                        }}
                                    />
                                    <Typography
                                        fontSize={{
                                            lg: 19,
                                            md: 19,
                                            sm: 15,
                                            xs: 15,
                                        }}                                                                                
                                        sx={{
                                            marginTop: '30px',
                                            marginBottom: '5px',
                                        }}
                                    >
                                        <strong>Compartir mi actividad en Instagram</strong>
                                    </Typography>
                                    {!loadingCreated ?
                                    <CustomizedSwitch
                                        label='Si activás esta opción, vas a compartir tu actividad en Instagram, lo que puede incluir tu nombre de usuario, tu foto de perfil y tus servicios.'
                                        strong={false}
                                        checked={sharedInstagram}
                                        onGetChange={async (e)=>{
                                            const infoUser = doc(database, "users", currentUser.uid);
                                            try{                                  
                                                await updateDoc(infoUser, {
                                                    'privacy_and_sharing.instagram': e,
                                                })
                                                .then(()=>{
                                                    if (isMounted){
                                                        setSharedInstagram(e);                                            
                                                    }
                                                })
                                                .catch(()=>{
                                                    if (isMounted){
                                                        setMsg('Ha ocurrido un error al intentar actualizar tu información');
                                                        setSeverityInfo('error');
                                                        setOpenMsg(true); 
                                                    }                                       
                                                });
                                            }catch{
                                                if (isMounted){
                                                    setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                                                    setSeverityInfo('error');
                                                    setOpenMsg(true);
                                                }                                        
                                            } 
                                        }}
                                    /> 
                                    :
                                    <>
                                    <Skeleton variant="text" width="100%"/>
                                    <Skeleton variant="text" width="100%"/>
                                    <Skeleton variant="text" width="100%"/>
                                    </>
                                    }
                                    <Divider
                                        style={{
                                            marginTop: '30px',
                                        }}
                                    />
                                    <Typography
                                        fontSize={{
                                            lg: 19,
                                            md: 19,
                                            sm: 15,
                                            xs: 15,
                                        }}                                                                                
                                        sx={{
                                            marginTop: '30px',
                                            marginBottom: '5px',
                                        }}
                                    >
                                        <strong>Incluir mi perfil y mis servicios en los buscadores</strong>
                                    </Typography>
                                    {!loadingCreated ?
                                    <CustomizedSwitch
                                        label='Al activar esta opción, los motores de búsqueda como Google van a mostrar las páginas de tu perfil y tus servicios en sus resultados.'
                                        strong={false}
                                        checked={sharedGoogle}
                                        onGetChange={async (e)=>{
                                            const infoUser = doc(database, "users", currentUser.uid);
                                            try{                                  
                                                await updateDoc(infoUser, {
                                                    'privacy_and_sharing.google': e,
                                                })
                                                .then(()=>{
                                                    if (isMounted){
                                                        setSharedGoogle(e);                                            
                                                    }
                                                })
                                                .catch(()=>{
                                                    if (isMounted){
                                                        setMsg('Ha ocurrido un error al intentar actualizar tu información');
                                                        setSeverityInfo('error');
                                                        setOpenMsg(true); 
                                                    }                                       
                                                });
                                            }catch{
                                                if (isMounted){
                                                    setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                                                    setSeverityInfo('error');
                                                    setOpenMsg(true);
                                                }                                        
                                            } 
                                        }}
                                    /> 
                                    :
                                    <>
                                    <Skeleton variant="text" width="100%"/>
                                    <Skeleton variant="text" width="100%"/>
                                    <Skeleton variant="text" width="100%"/>
                                    </>
                                    }
                                    <Divider
                                        style={{
                                            marginTop: '30px',
                                        }}
                                    />
                                </Box>
                            </Container>
                            <Container maxWidth="md"
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'center',
                                    width: '100%',
                                }}                            
                            >
                                <Paper
                                    variant='string'
                                    square={true}
                                    sx={{ 
                                        p: 2, 
                                        border: '1px solid lightgray',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            margin: '30px',
                                        }}                                        
                                    >
                                        <Img src={social} />
                                        <Typography 
                                            fontSize={{
                                                lg: 20,
                                                md: 20,
                                                sm: 15,
                                                xs: 15,
                                            }}                                                                                
                                            sx={{marginTop: '20px'}}
                                        >
                                            <strong>Elegí lo que vas a compartir</strong>
                                        </Typography>
                                        <Typography 
                                            fontSize={{
                                                lg: 15,
                                                md: 15,
                                                sm: 12,
                                                xs: 12,
                                            }}                                                                                
                                            sx={{marginTop: '20px'}}
                                        >
                                            byOO se preocupa por tu privacidad. Utilizá esta pantalla para elegir cómo querés compartir tu actividad.
                                        </Typography>
                                    </Box>
                                </Paper> 
                            </Container>
                        </Stack>
                    </Paper>
                </Box>
                <Snackbar open={openMsg} autoHideDuration={6000} onClose={handleCloseMsg} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{width: '100%'}}>
                    <Alert onClose={handleCloseMsg} severity={severityInfo}>{msg}</Alert>
                </Snackbar>            
            </Container>
        </div>
    )
}

export default PrivacyAndSharing