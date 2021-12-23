import React, { useEffect, useState } from 'react';
import './Login.css';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { withStyles } from '@material-ui/core/styles';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import { getAuth, 
         PhoneAuthProvider, 
         linkWithCredential,
         unlink, 
        } from "firebase/auth";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { PinInput, PinInputField } from '@chakra-ui/react';
import {emitCustomEvent} from 'react-custom-events';
import { getFirestore, 
    doc, 
    updateDoc,} from "firebase/firestore";

const database = getFirestore();

function FormVerificaCodigoPhoneLink(props) {
    const [isMounted, setIsMounted] = useState(true);
    const mobilAccess = !useMediaQuery('(min-width:769px)', { noSsr: true });
    const [codeVerification, setCodeVerification] = useState('');
    const [value, setValue] = useState('');
    const[ openMsg, setOpenMsg] = useState(false);
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

    const styles = (theme) => ({});
    const DialogTitle = withStyles(styles)((props) => {
        const { children, onClose } = props;
        return (
            <MuiDialogTitle disableTypography 
                style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }} 
            >
                <IconButton aria-label="close"  onClick={onClose}>
                    <ArrowBackIosIcon />
                </IconButton>
                <Typography variant='subtitle2'
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%'
                    }}
                >
                    {children}
                </Typography>
                <IconButton 
                    aria-label="close"  
                    onClick={onClose}
                    disabled={true}
                    style={{
                        color: 'white'
                    }}
                >
                    <ArrowBackIosIcon />
                </IconButton>
            </MuiDialogTitle>
        );
    });

    
    const handleCloseFormVerificaCodigoPhone = () => {
        props.onGetReturn(true);
        emitCustomEvent('openLoadingPage', false);
    } 

    const handleVolveAEnviarlo = () => {
        props.onGetReturn(true);
        emitCustomEvent('openLoadingPage', false);
    }

    const handleChange = (value) => {
        if (isMounted)
        setValue(value)
    }
    
    const handleComplete = (value) => {
        emitCustomEvent('openLoadingPage', true);
        if (isMounted)
        setCodeVerification(value);
    }

    useEffect(() => {
        if (props.open){
            if (isMounted){
            setValue('');
            setCodeVerification('');
            }
        }             
    }, [props, isMounted]);

    useEffect(() => {
        if (codeVerification !== ''){
            if (props.confirmationResult !== null){
                if (isMounted)
                setCodeVerification('');
                const auth = getAuth();
                var credential = PhoneAuthProvider.credential(props.confirmationResult.verificationId, codeVerification);
                if (props.actualizar === true){
                    linkWithCredential(auth.currentUser, credential)
                    .then(async (result) =>{
                        const auth = getAuth();
                        const infoUser = doc(database, "users", auth.currentUser.uid);  
                        await updateDoc(infoUser, {
                            countryCode: props.code,
                        })
                        .then(()=>{
                            props.onGetLinked(true);
                            emitCustomEvent('openLoadingPage', false);
                        })
                        .catch(()=>{
                            props.onGetReturn(true);
                            emitCustomEvent('openLoadingPage', false);
                        });
                    }).catch((error) => {
                        console.log(error);
                        if (error.code === 'auth/invalid-verification-code'){
                            emitCustomEvent('openLoadingPage', false);
                            if (isMounted){
                            setMsg('El código ingresado es incorrecto.');
                            setSeverityInfo('error');
                            setOpenMsg(true);                    
                            setValue('');
                            setCodeVerification('');
                            }
                        }                    
                        if (error.code === 'auth/provider-already-linked'){
                            unlink(auth.currentUser, 'phone')
                            .then(() => {
                                linkWithCredential(auth.currentUser, credential)
                                .then(async (result) =>{
                                    const auth = getAuth();
                                    const infoUser = doc(database, "users", auth.currentUser.uid);  
                                    await updateDoc(infoUser, {
                                        countryCode: props.code,
                                    })
                                    .then(()=>{
                                        props.onGetLinked(true);
                                        emitCustomEvent('openLoadingPage', false);
                                    })
                                    .catch(()=>{
                                        props.onGetReturn(true);
                                        emitCustomEvent('openLoadingPage', false);
                                    });
                                }).catch((error) => {
                                    console.log(error);
                                    if (error.code === 'auth/invalid-verification-code'){
                                        emitCustomEvent('openLoadingPage', false);
                                        if (isMounted){
                                        setMsg('El código ingresado es incorrecto.');
                                        setSeverityInfo('error');
                                        setOpenMsg(true);                    
                                        setValue('');
                                        setCodeVerification('');
                                        }
                                    }                    
                                    if (error.code === 'auth/provider-already-linked'){
                                        emitCustomEvent('openLoadingPage', false);
                                        if (isMounted){
                                        setMsg('Ya tenes un telefono asociado a tu cuenta.');
                                        setSeverityInfo('error');
                                        setOpenMsg(true);                    
                                        setValue('');
                                        setCodeVerification('');
                                        }
                                    }                    
                                });    
                            }).catch((error) => {
                                linkWithCredential(auth.currentUser, credential)
                                .then(async (result) =>{
                                    const auth = getAuth();
                                    const infoUser = doc(database, "users", auth.currentUser.uid);  
                                    await updateDoc(infoUser, {
                                        countryCode: props.code,
                                    })
                                    .then(()=>{
                                        props.onGetLinked(true);
                                        emitCustomEvent('openLoadingPage', false);
                                    })
                                    .catch(()=>{
                                        props.onGetReturn(true);
                                        emitCustomEvent('openLoadingPage', false);
                                    });
                                }).catch((error) => {
                                    console.log(error);
                                    if (error.code === 'auth/invalid-verification-code'){
                                        emitCustomEvent('openLoadingPage', false);
                                        if (isMounted){
                                        setMsg('El código ingresado es incorrecto.');
                                        setSeverityInfo('error');
                                        setOpenMsg(true);                    
                                        setValue('');
                                        setCodeVerification('');
                                        }
                                    }                    
                                    if (error.code === 'auth/provider-already-linked'){
                                        emitCustomEvent('openLoadingPage', false);
                                        if (isMounted){
                                        setMsg('Ya tenes un telefono asociado a tu cuenta.');
                                        setSeverityInfo('error');
                                        setOpenMsg(true);                    
                                        setValue('');
                                        setCodeVerification('');
                                        }
                                    }                    
                                });    
                            });
                        }                    
                    });    
                }else{
                    linkWithCredential(auth.currentUser, credential)
                    .then(async (result) =>{
                        const auth = getAuth();
                        const infoUser = doc(database, "users", auth.currentUser.uid);  
                        await updateDoc(infoUser, {
                            countryCode: props.code,
                        })
                        .then(()=>{
                            props.onGetLinked(true);
                            emitCustomEvent('openLoadingPage', false);
                        })
                        .catch(()=>{
                            props.onGetReturn(true);
                            emitCustomEvent('openLoadingPage', false);
                        });
                    }).catch((error) => {
                        console.log(error);
                        if (error.code === 'auth/invalid-verification-code'){
                            emitCustomEvent('openLoadingPage', false);
                            if (isMounted){
                            setMsg('El código ingresado es incorrecto.');
                            setSeverityInfo('error');
                            setOpenMsg(true);                    
                            setValue('');
                            setCodeVerification('');
                            }
                        }                    
                        if (error.code === 'auth/provider-already-linked'){
                            emitCustomEvent('openLoadingPage', false);
                            if (isMounted){
                            setMsg('Ya tenes un telefono asociado a tu cuenta.');
                            setSeverityInfo('error');
                            setOpenMsg(true);                    
                            setValue('');
                            setCodeVerification('');
                            }
                        }                    
                    });    
                }
            }
        }                
   }, [props, codeVerification, isMounted]);

    return (
        <div>
            <Dialog 
                fullScreen={mobilAccess}
                open={props.open}
                onClose = {handleCloseFormVerificaCodigoPhone}
                aria-labelledby="customized-dialog-title" 
                PaperProps = { { 
                    style : {  borderRadius : 15  } 
                } } 
                keepMounted
                disableEscapeKeyDown={true}
            >
            <DialogTitle
                onClose={handleCloseFormVerificaCodigoPhone}
            >
                <strong>Verificá el código</strong>
            </DialogTitle>
            <MuiDialogContent dividers>
                <Typography variant='h6'
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%'
                    }}
                >
                    <strong>Confirmá tu número de teléfono</strong>
                </Typography> 
                <Typography 
                    variant="caption"
                    gutterBottom
                    style={{
                        width: '100%',
                        marginTop: 10,
                        color: 'gray',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 15,
                    }}
                    >
                    Ingresá el código de 6 dígitos que byOO acaba de enviar a {props.phoneNumber}
                </Typography>
                <div align='center' className='pin'>
                <PinInput 
                    type="numeric"
                    value={value}
                    onChange={handleChange}
                    onComplete={handleComplete}
                >
                    <PinInputField className='pin__input'/>
                    <PinInputField className='pin__input'/>
                    <PinInputField className='pin__input'/>
                    <PinInputField className='pin__input'/>
                    <PinInputField className='pin__input'/>
                    <PinInputField className='pin__input'/>
                </PinInput>
                </div>

                <Typography 
                    variant="caption"
                    gutterBottom
                    style={{
                        width: '100%',
                        marginTop: 10,
                        color: 'gray',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    >
                    ¿No recibiste el mensaje?  
                <Link
                    component="button"
                    onClick={handleVolveAEnviarlo}
                    sx={{
                        textDecoration: "underline #000000",
                        color: 'black !important',
                        fontSize: '13px',
                        marginLeft: '5px',
                    }} 
                >
                    Volvé a enviarlo
                </Link> 
                </Typography>
            </MuiDialogContent>
            <Snackbar open={openMsg} autoHideDuration={6000} onClose={handleCloseMsg} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{width: '100%'}}>
                <Alert onClose={handleCloseMsg} severity={severityInfo}>{msg}</Alert>
            </Snackbar>            
            </Dialog>                          
        </div>
    )
}

export default FormVerificaCodigoPhoneLink