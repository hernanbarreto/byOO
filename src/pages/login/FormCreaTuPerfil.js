import React, { useState, useEffect, useCallback }from 'react';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InputCountrySelectPhone from './InputCountrySelectPhone';
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAuth, 
         signInWithPhoneNumber, 
         RecaptchaVerifier,
         fetchSignInMethodsForEmail,
         EmailAuthProvider,
         linkWithCredential,
         sendEmailVerification,
         GoogleAuthProvider,
         FacebookAuthProvider,
         onAuthStateChanged,
       } from "firebase/auth";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import FormVerificaCodigoPhoneLink from './FormVerificaCodigoPhoneLink';
import InputEmail from './InputEmail';
import InputPassword from './InputPassword';
import GoogleLogin from 'react-google-login';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useHistory } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Badge from '@mui/material/Badge';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Fab from '@mui/material/Fab';
import './Login.css';
import { getFirestore, 
         doc, 
         updateDoc,
         getDoc } from "firebase/firestore";
import { getStorage, 
         ref, 
         uploadBytesResumable, 
         getDownloadURL,
         deleteObject } from "firebase/storage";
import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';
import { emitCustomEvent } from 'react-custom-events';
import Chip from '@mui/material/Chip';

var steps = [
             'Confirmá tu número de teléfono', 
             'Vinculá un acceso mediante correo y contraseña', 
             'Vinculá un acceso mediante google', 
             'Vinculá un acceso mediante facebook', 
             'Agregá una foto de perfil'
            ];

var textSteps = [
            'De esta forma, prestadores de servicio, usuarios y byOO pueden ponerse en contacto con vos. Además, podés usar este número de teléfono para ingresar a tu cuenta.', 
            'De esta forma, prestadores de servicio, usuarios y byOO pueden ponerse en contacto con vos. Además, podés usar este correo y contraseña para ingresar a tu cuenta.', 
            'Vas a poder ingresar a byOO mediante google. Es una manera muy sencilla, rápida y segura de ingresar sin tener que memorizar nuevas contraseñas.', 
            'Vas a poder ingresar a byOO mediante facebook. Es una manera muy sencilla, rápida y segura de ingresar sin tener que memorizar nuevas contraseñas y lo mejor, vas a poder compartir contenido entre byOO y facebook.', 
            'Elegí la imagen con la que querés que los prestadores de servicio y usuarios de byOO te reconozcan. Puede ser un logo, una imagen de tu cara, la que vos elijas.'
           ];

var recaptchaVerifier;
const functions = getFunctions();
const getUserByPhoneNumber = httpsCallable(functions, 'getUserByPhoneNumber');
const getUserByEmail = httpsCallable(functions, 'getUserByEmail');      
const sendMail = httpsCallable(functions, 'sendMail');

const database = getFirestore();

