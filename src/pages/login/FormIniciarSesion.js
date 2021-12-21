import React, { useState, useEffect }from 'react';
import InputPassword from './InputPassword';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import './Login.css'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getAuth, 
         sendPasswordResetEmail, 
         signInWithEmailAndPassword } from "firebase/auth";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { withStyles } from '@material-ui/core/styles';
import { emitCustomEvent } from 'react-custom-events';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import { Divider } from '@material-ui/core';

function FormIniciarSesion(props) {
    const [isMounted, setIsMounted] = useState(true);
    const mobilAccess = !useMediaQuery('(min-width:769px)', { noSsr: true });

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

    const handleCloseIniciarSesion = () => {
        props.onGetReturn(true);
        emitCustomEvent('openLoadingPage', false);
    }

    /*submit Iniciar sesion*/
    const handleClickIniciarSesion = () => { 
        if (isMounted){     
        setSubmitInputPasswordFormIniciarSesion(true);    
        }    
    }
    /*fin submit iniciar sesion*/ 
    
    const handleEnter = () => {
        if (isMounted){
        setSubmitInputPasswordFormIniciarSesion(true);
        }        
    }

    const handleRecuperarPassword = () => {
        props.onGetRecoveryPass(true);
        emitCustomEvent('openLoadingPage', false);
    }

    /*variables del componente InputPassword del form inicias sesion*/
    const styleInputPasswordFormIniciarSesion = { marginTop: "30px" };
    const [valueInputPasswordFormIniciarSesion, setValueInputPasswordFormIniciarSesion] = useState('');
    const [submitPasswordFormIniciarSesion, setSubmitInputPasswordFormIniciarSesion] = useState(false);
    const [variableEstadoCargadoNewValuePasswordFormIniciarSesion, setVariableEstadoCargadoNewValuePasswordFormIniciarSesion] = useState(false);
    const submitValuePasswordFormIniciarSesion = (value) => {
        if (isMounted){
        setSubmitInputPasswordFormIniciarSesion(value);
        }
    }
    const getValuePasswordFormIniciarSesion = (password) => {
        if (isMounted){
        setValueInputPasswordFormIniciarSesion(password);
        setVariableEstadoCargadoNewValuePasswordFormIniciarSesion(true);
        }
    }
    /*fin variables de componente InputPassword del form iniciar sesion*/

    /*atencion del valor ingresado del componente InputPassword del form iniciar sesion*/
    useEffect(() => {       
        if (variableEstadoCargadoNewValuePasswordFormIniciarSesion){
            if ((valueInputPasswordFormIniciarSesion !== '')) {
                emitCustomEvent('openLoadingPage', true);
                const auth = getAuth();
                signInWithEmailAndPassword(auth, props.email, valueInputPasswordFormIniciarSesion)
                    .then((userCredential) => {
                        props.onGetClose(true);
                        props.onGetUpdateProfile(true);
                        emitCustomEvent('openLoadingPage', false);
                    })
                    .catch((error) => {
                        if (error.code === 'auth/wrong-password'){
                            emitCustomEvent('openLoadingPage', false);
                            if (isMounted){
                            setMsg('El password ingresado es incorrecto, no te preocupes volvé a intentarlo')
                            setSeverityInfo('error')
                            setOpenMsg(true);
                            }
                        }
                        if (error.code === 'auth/too-many-requests'){
                            const auth = getAuth();
                            sendPasswordResetEmail(auth, props.email)
                              .then(() => {
                                emitCustomEvent('showMsg', String('Demasiados intentos fallidos, te hemos enviado un enlace para restablecer tu contraseña a la dirección ') + String(props.email) + String('/') + String('info'));
                                props.onGetClose(true);
                                emitCustomEvent('openLoadingPage', false);
                            })
                              .catch((error) => {
                                emitCustomEvent('openLoadingPage', false);
                                if (isMounted){
                                setMsg(error.code.split('/')[1].replace(/-/g,' '));
                                setSeverityInfo('error');
                                setOpenMsg(true);
                                }                    
                              });                                
                        } 
                        if (error.code === 'auth/invalid-email'){
                            emitCustomEvent('showMsg', String('No existe una cuenta asociada a ') + String(props.email) + String('/') + String('error'));
                            props.onGetClose(true);
                            emitCustomEvent('openLoadingPage', false);
                        }
                    });
            }
            setVariableEstadoCargadoNewValuePasswordFormIniciarSesion(false);       
        }         
    },[valueInputPasswordFormIniciarSesion, variableEstadoCargadoNewValuePasswordFormIniciarSesion, props, isMounted]);
    /*fin atencion del valor ingresado del componente InputPassword del form Inicias sesion*/


    return (
        <div>
            <Dialog 
                fullScreen={mobilAccess}
                open={props.open}
                onClose = {handleCloseIniciarSesion}
                aria-labelledby="customized-dialog-title" 
                PaperProps = { { 
                    style : {  borderRadius : 15  } 
                } } 
                keepMounted
                disableEscapeKeyDown={true}
            >
            <DialogTitle 
                onClose={handleCloseIniciarSesion}
            >
                <strong>Iniciar sesión</strong>
            </DialogTitle>
            <MuiDialogContent dividers style={{align: 'center'}}>
                <Typography 
                    variant="caption"
                    display="block"
                    gutterBottom
                    style={{
                        width: '100%',
                        marginTop: 10,
                    }}
                > 
                Ingresá la contraseña asociada a tu cuenta {props.email}. Si no la recordás, podés hacer click en el enlace siguiente para recuperarla.                   
                </Typography>
                <InputPassword 
                    style={styleInputPasswordFormIniciarSesion}
                    onGetValuePassword={getValuePasswordFormIniciarSesion} 
                    verify={submitPasswordFormIniciarSesion} 
                    onSubmitValuePassword={submitValuePasswordFormIniciarSesion} 
                    close={!props.open}
                    onGetEnter={handleEnter}
                />
                <Divider style={{width: '100%', marginTop:'20px', marginBottom:'5px'}}/>
                <Button 
                    variant='outlined'
                    className='button__log__continuar'
                    onClick={handleClickIniciarSesion}
                >
                    Iniciá sesión
                </Button>
                <Box 
                    sx={{
                        width: '100%',
                        height: '8rem',
                    }} 
                >
                    <Link
                        component="button"
                        onClick={handleRecuperarPassword}
                        sx={{
                            textDecoration: "underline #000000",
                            color: 'black !important',
                            fontSize: '1rem',
                            marginTop: '1rem !important',
                        }} 
                            >
                        ¿Te olvidaste la contraseña?
                    </Link>            
                </Box>        
            </MuiDialogContent>
            <Snackbar open={openMsg} autoHideDuration={6000} onClose={handleCloseMsg} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{width: '100%'}}>
                <Alert onClose={handleCloseMsg} severity={severityInfo}>{msg}</Alert>
            </Snackbar>
            </Dialog>            
        </div>
    )
}

export default FormIniciarSesion
