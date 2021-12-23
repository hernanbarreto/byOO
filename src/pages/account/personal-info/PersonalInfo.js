import React, { useEffect, useState, useCallback } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import personalInfo from  '../../../images/svg/undraw_personal_info_0okl.svg';
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
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import CakeIcon from '@mui/icons-material/Cake';
import WcIcon from '@mui/icons-material/Wc';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import '../../login/Login.css';
import { Button } from '@material-ui/core';
import Skeleton from '@mui/material/Skeleton';
import { logout } from '../../../services/firebase';
import { emitCustomEvent } from 'react-custom-events';
import { useInitPage } from '../../useInitPage';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import InputEmail from '../../login/InputEmail';
import InputName from '../../login/InputName';
import { getFirestore,
    arrayRemove,
    arrayUnion, 
    doc, 
    getDoc,
    updateDoc,
        } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAuth, updateProfile, updateEmail, fetchSignInMethodsForEmail,sendEmailVerification,RecaptchaVerifier,signInWithPhoneNumber } from "firebase/auth";
import FormReautenticaConPassword from '../login-and-security/FormReautenticaConPassword';
import FormReautenticaConGoogle from '../login-and-security/FormReautenticaConGoogle';
import FormReautenticaConFacebook from '../login-and-security/FormReautenticaConFacebook';
import FormReautenticaConPhone from '../login-and-security/FormReautenticaConPhone';
import FormRecoveryPassword from '../../login/FormRecoveryPassword';
import InputAge from '../../login/InputAge';
import InputSex from './InputSex';
import InputCountrySelectPhone from '../../login/InputCountrySelectPhone';
import FormVerificaCodigoPhoneLink from '../../login/FormVerificaCodigoPhoneLink';
import FormPoliticaIdentidad from './FormPoliticaIdentidad';
import LockIcon from '@mui/icons-material/Lock';
import DniFront from '../../../images/svg/dni_fron.svg';
import DniBack from '../../../images/svg/dni_back.svg';

const functions = getFunctions();
const getUser = httpsCallable(functions, 'getUser');        
const getUserByEmail = httpsCallable(functions, 'getUserByEmail');
const updateUser = httpsCallable(functions, 'updateUser');
const getUserByPhoneNumber = httpsCallable(functions, 'getUserByPhoneNumber');

const database = getFirestore();

var recaptchaVerifier;
var antTokenPhone;

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '150px',
}); 