function FormCreaTuPerfil(props) {
    const [isMounted, setIsMounted] = useState(true);
    const [telefono, setTelefono] = useState(false);
    const [correo, setCorreo] = useState(false);
    const [facebook, setFacebook] = useState(false);
    const [google, setGoogle] = useState(false);
    const [perfil, setPerfil] = useState(false);
    const [loadingDataFromFirestore, setLoadingDataFromFirestore] = useState(false);
    const [googlePhotoState, setGooglePhotoState] = useState(null);
    const [facebookPhotoState, setFacebookPhotoState] = useState(null);
    const [selectedPhotoGoogle, setSelectedPhotoGoogle] = useState(false);
    const [selectedPhotoFacebook, setSelectedPhotoFacebook] = useState(false);
    const [selectedPhotoAvatar, setSelectedPhotoAvatar] = useState(true);
    const [photoUploaded, setPhotoUploaded] = useState(null);
    const [filePhoto, setFilePhoto] = useState(null);
    const [loading, setLoading] = useState(false);

    const mobilAccess = !useMediaQuery('(min-width:769px)', { noSsr: true });
    const [mostrar, setMostrar] = useState(false);
    const [txtBtnContinuar, setTxtBtnContinuar] = useState('Continuar');
    const [classNameBtnContinuar, setClassNameBtnContinuar] = useState('button__log__continuar');
    const [openFormVerificaCodigoPhone, setOpenFormVerificaCodigoPhone] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState(null);

    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());

    const [loadingAvatarFacebook, setLoadingAvatarFacebook] = useState(true);
    const [loadingAvatarGoogle, setLoadingAvatarGoogle] = useState(true);
  
    const [ openMsg, setOpenMsg] = useState(false);
    const [severityInfo, setSeverityInfo] = useState('success');
    const [msg, setMsg] = useState('');
    const handleCloseMsg = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpenMsg(false);
    };
    
    useEffect(() => {
        setIsMounted(true);
        return () => {setIsMounted(false)}
    }, []);

      const isStepSkipped = useCallback((step) => {
        return skipped.has(step);
      },[skipped]);
    
      const handleNext = useCallback(() => {
        if (isMounted){
            let newSkipped = skipped;
            if (isStepSkipped(activeStep)) {
                newSkipped = new Set(newSkipped.values());
                newSkipped.delete(activeStep);
            }
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setSkipped(newSkipped);
        }
      },[isMounted, activeStep, isStepSkipped, skipped]);
      
    const handleSkip = () => {
        if (isMounted){
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
            });
        }
    };    

    const handleNextPhone = () => {
        if (isMounted){
            setOpenFormVerificaCodigoPhone(false);
            handleNext();
            setMostrar(true);
        }
    }

    const handleReturnFormVerificaCodigoPhone =() => {
        if (isMounted){
            setOpenFormVerificaCodigoPhone(false);
            setMostrar(true);
        }
    }
    
    const handleClickContinuar = () => {
        if (txtBtnContinuar === 'Continuar')
            if (isMounted){
                setSubmitCountrySelectPhoneFormPrincipal(true);
            }
        else{
            if (recaptchaVerifier !== undefined)
                if (!recaptchaVerifier.destroyed) 
                    recaptchaVerifier.clear();
            if (isMounted){
                setTxtBtnContinuar('Continuar');
                setClassNameBtnContinuar('button__log__continuar');
            }
        }
    }

    /*variables del componente CountrySelectPhone*/
    const styleSelectCountryPhoneFormPrincipal = { marginTop: "30px" };
    const [valueInputPhoneFormPrincipal, setValueInputPhoneFormPrincipal] = useState('');
    const [submitCountrySelectPhoneFormPrincipal, setSubmitCountrySelectPhoneFormPrincipal] = useState(false);
    const [variableEstadoCargadoNewValuePhoneFormPrincipal, setVariableEstadoCargadoNewValuePhoneFormPrincipal] = useState(false);
    const [countryCodeFormPrincipal, setCountryCodeFormPrincipal] = useState(null);
    const submitValuePhoneFormPicnipal = (value) => {
        if (isMounted){
            setSubmitCountrySelectPhoneFormPrincipal(value);
        }
    }
    const getValuePhoneCountrySelectPhoneFormPrincipal = (phone) => {
        if (isMounted){
            setValueInputPhoneFormPrincipal(phone[0]);
            setCountryCodeFormPrincipal(phone[1].code);
            setVariableEstadoCargadoNewValuePhoneFormPrincipal(true);
        }
    }
    /*fin variables de componente CountrySelectPhone*/

    /*variables del componente InputEmail Form Principal*/
    const styleInputEmailFormPrincipal = { marginTop: "20px" };
    const [valueInputEmailFormPrincipal, setValueInputEmailFormPrincipal] = useState('');
    const [submitEmailFormPrincipal, setSubmitEmailFormPrincipal] = useState(false);
    const [variableEstadoCargadoNewValueEmailFormPrincipal, setVariableEstadoCargadoNewValueEmailFormPrincipal] = useState(false);
    const submitValueEmailFormPrincipal = (value) => {
        if (isMounted){
            setSubmitEmailFormPrincipal(value);
        }
    }
    const getValueEmailFormPrincipal = (email) => {
        if (isMounted){
            setValueInputEmailFormPrincipal(email);
            setVariableEstadoCargadoNewValueEmailFormPrincipal(true);
        }
    }
    /*fin variables del componente InputEmail Form Principal*/
      
    /*variables del componente InputPassword del form Registrate*/
    const styleInputPasswordFormRegistrate = { marginTop: "10px" };
    const [valueInputPasswordFormRegistrate, setValueInputPasswordFormRegistrate] = useState('');
    const [submitPasswordFormRegistrate, setSubmitInputPasswordFormRegistrate] = useState(false);
    const [variableEstadoCargadoNewValuePasswordFormRegistrate, setVariableEstadoCargadoNewValuePasswordFormRegistrate] = useState(false);
    const submitValuePasswordFormRegistrate = (value) => {
        if (isMounted){
            setSubmitInputPasswordFormRegistrate(value);
        }
    }
    const getValuePasswordFormRegistrate = (password) => {
        if (isMounted){
            setValueInputPasswordFormRegistrate(password);
            setVariableEstadoCargadoNewValuePasswordFormRegistrate(true);
        }
    }
    /*fin variables de componente InputPassword del form Registrate*/

    const handleEnter = () => {
        if (txtBtnContinuar === 'Continuar')
            if (isMounted){
                setSubmitCountrySelectPhoneFormPrincipal(true);
            }
        else{
            if (recaptchaVerifier !== undefined)
                if (!recaptchaVerifier.destroyed) 
                    recaptchaVerifier.clear();
            if (isMounted){
                setTxtBtnContinuar('Continuar');
                setClassNameBtnContinuar('button__log__continuar');
            }
        }
    }

    /*atencion del valor ingresado del componente CountrySelectPhone*/
    useEffect(() => {       
        if (variableEstadoCargadoNewValuePhoneFormPrincipal){
            if ((valueInputPhoneFormPrincipal !== '')) {
                emitCustomEvent('openLoadingPage', true);
                getUserByPhoneNumber(valueInputPhoneFormPrincipal)  
                .then((userRecord) => {
                    //el usuario existe
                    emitCustomEvent('openLoadingPage', false);
                    if (recaptchaVerifier !== undefined)
                        if (!recaptchaVerifier.destroyed) 
                            recaptchaVerifier.clear();
                    if (isMounted){
                        setTxtBtnContinuar('Continuar');
                        setClassNameBtnContinuar('button__log__continuar');
                        setMsg('El número ' + String(valueInputPhoneFormPrincipal) + ' ya se encuentra asociado a otra cuenta.');
                        setSeverityInfo('error');
                        setOpenMsg(true);
                    }                    
                })
                .catch((error) => {
                    //el usuario no existe
                    const auth = getAuth();
                    auth.languageCode = props.lenguaje;
                    recaptchaVerifier = new RecaptchaVerifier('recaptcha-container3', {
                        type: 'image', // 'audio'
                        size: 'normal', // 'normal, invisible' or 'compact'
                        badge: 'inline' //' bottomright' or 'inline' applies to invisible.                    
                    }, auth);
                    if (isMounted){
                        setTxtBtnContinuar('Cancelar');
                        setClassNameBtnContinuar('button__log__BW');
                    }
                    emitCustomEvent('openLoadingPage', false);
                    
                    signInWithPhoneNumber(auth, valueInputPhoneFormPrincipal, recaptchaVerifier)
                    .then((result) => {
                        emitCustomEvent('openLoadingPage', true);
                        if (recaptchaVerifier !== undefined)
                            if (!recaptchaVerifier.destroyed) 
                                recaptchaVerifier.clear();
                        if (isMounted){
                            setTxtBtnContinuar('Continuar');
                            setClassNameBtnContinuar('button__log__continuar');
                            setConfirmationResult(result);
                            setMostrar(false);
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
                            setTxtBtnContinuar('Continuar');
                            setClassNameBtnContinuar('button__log__continuar');
                            setMsg('No pudimos enviar el SMS al número de teléfono ' + String(valueInputPhoneFormPrincipal));
                            setSeverityInfo('error');
                            setOpenMsg(true);
                        }                    
                        emitCustomEvent('openLoadingPage', false);
                    });                
                });
             }
             if (isMounted){
                setVariableEstadoCargadoNewValuePhoneFormPrincipal(false);  
             }     
        }             
    },[props, isMounted, valueInputPhoneFormPrincipal, variableEstadoCargadoNewValuePhoneFormPrincipal]);
    /*fin atencion del valor ingresado del componente CountrySelectPhone*/

    const handleGoogleUser = useCallback(async () => {
        const auth = getAuth();
        const infoUser = doc(database, "users", auth.currentUser.uid);  
        await updateDoc(infoUser, {
            googlePhoto: auth.currentUser.photoURL,
        })
        .then(()=>{
            steps.splice(2, 1);
            textSteps.splice(2, 1);
            if (isMounted){
                setValueInputEmailFormPrincipal(props.googleUser.profileObj.email);
                setCorreo(false);
                setFacebook(false);
                setGoogle(false);
                setPerfil(false);
                setTelefono(true); 
                setMostrar(true);
            }
            emitCustomEvent('openLoadingPage', false);
        })
        .catch(()=>{
            emitCustomEvent('openLoadingPage', false);            
        });
    },[props.googleUser, isMounted]);

    const handleFacebookUser = useCallback(async () => {
        const auth = getAuth();
        const infoUser = doc(database, "users", auth.currentUser.uid);  
        await updateDoc(infoUser, {
            facebookPhoto: auth.currentUser.photoURL,
        })
        .then(()=>{
            steps.splice(3, 1);
            textSteps.splice(3, 1);
            if (isMounted){
                setValueInputEmailFormPrincipal(props.facebookUser.email);
                setCorreo(false);
                setFacebook(false);
                setGoogle(false);
                setPerfil(false);
                setTelefono(true);
                setMostrar(true);
            }
            emitCustomEvent('openLoadingPage', false);
        })
        .catch(()=>{
            emitCustomEvent('openLoadingPage', false);
        });
    },[props.facebookUser, isMounted]);

    const handlePhotoPerfil = useCallback(async () => {
        const auth = getAuth();
        const infoUser = doc(database, "users", auth.currentUser.uid);                                  
        const docSnap = await getDoc(infoUser);
        if (docSnap.exists()) {
            if (isMounted){
            setGooglePhotoState(docSnap.data().googlePhoto);
            setFacebookPhotoState(docSnap.data().facebookPhoto);
            setLoadingDataFromFirestore(false); 
            }               
        } else {
            if (isMounted){
            setMsg('Ha ocurrido un error al intentar acceder al servidor');
            setSeverityInfo('error');
            setOpenMsg(true);
            }
            emitCustomEvent('openLoadingPage', false);
        }
    },[isMounted]);

    useEffect(() => {     
        if (props.open){
            if (activeStep === steps.length){
                const auth = getAuth();
                if (auth.currentUser.email !== null){
                    sendEmailVerification(auth.currentUser)
                    .then(() => {
                        emitCustomEvent('showMsg', 'Te enviamos un mail a ' + auth.currentUser.email + ' para que verfiques tu cuenta./info');
                    })
                    .catch((error)=>{
                        emitCustomEvent('showMsg', 'No hemos podido enviar un mail a ' + auth.currentUser.email + ' para que verfiques tu cuenta./error');
                    });

                    sendMail([
                        "byOO <automated@byoo.com>", 
                        auth.currentUser.email, 
                        {
                            name: 'welcome',
                            data: {
                                username: props.name,
                            }
                        }
                    ])
                    .then(() => console.log("Queued email for delivery!"));    
                }
                if (props.googleUser !== null){
                    //se logeo por google
                    steps.splice(2, 0, 'Vinculá un acceso mediante google');
                    textSteps.splice(2, 0, 'Vas a poder ingresar a byOO mediante google. Es una manera muy sencilla, rápida y segura de ingresar sin tener que memorizar nuevas contraseñas.');
                }else{
                    if (props.facebookUser !== null){
                        //se logeo por facebook
                        steps.splice(3, 0, 'Vinculá un acceso mediante facebook');
                        textSteps.splice(3, 0, 'Vas a poder ingresar a byOO mediante facebook. Es una manera muy sencilla, rápida y segura de ingresar sin tener que memorizar nuevas contraseñas y lo mejor, vas a poder compartir contenido entre byOO y facebook.');
                    }else{
                        if (props.phoneUser !== null){
                            //se logeo por telefono
                            steps.splice(0, 0, 'Confirmá tu número de teléfono');
                            textSteps.splice(0, 0, 'De esta forma, prestadores de servicio, usuarios y byOO pueden ponerse en contacto con vos. Además, podés usar este número de teléfono para ingresar a tu cuenta.');                            
                        }else{
                            //se logeo por mail y contraseña
                            steps.splice(1, 0, 'Vinculá un acceso mediante correo y contraseña');
                            textSteps.splice(1, 0, 'De esta forma, prestadores de servicio, usuarios y byOO pueden ponerse en contacto con vos. Además, podés usar este correo y contraseña para ingresar a tu cuenta.');
                        }
                    }
                }
                if (isMounted){                
                    setMostrar(false);
                    emitCustomEvent('openLoadingPage', true);
                    setFacebook(false);
                    setGoogle(false);
                    setPerfil(false);
                    setTelefono(false);    
                    setCorreo(false);    
                    setActiveStep(0);
                    setLoadingDataFromFirestore(false);
                    setGooglePhotoState(null);
                    setFacebookPhotoState(null);
                    setPhotoUploaded(null);
                    setFilePhoto(null);
                    setLoading(false);
                    emitCustomEvent('openLoadingPage', false);
                    setLoadingAvatarFacebook(true);
                    setLoadingAvatarGoogle(true);
                    setCountryCodeFormPrincipal(null);
                }
                props.onGetFinish(true);
            }else{
                if (steps.length === 4){
                    if (steps[activeStep].includes('teléfono')){
                        if (isMounted){
                        setCorreo(false);
                        setFacebook(false);
                        setGoogle(false);
                        setPerfil(false);
                        setTelefono(true);
                        } 
                        emitCustomEvent('openLoadingPage', false);
                    }else{
                        if (steps[activeStep].includes('correo y contraseña')){
                            if (isMounted){
                            setFacebook(false);
                            setGoogle(false);
                            setPerfil(false);
                            setTelefono(false);    
                            setCorreo(true);
                            }    
                            emitCustomEvent('openLoadingPage', false);
                        }else{
                            if (steps[activeStep].includes('facebook')){
                                if (isMounted){
                                setGoogle(false);
                                setPerfil(false);
                                setTelefono(false);    
                                setCorreo(false);    
                                setFacebook(true);
                                }                            
                                emitCustomEvent('openLoadingPage', false);
                            }else{
                                if (steps[activeStep].includes('google')){
                                    if (isMounted){
                                    setPerfil(false);
                                    setTelefono(false);    
                                    setCorreo(false);    
                                    setFacebook(false);    
                                    setGoogle(true);
                                    }          
                                    emitCustomEvent('openLoadingPage', false);
                                }else{
                                    if (steps[activeStep].includes('foto de perfil')){
                                        if (isMounted){
                                        setTelefono(false);    
                                        setCorreo(false);    
                                        setFacebook(false);    
                                        setGoogle(false);
                                        setLoadingDataFromFirestore(true);    
                                        setPerfil(true);
                                        }
                                        handlePhotoPerfil();
                                        emitCustomEvent('openLoadingPage', false);
                                    }
                                }
                            }
                        }
                    }
                }
                if (steps.length === 5){
                    if (props.googleUser !== null){
                        handleGoogleUser();
                    }else{
                        if (props.facebookUser !== null){
                            handleFacebookUser();
                        }else{
                            if (props.phoneUser !== null){
                                steps.splice(0, 1);
                                textSteps.splice(0, 1);
                                if (isMounted){                            
                                setValueInputEmailFormPrincipal('');
                                setCorreo(true);
                                setFacebook(false);
                                setGoogle(false);
                                setPerfil(false);
                                setTelefono(false);            
                                setCorreo(true);
                                setMostrar(true);
                                }
                                emitCustomEvent('openLoadingPage', false);
                            }else{
                                steps.splice(1, 1);
                                textSteps.splice(1, 1);
                                if (isMounted){
                                setValueInputEmailFormPrincipal('');
                                setCorreo(false);
                                setFacebook(false);
                                setGoogle(false);
                                setPerfil(false);
                                setTelefono(true);  
                                setMostrar(true);
                                }
                                emitCustomEvent('openLoadingPage', false);
                            }
                        }
                    }
                } 
            }   
        }            
    }, [props, isMounted, activeStep, handleFacebookUser, handleGoogleUser, handlePhotoPerfil])

    /*atencion del valor ingresado del componente Input Email del form principal*/
    useEffect(() => {      
        if (variableEstadoCargadoNewValuePasswordFormRegistrate){  
            if (isMounted){      
            setVariableEstadoCargadoNewValuePasswordFormRegistrate(false);   
            }    
        } 

        if (variableEstadoCargadoNewValueEmailFormPrincipal){
            if ((valueInputEmailFormPrincipal !== '')) {
                if (valueInputPasswordFormRegistrate !== '') {
                    emitCustomEvent('openLoadingPage', true);
                    const auth = getAuth();
                    fetchSignInMethodsForEmail(auth, valueInputEmailFormPrincipal)
                        .then(providers => {
                            if (providers.length === 0){
                                getUserByEmail(valueInputEmailFormPrincipal)
                                .then((result)=>{
                                    if (result.data.uid === auth.currentUser.uid){
                                        //el mail no esta asociado a ninguna cuenta
                                        const credential = EmailAuthProvider.credential(valueInputEmailFormPrincipal, valueInputPasswordFormRegistrate);
                                        linkWithCredential(auth.currentUser, credential)
                                        .then((usercred) => {
                                            handleNext();
                                            emitCustomEvent('openLoadingPage', false);
                                        }).catch((error) => {
                                            try{
                                                setMsg(error.code.split('/')[1].replace(/-/g,' '));
                                            }catch{
                                                setMsg('Ha ocurrido un error');
                                            } 
                                            if (isMounted){                           
                                            setSeverityInfo('error');
                                            setOpenMsg(true);
                                            }
                                            emitCustomEvent('openLoadingPage', false);
                                        });                                
                                    }else{
                                        if (isMounted){
                                        setMsg('No podemos asociar el correo ' + valueInputEmailFormPrincipal + ' porque ya se encuentra asociado a otra cuenta.');
                                        setSeverityInfo('error');
                                        setOpenMsg(true); 
                                        }
                                        emitCustomEvent('openLoadingPage', false);
                                    }
                                })
                                .catch(()=>{
                                    const credential = EmailAuthProvider.credential(valueInputEmailFormPrincipal, valueInputPasswordFormRegistrate);
                                    linkWithCredential(auth.currentUser, credential)
                                    .then((usercred) => {
                                        handleNext();
                                        emitCustomEvent('openLoadingPage', false);
                                    }).catch((error) => {
                                        try{
                                            setMsg(error.code.split('/')[1].replace(/-/g,' '));
                                        }catch{
                                            setMsg('Ha ocurrido un error');
                                        }  
                                        if (isMounted){                          
                                        setSeverityInfo('error');
                                        setOpenMsg(true);
                                        }
                                        emitCustomEvent('openLoadingPage', false);
                                    });                                
                                });
                            }else{
                                //el mail esta asociado a alguna cuenta
                                if (auth.currentUser.email === valueInputEmailFormPrincipal){
                                    //el mail es el mismo del usuario actual
                                    const credential = EmailAuthProvider.credential(valueInputEmailFormPrincipal, valueInputPasswordFormRegistrate);
                                    linkWithCredential(auth.currentUser, credential)
                                    .then((usercred) => {
                                        handleNext();
                                        emitCustomEvent('openLoadingPage', false);
                                    }).catch((error) => {
                                        try{
                                            if (isMounted){
                                            setMsg(error.code.split('/')[1].replace(/-/g,' '));
                                            }
                                        }catch{
                                            if (isMounted){
                                            setMsg('Ha ocurrido un error');
                                            }
                                        } 
                                        if (isMounted){                           
                                        setSeverityInfo('error');
                                        setOpenMsg(true);
                                        }  
                                        emitCustomEvent('openLoadingPage', false);
                                    });                                    
                                }else{
                                    //el mail no es el del usuario actual
                                    if (isMounted){
                                    setMsg('No podemos asociar el correo ' + valueInputEmailFormPrincipal + ' porque ya se encuentra asociado a otra cuenta.');
                                    setSeverityInfo('error');
                                    setOpenMsg(true); 
                                    }
                                    emitCustomEvent('openLoadingPage', false);
                                }
                            }
                        })
                        .catch((error) => {
                            // Some error occurred, you can inspect the code: error.code
                            emitCustomEvent('openLoadingPage', false);
                            if (isMounted){
                            try{
                                setMsg(error.code.split('/')[1].replace(/-/g,' '));
                            }catch{
                                setMsg('Ha ocurrido un error');
                            }                            
                            setSeverityInfo('error');
                            setOpenMsg(true);
                            }
                            emitCustomEvent('openLoadingPage', false);
                        }
                    );
                }           
            }
            if (isMounted){
            setVariableEstadoCargadoNewValueEmailFormPrincipal(false);  
            }     
        }              
    },[props, isMounted, handleNext, valueInputEmailFormPrincipal, variableEstadoCargadoNewValueEmailFormPrincipal, valueInputPasswordFormRegistrate, variableEstadoCargadoNewValuePasswordFormRegistrate]);
    /*fin atencion del valor ingresado del componente Input Email del form principal*/    
   
    const handleEnterCorreo = () => {     
        if (isMounted){       
        setSubmitEmailFormPrincipal(true);
        setSubmitInputPasswordFormRegistrate(true);
        }
    } 
    
    const handleGoogleLinked = async (data) => {
        const auth = getAuth();
        const infoUser = doc(database, "users", auth.currentUser.uid);  
        await updateDoc(infoUser, {
            googlePhoto: data.imageUrl,
        })
        .then(()=>{
            handleNext();
            emitCustomEvent('openLoadingPage', false);
        })
        .catch(()=>{
            if (isMounted){
            setMsg('Ha ocurrido un error en la base de datos');
            setSeverityInfo('error');
            setOpenMsg(true);  
            }
            emitCustomEvent('openLoadingPage', false);
        });
    }
 
    const responseGoogleSuccess = (googleUser) => {
        emitCustomEvent('openLoadingPage', true);
        const auth = getAuth();
        fetchSignInMethodsForEmail(auth, googleUser.profileObj.email)
            .then(providers => {
                if (providers.length === 0){
                    //el usuario no existe, puede entrar por google.com pero se debe terminar de registrar
                    const credential = GoogleAuthProvider.credential(googleUser.getAuthResponse().id_token);
                    linkWithCredential(auth.currentUser, credential)
                    .then((usercred) => {
                        handleGoogleLinked(googleUser.profileObj);
                    }).catch((error) => {
                        if (isMounted){
                        try{
                            setMsg(error.code.split('/')[1].replace(/-/g,' '));
                        }catch{
                            setMsg('Ha ocurrido un error');
                        }                            
                        setSeverityInfo('error');
                        setOpenMsg(true);
                        }  
                        emitCustomEvent('openLoadingPage', false);
                    });                                    
                }else{
                    //el usuario existe, verifico si google.com es un proveedor asociado
                    if (providers.includes('google.com')){
                        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
                            unsubscribe();
                            // Check if we are already signed-in Firebase with the correct user.
                            if (!isUserEqualGoogle(googleUser, firebaseUser)) {
                                if (isMounted){
                                setMsg('No podemos asociar esta cuenta de google porque ya se encuentra asociado a otra cuenta.');
                                setSeverityInfo('error');
                                setOpenMsg(true); 
                                } 
                                emitCustomEvent('openLoadingPage', false);
                            } else {
                                console.log('User already signed-in Firebase.');
                            }
                            });    
                    }else{
                        const credential = GoogleAuthProvider.credential(googleUser.getAuthResponse().id_token);
                        linkWithCredential(auth.currentUser, credential)
                        .then((usercred) => {
                            handleGoogleLinked(googleUser.profileObj);
                        }).catch((error) => {
                            if (isMounted){
                            try{
                                setMsg(error.code.split('/')[1].replace(/-/g,' '));
                            }catch{
                                setMsg('Ha ocurrido un error');
                            }                            
                            setSeverityInfo('error');
                            setOpenMsg(true); 
                            } 
                            emitCustomEvent('openLoadingPage', false);
                        });                                    
                    }
                }
            })
            .catch((error) => {
                if (isMounted){
                try{
                    setMsg(error.code.split('/')[1].replace(/-/g,' '));
                }catch{
                    setMsg('Ha ocurrido un error');
                }                            
                setSeverityInfo('error');
                setOpenMsg(true); 
                } 
                emitCustomEvent('openLoadingPage', false);
            }
        );
        
    }

    const responseGoogleError = (error) => {
        emitCustomEvent('openLoadingPage', false);
    }

    const handleErrorLoadGoogle = (error) => {
        emitCustomEvent('openLoadingPage', false);
    }

    function isUserEqualGoogle(googleUser, firebaseUser) {
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

    const handleErrorFacebook = (error) => {
        emitCustomEvent('openLoadingPage', false);
    }

    const handleFacebookLinked = async (data) => {
        const auth = getAuth();
        const infoUser = doc(database, "users", auth.currentUser.uid);  
        await updateDoc(infoUser, {
            facebookPhoto: data._tokenResponse.photoUrl,
        })
        .then(()=>{
            handleNext();
            emitCustomEvent('openLoadingPage', false);
        })
        .catch(()=>{
            if (isMounted){
            setMsg('Ha ocurrido un error en la base de datos');
            setSeverityInfo('error');
            setOpenMsg(true); 
            } 
            emitCustomEvent('openLoadingPage', false);
        });
    }

    const history = useHistory();
    const responseFacebook = (response) => {
        emitCustomEvent('openLoadingPage', true);
        const auth = getAuth();
        if (response.status !== 'unknown'){
            fetchSignInMethodsForEmail(auth, response.email)
            .then(providers => {
                if (providers.length === 0){
                    //el usuario no existe, puede entrar por google.com pero se debe terminar de registrar
                    const credential = FacebookAuthProvider.credential(response.accessToken);
                    linkWithCredential(auth.currentUser, credential)
                    .then((usercred) => {
                        handleFacebookLinked(usercred);
                    }).catch((error) => {
                        if (isMounted){
                        try{
                            setMsg(error.code.split('/')[1].replace(/-/g,' '));
                        }catch{
                            setMsg('Ha ocurrido un error');
                        }                            
                        setSeverityInfo('error');
                        setOpenMsg(true);
                        }  
                        emitCustomEvent('openLoadingPage', false);
                    });                                    
                }else{
                    //el usuario existe, verifico si facebook.com es un proveedor asociado
                    if (providers.includes('facebook.com')){
                        if (window.location.href.indexOf('?code=') !== -1){
                            history.push((window.location.href.substring(0, window.location.href.indexOf('?code='))).replace('https://byoo.com.ar', ''))
                        }
                        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
                            unsubscribe();
                            // Check if we are already signed-in Firebase with the correct user.
                            if (!isUserEqualFacebook(response, firebaseUser)) {
                                if (isMounted){
                                setMsg('No podemos asociar esta cuenta de facebook porque ya se encuentra asociado a otra cuenta.');
                                setSeverityInfo('error');
                                setOpenMsg(true);
                                }  
                                emitCustomEvent('openLoadingPage', false);
                            } else {
                                console.log('User already signed-in Firebase.');
                                emitCustomEvent('openLoadingPage', false);
                            }
                            });    
                    }else{
                        const credential = FacebookAuthProvider.credential(response.accessToken);
                        linkWithCredential(auth.currentUser, credential)
                        .then((usercred) => {
                            handleFacebookLinked(usercred);
                        }).catch((error) => {
                            if (isMounted){
                            try{
                                setMsg(error.code.split('/')[1].replace(/-/g,' '));
                            }catch{
                                setMsg('Ha ocurrido un error');
                            }                            
                            setSeverityInfo('error');
                            setOpenMsg(true);
                            }  
                            emitCustomEvent('openLoadingPage', false);
                        });                                    
                    }
                }
            })
            .catch((error) => {
                if (isMounted){
                try{
                    setMsg(error.code.split('/')[1].replace(/-/g,' '));
                }catch{
                    setMsg('Ha ocurrido un error');
                }                            
                setSeverityInfo('error');
                setOpenMsg(true);
                }  
                emitCustomEvent('openLoadingPage', false);
            }
        );
        }
    }

    function isUserEqualFacebook(response, firebaseUser) {
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

    const handleSelectPhotoGoogle = () => {
        if (isMounted){
        setSelectedPhotoAvatar(false);
        setSelectedPhotoFacebook(false);
        setSelectedPhotoGoogle(true);
        }
    }

    const handleSelectPhotoFacebook = () => {
        if (isMounted){
        setSelectedPhotoAvatar(false);
        setSelectedPhotoGoogle(false);
        setSelectedPhotoFacebook(true);
        }
    }

    const handleSelectPhotoAvatar = () => {
        if (isMounted){
        setSelectedPhotoGoogle(false);
        setSelectedPhotoFacebook(false);
        setSelectedPhotoAvatar(true);
        }
    }

    const handleListo = async () => {
        const auth = getAuth();
        const infoUser = doc(database, "users", auth.currentUser.uid);                                  
        const docSnap = await getDoc(infoUser);
        if (docSnap.exists()) {
            if (selectedPhotoGoogle){
                await updateDoc(infoUser, {
                    profilePhoto: docSnap.data().googlePhoto,
                })
                .then(()=>{
                    handleNext();
                })
                .catch(()=>{
                    emitCustomEvent('openLoadingPage', false);
                    if (isMounted){
                    setMsg('Ha ocurrido un error en la base de datos');
                    setSeverityInfo('error');
                    setOpenMsg(true);
                    }  
                });
            }else{
                if (selectedPhotoFacebook){
                    await updateDoc(infoUser, {
                        profilePhoto: docSnap.data().facebookPhoto,
                    })
                    .then(()=>{
                        handleNext();
                    })
                    .catch(()=>{
                        emitCustomEvent('openLoadingPage', false);
                        if (isMounted){
                        setMsg('Ha ocurrido un error en la base de datos');
                        setSeverityInfo('error');
                        setOpenMsg(true);
                        }  
                    });        
                }else{
                    if (selectedPhotoAvatar){
                        if (photoUploaded === null){
                            await updateDoc(infoUser, {
                                profilePhoto: 'none',
                            })
                            .then(()=>{
                                handleNext();
                            })
                            .catch(()=>{
                                emitCustomEvent('openLoadingPage', false);
                                if (isMounted){
                                setMsg('Ha ocurrido un error en la base de datos');
                                setSeverityInfo('error');
                                setOpenMsg(true);
                                }  
                            });
                        }else{
                            handleNext();
                        }
                    }
                }
            }
        } else {
            if (isMounted){
            setMsg('Ha ocurrido un error al intentar acceder al servidor');
            setSeverityInfo('error');
            setOpenMsg(true);
            }
            emitCustomEvent('openLoadingPage', false);
        }
    }

    const handleAddPhoto = () => {
        handleSelectPhotoAvatar();
    }

    const handleFileSelected = async (file) => {
        if (file !== undefined){
            if (isMounted){
            setLoading(true);
            setFilePhoto(file);
            }
            const auth = getAuth();
            const storage = getStorage();
            const storageRef = ref(storage, auth.currentUser.uid + '/profile/' + file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);
            
            uploadTask.on('state_changed', 
            (snapshot) => {
//                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//                console.log('Upload is ' + progress + '% done');
            }, 
            (error) => {
                if (isMounted){
                setMsg('Ha ocurrido un error al cargar el archivo');
                setSeverityInfo('error');
                setOpenMsg(true);
                setLoading(false);
                }
            }, 
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                .then(async (downloadURL) => {
                    const infoUser = doc(database, "users", auth.currentUser.uid);                                  
                    const docSnap = await getDoc(infoUser);
                    if (docSnap.exists()) {
                        await updateDoc(infoUser, {
                            profilePhoto: downloadURL,
                        }).then(()=>{
                            if (isMounted){
                            setPhotoUploaded(downloadURL);
                            setLoading(false);
                            }
                        }).catch(()=>{
                            emitCustomEvent('openLoadingPage', false);
                            if (isMounted){
                            setMsg('Ha ocurrido un error en la base de datos');
                            setSeverityInfo('error');
                            setOpenMsg(true);  
                            setLoading(false);
                            }
                        });
                    }
                });
            }
          );            
        }else{
            if (isMounted){
            setLoading(false);
            }
        }
    }

    const handleRemovePhoto = () => {
        if (isMounted){
        setLoading(true);
        handleSelectPhotoAvatar();
        }
        const auth = getAuth();
        const storage = getStorage();
        const storageRef = ref(storage, auth.currentUser.uid + '/profile/' + filePhoto.name);        
        deleteObject(storageRef).then(async () => {
            const infoUser = doc(database, "users", auth.currentUser.uid);                                  
            const docSnap = await getDoc(infoUser);
            if (docSnap.exists()) {
                await updateDoc(infoUser, {
                    profilePhoto: null,
                }).then(()=>{
                    if (isMounted){
                    setFilePhoto(null);
                    setPhotoUploaded(null);
                    setLoading(false);
                    }
                }).catch(()=>{
                    emitCustomEvent('openLoadingPage', false);
                    if (isMounted){
                    setMsg('Ha ocurrido un error en la base de datos');
                    setSeverityInfo('error');
                    setOpenMsg(true);  
                    setLoading(false);
                    }
                });
            }
        }).catch((error) => {
            setMsg('Ha ocurrido un error al borrar el archivo');
            if (isMounted){
            setSeverityInfo('error');
            setOpenMsg(true);
            emitCustomEvent('openLoadingPage', false);
            setLoading(false);
            }
        });        
    }

    const handleLoadAvatarGoogle = () => {
        if (isMounted){
        setLoadingAvatarGoogle(false);
        }
    }

    const handleLoadAvatarFacebook = () => {
        if (isMounted){
        setLoadingAvatarFacebook(false);
        }
    }

    return (
        <div>
            {mostrar ?
                <Dialog 
                    fullScreen={mobilAccess}
                    open={props.open}
                    aria-labelledby="customized-dialog-title" 
                    PaperProps = { { 
                        style : {  borderRadius : 15  } 
                    } } 
                    keepMounted
                    disableEscapeKeyDown={true}
                >
                <MuiDialogTitle disableTypography 
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                    }} 
                >
                    <Typography variant='subtitle2'
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%'
                        }}                                            
                    >
                        <strong>Creá tu perfil</strong>
                    </Typography>
                    <IconButton 
                        aria-label="close"  
                        disabled={true}
                        style={{
                            color: 'white'
                        }}
                    >
                        <ArrowBackIosIcon />
                    </IconButton>
                </MuiDialogTitle>
                <MuiDialogContent dividers>
                <Box sx={{ width: '100%' }}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    if (isStepSkipped(index)) {
                        stepProps.completed = false;
                    }
                    return (
                        <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps}></StepLabel>
                        </Step>
                    );
                    })}
                </Stepper>
                    <React.Fragment>
                        <div align='center'>
                        <Typography 
                            variant='h6'
                            style={{
                                width: '100%',
                                marginTop: 20,
                                color: 'black',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}        
                        >
                            <strong>{steps[activeStep]}</strong>
                        </Typography>
                        <Typography 
                            variant='subtitle2'
                            style={{
                                width: '100%',
                                color: 'gray',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {textSteps[activeStep]}
                        </Typography>
                        </div>
                    </React.Fragment>
                    </Box>
                    {telefono ?
                        <div>
                            <InputCountrySelectPhone 
                                style={styleSelectCountryPhoneFormPrincipal} 
                                onGetValuePhone={getValuePhoneCountrySelectPhoneFormPrincipal} 
                                verify={submitCountrySelectPhoneFormPrincipal} 
                                onSubmitValuePhone={submitValuePhoneFormPicnipal} 
                                onGetEnter={handleEnter}
                                country={props.country}
                                code={null}
                                close={!props.open}
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
                            <div align='center' id="recaptcha-container3" className='recaptchaClass'></div>
                            <Button 
                                variant='outlined'
                                className={classNameBtnContinuar}
                                onClick={handleClickContinuar}
                            >
                            {txtBtnContinuar}
                            </Button>
                        </div>
                    :null}
                    {correo ?
                        <div>
                            <InputEmail 
                                style={styleInputEmailFormPrincipal}
                                email=""
                                onGetValueEmail={getValueEmailFormPrincipal} 
                                verify={submitEmailFormPrincipal} 
                                onSubmitValueEmail={submitValueEmailFormPrincipal} 
                                close={!props.open}
                                onGetEnter={handleEnterCorreo}
                            />
                            <InputPassword 
                                onGetValuePassword={getValuePasswordFormRegistrate} 
                                onSubmitValuePassword={submitValuePasswordFormRegistrate} 
                                onGetEnter={handleEnterCorreo}
                                password=''
                                verify={submitPasswordFormRegistrate} 
                                style={styleInputPasswordFormRegistrate}
                                close={!props.open}
                            />
                            <Button 
                                variant='outlined'
                                className='button__log__continuar'
                                onClick={handleEnterCorreo}
                            >
                            Continuar
                            </Button>
                        </div>
                    :null}
                    {facebook ?
                        <div>
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
                                    <Button         
                                        variant='outlined'
                                        className='button__log'
                                        startIcon={<FacebookIcon className='button__icon'/>}
                                        onClick={e=>{renderProps.onClick();}} 
                                        disabled={renderProps.isDisabled}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            width: '100%'
                                        }}                                            
                                        endIcon={<FacebookIcon sx={{color: 'white'}}/>}
                                    >
                                    Vinculá un acceso con Facebook
                                    </Button>
                                )}                
                            />          
                        </div>
                    :null}
                    {google ?
                        <div>
                            <GoogleLogin
                                jsSrc={'https://apis.google.com/js/client.js'}
                                clientId={process.env.REACT_APP_GOOGLEID}
                                onSuccess={responseGoogleSuccess}
                                onFailure={responseGoogleError}
                                onScriptLoadFailure={handleErrorLoadGoogle}
                                scope= 'https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
                                cookiePolicy = {"single_host_origin"}  
                                render={renderProps => (
                                    <Button         
                                        variant='outlined'
                                        className='button__log'
                                        startIcon={<GoogleIcon className='button__icon'/>}
                                        onClick={e=>{renderProps.onClick();}} 
                                        disabled={renderProps.disabled}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            width: '100%'
                                        }}                                            
                                        endIcon={<GoogleIcon sx={{color: 'white'}}/>}
                                    >
                                    Vinculá un acceso con Google
                                    </Button>
                                )}
                            />            
                        </div>
                    :null}
                    {perfil ?
                        <div>
                            {loadingDataFromFirestore ?
                            <Stack direction="row" spacing={2} 
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: '20px',
                                }}
                            >
                                <Skeleton variant="circular" width={100} height={100} />                            
                            </Stack>
                            :
                            <div>
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={{ xs: 1, sm: 2, md: 3 }}
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: '20px',
                                }}
                            >
                                { googlePhotoState !== null ?
                                    <Stack
                                        direction='column'
                                        style={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                    {!selectedPhotoGoogle ?
                                        <Box sx={{ position: 'relative' }}>
                                        {loadingAvatarGoogle ?
                                            <CircularProgress
                                                size={100}
                                                sx={{
                                                    color: '#5f5f5f',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    zIndex: 1,
                                                }}
                                                color="inherit"
                                            />
                                        :
                                            null
                                        }
                                        <Avatar
                                            onClick={handleSelectPhotoGoogle}
                                            src={googlePhotoState}
                                            sx={{ width: 100, height: 100, cursor: 'pointer'}}
                                            onLoad={handleLoadAvatarGoogle}
                                        />
                                        </Box>
                                    :
                                    <Box sx={{ position: 'relative' }}>
                                    {loadingAvatarGoogle ?
                                        <CircularProgress
                                            size={100}
                                            sx={{
                                                color: '#5f5f5f',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                zIndex: 1,
                                            }}
                                            color="inherit"
                                        />
                                    :
                                        null
                                    }
                                    <Avatar
                                        onClick={handleSelectPhotoGoogle}
                                        src={googlePhotoState}
                                        sx={{ width: 100, height: 100, cursor: 'pointer', border: "3px solid #44b700", }}
                                        onLoad={handleLoadAvatarGoogle}
                                    />
                                    </Box>
                                    }
                                    <Chip label="google" sx={{fontSize:'14px', maxWidth: '100px'}}/>
                                    </Stack>
                                :null}
                                { facebookPhotoState !== null ?
                                    <Stack
                                        direction='column'
                                        style={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                    {!selectedPhotoFacebook ?
                                    <Box sx={{ position: 'relative' }}>
                                    {loadingAvatarFacebook ?
                                        <CircularProgress
                                            size={100}
                                            sx={{
                                                color: '#5f5f5f',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                zIndex: 1,
                                            }}
                                            color="inherit"
                                        />
                                    :
                                        null
                                    }
                                    <Avatar
                                        onClick={handleSelectPhotoFacebook}
                                        src={facebookPhotoState}
                                        sx={{ width: 100, height: 100, cursor: 'pointer' }}
                                        onLoad={handleLoadAvatarFacebook}
                                    />
                                    </Box>
                                    :
                                    <Box sx={{ position: 'relative' }}>
                                    {loadingAvatarFacebook ?
                                        <CircularProgress
                                            size={100}
                                            sx={{
                                                color: '#5f5f5f',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                zIndex: 1,
                                            }}
                                            color="inherit"
                                        />
                                    :
                                        null
                                    }
                                    <Avatar
                                        onClick={handleSelectPhotoFacebook}
                                        src={facebookPhotoState}
                                        sx={{ width: 100, height: 100, cursor: 'pointer', border: "3px solid #44b700", }}
                                        onLoad={handleLoadAvatarFacebook}
                                    />
                                    </Box>
                                    }
                                    <Chip label="facebook" sx={{fontSize:'14px', maxWidth: '100px'}}/>
                                    </Stack>
                                :null}
                                <Badge 
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    overlap="circular" 
                                    badgeContent={
                                        <div>
                                        {!photoUploaded ?
                                        <label htmlFor="uploadPhoto">
                                            <input
                                                style={{ display: "none" }}
                                                id="uploadPhoto"
                                                name="uploadPhoto"
                                                type="file"
                                                accept="image/jpeg, image/png, image/jpg"
                                                onChange={(e)=> {handleFileSelected(e.target.files[0])}}
                                            />                                
                                            <Fab color="primary" size="small" component="span" aria-label="add">
                                                <AddIcon 
                                                    onClick={handleAddPhoto}
                                                />
                                            </Fab>
                                        </label>
                                        :
                                        <Fab color="primary" size="small" component="span" aria-label="add">
                                            <RemoveIcon 
                                                onClick={handleRemovePhoto}
                                            />
                                        </Fab>

                                        }
                                        </div>
                                    }
                                >
                                <Stack
                                    direction='column'
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                {!selectedPhotoAvatar ?
                                    <div>
                                        {photoUploaded === null ?
                                            <Box sx={{ position: 'relative' }}>
                                                <Avatar
                                                    onClick={handleSelectPhotoAvatar}
                                                    sx={{ width: 100, height: 100, cursor: 'pointer' }}
                                                >
                                                        <AccountCircleIcon sx={{ width: 115, height: 115 }}/>
                                                </Avatar>
                                                {loading && (
                                                <CircularProgress
                                                    size={100}
                                                    onClick={handleSelectPhotoAvatar}
                                                    sx={{
                                                    color: green[500],
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    }}
                                                />
                                                )}
                                            </Box>      
                                        :
                                            <Box sx={{ position: 'relative' }}>
                                                <Avatar
                                                    onClick={handleSelectPhotoAvatar}
                                                    src={photoUploaded}
                                                    sx={{ width: 100, height: 100, cursor: 'pointer' }}
                                                />
                                                {loading && (
                                                <CircularProgress
                                                    size={100}
                                                    onClick={handleSelectPhotoAvatar}
                                                    sx={{
                                                    color: green[500],
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    }}
                                                />
                                                )}
                                            </Box>      
                                        }
                                    </div>
                                :
                                    <div>
                                        {photoUploaded === null ?
                                            <Box sx={{ position: 'relative' }}>
                                                <Avatar
                                                    onClick={handleSelectPhotoAvatar}
                                                    sx={{ width: 100, height: 100, cursor: 'pointer', border: "3px solid #44b700"}}
                                                >
                                                    <AccountCircleIcon sx={{ width: 115, height: 115 }}/>
                                                </Avatar>
                                                {loading && (
                                                <CircularProgress
                                                    size={106}
                                                    onClick={handleSelectPhotoAvatar}
                                                    sx={{
                                                    color: green[500],
                                                    position: 'absolute',
                                                    top: '-0px',
                                                    left: '-0px',
                                                    }}
                                                />
                                                )}
                                            </Box>      
                                        :
                                            <Box sx={{ position: 'relative' }}>
                                                <Avatar
                                                    onClick={handleSelectPhotoAvatar}
                                                    src={photoUploaded}
                                                    sx={{ width: 100, height: 100, cursor: 'pointer', border: "3px solid #44b700"}}
                                                />
                                                {loading && (
                                                <CircularProgress
                                                    size={106}
                                                    onClick={handleSelectPhotoAvatar}
                                                    sx={{
                                                    color: green[500],
                                                    position: 'absolute',
                                                    top: '-0px',
                                                    left: '-0px',
                                                    }}
                                                />
                                                )}
                                            </Box>      
                                        }
                                    </div>
                                }
                                <Chip label="otra" sx={{fontSize:'14px', maxWidth: '100px'}}/>
                                </Stack>
                                </Badge>
                            </Stack>
                            <Button 
                                variant='outlined'
                                className='button__log__continuar'
                                onClick={handleListo}
                                sx={{
                                    marginTop: '2rem !important',
                                    marginBottom: '2rem !important',
                                }}
                            >
                                Listo!
                            </Button>
                            </div>
                            }
                        </div>
                    :null}
                    {!perfil ?
                        <Box 
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%'
                            }}
                            sx={{
                                width: '100%',
                                height: '5rem',
                            }} 
                        >
                            <Link
                                component="button"
                                onClick={handleSkip}
                                sx={{
                                    textDecoration: "underline #000000",
                                    color: 'black !important',
                                    fontSize: '1rem',
                                    marginTop: '1rem !important',
                                }} 
                                    >
                                <strong>Lo voy a hacer mas tarde</strong>
                            </Link>            
                        </Box>
                    :null}        
                </MuiDialogContent>
                <Snackbar open={openMsg} autoHideDuration={6000} onClose={handleCloseMsg} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{width: '100%'}}>
                    <Alert onClose={handleCloseMsg} severity={severityInfo}>{msg}</Alert>
                </Snackbar>            
                </Dialog>                
            :null}
            {openFormVerificaCodigoPhone ?
                <FormVerificaCodigoPhoneLink
                    phoneNumber={valueInputPhoneFormPrincipal}
                    code={countryCodeFormPrincipal}
                    confirmationResult={confirmationResult}
                    onGetReturn={handleReturnFormVerificaCodigoPhone}
                    onGetLinked={handleNextPhone}
                    open={openFormVerificaCodigoPhone}
                />
            :null}
        </div>
    )
}

export default FormCreaTuPerfil
