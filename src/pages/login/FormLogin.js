import React, { useEffect, useState } from 'react';
import './Login.css'
import InputCountrySelectPhone from './InputCountrySelectPhone';
import InputEmail from './InputEmail';
import Dialog from '@material-ui/core/Dialog';
import useMediaQuery from '@mui/material/useMediaQuery';
import LoginWithGoogle from './LoginWithGoogle';
import LoginWithFacebook from './LoginWithFacebook';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import EmailIcon from '@mui/icons-material/Email';
import { Button } from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { Divider } from '@material-ui/core';
import { getAuth, 
         fetchSignInMethodsForEmail, 
         signInWithPhoneNumber, 
         RecaptchaVerifier } from "firebase/auth";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { getFunctions, httpsCallable } from "firebase/functions";
import Link from '@mui/material/Link';
import { emitCustomEvent } from 'react-custom-events';

const functions = getFunctions();
const getUserByPhoneNumber = httpsCallable(functions, 'getUserByPhoneNumber');
const getUserByEmail = httpsCallable(functions, 'getUserByEmail');

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

var recaptchaVerifier;
function FormLogin(props) {
    const [isMounted, setIsMounted] = useState(true);
    const mobilAccess = !useMediaQuery('(min-width:769px)', { noSsr: true });
    const [txtBtnContinuar, setTxtBtnContinuar] = useState('Continuar');
    const [classNameBtnContinuar, setClassNameBtnContinuar] = useState('button__log__continuar');

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
                >
                    <CloseIcon />
                </IconButton>
            </MuiDialogTitle>
        );
    });

    const [showEmail, setShowEmail] = useState(false);
    const [showPhone, setShowPhone] = useState(true);    
    
    const handleCloseLogin = () => {
        if (recaptchaVerifier !== undefined)
            if (!recaptchaVerifier.destroyed) 
                recaptchaVerifier.clear();
        emitCustomEvent('openLoadingPage', false);
        if (isMounted){
        setTxtBtnContinuar('Continuar');
        setClassNameBtnContinuar('button__log__continuar');
        }
        props.onGetClose(true);
    }
    
    const handleClickLogEmail = () => {
        if (recaptchaVerifier !== undefined)
            if (!recaptchaVerifier.destroyed) 
                recaptchaVerifier.clear();
        if (isMounted){
        setShowEmail(true);
        setShowPhone(false);
        setTxtBtnContinuar('Continuar');
        setClassNameBtnContinuar('button__log__continuar');
        }
    }      

    const handleClickLogPhone = () => {
        if (recaptchaVerifier !== undefined)
            if (!recaptchaVerifier.destroyed) 
                recaptchaVerifier.clear();
        if (isMounted){
        setShowEmail(false);
        setShowPhone(true);
        setTxtBtnContinuar('Continuar');
        setClassNameBtnContinuar('button__log__continuar');
        }
    }
    
    /*atencion del handler submit del form principal*/
    const handleSubmit = () => {
        if (showPhone){
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
        }else{
            if (isMounted){
            setSubmitEmailFormPrincipal(true);    
            }       
        }
    }
    /*fin atencion del handler submit del form principal*/

    const handleEnter = () => {
        if (showPhone){
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
        }else{
            if (isMounted){
            setSubmitEmailFormPrincipal(true);  
            }         
        }
    }

    /*variables del componente CountrySelectPhone*/
    const styleSelectCountryPhoneFormPrincipal = { marginTop: "30px" };
    const [valueInputPhoneFormPrincipal, setValueInputPhoneFormPrincipal] = useState('');
    const [submitCountrySelectPhoneFormPrincipal, setSubmitCountrySelectPhoneFormPrincipal] = useState(false);
    const [variableEstadoCargadoNewValuePhoneFormPrincipal, setVariableEstadoCargadoNewValuePhoneFormPrincipal] = useState(false);
    const [countryCode, setCountryCode] = useState(null);
    const submitValuePhoneFormPicnipal = (value) => {
        if (isMounted){
        setSubmitCountrySelectPhoneFormPrincipal(value);
        }
    }
    const getValuePhoneCountrySelectPhoneFormPrincipal = (phone) => {
        if (isMounted){
        setValueInputPhoneFormPrincipal(phone[0]);
        setCountryCode(phone[1].code);
        setVariableEstadoCargadoNewValuePhoneFormPrincipal(true);
        }
    }

    /*fin variables de componente CountrySelectPhone*/

    /*atencion del valor ingresado del componente CountrySelectPhone*/
    useEffect(() => {       
        if (variableEstadoCargadoNewValuePhoneFormPrincipal){
            if ((valueInputPhoneFormPrincipal !== '')) {
                emitCustomEvent('openLoadingPage', true);
                getUserByPhoneNumber(valueInputPhoneFormPrincipal)  
                .then((userRecord) => {
                    //el usuario existe
                    const auth = getAuth();
                    auth.languageCode = props.lenguaje;
                    recaptchaVerifier = new RecaptchaVerifier('recaptcha-container1', {
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
                    .then((confirmationResult) => {
                        emitCustomEvent('openLoadingPage', true);
                        if (recaptchaVerifier !== undefined)
                            if (!recaptchaVerifier.destroyed) 
                                recaptchaVerifier.clear();
                        if (isMounted){
                        setTxtBtnContinuar('Continuar');
                        setClassNameBtnContinuar('button__log__continuar');
                        }
                        props.onGetPhoneNumber([valueInputPhoneFormPrincipal, countryCode]);
                        props.onGetConfirmationResult(confirmationResult);
                        props.onGetOpenFormVerificaCodigoPhone(true);
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
                        setMsg('No pudimos enviar el SMS al número de teléfono ' + String(valueInputPhoneFormPrincipal));
                        setSeverityInfo('error');
                        setOpenMsg(true);      
                        }              
                    });                
                })
                .catch((error) => {
                    //el usuario no existe
                    props.onGetPhoneNumber([valueInputPhoneFormPrincipal, countryCode]);
                    props.onGetOpenFormTerminaDeRegistrartePhone(true);
                    emitCustomEvent('openLoadingPage', false);
                });
             }
             if (isMounted){
                  setVariableEstadoCargadoNewValuePhoneFormPrincipal(false); 
             }      
        }         
    },[props, valueInputPhoneFormPrincipal, variableEstadoCargadoNewValuePhoneFormPrincipal, countryCode, isMounted]);
    /*fin atencion del valor ingresado del componente CountrySelectPhone*/

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
      
    /*atencion del valor ingresado del componente Input Email del form principal*/
    useEffect(() => {       
        if (variableEstadoCargadoNewValueEmailFormPrincipal){
            if ((valueInputEmailFormPrincipal !== '')) {
                emitCustomEvent('openLoadingPage', true);
                const auth = getAuth();
                getUserByEmail(valueInputEmailFormPrincipal)
                .then((userRecord) => {
                    const filtered = userRecord.data.providerData.filter(function(element){
                        return ((element.email === valueInputEmailFormPrincipal) && (element.providerId === 'password'));
                    });
                    if (filtered.length !== 0){
                        emitCustomEvent('openLoadingPage', false);
                        props.onGetValueInputEmailFormPrincipal(valueInputEmailFormPrincipal);
                        props.onGetOpenFormIniciarSesion (true);
                        props.onGetClose(true);                        
                    }else{
                        fetchSignInMethodsForEmail(auth, valueInputEmailFormPrincipal)
                        .then(providers => {
                            if (providers.length !== 0){
                                var i = providers.indexOf('password');
                                i !== -1 && providers.splice( i, 1 );
                                emitCustomEvent('openLoadingPage', false);
                                props.onGetExisteCuenta(providers);
                                props.onGetEmail(valueInputEmailFormPrincipal);
                            }else{
                                emitCustomEvent('openLoadingPage', false);
                                props.onGetExisteCuenta(['phone']);
                                props.onGetEmail(valueInputEmailFormPrincipal);
                            }
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
                })
                .catch((error) => {
                    fetchSignInMethodsForEmail(auth, valueInputEmailFormPrincipal)
                    .then(providers => {
                        if ((providers.length) === 0) {
                            //email inexistente, debe crear password
                            emitCustomEvent('openLoadingPage', false);
                            props.onGetValueInputEmailFormPrincipal(valueInputEmailFormPrincipal);
                            props.onGetOpenFormRegistrate (true);
                            props.onGetClose(true);
                        } else {
                            if (providers.length !== 0){
                                var i = providers.indexOf('password');
                                i !== -1 && providers.splice( i, 1 );
                                emitCustomEvent('openLoadingPage', false);
                                props.onGetExisteCuenta(providers);
                                props.onGetEmail(valueInputEmailFormPrincipal);
                            }else{
                                emitCustomEvent('openLoadingPage', false);
                                props.onGetExisteCuenta(['phone']);
                                props.onGetEmail(valueInputEmailFormPrincipal);
                            }
                        }
                    })
                    .catch((error) => {
                        // Some error occurred, you can inspect the code: error.code
                        emitCustomEvent('openLoadingPage', false);
                        if (isMounted){
                        setMsg(error.code.split('/')[1].replace(/-/g,' '));
                        setSeverityInfo('error');
                        setOpenMsg(true);
                        }                    
                    });           
                });                
            }
            if (isMounted){
            setVariableEstadoCargadoNewValueEmailFormPrincipal(false); 
            }      
        }       
    },[props, valueInputEmailFormPrincipal, variableEstadoCargadoNewValueEmailFormPrincipal, isMounted]);
    /*fin atencion del valor ingresado del componente Input Email del form principal*/    
    
    const handleProvidersGoogle = (providers) => {
        props.onGetExisteCuenta(providers);
        emitCustomEvent('openLoadingPage', false);
    }

    const handleProvidersFacebook = (providers) => {
        props.onGetExisteCuenta(providers);
        emitCustomEvent('openLoadingPage', false);
    }

    const handleEmail = (email) => {
        props.onGetEmail(email);
    }

    const handleTerminaRegistrarteGoogle = (value) => {
        if (value){
            props.onGetOpenFormTerminaDeRegistrarte(true);
        }
        handleCloseLogin();
    }
    const handleTerminaRegistrarteFacebook = (value) => {
        if (value){
            props.onGetOpenFormTerminaDeRegistrarte(true);
        }
        handleCloseLogin();
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

    const handleClickGoogle = () => {
        emitCustomEvent('openLoadingPage', true);
        if (recaptchaVerifier !== undefined)
            if (!recaptchaVerifier.destroyed) 
                recaptchaVerifier.clear();
        if (isMounted){
        setTxtBtnContinuar('Continuar');
        setClassNameBtnContinuar('button__log__continuar');
        }
    }

    const handleClickFacebook = () => {
        emitCustomEvent('openLoadingPage', true);
        if (recaptchaVerifier !== undefined)
            if (!recaptchaVerifier.destroyed) 
                recaptchaVerifier.clear();
        if (isMounted){
        setTxtBtnContinuar('Continuar');
        setClassNameBtnContinuar('button__log__continuar');
        }
    }

    const handleErrorFacebook = () => {
        emitCustomEvent('openLoadingPage', false);
    }

    const handleErrorGoogle = () => {
        emitCustomEvent('openLoadingPage', false);
    }

    const handlePoliticaDePrivacidad = () => {

    }

    const handleUpdateProfile = () => {
        props.onGetUpdateProfile(true);
    } 

    return (
        <div>
            <Dialog 
                fullScreen={mobilAccess}
                open={props.open}
                onClose = {handleCloseLogin}
                aria-labelledby="customized-dialog-title" 
                TransitionComponent={Transition}
                PaperProps = { { 
                    style : {  borderRadius : 15  } 
                } } 
                keepMounted
                disableEscapeKeyDown={true}
            >
            <DialogTitle 
                onClose={handleCloseLogin}>
                <strong>Inicia sesión o registrate</strong>
            </DialogTitle>
            <MuiDialogContent dividers style={{align: 'center'}}>
                <Typography variant='h6'>
                    <strong>Bienvenido a byOO</strong>
                </Typography>
                { showPhone ? 
                    <InputCountrySelectPhone 
                        style={styleSelectCountryPhoneFormPrincipal} 
                        onGetValuePhone={getValuePhoneCountrySelectPhoneFormPrincipal}
                        verify={submitCountrySelectPhoneFormPrincipal} 
                        onSubmitValuePhone={submitValuePhoneFormPicnipal} 
                        close={!props.open}
                        onGetEnter={handleEnter}
                        country={props.country}
                        code={null}
                    />
                    : null 
                }
                { showEmail ? 
                    <InputEmail 
                        style={styleInputEmailFormPrincipal}
                        onGetValueEmail={getValueEmailFormPrincipal} 
                        verify={submitEmailFormPrincipal} 
                        onSubmitValueEmail={submitValueEmailFormPrincipal} 
                        close={!props.open}
                        onGetEnter={handleEnter}
                    />
                    : null 
                }
                { showEmail ? 
                    <Typography 
                        variant="caption"
                        display="block"
                        gutterBottom
                        style={{
                            width: '100%',
                            marginTop: 0,
                        }}
                    >                    
                    </Typography>
                    : null 
                }
                { showPhone ? 
                        <Typography 
                            variant="caption"
                            display="block"
                            gutterBottom
                            style={{
                                width: '100%',
                                marginTop: 0,
                            }}
                        >
                            Vamos a enviarte un mensaje para confirmar el número. Se aplican tarifas estándar para mensajes y uso de datos.&nbsp;
                            <Link
                                component="button"
                                onClick={handlePoliticaDePrivacidad}
                                sx={{
                                    textDecoration: "underline #5472AD",
                                    color: '#5472AD !important',
                                    fontSize: '12px',
                                }} 
                                    >
                                <strong>Política de privacidad</strong>
                            </Link>
                        </Typography>
                    :
                    <Typography 
                        variant="caption"
                        display="block"
                        gutterBottom
                        style={{
                            width: '100%',
                            marginTop: 10,
                        }}
                    >
                        Es importante que puedas tener acceso a la direccion de correo electrónico indicada ya que te enviaremos información importante de tu cuenta.
                    </Typography>
                }
                <div align='center' id="recaptcha-container1" className='recaptchaClass'></div>
                <Divider style={{width: '100%', marginTop:'10px', marginBottom:'5px'}}/>
                <Button 
                    variant='outlined'
                    className={classNameBtnContinuar}
                    disableElevation
                    onClick={handleSubmit}
                >
                {txtBtnContinuar}
                </Button>
                <LoginWithFacebook
                    onGetFacebookUser={handleFacebookUser}
                    onGetProviders={handleProvidersFacebook}
                    onGetClick={handleClickFacebook}
                    onGetError={handleErrorFacebook}
                    onGetTerminarRegistrarte={handleTerminaRegistrarteFacebook}
                    onGetEmail={handleEmail}
                    onGetUpdateProfile={handleUpdateProfile}
                /> 
                <LoginWithGoogle
                    onGetGoogleUser={handleGoogleUser}
                    onGetProviders={handleProvidersGoogle}
                    onGetClick={handleClickGoogle}
                    onGetError={handleErrorGoogle}
                    onGetTerminarRegistrarte={handleTerminaRegistrarteGoogle}
                    onGetEmail={handleEmail}
                    onGetUpdateProfile={handleUpdateProfile}
                />
                { showPhone ? 
                    <Button 
                        variant='outlined'
                        className='button__log'
                        startIcon={<EmailIcon className='button__icon'/>}
                        onClick={handleClickLogEmail}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%'
                        }}                                            
                        endIcon={<EmailIcon sx={{color: 'white'}}/>}
                    >
                        Ingresa con un correo electrónico
                    </Button>                                                
                    : null 
                }
                { showEmail ? 
                    <Button 
                        variant='outlined'
                        className='button__log'
                        startIcon={<PhoneIphoneIcon className='button__icon'/>}
                        onClick={handleClickLogPhone}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%'
                        }}                                            
                        endIcon={<PhoneIphoneIcon sx={{color: 'white'}}/>}
                    >
                        Ingresa con tu número telefónico
                    </Button>                                                
                    : null 
                }
            </MuiDialogContent>
            <Snackbar open={openMsg} autoHideDuration={6000} onClose={handleCloseMsg} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{width: '100%'}}>
                <Alert onClose={handleCloseMsg} severity={severityInfo}>{msg}</Alert>
            </Snackbar>            
            </Dialog>
        </div>
    )
}

export default FormLogin
