import React, { useEffect, useState, useCallback } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import security from '../../../images/svg/undraw_Security_on_re_e491.svg';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import { useHistory } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {  Divider } from '@material-ui/core';
import { useAuth } from '../../../services/firebase';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ListItemIcon from '@mui/material/ListItemIcon';
import PasswordIcon from '@mui/icons-material/Password';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import GroupsIcon from '@mui/icons-material/Groups';
import { getFunctions, httpsCallable } from "firebase/functions";
import { getFirestore, 
    doc, 
    getDoc,
    updateDoc,
    arrayRemove,
    Timestamp, 
    arrayUnion, 
        } from "firebase/firestore";
import '../../login/Login.css';
import { Button } from '@material-ui/core';
import Skeleton from '@mui/material/Skeleton';
import FormEliminarCuenta from './FormEliminarCuenta';
import { logout } from '../../../services/firebase';
import { emitCustomEvent } from 'react-custom-events';
import Chip from '@mui/material/Chip';
import { useInitPage } from '../../useInitPage';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import CustomizedSwitch from '../../custom/CustomSwitch';
import { getAuth, unlink, linkWithCredential, GoogleAuthProvider, FacebookAuthProvider, onAuthStateChanged } from "firebase/auth";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import GoogleLogin from 'react-google-login';

const functions = getFunctions();
const deleteUser = httpsCallable(functions, 'deleteUser');
const revokeRefreshTokens = httpsCallable(functions, 'revokeRefreshTokens');
const getUser = httpsCallable(functions, 'getUser');

const database = getFirestore();
var sessions = [];
var listItems = null;

