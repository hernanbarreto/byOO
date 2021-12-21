import React, { useState, useEffect }from 'react';
import './Login.css';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InputPassword from './InputPassword';
import LoginWithGoogle from './LoginWithGoogle';
import LoginWithFacebook from './LoginWithFacebook';
import { getAuth, 
    sendPasswordResetEmail, 
    signInWithEmailAndPassword,
    RecaptchaVerifier,
    signInWithPhoneNumber } from "firebase/auth";
import { emitCustomEvent } from 'react-custom-events';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { getFunctions, httpsCallable } from "firebase/functions";
import { Divider } from '@material-ui/core';
import FormVerificaCodigoPhone from './FormVerificaCodigoPhone';

const functions = getFunctions();
const getUserByEmail = httpsCallable(functions, 'getUserByEmail');

var recaptchaVerifier;
function FormExisteCuenta(props) {
    const [isMounted, setIsMounted] = useState(true);
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

    const [email, setEmail] = useState(null);
    const [googleProvider, setGoogleProvider] = useState(false);
    const [facebookProvider, setFacebookProvider] = useState(false);
    const [passwordProvider, setPasswordProvider] = useState(false);
    const [phoneProvider, setPhoneProvider] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [txtBtnContinuar, setTxtBtnContinuar] = useState('Continuar');
    const [classNameBtnContinuar, setClassNameBtnContinuar] = useState('button__log__continuar');
    const [openFormVerificaCodigoPhone, setOpenFormVerificaCodigoPhone] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState(null);
    const mobilAccess = !useMediaQuery('(min-width:769px)', { noSsr: true });

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
                    <CloseIcon />
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
                    <CloseIcon />
                </IconButton>
            </MuiDialogTitle>
        );
    });

    const handleCloseExisteCuenta = () => {
        if (recaptchaVerifier !== undefined)
            if (!recaptchaVerifier.destroyed) 
                recaptchaVerifier.clear();
        if (isMounted){
        setTxtBtnContinuar('Continuar');
        setClassNameBtnContinuar('button__log__continuar');
        }
        emitCustomEvent('openLoadingPage', false);
        props.onGetReturn(true);
    }

    /*submit Iniciar sesion*/
    const handleClickIniciarSesion = () => {
        if (recaptchaVerifier !== undefined)
            if (!recaptchaVerifier.destroyed) 
                recaptchaVerifier.clear();
        if (isMounted){
        setTxtBtnContinuar('Continuar');
        setClassNameBtnContinuar('button__log__continuar');
        setSubmitInputPasswordFormIniciarSesion(true);       
        } 
    }
    /*fin submit iniciar sesion*/ 
    
    const handleEnter = () => {
        if (recaptchaVerifier !== undefined)
            if (!recaptchaVerifier.destroyed) 
                recaptchaVerifier.clear();
        if (isMounted){
        setTxtBtnContinuar('Continuar');
        setClassNameBtnContinuar('button__log__continuar');
        setSubmitInputPasswordFormIniciarSesion(true); 
        }       
    }

    const handleRecuperarPassword = () => {
        if (recaptchaVerifier !== undefined)
            if (!recaptchaVerifier.destroyed) 
                recaptchaVerifier.clear();
        if (isMounted){
        setTxtBtnContinuar('Continuar');
        setClassNameBtnContinuar('button__log__continuar');
        }

        props.onGetRecoveryPass(true);
        emitCustomEvent('openLoadingPage', false);
    }

    const handleErrorFacebook = () => {
        if (recaptchaVerifier !== undefined)
            if (!recaptchaVerifier.destroyed) 
                recaptchaVerifier.clear();
        if (isMounted){
        setTxtBtnContinuar('Continuar');
        setClassNameBtnContinuar('button__log__continuar');
        }

        emitCustomEvent('openLoadingPage', false);
    }

    const handleErrorGoogle = () => {
        emitCustomEvent('openLoadingPage', false);
    }

    const handleClickGoogle = () => {
        if (recaptchaVerifier !== undefined)
            if (!recaptchaVerifier.destroyed) 
                recaptchaVerifier.clear();
        if (isMounted){
        setTxtBtnContinuar('Continuar');
        setClassNameBtnContinuar('button__log__continuar');      
        }  

        emitCustomEvent('openLoadingPage', true);
    }

    const handleClickFacebook = () => {
        if (recaptchaVerifier !== undefined)
            if (!recaptchaVerifier.destroyed) 
                recaptchaVerifier.clear();
        if (isMounted){
        setTxtBtnContinuar('Continuar');
        setClassNameBtnContinuar('button__log__continuar');
        }

        emitCustomEvent('openLoadingPage', true);
    }

    const handleEmail = (email) => {
        if (recaptchaVerifier !== undefined)
            if (!recaptchaVerifier.destroyed) 
                recaptchaVerifier.clear();
        if (isMounted){
        setTxtBtnContinuar('Continuar');
        setClassNameBtnContinuar('button__log__continuar');
        }

        props.onGetEmail(email);
    }

    const handleTerminaRegistrarteGoogle = (value) => {
        if (recaptchaVerifier !== undefined)
            if (!recaptchaVerifier.destroyed) 
                recaptchaVerifier.clear();
        if (isMounted){
        setTxtBtnContinuar('Continuar');
        setClassNameBtnContinuar('button__log__continuar');
        }

        if (value){
            props.onGetOpenFormTerminaDeRegistrarte(true);
        }
        props.onGetClose(true);
        emitCustomEvent('openLoadingPage', false);
    }
    
    const handleTerminaRegistrarteFacebook = (value) => {
        if (recaptchaVerifier !== undefined)
            if (!recaptchaVerifier.destroyed) 
                recaptchaVerifier.clear();
        if (isMounted){
        setTxtBtnContinuar('Continuar');
        setClassNameBtnContinuar('button__log__continuar');
        }

        if (value){
            props.onGetOpenFormTerminaDeRegistrarte(true);
        }
        props.onGetClose(true);
        emitCustomEvent('openLoadingPage', false);
    }

    const handleGoogleUser = (value) => {
        if (recaptchaVerifier !== undefined)
            if (!recaptchaVerifier.destroyed) 
                recaptchaVerifier.clear();
        if (isMounted){
        setTxtBtnContinuar('Continuar');
        setClassNameBtnContinuar('button__log__continuar');
        }

        emitCustomEvent('openLoadingPage', false);
        props.onGetNameFormTerminaDeRegistrarte(value.profileObj.givenName);
        props.onGetApellidoFormTerminaDeRegistrarte(value.profileObj.familyName);
        props.onGetEmailFormTerminaDeRegistrarte(value.profileObj.email);
        props.onGetFacebookUser(null);
        props.onGetGoogleUser(value);
    }

    const handleFacebookUser = (value) => {
        if (recaptchaVerifier !== undefined)
            if (!recaptchaVerifier.destroyed) 
                recaptchaVerifier.clear();
        if (isMounted){
        setTxtBtnContinuar('Continuar');
        setClassNameBtnContinuar('button__log__continuar');
        }

        emitCustomEvent('openLoadingPage', false);
        props.onGetNameFormTerminaDeRegistrarte(value.name.split(' ')[0]);
        props.onGetApellidoFormTerminaDeRegistrarte(value.name.split(' ')[1]);
        props.onGetEmailFormTerminaDeRegistrarte(value.email);
        props.onGetGoogleUser(null);
        props.onGetFacebookUser(value);
    }

    const handleProviders = () => {

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
        if (props.open){
            if (props.email !== null){
                let k='';            
                for (var i = 0; i< props.email.split('@')[0].length-2; i++){
                    k+='*';
                }
                if (isMounted){
                setEmail(props.email.split('@')[0].substring(0,1) + k + props.email.split('@')[0].substring(props.email.split('@')[0].length-1, props.email.split('@')[0].length) + '@' + props.email.split('@')[1]);
                }
            }
        }else{
            if (isMounted){
            setEmail(null);
            }
        }

        if (props.providers.length !==0){
            if (props.providers.includes('google.com')){
                if (isMounted){
                setGoogleProvider(true);
                }
            }else{
                if (isMounted){
                setGoogleProvider(false);
                }
            }
            if (props.providers.includes('facebook.com')){
                if (isMounted){
                setFacebookProvider(true);
                }
            }else{
                if (isMounted){
                setFacebookProvider(false);
                }
            }
            if (props.providers.includes('password')){
                if (isMounted){
                setPasswordProvider(true);
                }
            }else{
                if (isMounted){
                setPasswordProvider(false);
                }
            }
            if (props.providers.includes('phone')){
                if (props.email !== null){
                    getUserByEmail(props.email)
                    .then((userRecord) => {
                        if (isMounted){
                        setPhoneNumber(userRecord.data.phoneNumber);
                        setPhoneProvider(true);
                        }
                    })
                    .catch((error)=>{
                        console.log(error);
                        if (isMounted){
                        setPhoneNumber(null);
                        setPhoneProvider(false);
                        }
                    });
                }else{
                    if (isMounted){
                    setPhoneProvider(false);
                    }
                }
            }else{
                if (isMounted){
                setPhoneProvider(false);
                }
            }
        }

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
            if (isMounted){
            setVariableEstadoCargadoNewValuePasswordFormIniciarSesion(false); 
            }      
        }          
    },[valueInputPasswordFormIniciarSesion, variableEstadoCargadoNewValuePasswordFormIniciarSesion, props, email, isMounted]);
    /*fin atencion del valor ingresado del componente InputPassword del form Inicias sesion*/

    const handleUpdateProfile = () => {
        props.onGetUpdateProfile(true);
    }

    const handleSubmit = () => {
        if (txtBtnContinuar === 'Continuar'){
            const auth = getAuth();
            auth.languageCode = props.lenguaje;
            recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
                type: 'image', // 'audio'
                size: 'normal', // 'normal, invisible' or 'compact'
                badge: 'inline' //' bottomright' or 'inline' applies to invisible.                    
            }, auth);
            if (isMounted){
            setTxtBtnContinuar('Cancelar');
            setClassNameBtnContinuar('button__log__BW');
            }
            emitCustomEvent('openLoadingPage', false);
            signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
            .then((confirmationResult) => {
                emitCustomEvent('openLoadingPage', true);
                if (recaptchaVerifier !== undefined)
                    if (!recaptchaVerifier.destroyed) 
                        recaptchaVerifier.clear();
                if (isMounted){
                setTxtBtnContinuar('Continuar');
                setClassNameBtnContinuar('button__log__continuar');
                setConfirmationResult(confirmationResult);
                setOpenFormVerificaCodigoPhone(true);
                }
                emitCustomEvent('openLoadingPage', false);
            }).catch((error) => {
                // Error; SMS not sent
                // ...
                emitCustomEvent('openLoadingPage', false);
                if (recaptchaVerifier !== undefined)
                    if (!recaptchaVerifier.destroyed) 
                        recaptchaVerifier.clear();
                if (isMounted){
                setTxtBtnContinuar('Continuar');
                setClassNameBtnContinuar('button__log__continuar');
                setMsg('No pudimos enviar el SMS al número de teléfono ' + String(phoneNumber));
                setSeverityInfo('error');
                setOpenMsg(true);    
                }                
            });                
         }else{
            if (recaptchaVerifier !== undefined)
                if (!recaptchaVerifier.destroyed) 
                    recaptchaVerifier.clear();
            if (isMounted){
            setTxtBtnContinuar('Continuar');
            setClassNameBtnContinuar('button__log__continuar');
            }
        }
    }

    const handleRegistred1 = (user) => {
    }

    const handleReturnFormVerificaCodigoPhone = () => {
        if (isMounted){
        setOpenFormVerificaCodigoPhone(false);
        }
    }

    const handleCloseFormVerificaCodigoPhone = () => {
        if (isMounted){
        setOpenFormVerificaCodigoPhone(false);
        }
        props.onGetClose(true);
    }

    return (
        <div>
            <Dialog 
                fullScreen={mobilAccess}
                open={props.open}
                onClose = {handleCloseExisteCuenta}
                aria-labelledby="customized-dialog-title" 
                PaperProps = { { 
                    style : {  borderRadius : 15  } 
                } } 
                keepMounted
                disableEscapeKeyDown={true}
            >
            <DialogTitle
                onClose={handleCloseExisteCuenta}
            >
                <strong>Ya existe esta cuenta</strong>
            </DialogTitle>
            <MuiDialogContent dividers>
                <Typography 
                    variant="caption"
                    gutterBottom
                    style={{
                        width: '100%',
                        color: 'gray',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    >
                    Parece que ya tenés una cuenta.
                </Typography>
                <Avatar
                    sx={{
                        height: 100,
                        width:100,
                        margin: '10px auto',
                    }} 
                >
                    <AccountCircleIcon
                        sx={{
                            height: 116,
                            width:116,
                        }} 
                    />
                </Avatar>
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
                    {email}
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
                    }}
                    >
                    Podés ingresar por cualquiera de los siguientes proveedores.
                </Typography>
                <Divider style={{width: '100%', marginTop:'10px', marginBottom:'5px'}}/>
                {passwordProvider ?
                <>
                <InputPassword 
                    style={styleInputPasswordFormIniciarSesion}
                    onGetValuePassword={getValuePasswordFormIniciarSesion} 
                    verify={submitPasswordFormIniciarSesion} 
                    onSubmitValuePassword={submitValuePasswordFormIniciarSesion} 
                    close={!props.open}
                    onGetEnter={handleEnter}
                />
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
                    }} 
                >
                    <Link
                        component="button"
                        onClick={handleRecuperarPassword}
                        sx={{
                            textDecoration: "underline #000000",
                            color: 'black !important',
                            fontSize: '0.8rem',
                            marginTop: '1rem !important',
                        }} 
                            >
                        ¿Te olvidaste la contraseña?
                    </Link>            
                </Box>
                <Divider style={{width: '100%', marginTop:'10px', marginBottom:'5px'}}/>
                </>
                :null}
                {facebookProvider ?
                <>
                <LoginWithFacebook
                    onGetFacebookUser={handleFacebookUser}
                    onGetClick={handleClickFacebook}
                    onGetError={handleErrorFacebook}
                    onGetTerminarRegistrarte={handleTerminaRegistrarteFacebook}
                    onGetEmail={handleEmail}
                    onGetProviders={handleProviders}
                    onGetUpdateProfile={handleUpdateProfile}
                /> 
                <Divider style={{width: '100%', marginTop:'10px', marginBottom:'5px'}}/>
                </>
                :null}
                {googleProvider ?
                <>
                <LoginWithGoogle
                    onGetGoogleUser={handleGoogleUser}
                    onGetClick={handleClickGoogle}
                    onGetError={handleErrorGoogle}
                    onGetTerminarRegistrarte={handleTerminaRegistrarteGoogle}
                    onGetEmail={handleEmail}
                    onGetProviders={handleProviders}
                    onGetUpdateProfile={handleUpdateProfile}
                />
                <Divider style={{width: '100%', marginTop:'10px', marginBottom:'5px'}}/>
                </>
                :null}
                {phoneProvider ?
                <>
                <Typography 
                    variant="caption"
                    gutterBottom
                    style={{
                        width: '100%',
                        marginTop: 10,
                        color: 'gray',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    >
                    Enviar un código de verificación al número <strong>{phoneNumber}</strong>. Se aplican tarifas estándar para mensajes y uso de datos.
                </Typography>
                <div align='center' id="recaptcha-container" className='recaptchaClass'></div>
                <Button 
                    variant='outlined'
                    className={classNameBtnContinuar}
                    disableElevation
                    onClick={handleSubmit}
                >
                {txtBtnContinuar}
                </Button>                
                <Divider style={{width: '100%', marginTop:'10px', marginBottom:'5px'}}/>
                </>
                :null}
                <Box 
                    sx={{
                        width: '100%',
                    }} 
                >
                    <Link
                        component="button"
                        onClick={handleCloseExisteCuenta}
                        sx={{
                            textDecoration: "underline #000000",
                            color: 'black !important',
                            fontSize: '0.8rem',
                            marginTop: '1rem !important',
                        }} 
                            >
                        Iniciá sesión con otra cuenta
                    </Link>            
                </Box>        
            </MuiDialogContent>
            <Snackbar open={openMsg} autoHideDuration={6000} onClose={handleCloseMsg} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{width: '100%'}}>
                <Alert onClose={handleCloseMsg} severity={severityInfo}>{msg}</Alert>
            </Snackbar>
            </Dialog>
            {openFormVerificaCodigoPhone ?
            <FormVerificaCodigoPhone
                phoneNumber={phoneNumber}
                name={null}
                confirmationResult={confirmationResult}
                onGetReturn={handleReturnFormVerificaCodigoPhone}
                onGetClose={handleCloseFormVerificaCodigoPhone}
                onGetRegistred={handleRegistred1}
                onGetUpdateProfile={handleUpdateProfile}
                open={openFormVerificaCodigoPhone}
            />
            :null}
        </div>
    )
}

export default FormExisteCuenta