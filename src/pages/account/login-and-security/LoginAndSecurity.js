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
import { RecaptchaVerifier, 
         getAuth, 
         unlink, 
         linkWithCredential, 
         GoogleAuthProvider, 
         FacebookAuthProvider,
         signInWithPhoneNumber,
         fetchSignInMethodsForEmail,
         EmailAuthProvider, 
         onAuthStateChanged } from "firebase/auth";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import GoogleLogin from 'react-google-login';
import InputCountrySelectPhone from '../../login/InputCountrySelectPhone';
import FormVerificaCodigoPhoneLink from '../../login/FormVerificaCodigoPhoneLink';
import InputEmail from '../../login/InputEmail';
import InputPassword from '../../login/InputPassword';
import FormReautenticaConPassword from './FormReautenticaConPassword';
import FormRecoveryPassword from '../../login/FormRecoveryPassword';
import FormReautenticaConGoogle from './FormReautenticaConGoogle';
import FormReautenticaConFacebook from './FormReautenticaConFacebook';
import FormReautenticaConPhone from './FormReautenticaConPhone';

var recaptchaVerifier;
var antTokenPhone;
const functions = getFunctions();
const deleteUser = httpsCallable(functions, 'deleteUser');
const revokeRefreshTokens = httpsCallable(functions, 'revokeRefreshTokens');
const getUser = httpsCallable(functions, 'getUser');
const getUserByPhoneNumber = httpsCallable(functions, 'getUserByPhoneNumber');

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
    const [txtBtnContinuar, setTxtBtnContinuar] = useState('Actualizar');
    const [classNameBtnContinuar, setClassNameBtnContinuar] = useState('button__log__continuar');
    
    const [googleProvider, setGoogleProvider] = useState(false);
    const [facebookProvider, setFacebookProvider] = useState(false);
    const [phoneProvider, setPhoneProvider] = useState(false);
    const [passwordProvider, setPasswordProvider] = useState(false);
    const [providers, setProviders] = useState(null);
    const [countryPhone, setCountryPhone] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [openFormVerificaCodigoPhone, setOpenFormVerificaCodigoPhone] = useState(false);
    const [actualizarPhone, setActualizarPhone] = useState(false);
    const [cerrarProbar, setCerrarProbar] = useState(false);
    const [openFormReautenticaConPassword, setOpenFormReautenticaConPassword] = useState(false);
    const [openFormRecoveryPassword, setOpenFormRecoveryPassword] = useState(false);
    const [openFormReautenticaConPasswordDesvincular, setOpenFormReautenticaConPasswordDesvincular] = useState(false);
    const [openFormRecoveryPasswordDesvincular, setOpenFormRecoveryPasswordDesvincular] = useState(false);
    const [openFormReautenticaConGoogle, setOpenFormReautenticaConGoogle] = useState(false);
    const [openFormReautenticaConFacebook, setOpenFormReautenticaConFacebook] = useState(false);
    const [openFormReautenticaConPhone, setOpenFormReautenticaConPhone] = useState(false);

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
                            if(item.providerId === 'phone'){
                                setPhoneProvider(true);
                                setPhoneNumber(currentUser.phoneNumber);
                            }
                            if(item.providerId === 'password'){
                                setPasswordProvider(true);
                            }
                        });
                        if (currentUser.providerData.length === 1){
                            //tiene un solo proveedor
                            if (currentUser.providerData[0].providerId === 'phone'){
                                //tiene un solo proveedor y es phone
                                if (currentUser.email !== null){
                                    //tiene un solo proveedor, es phone y tiene un email asociado esta mal, hay que asignarle null a email
                                }
                            }
                        }
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
                        setCountryPhone(docSnap.data().countryCode);
                        setValueInputPhoneFormPrincipal(currentUser.phoneNumber);
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
                        console.log('error')
                    })
                    .catch((error)=>{
                        emitCustomEvent('showMsg', 'Ha ocurrido un error al intentar acceder a los datos de tu cuenta/error');
                        console.log('error')
                    });    
                })
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
        setGoogleProvider(false);
        setFacebookProvider(false);
        setPhoneProvider(false);
        setPasswordProvider(false);
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
        setCountryPhone(null);
        setValueInputPhoneFormPrincipal('');
        setCountryCode(null);
        setPhoneNumber(null);
        setCerrarProbar(false);
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
                if (userEmail !==null ){
                    emitCustomEvent('showMsg', 'Hemos eliminado la cuenta ' + userEmail + '/info');
                }else{
                    emitCustomEvent('showMsg', 'Hemos eliminado tu cuenta/info');
                }
            })
            .catch((error)=>{
                emitCustomEvent('openLoadingPage', false);
                if (userEmail !==null ){
                    emitCustomEvent('showMsg', 'Hemos eliminado la cuenta ' + userEmail + '/info');
                }else{
                    emitCustomEvent('showMsg', 'Hemos eliminado tu cuenta/info');
                }
            });
        })
        .catch((error)=> {
            emitCustomEvent('openLoadingPage', false);
            if (userEmail !==null ){
                emitCustomEvent('showMsg', 'Ocurrió un error al eliminar la cuenta ' + userEmail + '. No te preocupes, nosotros nos encargaremos de eliminarla./error');
            }else{
                emitCustomEvent('showMsg', 'Ocurrió un error al eliminar tu cuenta. No te preocupes, nosotros nos encargaremos de eliminarla./error');
            }
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
                setMsg('Se ha desvinculado el ingreso mediante Facebook');
                setSeverityInfo('info');
                setOpenMsg(true);  
            }).catch((error) => {
                emitCustomEvent('openLoadingPage', false);
                setMsg('Ha ocurrido un error al intentar desvincular el ingreso mediante Facebook de tu cuenta');
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
                                    setMsg('Se ha vinculado el ingreso mediante Facebook');
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
                    setMsg('No se hemos podido vincular el acceso mediante Fecebook a tu cuenta. Prueba con otra cuenta de Fecebook');
                    setSeverityInfo('error');
                    setOpenMsg(true);        
                });
            } else {
                emitCustomEvent('openLoadingPage', false);
                clearStates();
                handleUpdateProfile();                    
                setMsg('No se hemos podido vincular el acceso mediante Fecebook a tu cuenta.');
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
        setMsg('No se hemos podido vincular el acceso mediante Fecebook a tu cuenta.');
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
                setMsg('Se ha desvinculado el ingreso mediante Google');
                setSeverityInfo('info');
                setOpenMsg(true);  
            }).catch((error) => {
                emitCustomEvent('openLoadingPage', false);
                setMsg('Ha ocurrido un error al intentar desvincular el ingreso mediante Google de tu cuenta');
                setSeverityInfo('error');
                setOpenMsg(true);                      
            });
        }
    }

    const responseGoogleError = () => {
        emitCustomEvent('openLoadingPage', false);
        clearStates();
        handleUpdateProfile();                    
        setMsg('No se hemos podido vincular el acceso mediante Google a tu cuenta.');
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
                                    setMsg('Se ha vinculado el ingreso mediante Google');
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
                    setMsg('No se hemos podido vincular el acceso mediante Google a tu cuenta. Prueba con otra cuenta de Google');
                    setSeverityInfo('error');
                    setOpenMsg(true);        
                });
            }else {
                emitCustomEvent('openLoadingPage', false);
                clearStates();
                handleUpdateProfile();                    
                setMsg('No se hemos podido vincular el acceso mediante Google a tu cuenta.');
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

    const handleVincularPhone = () => {
        setActualizarPhone(false);
        setSubmitCountrySelectPhoneFormPrincipal(true);
    }

    const handleDesvincularPhone = () => {
        //esta desvinculando
        if (providers.length === 1){
            //esta desvinculando a su unico proveedor
            if (providers[0].providerId === 'phone'){
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
            unlink(auth.currentUser, 'phone')
            .then(async() => {
                const infoUser = doc(database, "users", auth.currentUser.uid);  
                await updateDoc(infoUser, {
                    countryCode: null,
                })
                .then(()=>{
                    emitCustomEvent('openLoadingPage', false);
                    clearStates();
                    handleUpdateProfile();                    
                    setMsg('Se ha desvinculado el ingreso mediante número telefónico');
                    setSeverityInfo('info');
                    setOpenMsg(true);      
                })
                .catch(()=>{
                    emitCustomEvent('openLoadingPage', false);
                    clearStates();
                    handleUpdateProfile();                    
                    setMsg('Se ha desvinculado el ingreso mediante número telefónico');
                    setSeverityInfo('info');
                    setOpenMsg(true);      
                });
            }).catch((error) => {
                emitCustomEvent('openLoadingPage', false);
                setMsg('Ha ocurrido un error al intentar desvincular el ingreso mediante número telefónico de tu cuenta');
                setSeverityInfo('error');
                setOpenMsg(true);                      
            });
        }
    }

    /*variables del componente CountrySelectPhone*/
    const styleSelectCountryPhoneFormPrincipal = { marginTop: "10px", marginBottom: '10px' };
    const [valueInputPhoneFormPrincipal, setValueInputPhoneFormPrincipal] = useState('');
    const [submitCountrySelectPhoneFormPrincipal, setSubmitCountrySelectPhoneFormPrincipal] = useState(false);
    const [variableEstadoCargadoNewValuePhoneFormPrincipal, setVariableEstadoCargadoNewValuePhoneFormPrincipal] = useState(false);
    const [countryCode, setCountryCode] = useState(null);
    const submitValuePhoneFormPicnipal = (value) => {
        setSubmitCountrySelectPhoneFormPrincipal(value);
    }
    const getValuePhoneCountrySelectPhoneFormPrincipal = (phone) => {
        setValueInputPhoneFormPrincipal(phone[0]);
        setCountryCode(phone[1].code);
        setVariableEstadoCargadoNewValuePhoneFormPrincipal(true);
    }
    /*fin variables de componente CountrySelectPhone*/

    const handleEnter = () => {
        if (txtBtnContinuar === 'Actualizar'){
            if (phoneProvider){
                setCerrarProbar(true);
                setActualizarPhone(true);
            }else{
                setActualizarPhone(false);
            }
            setSubmitCountrySelectPhoneFormPrincipal(true);
        }else{
            setCerrarProbar(false);
            if (recaptchaVerifier !== undefined)
                if (!recaptchaVerifier.destroyed) 
                    recaptchaVerifier.clear();
            clearStates();
            handleUpdateProfile();                                
            setTxtBtnContinuar('Actualizar');
            setClassNameBtnContinuar('button__log__continuar');
        }
    }

    const handleClickContinuar = () => {
        if (txtBtnContinuar === 'Actualizar'){
            if (phoneProvider){
                setCerrarProbar(true);
                setActualizarPhone(true);
            }else{
                setActualizarPhone(false);
            }
            setSubmitCountrySelectPhoneFormPrincipal(true);
        }else{
            setCerrarProbar(false);
            if (recaptchaVerifier !== undefined)
                if (!recaptchaVerifier.destroyed) 
                    recaptchaVerifier.clear();
            clearStates();
            handleUpdateProfile();                                
            setTxtBtnContinuar('Actualizar');
            setClassNameBtnContinuar('button__log__continuar');
        }
    }

    /*atencion del valor ingresado del componente CountrySelectPhone*/
    useEffect(() => {
        if (variableEstadoCargadoNewValuePhoneFormPrincipal){
            if ((valueInputPhoneFormPrincipal !== '')) {
                emitCustomEvent('openLoadingPage', true);
                getUserByPhoneNumber(valueInputPhoneFormPrincipal)  
                .then((userRecord) => {
                    emitCustomEvent('openLoadingPage', false);
                    if (recaptchaVerifier !== undefined)
                        if (!recaptchaVerifier.destroyed) 
                            recaptchaVerifier.clear();
                    clearStates();
                    handleUpdateProfile();                                                
                    setTxtBtnContinuar('Actualizar');
                    setClassNameBtnContinuar('button__log__continuar');        
                    if (userRecord.data.uid === currentUser.uid){
                        //el usuario existe
                        setMsg('El número ' + String(valueInputPhoneFormPrincipal) + ' ya se encuentra asociado a tu cuenta.');
                    }else{
                        //el usuario existe
                        setMsg('El número ' + String(valueInputPhoneFormPrincipal) + ' ya se encuentra asociado a otra cuenta.');
                    }
                    setSeverityInfo('error');
                    setOpenMsg(true);
                })
                .catch((error) => {
                    const auth = getAuth();
                    auth.languageCode = details.user[0].languages.split(',')[0];
                    recaptchaVerifier = new RecaptchaVerifier('recaptcha-container4', {
                        type: 'image', // 'audio'
                        size: 'normal', // 'normal, invisible' or 'compact'
                        badge: 'inline' //' bottomright' or 'inline' applies to invisible.                    
                    }, auth);                    
                    antTokenPhone = auth.currentUser.accessToken;
                    setTxtBtnContinuar('Cancelar');
                    setClassNameBtnContinuar('button__log__BW');
                    emitCustomEvent('openLoadingPage', false);                    
                    signInWithPhoneNumber(auth, valueInputPhoneFormPrincipal, recaptchaVerifier)
                    .then((result) => {
                        emitCustomEvent('openLoadingPage', true);
                        if (recaptchaVerifier !== undefined)
                            if (!recaptchaVerifier.destroyed) 
                                recaptchaVerifier.clear();
                        setConfirmationResult(result);
                        setOpenFormVerificaCodigoPhone(true);
                        emitCustomEvent('openLoadingPage', false);
                    }).catch((error) => {
                        // Error; SMS not sent
                        // ...
                        if (recaptchaVerifier !== undefined)
                            if (!recaptchaVerifier.destroyed) 
                                recaptchaVerifier.clear();
                        clearStates();
                        handleUpdateProfile();                                                
                        setTxtBtnContinuar('Actualizar');
                        setClassNameBtnContinuar('button__log__continuar');
                        setMsg('No pudimos enviar el SMS al número de teléfono ' + String(valueInputPhoneFormPrincipal));
                        setSeverityInfo('error');
                        emitCustomEvent('openLoadingPage', false);
                        setOpenMsg(true);                    
                    });
                });
             }else{
                emitCustomEvent('openLoadingPage', false);
                setMsg('No ingresaste un número de teléfono válido');
                setSeverityInfo('error');
                setOpenMsg(true);                    
            }
            setVariableEstadoCargadoNewValuePhoneFormPrincipal(false);       
        }         
    },[details, currentUser, valueInputPhoneFormPrincipal, variableEstadoCargadoNewValuePhoneFormPrincipal, clearStates, handleUpdateProfile]);
    /*fin atencion del valor ingresado del componente CountrySelectPhone*/

    const handleLinkedPhone = async() => {
        setTxtBtnContinuar('Actualizar');
        setClassNameBtnContinuar('button__log__continuar');
        const auth = getAuth();
        const newToken = auth.currentUser.accessToken;
        const database = getFirestore();
        const infoUser = doc(database, "users", currentUser.uid);
        const docSnap = await getDoc(infoUser);
        if (docSnap.exists()) {
            const filtered = docSnap.data().sessions.filter(function(element){
              return element.id === antTokenPhone;
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
                        setOpenFormVerificaCodigoPhone(false);
                        clearStates();
                        handleUpdateProfile();                    
                        emitCustomEvent('openLoadingPage', false);
                        setMsg('Ya podés ingresar a byOO con ' + String(valueInputPhoneFormPrincipal));
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
    }

    const handleReturnFormVerificaCodigoPhone =() => {
        clearStates();
        handleUpdateProfile();                    
        setTxtBtnContinuar('Actualizar');
        setClassNameBtnContinuar('button__log__continuar');
        setOpenFormVerificaCodigoPhone(false);
    }

    /*variables del componente InputEmail Form Principal*/
    const styleInputEmailFormPrincipal = { marginTop: "10px" };
    const [submitEmailFormPrincipal, setSubmitEmailFormPrincipal] = useState(false);
    const [variableEstadoCargadoNewValueEmailFormPrincipal, setVariableEstadoCargadoNewValueEmailFormPrincipal] = useState(false);
    const submitValueEmailFormPrincipal = (value) => {
        setSubmitEmailFormPrincipal(value);
    }
    const getValueEmailFormPrincipal = (email) => {
        setUserMail(email);
        setVariableEstadoCargadoNewValueEmailFormPrincipal(true);
    }
    /*fin variables del componente InputEmail Form Principal*/

    /*variables del componente InputPassword del form Registrate*/
    const styleInputPasswordFormRegistrate1 = { marginTop: "10px" };
    const [valueInputPasswordFormRegistrate1, setValueInputPasswordFormRegistrate1] = useState('');
    const [submitPasswordFormRegistrate1, setSubmitInputPasswordFormRegistrate1] = useState(false);
    const [variableEstadoCargadoNewValuePasswordFormRegistrate1, setVariableEstadoCargadoNewValuePasswordFormRegistrate1] = useState(false);
    const submitValuePasswordFormRegistrate1 = (value) => {
        setSubmitInputPasswordFormRegistrate1(value);
    }
    const getValuePasswordFormRegistrate1 = (password) => {
        setValueInputPasswordFormRegistrate1(password);
        setVariableEstadoCargadoNewValuePasswordFormRegistrate1(true);
    }
    /*fin variables de componente InputPassword del form Registrate*/

    /*variables del componente InputPassword del form Registrate*/
    const styleInputPasswordFormRegistrate2 = { marginTop: "10px", marginBottom: '10px' };
    const [valueInputPasswordFormRegistrate2, setValueInputPasswordFormRegistrate2] = useState('');
    const [submitPasswordFormRegistrate2, setSubmitInputPasswordFormRegistrate2] = useState(false);
    const [variableEstadoCargadoNewValuePasswordFormRegistrate2, setVariableEstadoCargadoNewValuePasswordFormRegistrate2] = useState(false);
    const submitValuePasswordFormRegistrate2 = (value) => {
        setSubmitInputPasswordFormRegistrate2(value);
    }
    const getValuePasswordFormRegistrate2 = (password) => {
        setValueInputPasswordFormRegistrate2(password);
        setVariableEstadoCargadoNewValuePasswordFormRegistrate2(true);
    }
    /*fin variables de componente InputPassword del form Registrate*/
    
    /*atencion del valor ingresado del componente Input Email del form principal*/
    useEffect(() => {    
        if (variableEstadoCargadoNewValuePasswordFormRegistrate1){        
            setVariableEstadoCargadoNewValuePasswordFormRegistrate1(false);       
        }         

        if (variableEstadoCargadoNewValuePasswordFormRegistrate2){        
            setVariableEstadoCargadoNewValuePasswordFormRegistrate2(false);       
        }                 

        if (variableEstadoCargadoNewValueEmailFormPrincipal){
            if (valueInputPasswordFormRegistrate1 !== '') {
                if (valueInputPasswordFormRegistrate2 !== '') {
                    if ((userEmail !== '')&&(userEmail !== null)) {
                        if (valueInputPasswordFormRegistrate1 === valueInputPasswordFormRegistrate2){
                            const auth = getAuth();
                            const antToken = auth.currentUser.accessToken;
                            fetchSignInMethodsForEmail(auth, userEmail)
                            .then(providers => {
                                if (providers.length === 0){
                                    //el mail no esta asociado a ninguna cuenta
                                    const credential = EmailAuthProvider.credential(userEmail, valueInputPasswordFormRegistrate1);
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
                                                        setMsg('Se han actualizado los datos de tu cuenta');
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
                                        console.log(error);
                                        emitCustomEvent('openLoadingPage', false);
                                        if (error.code === 'auth/provider-already-linked'){
                                            //esta actualizando el password
                                            setOpenFormReautenticaConPassword(true);
                                        }else{
                                            if (error.code === 'auth/requires-recent-login'){
                                                //requiere actualizar las credenciales
                                                if (passwordProvider){
                                                    setOpenFormReautenticaConPassword(true);
                                                }else{
                                                    if (googleProvider){
                                                        setOpenFormReautenticaConGoogle(true);
                                                    }else{
                                                        if (facebookProvider){
                                                            setOpenFormReautenticaConFacebook(true);
                                                        }else{
                                                            if (phoneProvider){
                                                                setOpenFormReautenticaConPhone(true);
                                                            }
                                                        }
                                                    }
                                                }
                                            }else{
                                                setMsg('Ha ocurrido un error al intentar actualizar los datos de tu cuenta.');
                                                setSeverityInfo('error');
                                                setOpenMsg(true);
                                                emitCustomEvent('openLoadingPage', false);                    
                                            }
                                        }
                                    });                                  
                                }else{
                                    let emailProvider = false;
                                    currentUser.providerData.forEach((item)=>{
                                        if (item.email === userEmail){
                                            emailProvider = true;
                                        }
                                    });
                                    //el mail esta asociado a alguna cuenta
                                    if ((auth.currentUser.email === userEmail)||(emailProvider)){
                                        //el mail es el mismo del usuario actual
                                        const credential = EmailAuthProvider.credential(userEmail, valueInputPasswordFormRegistrate1);
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
                                                            setMsg('Se han actualizado los datos de tu cuenta');
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
                                            console.log(error);
                                            emitCustomEvent('openLoadingPage', false);
                                            if (error.code === 'auth/provider-already-linked'){
                                                //esta actualizando el password
                                                setOpenFormReautenticaConPassword(true);
                                            }else{
                                                if (error.code === 'auth/requires-recent-login'){
                                                    //requiere actualizar las credenciales
                                                    if (passwordProvider){
                                                        setOpenFormReautenticaConPassword(true);
                                                    }else{
                                                        if (googleProvider){
                                                            setOpenFormReautenticaConGoogle(true);
                                                        }else{
                                                            if (facebookProvider){
                                                                setOpenFormReautenticaConFacebook(true);
                                                            }else{
                                                                if (phoneProvider){
                                                                    setOpenFormReautenticaConPhone(true);
                                                                }
                                                            }
                                                        }
                                                    }
                                                }else{
                                                    setMsg('Ha ocurrido un error al intentar actualizar los datos de tu cuenta.');
                                                    setSeverityInfo('error');
                                                    setOpenMsg(true);
                                                    emitCustomEvent('openLoadingPage', false);                    
                                                }
                                            }
                                        });                                    
                                    }else{
                                        //el mail no es el del usuario actual
                                        setMsg('No podemos asociar el correo ' + userEmail + ' porque ya se encuentra asociado a otra cuenta.');
                                        setSeverityInfo('error');
                                        setOpenMsg(true); 
                                        emitCustomEvent('openLoadingPage', false);
                                    }
                                }
                            })
                            .catch((error) => {
                                // Some error occurred, you can inspect the code: error.code
                                setMsg('Ha ocurrido un error al intentar asociar el correo ' + userEmail + ' a tu cuenta.');
                                setSeverityInfo('error');
                                setOpenMsg(true);
                                emitCustomEvent('openLoadingPage', false);
                            });
                        }else{
                            emitCustomEvent('openLoadingPage', false);
                            setMsg('Las contraseñas ingresadas deben ser iguales. Revisá las contraseñas ingresadas y probá nuevamente.');
                            setSeverityInfo('error');
                            setOpenMsg(true);                    
                        }                
                    }else{
                        emitCustomEvent('openLoadingPage', false);
                        setMsg('Revisá los datos ingresados.');
                        setSeverityInfo('error');
                        setOpenMsg(true);                            
                    }
                }else{
                    emitCustomEvent('openLoadingPage', false);
                    setMsg('Revisá los datos ingresados.');
                    setSeverityInfo('error');
                    setOpenMsg(true);                        
                }
            }else{
                emitCustomEvent('openLoadingPage', false);
                setMsg('Revisá los datos ingresados.');
                setSeverityInfo('error');
                setOpenMsg(true);                    
            }
            setVariableEstadoCargadoNewValueEmailFormPrincipal(false);       
        }       
    },[userEmail, variableEstadoCargadoNewValueEmailFormPrincipal, variableEstadoCargadoNewValuePasswordFormRegistrate1, clearStates, currentUser, details, facebookProvider, googleProvider, handleUpdateProfile, passwordProvider, phoneProvider, valueInputPasswordFormRegistrate1, valueInputPasswordFormRegistrate2, variableEstadoCargadoNewValuePasswordFormRegistrate2]);
    /*fin atencion del valor ingresado del componente Input Email del form principal*/    

    const handleVincularPassword = () => {
        handleEnterEmail();
    }

    const handleDesvincularPassword = () => {
        //esta desvinculando
        if (providers.length === 1){
            //esta desvinculando a su unico proveedor
            if (providers[0].providerId === 'password'){
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
            setOpenFormReautenticaConPasswordDesvincular(true);
            emitCustomEvent('openLoadingPage', false);
        }
    }

    const handleEnterEmail = () => {
        emitCustomEvent('openLoadingPage', true);
        setSubmitInputPasswordFormRegistrate1(true);
        setSubmitInputPasswordFormRegistrate2(true);
        setSubmitEmailFormPrincipal(true);
    }

    const handleClickActualizarPassword = () => {
        handleEnterEmail();        
    }

    const handleRecoveryPassReautenticaConPassword = () => {
        setOpenFormReautenticaConPassword(false);
        setOpenFormRecoveryPassword(true);
    }

    const handleRecoveryPassReautenticaConPasswordDesvincular = () => {
        setOpenFormReautenticaConPasswordDesvincular(false);
        setOpenFormRecoveryPasswordDesvincular(true);
    }

    const handleReturnFormRecoveryPassword = () =>{
        setOpenFormRecoveryPassword(false);
        setOpenFormReautenticaConPassword(true);
    }

    const handleReturnFormRecoveryPasswordDesvincular = () =>{
        setOpenFormRecoveryPasswordDesvincular(false);
        setOpenFormReautenticaConPasswordDesvincular(true);
    }

    const handleCloseFormRecoveryPassword = () => {
        setOpenFormRecoveryPassword(false);
    }

    const handleCloseFormRecoveryPasswordDesvincular = () => {
        setOpenFormRecoveryPasswordDesvincular(false);
    }

    const handleCloseReautenticaConPassword = () => {
        setOpenFormReautenticaConPassword(false);
        clearStates();
        handleUpdateProfile();                    
    }

    const handleCloseReautenticaConPasswordDesvincular = () => {
        setOpenFormReautenticaConPasswordDesvincular(false);
        clearStates();
        handleUpdateProfile();                    
    }

    const handleCredentialOKPasswordDesvincular = () => {
        emitCustomEvent('openLoadingPage', true);
        setOpenFormReautenticaConPasswordDesvincular(false);
        const auth = getAuth();
        unlink(auth.currentUser, 'password')
        .then(() => {
            emitCustomEvent('openLoadingPage', false);
            clearStates();
            handleUpdateProfile();                    
            setMsg('Se ha desvinculado el ingreso mediante contraseña');
            setSeverityInfo('info');
            setOpenMsg(true);      
        }).catch((error) => {
            emitCustomEvent('openLoadingPage', false);
            setMsg('Ha ocurrido un error al intentar desvincular el ingreso mediante contraseña de tu cuenta');
            setSeverityInfo('error');
            setOpenMsg(true);                      
        });
    }

    const handleCredentialOKPassword = () => {
        emitCustomEvent('openLoadingPage', true);
        setOpenFormReautenticaConGoogle(false);
        setOpenFormReautenticaConFacebook(false);
        setOpenFormReautenticaConPassword(false);
        setOpenFormReautenticaConPhone(false);
        const auth = getAuth();
        const antToken = auth.currentUser.accessToken;
        const credential = EmailAuthProvider.credential(userEmail, valueInputPasswordFormRegistrate1);
        linkWithCredential(auth.currentUser, credential)
        .then(async() => {
            emitCustomEvent('openLoadingPage', true);
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
                            setMsg('Se han actualizado los datos de tu cuenta');
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
                    console.log(error);
                    emitCustomEvent('openLoadingPage', false);
                });                    
            }
        }).catch((error) => {
            console.log(error);
            if (error.code === 'auth/provider-already-linked'){
                emitCustomEvent('openLoadingPage', true);
                const auth = getAuth();
                unlink(auth.currentUser, 'password')
                .then(() => {
                    const antToken = auth.currentUser.accessToken;
                    linkWithCredential(auth.currentUser, credential)
                    .then(async() => {
                        emitCustomEvent('openLoadingPage', true);
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
                                        setMsg('Se han actualizado los datos de tu cuenta');
                                        setSeverityInfo('success');
                                        setOpenMsg(true);        
                                    })
                                    .catch((error)=>{
                                        console.log(error);
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
                                console.log(error);
                                logout()
                                .then(()=>{
                                    emitCustomEvent('openLoadingPage', false);
                                })
                                .catch((error)=>{
                                    emitCustomEvent('openLoadingPage', false);
                                });                        
                            });
                          }else{ 
                            console.log('por aca');
                            logout()
                            .then(()=>{
                                emitCustomEvent('openLoadingPage', false);
                            })
                            .catch((error)=>{
                                emitCustomEvent('openLoadingPage', false);
                            });                    
                          }
                        }else{
                            console.log('por aca');
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
                        setMsg('Ha ocurrido un error al intentar desvincular el ingreso mediante contraseña de tu cuenta');
                        setSeverityInfo('error');
                        setOpenMsg(true);        
                    }); 
                }).catch((error) => {
                    emitCustomEvent('openLoadingPage', false);
                    setMsg('Ha ocurrido un error al intentar desvincular el ingreso mediante contraseña de tu cuenta');
                    setSeverityInfo('error');
                    setOpenMsg(true);        
                });
            }else{
                emitCustomEvent('openLoadingPage', false);
                setMsg('Ha ocurrido un error al intentar desvincular el ingreso mediante contraseña de tu cuenta');
                setSeverityInfo('error');
                setOpenMsg(true);        
            }
        }); 
    }

    const handleCloseReautenticaConGoogle = () => {
        setOpenFormReautenticaConGoogle(false);
        clearStates();
        handleUpdateProfile();                    
    }

    const handleClickReautenticaConGoogle = () => {
        emitCustomEvent('openLoadingPage', true);
    }

    const handleErrorReautenticaConGoogle = () => {
        setOpenFormReautenticaConGoogle(false);
        emitCustomEvent('openLoadingPage', false);
    }

    const handleCredentialOKGoogle = () => {
        handleCredentialOKPassword();
    }

    const handleCloseReautenticaConFacebook = () => {
        setOpenFormReautenticaConFacebook(false);
        clearStates();
        handleUpdateProfile();                    
    }

    const handleClickReautenticaConFacebook = () => {
        emitCustomEvent('openLoadingPage', true);
    }

    const handleErrorReautenticaConFacebook = () => {
        setOpenFormReautenticaConFacebook(false);
        emitCustomEvent('openLoadingPage', false);
    }

    const handleCredentialOKFacebook = () => {
        handleCredentialOKPassword();
    }    
    
    const handleCloseReautenticaConPhone = () => {
        setOpenFormReautenticaConPhone(false);
        clearStates();
        handleUpdateProfile();                    
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
                                        <Divider/>
                                            {!loadingCreated ?
                                            <Stack
                                                direction='column'
                                                style={{
                                                    marginTop: '10px',
                                                    marginBottom: '10px'
                                                }}
                                            >
                                            <CustomizedSwitch
                                                label='Correo electrónico y contraseña'
                                                strong={true}
                                                checked={passwordProvider}
                                                onGetChange={e=>{
                                                    emitCustomEvent('openLoadingPage', true);
                                                    if(e){
                                                        handleVincularPassword();
                                                    }else{
                                                        handleDesvincularPassword();
                                                    }
                                                }}
                                            />
                                            {(providers.length === 1) && (passwordProvider) ? 
                                            <Chip size='small' color='info' label="único proveedor" sx={{fontSize:'11px', maxWidth: '100px'}}/>
                                            :null}
                                            </Stack>
                                            :
                                            <Skeleton variant="text" width="100%"/>
                                            }
                                            <Divider/>
                                            {!loadingCreated ? 
                                            <>
                                                <Typography 
                                                    variant="caption"
                                                    display="block"
                                                    gutterBottom
                                                    style={{
                                                        width: '100%',
                                                        marginTop: 10,
                                                    }}
                                                >
                                                    En éste correo electrónico recibirás toda la información de la comunidad byOO.
                                                </Typography>
                                                <InputEmail 
                                                    style={styleInputEmailFormPrincipal}
                                                    email={userEmail}
                                                    onGetValueEmail={getValueEmailFormPrincipal} 
                                                    verify={submitEmailFormPrincipal} 
                                                    onSubmitValueEmail={submitValueEmailFormPrincipal} 
                                                    close={false}
                                                    onGetEnter={handleEnterEmail}
                                                />
                                                <Typography 
                                                    variant="caption"
                                                    display="block"
                                                    gutterBottom
                                                    style={{
                                                        width: '100%',
                                                        marginTop: 10,
                                                    }}
                                                >
                                                    Ingresá una contraseña. Recordá que debe tener al menos 8 carateres, un número y una mayúscula.
                                                </Typography>
                                                <InputPassword 
                                                    onGetValuePassword={getValuePasswordFormRegistrate1} 
                                                    onSubmitValuePassword={submitValuePasswordFormRegistrate1} 
                                                    onGetEnter={handleEnterEmail}
                                                    password=''
                                                    verify={submitPasswordFormRegistrate1} 
                                                    style={styleInputPasswordFormRegistrate1}
                                                    close={false}
                                                />
                                                <Typography 
                                                    variant="caption"
                                                    display="block"
                                                    gutterBottom
                                                    style={{
                                                        width: '100%',
                                                        marginTop: 10,
                                                    }}
                                                >
                                                    Repetí la contraseña que ingresaste anteriormente.
                                                </Typography>
                                                <InputPassword 
                                                    onGetValuePassword={getValuePasswordFormRegistrate2} 
                                                    onSubmitValuePassword={submitValuePasswordFormRegistrate2} 
                                                    onGetEnter={handleEnterEmail}
                                                    password=''
                                                    verify={submitPasswordFormRegistrate2} 
                                                    style={styleInputPasswordFormRegistrate2}
                                                    close={false}
                                                />
                                            </>
                                            :
                                             null
                                            }
                                            {!loadingCreated && passwordProvider ?
                                            <>
                                                <Button 
                                                    variant='outlined'
                                                    className='button__log__continuar'
                                                    onClick={handleClickActualizarPassword}
                                                    style={{
                                                        marginBottom: 10,
                                                    }}
                                                >
                                                Actualizar
                                                </Button>
                                            </> 
                                            :
                                            null
                                            }
                                            <Divider/>
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
                                        <Divider/>
                                            {!loadingCreated ?
                                            <Stack
                                                direction='column'
                                                style={{
                                                    marginTop: '10px',
                                                    marginBottom: '10px'
                                                }}
                                            >
                                            <CustomizedSwitch
                                                label='Número telefónico'
                                                strong={true}
                                                checked={phoneProvider}
                                                onGetChange={e=>{
                                                    emitCustomEvent('openLoadingPage', true);
                                                    if(e){
                                                        handleVincularPhone();
                                                    }else{
                                                        handleDesvincularPhone();
                                                    }
                                                }}
                                            />
                                            {(providers.length === 1) && (phoneProvider) ? 
                                            <Chip size='small' color='info' label="único proveedor" sx={{fontSize:'11px', maxWidth: '100px'}}/>
                                            :null}
                                            </Stack>
                                            :
                                            <Skeleton variant="text" width="100%"/>
                                            }
                                            <Divider/>
                                            {!loadingCreated ? 
                                            <>
                                            <InputCountrySelectPhone 
                                                style={styleSelectCountryPhoneFormPrincipal} 
                                                onGetValuePhone={getValuePhoneCountrySelectPhoneFormPrincipal} 
                                                verify={submitCountrySelectPhoneFormPrincipal} 
                                                onSubmitValuePhone={submitValuePhoneFormPicnipal} 
                                                onGetEnter={handleEnter}
                                                country={details.user[0].country_code}
                                                disabled={false}
                                                phone={phoneNumber}
                                                code={countryPhone}
                                                close={cerrarProbar}
                                            />
                                            <Typography 
                                                variant="caption"
                                                display="block"
                                                gutterBottom
                                                style={{
                                                    width: '100%',
                                                    marginTop: 10,
                                                }}
                                            >
                                                Vamos a enviarte un mensaje para confirmar el número. Se aplican tarifas estándar para mensajes y uso de datos.
                                            </Typography>
                                            </>
                                            :
                                             null
                                            }
                                            <div align='center' id="recaptcha-container4" className='recaptchaClass'></div>
                                            {!loadingCreated && phoneProvider ? 
                                            <Button 
                                                variant='outlined'
                                                className={classNameBtnContinuar}
                                                onClick={handleClickContinuar}
                                                style={{
                                                    marginBottom: 10,
                                                }}
                                            >
                                            {txtBtnContinuar}
                                            </Button>
                                            :
                                            null
                                            }
                                            <Divider/>
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
            {openFormVerificaCodigoPhone ?
                <FormVerificaCodigoPhoneLink
                    phoneNumber={valueInputPhoneFormPrincipal}
                    code={countryCode}
                    confirmationResult={confirmationResult}
                    onGetReturn={handleReturnFormVerificaCodigoPhone}
                    onGetLinked={handleLinkedPhone}
                    actualizar={actualizarPhone}
                    open={openFormVerificaCodigoPhone}
                />
            :null}
            {openFormReautenticaConPassword ?
                <FormReautenticaConPassword
                    email={userEmail}
                    onGetClose={handleCloseReautenticaConPassword}
                    onGetReturn={handleCloseReautenticaConPassword}
                    onGetRecoveryPass={handleRecoveryPassReautenticaConPassword}
                    onGetUpdateProfile={handleCredentialOKPassword}
                    open={openFormReautenticaConPassword}
                    details={details}
                />
            :null}
            {openFormReautenticaConPasswordDesvincular ?
                <FormReautenticaConPassword
                    email={userEmail}
                    onGetClose={handleCloseReautenticaConPasswordDesvincular}
                    onGetReturn={handleCloseReautenticaConPasswordDesvincular}
                    onGetRecoveryPass={handleRecoveryPassReautenticaConPasswordDesvincular}
                    onGetUpdateProfile={handleCredentialOKPasswordDesvincular}
                    open={openFormReautenticaConPasswordDesvincular}
                    details={details}
                />
            :null}
            {openFormRecoveryPassword ?
                <FormRecoveryPassword
                    onGetClose={handleCloseFormRecoveryPassword}
                    onGetReturn={handleReturnFormRecoveryPassword}
                    email={userEmail}
                    open={openFormRecoveryPassword}
                />
            :null}
            {openFormRecoveryPasswordDesvincular ?
                <FormRecoveryPassword
                    onGetClose={handleCloseFormRecoveryPasswordDesvincular}
                    onGetReturn={handleReturnFormRecoveryPasswordDesvincular}
                    email={userEmail}
                    open={openFormRecoveryPasswordDesvincular}
                />
            :null}
            {openFormReautenticaConGoogle ?
                <FormReautenticaConGoogle
                    onGetReturn={handleCloseReautenticaConGoogle}
                    onGetUpdateProfile={handleCredentialOKGoogle}
                    onGetError={handleErrorReautenticaConGoogle}
                    onGetClick={handleClickReautenticaConGoogle}
                    details={details}
                    open={openFormReautenticaConGoogle}
                />
            :null}
            {openFormReautenticaConFacebook ?
                <FormReautenticaConFacebook
                    onGetReturn={handleCloseReautenticaConFacebook}
                    onGetUpdateProfile={handleCredentialOKFacebook}
                    onGetError={handleErrorReautenticaConFacebook}
                    onGetClick={handleClickReautenticaConFacebook}
                    details={details}
                    open={openFormReautenticaConFacebook}
                />
            :null}
            {openFormReautenticaConPhone ?
                <FormReautenticaConPhone
                    onGetReturn={handleCloseReautenticaConPhone}
                    onGetReautenticatedPhone={handleCredentialOKPassword}
                    phoneNumber={phoneNumber}
                    countryPhone={countryPhone}
                    details={details}
                    open={openFormReautenticaConPhone}
                />
            :null}
        </div>
    )
}

export default LoginAndSecurity