function PersonalInfo(details) {
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

    const [openFormReautenticaConPassword, setOpenFormReautenticaConPassword] = useState(false);
    const [openFormReautenticaConGoogle, setOpenFormReautenticaConGoogle] = useState(false);
    const [openFormReautenticaConFacebook, setOpenFormReautenticaConFacebook] = useState(false);
    const [openFormReautenticaConPhone, setOpenFormReautenticaConPhone] = useState(false);
    const [openFormRecoveryPassword, setOpenFormRecoveryPassword] = useState(false);

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
            fontSize: '14px',
            cursor: 'pointer'
        }} 
        >
            Cuenta
        </Link>,
        <Typography color="text.primary" key={2}>
            Datos personales
        </Typography>,
    ];    

    const [loadingCreated, setLoadingCreated] = useState(true);
    const [valueName, setValueName] = useState('');
    const [valueLastName, setValueLastName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [countryPhone, setCountryPhone] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [valueAge, setValueAge] = useState('');
    const [valueSex, setValueSex] = useState(null);
    const [accountVerified, setAccountVerified] = useState(false);

    const [txtBtnContinuar, setTxtBtnContinuar] = useState('Actualizar');
    const [classNameBtnContinuar, setClassNameBtnContinuar] = useState('button__log__continuar');
    const [phoneProvider, setPhoneProvider] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [openFormVerificaCodigoPhone, setOpenFormVerificaCodigoPhone] = useState(false);
    const [actualizarPhone, setActualizarPhone] = useState(false);
    const [cerrarProbar, setCerrarProbar] = useState(false);



    const handleUpdateProfile = useCallback(async () => {
        const infoUser = doc(database, "users", currentUser.uid);
        try{                                  
            const docSnap = await getDoc(infoUser);
            if (docSnap.exists()) {
                getUser(currentUser.uid)
                .then((record) => {
                    if (isMounted){
                        record.data.providerData.forEach((item) => {
                            if(item.providerId === 'phone'){
                                setPhoneProvider(true);
                                setPhoneNumber(currentUser.phoneNumber);
                            }
                        });
                        setValueName(docSnap.data().name);
                        setValueLastName(docSnap.data().lastName);
                        setUserEmail(currentUser.email);
                        setPhoneNumber(currentUser.phoneNumber);
                        setCountryPhone(docSnap.data().countryCode);
                        setValueAge(docSnap.data().age);
                        setValueSex(docSnap.data().sex);
                        setAccountVerified(docSnap.data().accountVerified);
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
            setValueName('');
            setValueLastName('');
            setUserEmail('');
            setCountryPhone(null);
            setPhoneNumber(null);
            setValueAge('');
            setValueSex(null);
            setAccountVerified(false);
            setCountryPhone(null);
            setValueInputPhone('');
            setCountryCode(null);
            setPhoneNumber(null);
            setCerrarProbar(false);
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

    /*variables del componente InputName*/
    const styleInputName = { marginTop: "20px" };
    const [submitName, setSubmitName] = useState(false);
    const [variableEstadoCargadoNewValueName, setVariableEstadoCargadoNewValueName] = useState(false);
    const submitValueName = (value) => {
        if (isMounted){
            setSubmitName(value);
        }
    }
    const getValueName = (name) => {
        if (isMounted){
            setValueName(name.split('/')[0]);
            setValueLastName(name.split('/')[1]);
            setVariableEstadoCargadoNewValueName(true);
        }
    }
    /*fin variables del componente InputName*/

    const handleEnterName = () => {
        if (isMounted){
            setSubmitName(true);
        }
    }

    const handleClickActualizarName = () => {
        handleEnterName();
    }

    /*atencion del valor ingresado del componente InputPassword del form Registrate*/
    useEffect(() => {
        async function fetchData(){
            emitCustomEvent('openLoadingPage', true);
            const infoUser = doc(database, "users", currentUser.uid);
            const docSnap = await getDoc(infoUser);
            if (docSnap.exists()) {
                if ((docSnap.data().name !== valueName) || (docSnap.data().lastName !== valueLastName)){
                    await updateDoc(infoUser, {
                        name: valueName,
                        lastName: valueLastName
                    })
                    .then(()=>{
                        const auth = getAuth();
                        updateProfile(auth.currentUser, {
                        displayName: valueName + String(' ') + valueLastName
                        }).then(() => {
                            emitCustomEvent('openLoadingPage', false);
                            if (isMounted){
                                setMsg('Se actualizó correctamente tu nombre y apellido');
                                setSeverityInfo('success');
                                setOpenMsg(true);
                                clearStates();
                                handleUpdateProfile();
                            }            
                        }).catch((error) => {
                            emitCustomEvent('openLoadingPage', false);
                            if (isMounted){
                                setMsg('Ha ocurrido un error al actualizar tu nombre y apellido');
                                setSeverityInfo('error');
                                setOpenMsg(true); 
                                clearStates();
                                handleUpdateProfile();
                            }            
                        });
                    })
                    .catch(()=>{
                        emitCustomEvent('openLoadingPage', false);
                        if (isMounted){
                            setMsg('Ha ocurrido un error al actualizar tu nombre y apellido');
                            setSeverityInfo('error');
                            setOpenMsg(true); 
                            clearStates();
                            handleUpdateProfile();
                        }            
                    });
                }else{
                    emitCustomEvent('openLoadingPage', false);
                    if (isMounted){
                        setMsg('El nombre y apellido que estas intentando actualizar son los mismos que tenes confirgurados actualmente.');
                        setSeverityInfo('info');
                        setOpenMsg(true);
                    } 
                }
            }else{
                emitCustomEvent('openLoadingPage', false);
                if (isMounted){
                    setMsg('Ha ocurrido un error al intentar acceder a tu información');
                    setSeverityInfo('error');
                    setOpenMsg(true); 
                    clearStates();
                    handleUpdateProfile();
                }            
            }
        }

        if (variableEstadoCargadoNewValueName){
            if (valueName !== ''){
                fetchData();
            }
            setVariableEstadoCargadoNewValueName(false);       
        }         

    },[currentUser, isMounted, valueName, valueLastName, variableEstadoCargadoNewValueName, clearStates, handleUpdateProfile]);
    /*fin atencion del valor ingresado del componente InputPassword del form Registrate*/   


    const handleEnterEmail = () => {
        if (isMounted){
            setSubmitEmail(true);
        }
    }

    /*variables del componente InputEmail Form Principal*/
    const styleInputEmail = { marginTop: "10px" };
    const [submitEmail, setSubmitEmail] = useState(false);
    const [variableEstadoCargadoNewValueEmail, setVariableEstadoCargadoNewValueEmail] = useState(false);
    const submitValueEmail = (value) => {
        if (isMounted){
            setSubmitEmail(value);
        }
    }
    const getValueEmail = (email) => {
        if (isMounted){
            setUserEmail(email);
            setVariableEstadoCargadoNewValueEmail(true);
        }
    }
    /*fin variables del componente InputEmail Form Principal*/

    /*atencion del valor ingresado del componente Input Email del form principal*/
    useEffect(() => {    
        if (variableEstadoCargadoNewValueEmail){
            if ((userEmail !== '')&&(userEmail !== null)) {
                emitCustomEvent('openLoadingPage', true);
                const auth = getAuth();
                fetchSignInMethodsForEmail(auth, userEmail)
                .then(providers => {
                    if (providers.length === 0){
                        getUserByEmail(userEmail)
                        .then((result)=>{
                            //el mail ya existe y esta asociado a un usuario
                            //me fijo si es el mismo
                            if (result.data.uid === auth.currentUser.uid){
                                //es el mismo usuario
                                console.log('por aca');
                                emitCustomEvent('openLoadingPage', false);    
                                if (isMounted){
                                    setMsg('La dirección de correo ' + String(userEmail) + ' es tu dirección actual.');
                                    setSeverityInfo('info');
                                    setOpenMsg(true);
                                } 
                            }else{
                                //no es el mismo usuario
                                console.log('por aca');
                                emitCustomEvent('openLoadingPage', false);
                                if (isMounted){
                                    setMsg('No podemos asociar el correo ' + userEmail + ' porque ya se encuentra asociado a otra cuenta.');
                                    setSeverityInfo('error');
                                    setOpenMsg(true); 
                                    clearStates();
                                    handleUpdateProfile();
                                }            
                            }
                        })
                        .catch((error)=>{
                        //el mail no esta asociado a ninguna cuenta
//                            const antToken = auth.currentUser.accessToken;
                            const antToken = auth.currentUser.stsTokenManager.refreshToken;
                            updateEmail(auth.currentUser, userEmail)
                            .then(async()=>{
//                                const newToken = auth.currentUser.accessToken;
                                const newToken = auth.currentUser.stsTokenManager.refreshToken;
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
                                            filtered[0].id = newToken;
                                            await updateDoc(infoUser, {sessions: arrayUnion(filtered[0]) })
                                            .then(()=>{
                                                updateUser([currentUser.uid, { emailVerified: false,}])
                                                .then((user) => {
                                                    sendEmailVerification(auth.currentUser)
                                                    .then(() => {
                                                        emitCustomEvent('openLoadingPage', false);
                                                        if (isMounted){
                                                            clearStates();
                                                            handleUpdateProfile();                    
                                                            setMsg('Se han actualizado los datos de tu cuenta. Ingresa a ' + auth.currentUser.email + ' para que verifiques tu cuenta.');
                                                            setSeverityInfo('success');
                                                            setOpenMsg(true);
                                                        }        
                                                    })
                                                    .catch((error)=>{
                                                        emitCustomEvent('openLoadingPage', false);
                                                        if (isMounted){
                                                            clearStates();
                                                            handleUpdateProfile();                    
                                                            setMsg('Se han actualizado los datos de tu cuenta, aunque no hemos podido enviar un correo de verificación a ' + auth.currentUser.email);
                                                            setSeverityInfo('error');
                                                            setOpenMsg(true);
                                                        }        
                                                    });
                                                })
                                                .catch((error) => {
                                                    emitCustomEvent('openLoadingPage', false);
                                                    if (isMounted){
                                                        clearStates();
                                                        handleUpdateProfile();                    
                                                        setMsg('Ha ocurrido un error al intentar actualizar los datos de tu cuenta.');
                                                        setSeverityInfo('error');
                                                        setOpenMsg(true);
                                                    }        
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
                            })
                            .catch((error)=>{
                                if (error.code === 'auth/requires-recent-login'){
                                    emitCustomEvent('openLoadingPage', false);
                                    let passwordProvider = false;
                                    let googleProvider = false;
                                    let facebookProvider = false;
                                    let phoneProvider = false;
                                    currentUser.providerData.forEach((item)=>{
                                        if(item.providerId === 'google.com'){
                                            googleProvider = true;
                                        }
                                        if(item.providerId === 'facebook.com'){
                                            facebookProvider = true;
                                        }
                                        if(item.providerId === 'phone'){
                                            phoneProvider = true;
                                        }
                                        if(item.providerId === 'password'){
                                            passwordProvider = true;
                                        }
                                    });
                                    if (passwordProvider){
                                        if (isMounted){
                                            setOpenFormReautenticaConPassword(true);
                                        }
                                    }else{
                                        if (googleProvider){
                                            if (isMounted){
                                                setOpenFormReautenticaConGoogle(true);
                                            }
                                        }else{
                                            if (facebookProvider){
                                                if (isMounted){
                                                    setOpenFormReautenticaConFacebook(true);
                                                }
                                            }else{
                                                if (phoneProvider){
                                                    if (isMounted){
                                                        setOpenFormReautenticaConPhone(true);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }else{
                                    console.log('por aca')
                                    emitCustomEvent('openLoadingPage', false);
                                    if (isMounted){
                                        setMsg('Ocurrió un error al intentar actualizar el correo de tu cuenta.');
                                        setSeverityInfo('error');
                                        setOpenMsg(true); 
                                        clearStates();
                                        handleUpdateProfile();
                                    }    
                                }
                            }); 
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
                            if (auth.currentUser.email === userEmail){
                                emitCustomEvent('openLoadingPage', false);
                                if (isMounted){    
                                    setMsg('La dirección de correo ' + String(userEmail) + ' es tu dirección actual.');
                                    setSeverityInfo('info');
                                    setOpenMsg(true); 
                                }
                            }else{
//                                const antToken = auth.currentUser.accessToken;
                                const antToken = auth.currentUser.stsTokenManager.refreshToken;
                                updateEmail(auth.currentUser, userEmail)
                                .then(async()=>{
//                                    const newToken = auth.currentUser.accessToken;
                                    const newToken = auth.currentUser.stsTokenManager.refreshToken;
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
                                            filtered[0].id = newToken;
                                            await updateDoc(infoUser, {sessions: arrayUnion(filtered[0]) })
                                                .then(()=>{
                                                    updateUser([currentUser.uid, { emailVerified: false,}])
                                                    .then((user) => {
                                                        sendEmailVerification(auth.currentUser)
                                                        .then(() => {
                                                            emitCustomEvent('openLoadingPage', false);
                                                            if (isMounted){
                                                                clearStates();
                                                                handleUpdateProfile();                    
                                                                setMsg('Se han actualizado los datos de tu cuenta. Ingresa a ' + auth.currentUser.email + ' para que verifiques tu cuenta.');
                                                                setSeverityInfo('success');
                                                                setOpenMsg(true);
                                                            }        
                                                        })
                                                        .catch((error)=>{
                                                            emitCustomEvent('openLoadingPage', false);
                                                            if (isMounted){
                                                                clearStates();
                                                                handleUpdateProfile();                    
                                                                setMsg('Se han actualizado los datos de tu cuenta, aunque no hemos podido enviar un correo de verificación a ' + auth.currentUser.email);
                                                                setSeverityInfo('error');
                                                                setOpenMsg(true);
                                                            }        
                                                        });
                                                    })
                                                    .catch((error) => {
                                                        emitCustomEvent('openLoadingPage', false);
                                                        if (isMounted){
                                                            clearStates();
                                                            handleUpdateProfile();                    
                                                            setMsg('Ha ocurrido un error al intentar actualizar los datos de tu cuenta.');
                                                            setSeverityInfo('error');
                                                            setOpenMsg(true);
                                                        }        
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
                                })
                                .catch((error)=>{
                                    if (error.code === 'auth/requires-recent-login'){
                                        emitCustomEvent('openLoadingPage', false);
                                        let passwordProvider = false;
                                        let googleProvider = false;
                                        let facebookProvider = false;
                                        let phoneProvider = false;
                                        currentUser.providerData.forEach((item)=>{
                                            if(item.providerId === 'google.com'){
                                                googleProvider = true;
                                            }
                                            if(item.providerId === 'facebook.com'){
                                                facebookProvider = true;
                                            }
                                            if(item.providerId === 'phone'){
                                                phoneProvider = true;
                                            }
                                            if(item.providerId === 'password'){
                                                passwordProvider = true;
                                            }
                                        });
                                        if (passwordProvider){
                                            if (isMounted){
                                                setOpenFormReautenticaConPassword(true);
                                            }
                                        }else{
                                            if (googleProvider){
                                                if (isMounted){
                                                    setOpenFormReautenticaConGoogle(true);
                                                }
                                            }else{
                                                if (facebookProvider){
                                                    if (isMounted){
                                                        setOpenFormReautenticaConFacebook(true);
                                                    }
                                                }else{
                                                    if (phoneProvider){
                                                        if (isMounted){
                                                            setOpenFormReautenticaConPhone(true);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }else{
                                        console.log('por aca')
                                        emitCustomEvent('openLoadingPage', false);
                                        if (isMounted){
                                            setMsg('Ocurrió un error al intentar actualizar el correo de tu cuenta.');
                                            setSeverityInfo('error');
                                            setOpenMsg(true); 
                                            clearStates();
                                            handleUpdateProfile();
                                        }    
                                    }
                                });                                
                            }
                        }else{
                            //el mail no es el del usuario actual
                            console.log('por aca')
                            emitCustomEvent('openLoadingPage', false);
                            if (isMounted){
                                setMsg('No podemos asociar el correo ' + userEmail + ' porque ya se encuentra asociado a otra cuenta.');
                                setSeverityInfo('error');
                                setOpenMsg(true); 
                                clearStates();
                                handleUpdateProfile();
                            }            
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                    emitCustomEvent('openLoadingPage', false);
                    if (isMounted){
                        setMsg('Ha ocurrido un error al intentar asociar el correo ' + userEmail + ' a tu cuenta.');
                        setSeverityInfo('error');
                        setOpenMsg(true);
                        clearStates();
                        handleUpdateProfile();
                    }    
                });                
            }
            setVariableEstadoCargadoNewValueEmail(false);       
        }       
    },[userEmail, isMounted, variableEstadoCargadoNewValueEmail, clearStates, currentUser, handleUpdateProfile, details]);
    /*fin atencion del valor ingresado del componente Input Email del form principal*/    

    const handleCloseReautenticaConPassword = () => {
        if (isMounted){
            setOpenFormReautenticaConPassword(false);
            clearStates();
            handleUpdateProfile();
        }                    
    }

    const handleRecoveryPassReautenticaConPassword = () => {
        if (isMounted){
            setOpenFormReautenticaConPassword(false);
            setOpenFormRecoveryPassword(true);
        }
    }

    const handleCredentialOKPassword = () => {
        emitCustomEvent('openLoadingPage', true);
        if (isMounted){
            setOpenFormReautenticaConPassword(false);
            setOpenFormReautenticaConGoogle(false);
            setOpenFormReautenticaConFacebook(false);
            setOpenFormReautenticaConPhone(false);
        }
        const auth = getAuth();
//        const antToken = auth.currentUser.accessToken;
        const antToken = auth.currentUser.stsTokenManager.refreshToken;
        updateEmail(auth.currentUser, userEmail)
        .then(async()=>{
//            const newToken = auth.currentUser.accessToken;
            const newToken = auth.currentUser.stsTokenManager.refreshToken;
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
                    filtered[0].id = newToken;
                    await updateDoc(infoUser, {sessions: arrayUnion(filtered[0]) })
                        .then(()=>{
                            updateUser([currentUser.uid, { emailVerified: false,}])
                            .then((user) => {
                                sendEmailVerification(auth.currentUser)
                                .then(() => {
                                    emitCustomEvent('openLoadingPage', false);
                                    if (isMounted){
                                        clearStates();
                                        handleUpdateProfile();                    
                                        setMsg('Se han actualizado los datos de tu cuenta. Ingresa a ' + auth.currentUser.email + ' para que verifiques tu cuenta.');
                                        setSeverityInfo('success');
                                        setOpenMsg(true);
                                    }        
                                })
                                .catch((error)=>{
                                    emitCustomEvent('openLoadingPage', false);
                                    if (isMounted){
                                        clearStates();
                                        handleUpdateProfile();                    
                                        setMsg('Se han actualizado los datos de tu cuenta, aunque no hemos podido enviar un correo de verificación a ' + auth.currentUser.email);
                                        setSeverityInfo('error');
                                        setOpenMsg(true);
                                    }        
                                });
                            })
                            .catch((error) => {
                                emitCustomEvent('openLoadingPage', false);
                                if (isMounted){
                                    clearStates();
                                    handleUpdateProfile();                    
                                    setMsg('Ha ocurrido un error al intentar actualizar los datos de tu cuenta.');
                                    setSeverityInfo('error');
                                    setOpenMsg(true);
                                }        
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
        })
        .catch((error)=>{
            console.log(error);
            emitCustomEvent('openLoadingPage', false);
            if (isMounted){
                setMsg('Ocurrió un error al intentar actualizar el correo de tu cuenta.');
                setSeverityInfo('error');
                setOpenMsg(true); 
                clearStates();
                handleUpdateProfile();
            }    
        });  
    }

    const handleCloseFormRecoveryPassword = () => {
        if (isMounted){
            setOpenFormRecoveryPassword(false);
        }
    }

    const handleReturnFormRecoveryPassword = () =>{
        if (isMounted){
            setOpenFormRecoveryPassword(false);
            setOpenFormReautenticaConPassword(true);
        }
    }

    const handleCloseReautenticaConGoogle = () => {
        if (isMounted){
            setOpenFormReautenticaConGoogle(false);
            clearStates();
            handleUpdateProfile();
        }                    
    }

    const handleCredentialOKGoogle = () => {
        if (isMounted){
            handleCredentialOKPassword();
        }
    }

    const handleErrorReautenticaConGoogle = () => {
        if (isMounted){
            setOpenFormReautenticaConGoogle(false);
        }
        emitCustomEvent('openLoadingPage', false);
    }
       
    const handleClickReautenticaConGoogle = () => {
        emitCustomEvent('openLoadingPage', true);
    }

    const handleCloseReautenticaConFacebook = () => {
        if (isMounted){
            setOpenFormReautenticaConFacebook(false);
            clearStates();
            handleUpdateProfile();
        }                    
    }
      
    const handleCredentialOKFacebook = () => {
        handleCredentialOKPassword();
    }
    
    const handleErrorReautenticaConFacebook = () => {
        if (isMounted){
            setOpenFormReautenticaConFacebook(false);
        }
        emitCustomEvent('openLoadingPage', false);
    }    

    const handleClickReautenticaConFacebook = () => {
        emitCustomEvent('openLoadingPage', true);
    }

    const handleCloseReautenticaConPhone = () => {
        if (isMounted){
            setOpenFormReautenticaConPhone(false);
            clearStates();
            handleUpdateProfile();    
        }                
    }

    /*variables del componente InputAge Form Registrate*/
    const styleInputAge = { marginTop: "20px" };
    const [submitAge, setSubmitAge] = useState(false);
    const [variableEstadoCargadoNewValueAge, setVariableEstadoCargadoNewValueAge] = useState(false);
    const [valueInputAge, setValueInputAge] = useState('');
    const submitValueAge = (value) => {
        if (isMounted)
        setSubmitAge(value);
    }
    const getValueAge = (email) => {
        if (isMounted){
        setValueInputAge(email);
        setVariableEstadoCargadoNewValueAge(true);
        }
    }
    /*fin variables del componente InputName Form Registrate*/

    const handleEnterAge = async () => {
        if (isMounted){
        setSubmitAge(true);
        }
    }

    /*atencion del valor ingresado del componente InputPassword del form Registrate*/
    useEffect(() => {
        async function fetchData(){
            emitCustomEvent('openLoadingPage', true);
            const infoUser = doc(database, "users", currentUser.uid);
            const docSnap = await getDoc(infoUser);
            if (docSnap.exists()) {
                if (docSnap.data().age !== valueInputAge){
                    await updateDoc(infoUser, {
                        age: valueInputAge,
                    })
                    .then(()=>{
                        emitCustomEvent('openLoadingPage', false);
                        if (isMounted){
                            setMsg('Se actualizó correctamente tu fecha de nacimiento');
                            setSeverityInfo('success');
                            setOpenMsg(true);
                            clearStates();
                            handleUpdateProfile();
                        }            
                    })
                    .catch(()=>{
                        emitCustomEvent('openLoadingPage', false);
                        if (isMounted){
                            setMsg('Ha ocurrido un error al actualizar tu fecha de nacimiento');
                            setSeverityInfo('error');
                            setOpenMsg(true); 
                            clearStates();
                            handleUpdateProfile();
                        }            
                    });
                }else{
                    emitCustomEvent('openLoadingPage', false);
                    if (isMounted){
                        setMsg('La fecha de nacimiento que estas intentando actualizar es la misma que tenes configurada actualmente.');
                        setSeverityInfo('info');
                        setOpenMsg(true);
                    } 
                }
            }else{
                emitCustomEvent('openLoadingPage', false);
                if (isMounted){
                    setMsg('Ha ocurrido un error al intentar acceder a tu información');
                    setSeverityInfo('error');
                    setOpenMsg(true); 
                    clearStates();
                    handleUpdateProfile();
                }            
            }
        }

        if (variableEstadoCargadoNewValueAge){
            if (valueInputAge !== ''){
                fetchData();
            }
            if (isMounted)
                setVariableEstadoCargadoNewValueAge(false);
        }
    },[valueInputAge, variableEstadoCargadoNewValueAge, isMounted, clearStates, currentUser.uid, handleUpdateProfile]);
    /*fin atencion del valor ingresado del componente InputPassword del form Registrate*/   

    /*variables del componente InputSex*/
    const styleInputSex = { marginTop: "20px" };
    const [submitSex, setSubmitSex] = useState(false);
    const [variableEstadoCargadoNewValueSex, setVariableEstadoCargadoNewValueSex] = useState(false);
    const [valueInputSex, setValueInputSex] = useState('');

    const submitValueSex = (value) => {
        if (isMounted)
        setSubmitSex(value);
    }
    const getValueSex = (sex) => {
        if (isMounted){
        setValueInputSex(sex);
        setVariableEstadoCargadoNewValueSex(true);
        }
    }

    const handleEnterSex = async () => {
        if (isMounted){
            setSubmitSex(true);
        }
    }

    useEffect(() => {
        async function fetchData(){
            emitCustomEvent('openLoadingPage', true);
            const infoUser = doc(database, "users", currentUser.uid);
            const docSnap = await getDoc(infoUser);
            if (docSnap.exists()) {
                if (docSnap.data().sex !== valueInputSex) {
                    await updateDoc(infoUser, {
                        sex: valueInputSex,
                    })
                    .then(()=>{
                        emitCustomEvent('openLoadingPage', false);
                        if (isMounted){
                            setMsg('Se actualizó correctamente tu sexo');
                            setSeverityInfo('success');
                            setOpenMsg(true);
                            clearStates();
                            handleUpdateProfile();
                        }            
                    })
                    .catch(()=>{
                        emitCustomEvent('openLoadingPage', false);
                        if (isMounted){
                            setMsg('Ha ocurrido un error al actualizar tu sexo');
                            setSeverityInfo('error');
                            setOpenMsg(true); 
                            clearStates();
                            handleUpdateProfile();
                        }            
                    });
                }else{
                    emitCustomEvent('openLoadingPage', false);
                    if (isMounted){
                        setMsg('El sexo que estas intentando actualizar es el mismo que tenes confirgurado actualmente.');
                        setSeverityInfo('info');
                        setOpenMsg(true);
                    } 
                }
            }else{
                emitCustomEvent('openLoadingPage', false);
                if (isMounted){
                    setMsg('Ha ocurrido un error al intentar acceder a tu información');
                    setSeverityInfo('error');
                    setOpenMsg(true); 
                    clearStates();
                    handleUpdateProfile();
                }            
            }
        }

        if (variableEstadoCargadoNewValueSex){
            if (valueInputSex !== ''){
                fetchData();
            }
            if (isMounted)
                setVariableEstadoCargadoNewValueSex(false);
        }
    },[valueInputSex, variableEstadoCargadoNewValueSex, isMounted, clearStates, currentUser.uid, handleUpdateProfile]);

    /*variables del componente CountrySelectPhone*/
    const styleSelectCountryPhone = { marginTop: "10px", marginBottom: '10px' };
    const [valueInputPhone, setValueInputPhone] = useState('');
    const [submitCountrySelectPhone, setSubmitCountrySelectPhone] = useState(false);
    const [variableEstadoCargadoNewValuePhone, setVariableEstadoCargadoNewValuePhone] = useState(false);
    const [countryCode, setCountryCode] = useState(null);
    const submitValuePhone = (value) => {
        if (isMounted){
            setSubmitCountrySelectPhone(value);
        }
    }
    const getValuePhoneCountrySelectPhone = (phone) => {
        if (isMounted){
            setValueInputPhone(phone[0]);
            setCountryCode(phone[1].code);
            setVariableEstadoCargadoNewValuePhone(true);
        }
    }
    /*fin variables de componente CountrySelectPhone*/

    const handleEnterPhone = () => {
        if (txtBtnContinuar === 'Actualizar'){
            if (phoneProvider){
                if (isMounted){
                    setCerrarProbar(true);
                    setActualizarPhone(true);
                }
            }else{
                if (isMounted){
                    setActualizarPhone(false);
                }
            }
            if (isMounted){
                setSubmitCountrySelectPhone(true);
            }
        }else{
            if (isMounted){
                setCerrarProbar(false);
            }
            if (recaptchaVerifier !== undefined)
                if (!recaptchaVerifier.destroyed) 
                    recaptchaVerifier.clear();
            if (isMounted){
                clearStates();
                handleUpdateProfile();                                
                setTxtBtnContinuar('Actualizar');
                setClassNameBtnContinuar('button__log__continuar');
            }
        }
    }

    const handleClickContinuar = () => {
        if (txtBtnContinuar === 'Actualizar'){
            if (phoneProvider){
                if (isMounted){
                    setCerrarProbar(true);
                    setActualizarPhone(true);
                }
            }else{
                if (isMounted){
                    setActualizarPhone(false);
                }
            }
            if (isMounted){
                setSubmitCountrySelectPhone(true);
            }
        }else{
            if (isMounted){
                setCerrarProbar(false);
            }
            if (recaptchaVerifier !== undefined)
                if (!recaptchaVerifier.destroyed) 
                    recaptchaVerifier.clear();
            if (isMounted){
                clearStates();
                handleUpdateProfile();                                
                setTxtBtnContinuar('Actualizar');
                setClassNameBtnContinuar('button__log__continuar');
            }
        }
    }

    /*atencion del valor ingresado del componente CountrySelectPhone*/
    useEffect(() => {
        if (variableEstadoCargadoNewValuePhone){
            if ((valueInputPhone !== '')) {
                emitCustomEvent('openLoadingPage', true);
                getUserByPhoneNumber(valueInputPhone)  
                .then((userRecord) => {
                    emitCustomEvent('openLoadingPage', false);
                    if (recaptchaVerifier !== undefined)
                        if (!recaptchaVerifier.destroyed) 
                            recaptchaVerifier.clear();
                    if (isMounted){
                        clearStates();
                        handleUpdateProfile();                                                
                        setTxtBtnContinuar('Actualizar');
                        setClassNameBtnContinuar('button__log__continuar');      
                        if (userRecord.data.uid === currentUser.uid){
                            //el usuario existe
                            setMsg('El número ' + String(valueInputPhone) + ' ya se encuentra asociado a tu cuenta.');
                        }else{
                            //el usuario existe
                            setMsg('El número ' + String(valueInputPhone) + ' ya se encuentra asociado a otra cuenta.');
                        }
                        setSeverityInfo('info');
                        setOpenMsg(true);
                    }
                })
                .catch((error) => {
                    const auth = getAuth();
                    auth.languageCode = details.user[0].languages.split(',')[0];
                    recaptchaVerifier = new RecaptchaVerifier('recaptcha-container20', {
                        type: 'image', // 'audio'
                        size: 'normal', // 'normal, invisible' or 'compact'
                        badge: 'inline' //' bottomright' or 'inline' applies to invisible.                    
                    }, auth);                    
//                    antTokenPhone = auth.currentUser.accessToken;
                    antTokenPhone = auth.currentUser.stsTokenManager.refreshToken;
                    if (isMounted){
                        setTxtBtnContinuar('Cancelar');
                        setClassNameBtnContinuar('button__log__BW');
                    }
                    emitCustomEvent('openLoadingPage', false);                    
                    signInWithPhoneNumber(auth, valueInputPhone, recaptchaVerifier)
                    .then((result) => {
                        emitCustomEvent('openLoadingPage', true);
                        if (recaptchaVerifier !== undefined)
                            if (!recaptchaVerifier.destroyed) 
                                recaptchaVerifier.clear();
                        if (isMounted){
                            setConfirmationResult(result);
                            setOpenFormVerificaCodigoPhone(true);
                        }
                        emitCustomEvent('openLoadingPage', false);
                    }).catch((error) => {
                        // Error; SMS not sent
                        // ...
                        if (recaptchaVerifier !== undefined)
                            if (!recaptchaVerifier.destroyed) 
                                recaptchaVerifier.clear();
                        if (isMounted){                        
                            clearStates();
                            handleUpdateProfile();                                                
                            setTxtBtnContinuar('Actualizar');
                            setClassNameBtnContinuar('button__log__continuar');
                            setMsg('No pudimos enviar el SMS al número de teléfono ' + String(valueInputPhone));
                            setSeverityInfo('error');
                            setOpenMsg(true);
                        }                    
                        emitCustomEvent('openLoadingPage', false);
                    });
                });
             }else{
                emitCustomEvent('openLoadingPage', false);
                if (isMounted){
                    setMsg('No ingresaste un número de teléfono válido');
                    setSeverityInfo('error');
                    setOpenMsg(true);
                }                    
            }
            setVariableEstadoCargadoNewValuePhone(false);       
        }         
    },[details, isMounted, currentUser, valueInputPhone, variableEstadoCargadoNewValuePhone, clearStates, handleUpdateProfile]);
    /*fin atencion del valor ingresado del componente CountrySelectPhone*/

    const handleLinkedPhone = async() => {
        if (isMounted){
            setTxtBtnContinuar('Actualizar');
            setClassNameBtnContinuar('button__log__continuar');
        }
        const auth = getAuth();
//        const newToken = auth.currentUser.accessToken;
        const newToken = auth.currentUser.stsTokenManager.refreshToken;
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
                    filtered[0].id = newToken;
                    await updateDoc(infoUser, {sessions: arrayUnion(filtered[0]) })
                    .then(()=>{
                        if (isMounted){
                            setOpenFormVerificaCodigoPhone(false);
                            clearStates();
                            handleUpdateProfile();                    
                            setMsg('Ya podés ingresar a byOO con ' + String(valueInputPhone));
                            setSeverityInfo('success');
                            setOpenMsg(true);
                        }                    
                        emitCustomEvent('openLoadingPage', false);
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

    const handleReturnFormVerificaCodigoPhone = () => {
        if (isMounted){
            clearStates();
            handleUpdateProfile();                    
            setTxtBtnContinuar('Actualizar');
            setClassNameBtnContinuar('button__log__continuar');
            setOpenFormVerificaCodigoPhone(false);
        }
    }

    const [openFormPoliticaIdentidad, setOpenFormPoliticaIdentidad] = useState(false);
    const handlePoliticaIdentificación = () => {
        setOpenFormPoliticaIdentidad (true);
    }

    const handleCloseFormPoliticaIdentidad = () => {
        setOpenFormPoliticaIdentidad (false);
    }

    return (
        <div>
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
                                            marginTop: '40px',
                                            marginBottom: '20px',
                                        }}
                                    >
                                        <strong>Datos personales</strong>
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
                                            aria-controls="panel-name"
                                            id="panel-name"
                                        >
                                        <ListItemIcon>
                                            <DriveFileRenameOutlineIcon fontSize="medium" />
                                        </ListItemIcon>
                                        <Typography><strong>Nombre legal</strong></Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                        <Divider/>
                                            <Typography
                                                fontSize={{
                                                    lg: 20,
                                                    md: 20,
                                                    sm: 15,
                                                    xs: 15,
                                                }}                                                                                
                                                sx={{
                                                    marginTop: '20px',
                                                }}
                                            >
                                                <strong>Nombre legal</strong>
                                            </Typography>
                                            <Typography 
                                                variant="caption"
                                                display="block"
                                                gutterBottom
                                                style={{
                                                    width: '100%',
                                                    marginTop: 10,
                                                }}
                                            >
                                                Este es el nombre que aparece en tu identificación oficial.
                                            </Typography>
                                            {!loadingCreated?
                                            <>
                                            <InputName
                                                style={styleInputName}
                                                disabled={accountVerified}
                                                onGetValueName={getValueName} 
                                                verify={submitName} 
                                                onSubmitValueName={submitValueName} 
                                                close={loadingCreated}
                                                onGetEnter={handleEnterName}
                                                name={valueName}
                                                lastName={valueLastName}
                                            />
                                            {!accountVerified ?
                                            <Button 
                                                variant='outlined'
                                                className='button__log__continuar'
                                                onClick={handleClickActualizarName}
                                                style={{
                                                    marginBottom: 10,
                                                }}
                                            >
                                                Actualizar
                                            </Button>
                                            :null}
                                            </>
                                            :
                                            <>
                                            <Skeleton variant="text" width="100%"/>
                                            <Skeleton variant="text" width="100%"/>
                                            </>
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
                                            aria-controls="panel-name"
                                            id="panel-name"
                                        >
                                        <ListItemIcon>
                                            <WcIcon fontSize="medium" />
                                        </ListItemIcon>
                                        <Typography><strong>Sexo</strong></Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                        <Divider/>
                                            <Typography
                                                fontSize={{
                                                    lg: 20,
                                                    md: 20,
                                                    sm: 15,
                                                    xs: 15,
                                                }}                                                                                
                                                sx={{
                                                    marginTop: '20px',
                                                }}
                                            >
                                                <strong>Sexo</strong>
                                            </Typography>
                                            <Typography 
                                                variant="caption"
                                                display="block"
                                                gutterBottom
                                                style={{
                                                    width: '100%',
                                                    marginTop: 10,
                                                }}
                                            >
                                                Este es el sexo que aparece en tu identificación oficial.
                                            </Typography>
                                            {!loadingCreated?
                                            <>
                                            <InputSex
                                                style={styleInputSex}
                                                disabled={accountVerified}
                                                close={loadingCreated}
                                                sex={valueSex}
                                                verify={submitSex}
                                                onGetEnter={handleEnterSex}
                                                onGetValue={getValueSex} 
                                                onSubmitValue={submitValueSex} 

                                            />
                                            {!accountVerified ?
                                            <Button 
                                                variant='outlined'
                                                className='button__log__continuar'
                                                onClick={handleEnterSex}
                                                style={{
                                                    marginBottom: 10,
                                                }}
                                            >
                                                Actualizar
                                            </Button>
                                            :null}
                                            </>
                                            :
                                            <>
                                            <Skeleton variant="text" width="100%"/>
                                            <Skeleton variant="text" width="100%"/>
                                            </>
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
                                            aria-controls="panel-name"
                                            id="panel-name"
                                        >
                                        <ListItemIcon>
                                            <CakeIcon fontSize="medium" />
                                        </ListItemIcon>
                                        <Typography><strong>Fecha de nacimiento</strong></Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                        <Divider/>
                                            <Typography
                                                fontSize={{
                                                    lg: 20,
                                                    md: 20,
                                                    sm: 15,
                                                    xs: 15,
                                                }}                                                                                
                                                sx={{
                                                    marginTop: '20px',
                                                }}
                                            >
                                                <strong>Fecha de nacimiento</strong>
                                            </Typography>
                                            <Typography 
                                                variant="caption"
                                                display="block"
                                                gutterBottom
                                                style={{
                                                    width: '100%',
                                                    marginTop: 10,
                                                }}
                                            >
                                                Esta es la fecha de nacimiento que aparece en tu identificación oficial.
                                            </Typography>
                                            {!loadingCreated?
                                            <>
                                            <InputAge
                                                disabled={accountVerified}
                                                onGetValueAge={getValueAge} 
                                                onSubmitValueAge={submitValueAge} 
                                                onGetEnter={handleEnterAge}
                                                verify={submitAge} 
                                                style={styleInputAge}
                                                close={loadingCreated}
                                                edad={valueAge}
                                            />
                                            {!accountVerified ?
                                            <Button 
                                                variant='outlined'
                                                className='button__log__continuar'
                                                onClick={handleEnterAge}
                                                style={{
                                                    marginBottom: 10,
                                                }}
                                            >
                                                Actualizar
                                            </Button>
                                            :null}
                                            </>
                                            :
                                            <>
                                            <Skeleton variant="text" width="100%"/>
                                            <Skeleton variant="text" width="100%"/>
                                            </>
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
                                            aria-controls="panel-name"
                                            id="panel-name"
                                        >
                                        <ListItemIcon>
                                            <AlternateEmailIcon fontSize="medium" />
                                        </ListItemIcon>
                                        <Typography><strong>Dirección de correo electrónico</strong></Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                        <Divider/>
                                            <Typography
                                                fontSize={{
                                                    lg: 20,
                                                    md: 20,
                                                    sm: 15,
                                                    xs: 15,
                                                }}                                                                                
                                                sx={{
                                                    marginTop: '20px',
                                                }}
                                            >
                                                <strong>Dirección de correo electrónico</strong>
                                            </Typography>
                                            <Typography 
                                                variant="caption"
                                                display="block"
                                                gutterBottom
                                                style={{
                                                    width: '100%',
                                                    marginTop: 10,
                                                }}
                                            >
                                                Usá una dirección de correo a la que siempre tengas acceso.
                                            </Typography>
                                            {!loadingCreated?
                                            <>
                                            <InputEmail 
                                                style={styleInputEmail}
                                                email={userEmail}
                                                onGetValueEmail={getValueEmail} 
                                                verify={submitEmail} 
                                                onSubmitValueEmail={submitValueEmail} 
                                                close={loadingCreated}
                                                onGetEnter={handleEnterEmail}
                                            />
                                            <Button 
                                                variant='outlined'
                                                className='button__log__continuar'
                                                onClick={handleEnterEmail}
                                                style={{
                                                    marginBottom: 10,
                                                }}
                                            >
                                                Actualizar
                                            </Button>
                                            </>
                                            :
                                            <>
                                            <Skeleton variant="text" width="100%"/>
                                            </>
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
                                            aria-controls="panel-name"
                                            id="panel-name"
                                        >
                                        <ListItemIcon>
                                            <ContactPhoneIcon fontSize="medium" />
                                        </ListItemIcon>
                                        <Typography><strong>Número de teléfono</strong></Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                        <Divider/>
                                            <Typography
                                                fontSize={{
                                                    lg: 20,
                                                    md: 20,
                                                    sm: 15,
                                                    xs: 15,
                                                }}                                                                                
                                                sx={{
                                                    marginTop: '20px',
                                                }}
                                            >
                                                <strong>Número de teléfono</strong>
                                            </Typography>
                                            <Typography 
                                                variant="caption"
                                                display="block"
                                                gutterBottom
                                                style={{
                                                    width: '100%',
                                                    marginTop: 10,
                                                }}
                                            >
                                                Agregá un número para que byOO y los usuarios de la comunidad puedan comunicarse con vos.
                                            </Typography>
                                            <Divider/>
                                            {!loadingCreated ? 
                                            <>
                                            <InputCountrySelectPhone 
                                                style={styleSelectCountryPhone} 
                                                onGetValuePhone={getValuePhoneCountrySelectPhone} 
                                                verify={submitCountrySelectPhone} 
                                                onSubmitValuePhone={submitValuePhone} 
                                                onGetEnter={handleEnterPhone}
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
                                            <>
                                            <Skeleton variant="text" width="100%"/>
                                            <Skeleton variant="text" width="100%"/>
                                            </>
                                            }
                                            <div align='center' id="recaptcha-container20" className='recaptchaClass'></div>
                                            {!loadingCreated ? 
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
                                            <Skeleton variant="text" width="100%"/>
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
                                            aria-controls="panel-name"
                                            id="panel-name"
                                        >
                                        <ListItemIcon>
                                            <FingerprintIcon fontSize="medium" />
                                        </ListItemIcon>
                                        <Typography><strong>Identificación oficial</strong></Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                        <Divider/>
                                            <Typography
                                                fontSize={{
                                                    lg: 20,
                                                    md: 20,
                                                    sm: 15,
                                                    xs: 15,
                                                }}                                                                                
                                                sx={{
                                                    marginTop: '20px',
                                                }}
                                            >
                                                <strong>Identificación oficial</strong>
                                            </Typography>
                                            <Typography 
                                                variant="caption"
                                                display="block"
                                                gutterBottom
                                                style={{
                                                    width: '100%',
                                                    marginTop: 10,
                                                }}
                                            >
                                                Tendrás que añadir un documento de identificación oficial Este paso nos sirve para comprobar que eres quien dices ser.
                                            </Typography>
                                            <Typography 
                                                variant="caption"
                                                display="block"
                                                gutterBottom
                                                style={{
                                                    width: '100%',
                                                    marginTop: 10,
                                                }}
                                            >
                                                Comprueba que las imágenes no estén borrosas y que en la parte delantera del documento de identidad se te vea bien la cara.
                                            </Typography>
                                            <Stack
                                                direction={{ xs: 'column', sm: 'row' }}
                                                spacing={{ xs: 1, }}
                                                style={{
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginTop: '10px',
                                                }}
                                            >
                                            <Box
                                                onClick={()=>{
                                                    console.log('click');
                                                }}
                                                maxWidth='250px'
                                                minWidth='210px'
                                                sx={{
                                                    display: 'grid',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',                            
                                                    width: '100%',
                                                    height: 150,
                                                    borderRadius: '10px',
                                                    border: "1px dashed grey",
                                                    '&:hover': {
                                                        cursor: 'pointer',
                                                        
                                                    },
                                                }}
                                            >
                                                <Img src={DniFront} sx={{mt: '50px'}}/>
                                                <Typography 
                                                    variant="subtitle1"
                                                    display="block"
                                                    gutterBottom
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                >
                                                    <strong>Sube la cara delantera</strong>    
                                                </Typography>
                                            </Box>
                                            <Box
                                                onClick={()=>{
                                                    console.log('click');
                                                }}
                                                maxWidth='250px'
                                                minWidth='210px'
                                                sx={{
                                                    display: 'grid',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',                            
                                                    width: '100%',
                                                    height: 150,
                                                    borderRadius: '10px',
                                                    border: "1px dashed grey",
                                                    '&:hover': {
                                                        cursor: 'pointer',
                                                        
                                                    },
                                                }}
                                            >
                                                <Img src={DniBack} sx={{mt: '50px'}}/>
                                                <Typography 
                                                    variant="subtitle1"
                                                    display="block"
                                                    gutterBottom
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                >
                                                    <strong>Sube la cara trasera</strong>    
                                                </Typography>
                                            </Box>
                                            </Stack>
                                            <Stack direction='row'>
                                                <LockIcon color="disabled" sx={{ mt: '10px', fontSize: '15px' }}/>
                                                <Typography 
                                                    variant="caption"
                                                    display="block"
                                                    gutterBottom
                                                    style={{
                                                        width: '100%',
                                                        marginTop: 10,
                                                        marginLeft: 5,
                                                    }}
                                                >
                                                    
                                                    Nuestro objetivo es garantizar la privacidad y la seguridad de los datos que nos proporcionas.&nbsp;
                                                    <Link
                                                        component="button"
                                                        onClick={handlePoliticaIdentificación}
                                                        sx={{
                                                            textDecoration: "underline #5472AD",
                                                            color: '#5472AD !important',
                                                            fontSize: '12px',
                                                        }} 
                                                            >
                                                        <strong>Cómo funciona</strong>
                                                    </Link>
                                                </Typography>
                                            </Stack>
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
                                            aria-controls="panel-name"
                                            id="panel-name"
                                        >
                                        <ListItemIcon>
                                            <PersonPinCircleIcon fontSize="medium" />
                                        </ListItemIcon>
                                        <Typography><strong>Dirección</strong></Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                        <Divider/>
                                            <Typography
                                                fontSize={{
                                                    lg: 20,
                                                    md: 20,
                                                    sm: 15,
                                                    xs: 15,
                                                }}                                                                                
                                                sx={{
                                                    marginTop: '20px',
                                                }}
                                            >
                                                <strong>Dirección</strong>
                                            </Typography>
                                            <Typography 
                                                variant="caption"
                                                display="block"
                                                gutterBottom
                                                style={{
                                                    width: '100%',
                                                    marginTop: 10,
                                                }}
                                            >
                                                Usá una dirección fija.
                                            </Typography>
                                        <Divider/>
                                        </AccordionDetails>
                                    </Accordion>
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
                                        <Img src={personalInfo} />
                                        <Typography 
                                            fontSize={{
                                                lg: 20,
                                                md: 20,
                                                sm: 15,
                                                xs: 15,
                                            }}                                                                                
                                            sx={{marginTop: '20px'}}
                                        >
                                            <strong>¿Qué datos se pueden editar?</strong>
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
                                            No se pueden modificar los datos que byOO utiliza para verificar tu identidad. Podés modificar algunos de tus datos personales y de contacto, pero podríamos pedirte que verifiques tu identidad la próxima vez que solicites un servicio o crees un anuncio.
                                        </Typography>
                                        <Typography 
                                            fontSize={{
                                                lg: 20,
                                                md: 20,
                                                sm: 15,
                                                xs: 15,
                                            }}                                                                                
                                            sx={{marginTop: '20px'}}
                                        >
                                            <strong>¿Qué información se comparte con los demás?</strong>
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
                                            byOO solo proporciona datos de contacto a los profesionales y clientes cuando se confirma un servicio.
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
            {openFormReautenticaConPassword ?
                <FormReautenticaConPassword
                    email={currentUser.email}
                    onGetClose={handleCloseReautenticaConPassword}
                    onGetReturn={handleCloseReautenticaConPassword}
                    onGetRecoveryPass={handleRecoveryPassReautenticaConPassword}
                    onGetUpdateProfile={handleCredentialOKPassword}
                    open={openFormReautenticaConPassword}
                    details={details}
                />
            :null}
            {openFormRecoveryPassword ?
                <FormRecoveryPassword
                    onGetClose={handleCloseFormRecoveryPassword}
                    onGetReturn={handleReturnFormRecoveryPassword}
                    email={currentUser.email}
                    open={openFormRecoveryPassword}
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
            {openFormVerificaCodigoPhone ?
                <FormVerificaCodigoPhoneLink
                    phoneNumber={valueInputPhone}
                    code={countryCode}
                    confirmationResult={confirmationResult}
                    onGetReturn={handleReturnFormVerificaCodigoPhone}
                    onGetLinked={handleLinkedPhone}
                    actualizar={actualizarPhone}
                    open={openFormVerificaCodigoPhone}
                />
            :null}
            {openFormPoliticaIdentidad ?
            <FormPoliticaIdentidad
                onGetClose={handleCloseFormPoliticaIdentidad}
                open={openFormPoliticaIdentidad}
            />
            :null}
        </div>
    )
}

export default PersonalInfo