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
    signInWithEmailAndPassword } from "firebase/auth";
import { emitCustomEvent } from 'react-custom-events';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function FormExisteCuenta(props) {
    const[ openMsg, setOpenMsg] = useState(false);
    const [severityInfo, setSeverityInfo] = useState('success');
    const [msg, setMsg] = useState('');
    const handleCloseMsg = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpenMsg(false);
    };

    const [email, setEmail] = useState(null);
    const [googleProvider, setGoogleProvider] = useState(false);
    const [facebookProvider, setFacebookProvider] = useState(false);
    const [passwordProvider, setPasswordProvider] = useState(false);
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
        emitCustomEvent('openLoadingPage', false);
        props.onGetReturn(true);
    }

    /*submit Iniciar sesion*/
    const handleClickIniciarSesion = () => {      
        setSubmitInputPasswordFormIniciarSesion(true);        
    }
    /*fin submit iniciar sesion*/ 
    
    const handleEnter = () => {
        setSubmitInputPasswordFormIniciarSesion(true);        
    }

    const handleRecuperarPassword = () => {
        props.onGetRecoveryPass(true);
        emitCustomEvent('openLoadingPage', false);
    }

    const handleErrorFacebook = () => {
        emitCustomEvent('openLoadingPage', false);
    }

    const handleErrorGoogle = () => {
        emitCustomEvent('openLoadingPage', false);
    }

    const handleClickGoogle = () => {
        emitCustomEvent('openLoadingPage', true);
    }

    const handleClickFacebook = () => {
        emitCustomEvent('openLoadingPage', true);
    }

    const handleEmail = (email) => {
        props.onGetEmail(email);
    }

    const handleTerminaRegistrarteGoogle = (value) => {
        if (value){
            props.onGetOpenFormTerminaDeRegistrarte(true);
        }
        props.onGetClose(true);
        emitCustomEvent('openLoadingPage', false);
    }
    
    const handleTerminaRegistrarteFacebook = (value) => {
        if (value){
            props.onGetOpenFormTerminaDeRegistrarte(true);
        }
        props.onGetClose(true);
        emitCustomEvent('openLoadingPage', false);
    }

    const handleGoogleUser = (value) => {
        emitCustomEvent('openLoadingPage', false);
        props.onGetNameFormTerminaDeRegistrarte(value.profileObj.givenName);
        props.onGetApellidoFormTerminaDeRegistrarte(value.profileObj.familyName);
        props.onGetEmailFormTerminaDeRegistrarte(value.profileObj.email);
        props.onGetFacebookUser(null);
        props.onGetGoogleUser(value);
    }

    const handleFacebookUser = (value) => {
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
        setSubmitInputPasswordFormIniciarSesion(value);
    }
    const getValuePasswordFormIniciarSesion = (password) => {
        setValueInputPasswordFormIniciarSesion(password);
        setVariableEstadoCargadoNewValuePasswordFormIniciarSesion(true);
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
                setEmail(props.email.split('@')[0].substring(0,1) + k + props.email.split('@')[0].substring(props.email.split('@')[0].length-1, props.email.split('@')[0].length) + '@' + props.email.split('@')[1]);
            }
        }else{
            setEmail(null);
        }

        if (props.providers.length !==0){
            if (props.providers.includes('google.com')){
                setGoogleProvider(true);
            }else{
                setGoogleProvider(false);
            }
            if (props.providers.includes('facebook.com')){
                setFacebookProvider(true);
            }else{
                setFacebookProvider(false);
            }
            if (props.providers.includes('password')){
                setPasswordProvider(true);
            }else{
                setPasswordProvider(false);
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
                            setMsg('El password ingresado es incorrecto, no te preocupes volvé a intentarlo')
                            setSeverityInfo('error')
                            setOpenMsg(true);
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
                                setMsg(error.code.split('/')[1].replace(/-/g,' '));
                                setSeverityInfo('error');
                                setOpenMsg(true);                    
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
    },[valueInputPasswordFormIniciarSesion, variableEstadoCargadoNewValuePasswordFormIniciarSesion, props, email]);
    /*fin atencion del valor ingresado del componente InputPassword del form Inicias sesion*/

    const handleUpdateProfile = () => {
        props.onGetUpdateProfile(true);
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
                {passwordProvider ?
                <InputPassword 
                    style={styleInputPasswordFormIniciarSesion}
                    onGetValuePassword={getValuePasswordFormIniciarSesion} 
                    verify={submitPasswordFormIniciarSesion} 
                    onSubmitValuePassword={submitValuePasswordFormIniciarSesion} 
                    close={!props.open}
                    onGetEnter={handleEnter}
                />
                :null}
                {passwordProvider ?
                <Button 
                    variant='outlined'
                    className='button__log__continuar'
                    onClick={handleClickIniciarSesion}
                >
                    Iniciá sesión
                </Button>
                :null}
                {passwordProvider ?
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
                :null}
                {facebookProvider ?
                <LoginWithFacebook
                    onGetFacebookUser={handleFacebookUser}
                    onGetClick={handleClickFacebook}
                    onGetError={handleErrorFacebook}
                    onGetTerminarRegistrarte={handleTerminaRegistrarteFacebook}
                    onGetEmail={handleEmail}
                    onGetProviders={handleProviders}
                    onGetUpdateProfile={handleUpdateProfile}
                /> 
                :null}
                {googleProvider ?
                <LoginWithGoogle
                    onGetGoogleUser={handleGoogleUser}
                    onGetClick={handleClickGoogle}
                    onGetError={handleErrorGoogle}
                    onGetTerminarRegistrarte={handleTerminaRegistrarteGoogle}
                    onGetEmail={handleEmail}
                    onGetProviders={handleProviders}
                    onGetUpdateProfile={handleUpdateProfile}
                />
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
        </div>
    )
}

export default FormExisteCuenta