function LoginAndSecurity(details) {
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

    const [createdOsName, setCreatedOsName] = useState(null);
    const [createdOsVersion, setCreatedOsVersion] = useState(null);
    const [createdLocationCity, setCreatedLocationCity] = useState(null);
    const [createdLocationCountry, setCreatedLocationCountry] = useState(null);
    const [createdLocationRegion, setCreatedLocationRegion] = useState(null);
    const [createdBrowser, setCreatedBrowser] = useState(null);
    const [createdDate, setCreatedDate] = useState(null);
    const [createdlenguaje, setCreatedLenguaje] = useState(null);
    const [loadingCreated, setLoadingCreated] = useState(true);
    const [userName, setUserName] = useState(null);
    const [openFormEliminarCuenta, setOpenFormEliminarCuenta] = useState(false);
    const [userEmail, setUserMail] = useState(null);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }    
    const [listo, setListo] = useState(false);
    
    const [googleProvider, setGoogleProvider] = useState(false);
    const [facebookProvider, setFacebookProvider] = useState(false);
    const [providers, setProviders] = useState(null);

    const handleUpdateProfile = useCallback(async () => {
        const infoUser = doc(database, "users", currentUser.uid);
        try{                                  
            const docSnap = await getDoc(infoUser);
            if (docSnap.exists()) {
                getUser(currentUser.uid)
                .then((record) => {
                    if (isMounted){
                        setProviders(record.data.providerData);
                        record.data.providerData.forEach((item) => {
                            if(item.providerId === 'google.com'){
                                setGoogleProvider(true);
                            }
                            if(item.providerId === 'facebook.com'){
                                setFacebookProvider(true);
                            }
                        })
                        setUserName(docSnap.data().name.split(' ')[0]);
                        setCreatedLenguaje(docSnap.data().account.created.location.lenguaje)
                        setCreatedOsName(docSnap.data().account.created.os.name);
                        setCreatedOsVersion(docSnap.data().account.created.os.version);
                        setCreatedLocationCity(docSnap.data().account.created.location.city);
                        setCreatedLocationCountry(docSnap.data().account.created.location.country);
                        setCreatedLocationRegion(docSnap.data().account.created.location.region);
                        setCreatedBrowser(docSnap.data().account.created.browser);
                        setCreatedDate(docSnap.data().account.created.date);
                        setUserMail(currentUser.email);
                        docSnap.data().sessions.forEach(e=>{
                            sessions.push(e);
                        });
                        setListo(true);
                        setLoadingCreated(false);
                    }
                })
                .catch(() => {
                    logout()
                    .then(()=>{
                        emitCustomEvent('showMsg', 'Ha ocurrido un error al intentar acceder a los datos de tu cuenta/error');
                    })
                    .catch((error)=>{
                        emitCustomEvent('showMsg', 'Ha ocurrido un error al intentar acceder a los datos de tu cuenta/error');
                    });    
                })
            }else{
                logout()
                .then(()=>{
                    emitCustomEvent('showMsg', 'Ha ocurrido un error al intentar acceder a los datos de tu cuenta/error');
                })
                .catch((error)=>{
                    emitCustomEvent('showMsg', 'Ha ocurrido un error al intentar acceder a los datos de tu cuenta/error');
                });
            }
        }catch{
        } 
    },[currentUser, isMounted]);

    const clearStates = useCallback(() => {
        if(isMounted){
        setLoadingCreated(true);
        setGoogleProvider(false);
        setFacebookProvider(false);
        setProviders(null);
        listItems = null;
        setCreatedOsName(null);
        setCreatedOsVersion(null);
        setCreatedLocationCity(null);
        setCreatedLocationCountry(null);
        setCreatedLocationRegion(null);
        setCreatedBrowser(null);
        setCreatedDate(null);
        setCreatedLenguaje(null);
        setUserMail(null);
        setUserName(null);
        sessions = [];
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


    const handleEliminarCuenta = () => {
        setOpenFormEliminarCuenta(true);
    } 

    const handleClose = () => {
        setOpenFormEliminarCuenta(false);
        clearStates();
        handleUpdateProfile();  
    }

    const handleEliminar = () => {
        setOpenFormEliminarCuenta(false);
        emitCustomEvent('openLoadingPage', true);
        deleteUser(currentUser.uid)
        .then(()=>{
            logout()
            .then(()=>{
                emitCustomEvent('openLoadingPage', false);
                emitCustomEvent('showMsg', 'Hemos eliminado la cuenta ' + userEmail + '/info');
            })
            .catch((error)=>{
                emitCustomEvent('openLoadingPage', false);
                emitCustomEvent('showMsg', 'Hemos eliminado la cuenta ' + userEmail + '/info');
            });
        })
        .catch((error)=> {
            emitCustomEvent('openLoadingPage', false);
            emitCustomEvent('showMsg', 'Ocurrió un error al eliminar la cuenta ' + userEmail + '. No te preocupes, nosotros nos encargaremos de eliminarla./error');
        })
    }

    const breadcrumbs = [
        <Link
          key={1}
          underline="none"
          onClick={handleCuenta}
          sx={{
            color: '#222222 !important',
            textDecoration: "underline #222222",
            fontSize: '14px',
            cursor: 'pointer'
        }} 
        >
            Cuenta
        </Link>,
        <Typography color="text.primary" key={2}>
            Inicio de sesión y seguridad
        </Typography>,
    ];    
    
    const handleCerrarSesiones = () => {
        if (currentUser){
            emitCustomEvent('openLoadingPage', true);
            revokeRefreshTokens(currentUser.uid)
            .then(() => {
            return getUser(currentUser.uid);
            })
            .then((userRecord) => {
            return new Date(userRecord.data.tokensValidAfterTime).getTime()/1000;
            })
            .then((timestamp) => {
                logout()
                .then(()=>{
                    emitCustomEvent('openLoadingPage', false);
                })
                .catch((error)=>{
                    emitCustomEvent('openLoadingPage', false);
                });
            });
        }
    }

    const handleCLoseSessionDevice = useCallback(async (i) => {
        emitCustomEvent('openLoadingPage', true);
        const database = getFirestore();
        const infoUser = doc(database, "users", currentUser.uid);
        const docSnap = await getDoc(infoUser);
        if (docSnap.exists()) {
          const filtered = docSnap.data().sessions.filter(function(element){
              return element.id === sessions[i].id;
          });
          if (filtered.length !== 0){
            await updateDoc(infoUser, {
                sessions: arrayRemove(filtered[0])
            })
            .then(()=>{
                if (sessions[i].id === currentUser.accessToken){
                    clearStates();
                    handleUpdateProfile();    
                    logout()
                    .then(()=>{
                        emitCustomEvent('openLoadingPage', false);
                    })
                    .catch((error)=>{
                        emitCustomEvent('openLoadingPage', false);
                    });                    
                }else{
                    emitCustomEvent('openLoadingPage', false);
                    clearStates();
                    handleUpdateProfile();    
                }        
            })
            .catch(()=>{
                if (sessions[i].id === currentUser.accessToken){
                    clearStates();
                    handleUpdateProfile();    
                    logout()
                    .then(()=>{
                        emitCustomEvent('openLoadingPage', false);
                    })
                    .catch((error)=>{
                        emitCustomEvent('openLoadingPage', false);
                    });                    
                }else{
                    emitCustomEvent('openLoadingPage', false);
                    clearStates();
                    handleUpdateProfile();    
                }        
            });
          }else{
            if (sessions[i].id === currentUser.accessToken){
                clearStates();
                handleUpdateProfile();    
                logout()
                .then(()=>{
                    emitCustomEvent('openLoadingPage', false);
                })
                .catch((error)=>{
                    emitCustomEvent('openLoadingPage', false);
                });                    
            }else{
                emitCustomEvent('openLoadingPage', false);
                clearStates();
                handleUpdateProfile();    
            }    
          }
        }else{
            logout()
            .then(()=>{
                emitCustomEvent('openLoadingPage', false);
            })
            .catch((error)=>{
                emitCustomEvent('openLoadingPage', false);
            });
        }
    },[currentUser, handleUpdateProfile, clearStates]);

    useEffect(() => { 
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        if (listo){
            setListo(false);
            listItems = sessions.map((session, index) =>
            <Paper
                key={index+1}
                variant='string'
                sx={{ 
                    p: 2, 
                    border: '1px solid lightgray',
                    borderRadius: '20px',
                }}
                style={{
                    marginBottom: '10px',
                }}
            >
                <Stack
                    direction='row'
                    spacing={1}
                    key={(2*index)+1}
                    style={{
                        marginTop: '0px',
                        marginBottom: '0px',
                    }}
                >
                <DesktopWindowsIcon fontSize='large'/>
                <Stack
                    key={(2*index)+2}
                    spacing={1}
                    style={{
                        marginTop: '0px',
                        marginBottom: '0px',
                    }}
                >
                    {(sessions[index].id === currentUser.accessToken) ?
                        <Chip size='small' color='success' label="SESIÓN ACTUAL" sx={{fontSize:'10px', maxWidth: '100px'}}/>
                    :null
                    }
                    <Typography key={(4*index)+1}><strong>{sessions[index].os.name}&nbsp;{sessions[index].os.version}</strong>&nbsp;•&nbsp;{sessions[index].browser}</Typography>                                    
                    <Typography key={(4*index)+2}>{sessions[index].location.city}&nbsp;•&nbsp;{sessions[index].location.region}&nbsp;•&nbsp;{sessions[index].location.country}</Typography>                                    
                    <Typography key={(4*index)+3}>{new Date(parseInt(sessions[index].date)).toLocaleDateString(sessions[index].location.lenguaje, options)}&nbsp;a las&nbsp;{new Date(parseInt(sessions[index].date)).toLocaleTimeString(sessions[index].location.lenguaje)}</Typography>
                    <Link
                        key={(4*index)+4}
                        underline="none"
                        onClick={(e, item) => {handleCLoseSessionDevice(index);}}
                        sx={{
                            display: 'flex',
                            justifyContent: 'right',
                            color: '#222222 !important',
                            fontSize: '14px',
                            cursor: 'pointer',
                            userSelect: 'none',
                        }} 
                        >
                            <strong>Cerrar sesión</strong>
                    </Link>
                </Stack>
                </Stack>
            </Paper> 
            );    
        }
    }, [listo, currentUser, handleCLoseSessionDevice]);

    const handleDesvincularFacebook = () => {        
        //esta desvinculando
        if (providers.length === 1){
            //esta desvinculando a su unico proveedor
            if (providers[0].providerId === 'facebook.com'){
                emitCustomEvent('openLoadingPage', false);
                handleEliminarCuenta();                    
            }else{
                //hay algun error
                emitCustomEvent('openLoadingPage', false);
                clearStates();
                handleUpdateProfile();                    
            }
        }else{
            //esta desvinculando pero tiene mas proveedores de ingreso
            const auth = getAuth();
            unlink(auth.currentUser, 'facebook.com')
            .then(() => {
                emitCustomEvent('openLoadingPage', false);
                clearStates();
                handleUpdateProfile();                    
                setMsg('Se ha desvinculado el ingreso por Facebook');
                setSeverityInfo('info');
                setOpenMsg(true);  
            }).catch((error) => {
                emitCustomEvent('openLoadingPage', false);
                setMsg('Ha ocurrido un error al intentar desvincular Facebook de tu cuenta');
                setSeverityInfo('error');
                setOpenMsg(true);                      
            });
        }
    }

    const responseFacebook = (response) => {
        //esta vinculando
        const auth = getAuth();
        const antToken = auth.currentUser.accessToken;
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            unsubscribe();
            if (!isUserEqualF(response, firebaseUser)) {
                const credential = FacebookAuthProvider.credential(response.accessToken);
                linkWithCredential(auth.currentUser, credential)
                .then(async() => {
                    const newToken = auth.currentUser.accessToken;
                    const database = getFirestore();
                    const infoUser = doc(database, "users", currentUser.uid);
                    const docSnap = await getDoc(infoUser);
                    if (docSnap.exists()) {
                    const filtered = docSnap.data().sessions.filter(function(element){
                        return element.id === antToken;
                    });
                    if (filtered.length !== 0){
                        await updateDoc(infoUser, {
                            sessions: arrayRemove(filtered[0])
                        })
                        .then(async()=>{
                                await updateDoc(infoUser, {
                                    sessions: arrayUnion(                
                                        {
                                            id: newToken,
                                            date: Timestamp.now().toMillis(),
                                            ip: details.user[0].ip, 
                                            browser: details.user[1].browser.name,
                                            os:{
                                                name: details.user[1].os.name,
                                                version: details.user[1].os.version,
                                            },
                                            location:{
                                                city: details.user[0].city,//tigre
                                                country: details.user[0].country_name, //argentina
                                                region: details.user[0].region,
                                                country_code: details.user[0].country_code,
                                                currency_name: details.user[0].currency_name,
                                                currency: details.user[0].currency,
                                                lenguaje: details.user[0].languages.split(',')[0],
                                                country_tld: details.user[0].country_tld,
                                            },
                                        }
                                    )
                                }
                                )
                                .then(()=>{
                                    emitCustomEvent('openLoadingPage', false);
                                    clearStates();
                                    handleUpdateProfile();                    
                                    setMsg('Se ha vinculado el ingreso por Facebook');
                                    setSeverityInfo('success');
                                    setOpenMsg(true);        
                                })
                                .catch((error)=>{
                                    logout()
                                    .then(()=>{
                                        emitCustomEvent('openLoadingPage', false);
                                    })
                                    .catch((error)=>{
                                        emitCustomEvent('openLoadingPage', false);
                                    });                                
                                });
                        })
                        .catch((error)=>{ 
                            logout()
                            .then(()=>{
                                emitCustomEvent('openLoadingPage', false);
                            })
                            .catch((error)=>{
                                emitCustomEvent('openLoadingPage', false);
                            });                        
                        });
                    }else{ 
                        logout()
                        .then(()=>{
                            emitCustomEvent('openLoadingPage', false);
                        })
                        .catch((error)=>{
                            emitCustomEvent('openLoadingPage', false);
                        });                    
                    }
                    }else{
                        logout()
                        .then(()=>{
                            emitCustomEvent('openLoadingPage', false);
                        })
                        .catch((error)=>{
                            emitCustomEvent('openLoadingPage', false);
                        });                    
                    }
                }).catch((error) => {
                    emitCustomEvent('openLoadingPage', false);
                    clearStates();
                    handleUpdateProfile();                    
                    setMsg('No se hemos podido vincular el acceso por Fecebook a tu cuenta. Prueba con otra cuenta de Fecebook');
                    setSeverityInfo('error');
                    setOpenMsg(true);        
                });
            } else {
                emitCustomEvent('openLoadingPage', false);
                clearStates();
                handleUpdateProfile();                    
                setMsg('No se hemos podido vincular el acceso por Fecebook a tu cuenta.');
                setSeverityInfo('error');
                setOpenMsg(true);        
            }
            });    
    }

    function isUserEqualF(response, firebaseUser) {
        if (firebaseUser) {
          const providerData = firebaseUser.providerData;
          for (let i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === FacebookAuthProvider.PROVIDER_ID &&
                providerData[i].uid === response.id) {
              // We don't need to reauth the Firebase connection.
              return true;
            }
          }
        }
        return false;
    }

    const handleErrorFacebook = () => {
        emitCustomEvent('openLoadingPage', false);
        clearStates();
        handleUpdateProfile();                    
        setMsg('No se hemos podido vincular el acceso por Fecebook a tu cuenta.');
        setSeverityInfo('error');
        setOpenMsg(true);        
    }


    const handleDesvincularGoogle= () => {
        //esta desvinculando
        if (providers.length === 1){
            //esta desvinculando a su unico proveedor
            if (providers[0].providerId === 'google.com'){
                emitCustomEvent('openLoadingPage', false);
                handleEliminarCuenta();                    
            }else{
                //hay algun error
                emitCustomEvent('openLoadingPage', false);
                clearStates();
                handleUpdateProfile();                    
            }
        }else{
            //esta desvinculando pero tiene mas proveedores de ingreso
            const auth = getAuth();
            unlink(auth.currentUser, 'google.com')
            .then(() => {
                emitCustomEvent('openLoadingPage', false);
                clearStates();
                handleUpdateProfile();                    
                setMsg('Se ha desvinculado el ingreso por Google');
                setSeverityInfo('info');
                setOpenMsg(true);  
            }).catch((error) => {
                emitCustomEvent('openLoadingPage', false);
                setMsg('Ha ocurrido un error al intentar desvincular Google de tu cuenta');
                setSeverityInfo('error');
                setOpenMsg(true);                      
            });
        }
    }

    const responseGoogleError = () => {
        emitCustomEvent('openLoadingPage', false);
        clearStates();
        handleUpdateProfile();                    
        setMsg('No se hemos podido vincular el acceso por Google a tu cuenta.');
        setSeverityInfo('error');
        setOpenMsg(true);        
    }

    const responseGoogleSuccess = (googleUser) => {
        //esta vinculando
        const auth = getAuth();
        const antToken = auth.currentUser.accessToken;
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            unsubscribe();
            if (!isUserEqualG(googleUser, firebaseUser)) {
                const credential = GoogleAuthProvider.credential(googleUser.getAuthResponse().id_token);
                linkWithCredential(auth.currentUser, credential)
                .then(async() => {
                    const newToken = auth.currentUser.accessToken;
                    const database = getFirestore();
                    const infoUser = doc(database, "users", currentUser.uid);
                    const docSnap = await getDoc(infoUser);
                    if (docSnap.exists()) {
                      const filtered = docSnap.data().sessions.filter(function(element){
                          return element.id === antToken;
                    });
                      if (filtered.length !== 0){
                        await updateDoc(infoUser, {
                            sessions: arrayRemove(filtered[0])
                        })
                        .then(async()=>{
                                await updateDoc(infoUser, {
                                    sessions: arrayUnion(                
                                        {
                                            id: newToken,
                                            date: Timestamp.now().toMillis(),
                                            ip: details.user[0].ip, 
                                            browser: details.user[1].browser.name,
                                            os:{
                                                name: details.user[1].os.name,
                                                version: details.user[1].os.version,
                                            },
                                            location:{
                                                city: details.user[0].city,//tigre
                                                country: details.user[0].country_name, //argentina
                                                region: details.user[0].region,
                                                country_code: details.user[0].country_code,
                                                currency_name: details.user[0].currency_name,
                                                currency: details.user[0].currency,
                                                lenguaje: details.user[0].languages.split(',')[0],
                                                country_tld: details.user[0].country_tld,
                                            },
                                        }
                                    )
                                }
                                )
                                .then(()=>{
                                    emitCustomEvent('openLoadingPage', false);
                                    clearStates();
                                    handleUpdateProfile();                    
                                    setMsg('Se ha vinculado el ingreso por Google');
                                    setSeverityInfo('success');
                                    setOpenMsg(true);        
                                })
                                .catch((error)=>{
                                    logout()
                                    .then(()=>{
                                        emitCustomEvent('openLoadingPage', false);
                                    })
                                    .catch((error)=>{
                                        emitCustomEvent('openLoadingPage', false);
                                    });                                
                                });
                        })
                        .catch((error)=>{ 
                            logout()
                            .then(()=>{
                                emitCustomEvent('openLoadingPage', false);
                            })
                            .catch((error)=>{
                                emitCustomEvent('openLoadingPage', false);
                            });                        
                        });
                      }else{ 
                        logout()
                        .then(()=>{
                            emitCustomEvent('openLoadingPage', false);
                        })
                        .catch((error)=>{
                            emitCustomEvent('openLoadingPage', false);
                        });                    
                      }
                    }else{
                        logout()
                        .then(()=>{
                            emitCustomEvent('openLoadingPage', false);
                        })
                        .catch((error)=>{
                            emitCustomEvent('openLoadingPage', false);
                        });                    
                    }
                }).catch((error) => {
                    emitCustomEvent('openLoadingPage', false);
                    clearStates();
                    handleUpdateProfile();                    
                    setMsg('No se hemos podido vincular el acceso por Google a tu cuenta. Prueba con otra cuenta de Google');
                    setSeverityInfo('error');
                    setOpenMsg(true);        
                });
            }else {
                emitCustomEvent('openLoadingPage', false);
                clearStates();
                handleUpdateProfile();                    
                setMsg('No se hemos podido vincular el acceso por Google a tu cuenta.');
                setSeverityInfo('error');
                setOpenMsg(true);        
            }
        });  
    }

    function isUserEqualG(googleUser, firebaseUser) {
        if (firebaseUser) {
          const providerData = firebaseUser.providerData;
          for (let i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === GoogleAuthProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.getBasicProfile().getId()) {
              // We don't need to reauth the Firebase connection.
              return true;
            }
          }
        }
        return false;
    }

    return (
        <div>
            <FormEliminarCuenta
                open={openFormEliminarCuenta}
                name={userName}
                onGetClose={handleClose}
                onGetEliminar={handleEliminar}
            />
            <Container maxWidth="lg">
                <Box sx={{ flexGrow: 10 }}>
                    <Paper
                        variant='string' 
                        sx={{ 
                            marginTop: '50px', 
                            marginBottom: '50px', 
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
                                            fontSize: '14px',
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
                                            marginTop: '20px',
                                            marginBottom: '20px',
                                        }}
                                    >
                                        <strong>Inicio de sesión y seguridad</strong>
                                    </Typography>
                                    <Divider/>
                                    <Accordion
                                        sx={{
                                            marginTop: '40px',
                                            marginBottom: '20px',
                                        }}                                    
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel-password"
                                            id="panel-password"
                                        >
                                        <ListItemIcon>
                                            <PasswordIcon fontSize="medium" />
                                        </ListItemIcon>
                                        <Typography><strong>Contraseña</strong></Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                        <Typography>
                                            Datos de la contraseña
                                        </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion
                                        sx={{
                                            marginTop: '20px',
                                            marginBottom: '20px',
                                        }}                                    
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel-phone"
                                            id="panel-phone"
                                        >
                                        <ListItemIcon>
                                            <ContactPhoneIcon fontSize="medium" />
                                        </ListItemIcon>
                                        <Typography><strong>Número de teléfono</strong></Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                        <Typography>
                                            Datos del teléfono
                                        </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion
                                        sx={{
                                            marginTop: '20px',
                                            marginBottom: '40px',
                                        }}                                    
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel-social"
                                            id="panel-social"
                                        >
                                        <ListItemIcon>
                                            <GroupsIcon fontSize="medium" />
                                        </ListItemIcon>
                                        <Typography><strong>Proveedores externos</strong></Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Divider/>
                                            {!loadingCreated ?
                                            <Stack
                                                direction='column'
                                                style={{
                                                    marginTop: '10px',
                                                    marginBottom: '10px'
                                                }}
                                            >
                                            <GoogleLogin
                                                jsSrc={'https://apis.google.com/js/client.js'}
                                                clientId={process.env.REACT_APP_GOOGLEID}
                                                onSuccess={responseGoogleSuccess}
                                                onFailure={responseGoogleError}
                                                scope= 'https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
                                                cookiePolicy = {"single_host_origin"}
                                                render={renderProps => (
                                                    <CustomizedSwitch
                                                        label='Google'
                                                        strong={true}
                                                        checked={googleProvider}
                                                        onGetChange={e=>{
                                                            emitCustomEvent('openLoadingPage', true);
                                                            if(e){
                                                                renderProps.onClick();
                                                            }else{
                                                                handleDesvincularGoogle();
                                                            }
                                                        }}
                                                    />
                                                )}
                                            />            
                                            {(providers.length === 1) && (googleProvider) ? 
                                            <Chip size='small' color='info' label="único proveedor" sx={{fontSize:'11px', maxWidth: '100px'}}/>
                                            :null}
                                            </Stack>
                                            :
                                            <Skeleton variant="text" width="100%"/>
                                            }
                                            <Divider/>
                                            {!loadingCreated ?
                                            <Stack
                                                direction='column'
                                                style={{
                                                    marginTop: '10px',
                                                    marginBottom: '10px'
                                                }}
                                            >
                                            <FacebookLogin
                                                appId={process.env.REACT_APP_FACEBOOKID}
                                                fields="name,email,picture"
                                                scope=	'public_profile, email, user_birthday'
                                                responseType='id_token'
                                                accessType='online'
                                                version={'3.2'}
                                                isMobile={false}
                                                cookie={true}
                                                xfbml={true}                
                                                callback={responseFacebook}
                                                onFailure={handleErrorFacebook}
                                                render={renderProps => (
                                                    <CustomizedSwitch
                                                        label='Facebook'
                                                        strong={true}
                                                        checked={facebookProvider}
                                                        onGetChange={e=>{
                                                            emitCustomEvent('openLoadingPage', true);
                                                            if(e){
                                                                renderProps.onClick();
                                                            }else{
                                                                handleDesvincularFacebook();
                                                            }
                                                        }}
                                                    />    
                                                )}                
                                            />  
                                            {(providers.length === 1) && (facebookProvider) ? 
                                            <Chip size='small' color='info' label="único proveedor" sx={{fontSize:'11px', maxWidth: '100px'}}/>
                                            :null}
                                            </Stack>
                                            :
                                            <Skeleton variant="text" width="100%"/>
                                            }
                                            <Divider/>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Divider/>
                                    <Typography
                                        fontSize={{
                                            lg: 30,
                                            md: 30,
                                            sm: 25,
                                            xs: 25,
                                        }}                                                                                
                                        sx={{
                                            marginTop: '20px',
                                            marginBottom: '20px',
                                        }}
                                    >
                                        <strong>Sesiones activas</strong>
                                    </Typography>
                                    <Stack
                                        direction='column'
                                        style={{
                                            marginTop: '10px',
                                            marginBottom: '10px',
                                        }}
                                    >
                                        {!loadingCreated ?
                                        <>
                                        {listItems}
                                        </>
                                        :
                                        <Stack
                                            spacing={1}
                                            style={{
                                                marginTop: '0px',
                                                marginBottom: '0px',
                                            }}
                                        >
                                            <Skeleton variant="text" width="30%"/>
                                            <Skeleton variant="text" width="50%"/>
                                            <Skeleton variant="text" width="70%"/>
                                        </Stack>
                                        }
                                        <Button 
                                            variant='outlined'
                                            className='button__log__continuar'
                                            disableElevation
                                            onClick={handleCerrarSesiones}
                                        >
                                        Cerrar todas las sesiones
                                        </Button>
                                    </Stack>
                                    <Divider/>
                                    <Typography
                                        fontSize={{
                                            lg: 30,
                                            md: 30,
                                            sm: 25,
                                            xs: 25,
                                        }}                                                                                
                                        sx={{
                                            marginTop: '20px',
                                            marginBottom: '20px',
                                        }}
                                    >
                                        <strong>Datos de creación de cuenta</strong>
                                    </Typography>
                                    <Paper
                                        variant='string'
                                        sx={{ 
                                            p: 2, 
                                            border: '1px solid lightgray',
                                            borderRadius: '20px',
                                        }}
                                    >
                                    {!loadingCreated ?
                                    <Stack
                                        spacing={1}
                                        style={{
                                            marginTop: '0px',
                                            marginBottom: '0px',
                                        }}
                                    >
                                            <Typography><strong>{createdOsName}&nbsp;{createdOsVersion}</strong>&nbsp;•&nbsp;{createdBrowser}</Typography>                                    
                                            <Typography>{createdLocationCity}&nbsp;•&nbsp;{createdLocationRegion}&nbsp;•&nbsp;{createdLocationCountry}</Typography>                                    
                                            <Typography>{new Date(parseInt(createdDate)).toLocaleDateString(createdlenguaje, options)}&nbsp;a las&nbsp;{new Date(parseInt(createdDate)).toLocaleTimeString(createdlenguaje)}</Typography>
                                            <Button 
                                                variant='outlined'
                                                className='button__log__BW'
                                                disableElevation
                                                onClick={handleEliminarCuenta}
                                            >
                                            Elimina tu cuenta
                                            </Button>
                                        </Stack>
                                        :
                                        <Stack
                                            spacing={1}
                                            style={{
                                                marginTop: '0px',
                                                marginBottom: '0px',
                                            }}
                                        >
                                            <Skeleton variant="text" width="30%"/>
                                            <Skeleton variant="text" width="50%"/>
                                            <Skeleton variant="text" width="70%"/>
                                        </Stack>
                                        } 
                                    </Paper> 
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
                                        <Img src={security} />
                                        <Typography 
                                            fontSize={{
                                                lg: 20,
                                                md: 20,
                                                sm: 15,
                                                xs: 15,
                                            }}                                                                                
                                            sx={{marginTop: '20px'}}
                                        >
                                            <strong>Vamos a hacer que tu cuenta sea más segura</strong>
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
                                            Siempre estamos trabajando para aumentar la seguridad en nuestra comunidad. Por eso, revisamos todas las cuentas para asegurarnos de que sean lo más seguras posible.
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

export default LoginAndSecurity
