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
import CustomizedSwitch from '../../custom/CustomSwitch';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import InputEmail from '../../login/InputEmail';
import InputName from '../../login/InputName';
import { getFirestore,
    arrayRemove,
    Timestamp, 
    arrayUnion, 
    doc, 
    getDoc,
    updateDoc,
        } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAuth, updateProfile, updateEmail, fetchSignInMethodsForEmail } from "firebase/auth";
import FormReautenticaConPassword from '../login-and-security/FormReautenticaConPassword';
import FormReautenticaConGoogle from '../login-and-security/FormReautenticaConGoogle';
import FormReautenticaConFacebook from '../login-and-security/FormReautenticaConFacebook';
import FormReautenticaConPhone from '../login-and-security/FormReautenticaConPhone';
import FormRecoveryPassword from '../../login/FormRecoveryPassword';

const functions = getFunctions();
const getUser = httpsCallable(functions, 'getUser');        
const getUserByEmail = httpsCallable(functions, 'getUserByEmail');        

const database = getFirestore();

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

    const handleUpdateProfile = useCallback(async () => {
        const infoUser = doc(database, "users", currentUser.uid);
        try{                                  
            const docSnap = await getDoc(infoUser);
            if (docSnap.exists()) {
                getUser(currentUser.uid)
                .then((record) => {
                    if (isMounted){
                        setValueName(docSnap.data().name);
                        setValueLastName(docSnap.data().lastName);
                        setUserEmail(currentUser.email);
                        setLoadingCreated(false);
                        setPhoneNumber(currentUser.phoneNumber);
                        setCountryPhone(docSnap.data().countryCode);
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
        setSubmitName(value);
    }
    const getValueName = (name) => {
        setValueName(name.split('/')[0]);
        setValueLastName(name.split('/')[1]);
        setVariableEstadoCargadoNewValueName(true);
    }
    /*fin variables del componente InputName*/

    const handleEnterName = () => {
        setSubmitName(true);
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
                            setMsg('Se actualizó correctamente tu nombre y apellido');
                            setSeverityInfo('success');
                            setOpenMsg(true);
                            clearStates();
                            handleUpdateProfile();            
                        }).catch((error) => {
                            emitCustomEvent('openLoadingPage', false);
                            setMsg('Ha ocurrido un error al actualizar tu nombre y apellido');
                            setSeverityInfo('error');
                            setOpenMsg(true); 
                            clearStates();
                            handleUpdateProfile();            
                        });
                    })
                    .catch(()=>{
                        emitCustomEvent('openLoadingPage', false);
                        setMsg('Ha ocurrido un error al actualizar tu nombre y apellido');
                        setSeverityInfo('error');
                        setOpenMsg(true); 
                        clearStates();
                        handleUpdateProfile();            
                    });
                }else{
                    emitCustomEvent('openLoadingPage', false);
                    setMsg('El nombre y apellido que estas intentando actualizar son los mismos que tenes actualmente.');
                    setSeverityInfo('info');
                    setOpenMsg(true); 
                }
            }else{
                emitCustomEvent('openLoadingPage', false);
                setMsg('Ha ocurrido un error al intentar acceder a tu información');
                setSeverityInfo('error');
                setOpenMsg(true); 
                clearStates();
                handleUpdateProfile();            
            }
        }

        if (variableEstadoCargadoNewValueName){
            if (valueName !== ''){
                fetchData();
            }
            setVariableEstadoCargadoNewValueName(false);       
        }         

    },[currentUser, valueName, valueLastName, variableEstadoCargadoNewValueName, clearStates, handleUpdateProfile]);
    /*fin atencion del valor ingresado del componente InputPassword del form Registrate*/   


    const handleEnterEmail = () => {
        setSubmitEmail(true);
    }

    /*variables del componente InputEmail Form Principal*/
    const styleInputEmail = { marginTop: "10px" };
    const [submitEmail, setSubmitEmail] = useState(false);
    const [variableEstadoCargadoNewValueEmail, setVariableEstadoCargadoNewValueEmail] = useState(false);
    const submitValueEmail = (value) => {
        setSubmitEmail(value);
    }
    const getValueEmail = (email) => {
        setUserEmail(email);
        setVariableEstadoCargadoNewValueEmail(true);
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
                                console.log('por aca')
                                setMsg('La dirección de correo ' + String(userEmail) + ' es tu dirección actual.');
                                setSeverityInfo('info');
                                setOpenMsg(true); 
                                emitCustomEvent('openLoadingPage', false);    
                            }else{
                                //no es el mismo usuario
                                console.log('por aca')
                                setMsg('No podemos asociar el correo ' + userEmail + ' porque ya se encuentra asociado a otra cuenta.');
                                setSeverityInfo('error');
                                setOpenMsg(true); 
                                emitCustomEvent('openLoadingPage', false);
                                clearStates();
                                handleUpdateProfile();            
                            }
                        })
                        .catch((error)=>{
                        //el mail no esta asociado a ninguna cuenta
                            const antToken = auth.currentUser.accessToken;
                            updateEmail(auth.currentUser, userEmail)
                            .then(async()=>{
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
                                                setMsg('Actualizaste tu correo a ' + String(userEmail) + '.');
                                                setSeverityInfo('success');
                                                setOpenMsg(true); 
                                                emitCustomEvent('openLoadingPage', false);
                                                clearStates();
                                                handleUpdateProfile();
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
                                    console.log('por aca')
                                    setMsg('Ocurrió un error al intentar actualizar el correo de tu cuenta.');
                                    setSeverityInfo('error');
                                    setOpenMsg(true); 
                                    emitCustomEvent('openLoadingPage', false);
                                    clearStates();
                                    handleUpdateProfile();    
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
                                setMsg('La dirección de correo ' + String(userEmail) + ' es tu dirección actual.');
                                setSeverityInfo('info');
                                setOpenMsg(true); 
                                emitCustomEvent('openLoadingPage', false);    
                            }else{
                                const antToken = auth.currentUser.accessToken;
                                updateEmail(auth.currentUser, userEmail)
                                .then(async()=>{
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
                                                    setMsg('Actualizaste tu correo a ' + String(userEmail) + '.');
                                                    setSeverityInfo('success');
                                                    setOpenMsg(true); 
                                                    emitCustomEvent('openLoadingPage', false);
                                                    clearStates();
                                                    handleUpdateProfile();
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
                                        console.log('por aca')
                                        setMsg('Ocurrió un error al intentar actualizar el correo de tu cuenta.');
                                        setSeverityInfo('error');
                                        setOpenMsg(true); 
                                        emitCustomEvent('openLoadingPage', false);
                                        clearStates();
                                        handleUpdateProfile();    
                                    }
                                });                                
                            }
                        }else{
                            //el mail no es el del usuario actual
                            console.log('por aca')
                            setMsg('No podemos asociar el correo ' + userEmail + ' porque ya se encuentra asociado a otra cuenta.');
                            setSeverityInfo('error');
                            setOpenMsg(true); 
                            emitCustomEvent('openLoadingPage', false);
                            clearStates();
                            handleUpdateProfile();            
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                    // Some error occurred, you can inspect the code: error.code
                    setMsg('Ha ocurrido un error al intentar asociar el correo ' + userEmail + ' a tu cuenta.');
                    setSeverityInfo('error');
                    setOpenMsg(true);
                    emitCustomEvent('openLoadingPage', false);
                    clearStates();
                    handleUpdateProfile();    
                });                
            }
            setVariableEstadoCargadoNewValueEmail(false);       
        }       
    },[userEmail, variableEstadoCargadoNewValueEmail, clearStates, currentUser, handleUpdateProfile, details]);
    /*fin atencion del valor ingresado del componente Input Email del form principal*/    

    const handleCloseReautenticaConPassword = () => {
        setOpenFormReautenticaConPassword(false);
        clearStates();
        handleUpdateProfile();                    
    }

    const handleRecoveryPassReautenticaConPassword = () => {
        setOpenFormReautenticaConPassword(false);
        setOpenFormRecoveryPassword(true);
    }

    const handleCredentialOKPassword = () => {
        emitCustomEvent('openLoadingPage', true);
        setOpenFormReautenticaConPassword(false);
        setOpenFormReautenticaConGoogle(false);
        setOpenFormReautenticaConFacebook(false);
        setOpenFormReautenticaConPhone(false);
        const auth = getAuth();
        const antToken = auth.currentUser.accessToken;
        updateEmail(auth.currentUser, userEmail)
        .then(async()=>{
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
                            setMsg('Actualizaste tu correo a ' + String(userEmail) + '.');
                            setSeverityInfo('success');
                            setOpenMsg(true); 
                            emitCustomEvent('openLoadingPage', false);
                            clearStates();
                            handleUpdateProfile();
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
            setMsg('Ocurrió un error al intentar actualizar el correo de tu cuenta.');
            setSeverityInfo('error');
            setOpenMsg(true); 
            emitCustomEvent('openLoadingPage', false);
            clearStates();
            handleUpdateProfile();    
        });  
    }

    const handleCloseFormRecoveryPassword = () => {
        setOpenFormRecoveryPassword(false);
    }

    const handleReturnFormRecoveryPassword = () =>{
        setOpenFormRecoveryPassword(false);
        setOpenFormReautenticaConPassword(true);
    }

    const handleCloseReautenticaConGoogle = () => {
        setOpenFormReautenticaConGoogle(false);
        clearStates();
        handleUpdateProfile();                    
    }

    const handleCredentialOKGoogle = () => {
        handleCredentialOKPassword();
    }

    const handleErrorReautenticaConGoogle = () => {
        setOpenFormReautenticaConGoogle(false);
        emitCustomEvent('openLoadingPage', false);
    }
       
    const handleClickReautenticaConGoogle = () => {
        emitCustomEvent('openLoadingPage', true);
    }

    const handleCloseReautenticaConFacebook = () => {
        setOpenFormReautenticaConFacebook(false);
        clearStates();
        handleUpdateProfile();                    
    }
      
    const handleCredentialOKFacebook = () => {
        handleCredentialOKPassword();
    }
    
    const handleErrorReautenticaConFacebook = () => {
        setOpenFormReautenticaConFacebook(false);
        emitCustomEvent('openLoadingPage', false);
    }    

    const handleClickReautenticaConFacebook = () => {
        emitCustomEvent('openLoadingPage', true);
    }

    const handleCloseReautenticaConPhone = () => {
        setOpenFormReautenticaConPhone(false);
        clearStates();
        handleUpdateProfile();                    
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
                                                onGetValueName={getValueName} 
                                                verify={submitName} 
                                                onSubmitValueName={submitValueName} 
                                                close={loadingCreated}
                                                onGetEnter={handleEnterName}
                                                name={valueName}
                                                lastName={valueLastName}
                                            />
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
                    email={userEmail}
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
                    email={userEmail}
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
        </div>
    )
}

export default PersonalInfo