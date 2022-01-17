import React, { useState, useEffect }from 'react';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import '../../login/Login.css'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getAuth,
        signInWithPhoneNumber,
        RecaptchaVerifier,} from "firebase/auth";
import Button from '@mui/material/Button';
import { withStyles } from '@material-ui/core/styles';
import { emitCustomEvent } from 'react-custom-events';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import IconButton from '@mui/material/IconButton';
import { useAuth } from '../../../services/firebase';
import { getFunctions, httpsCallable } from "firebase/functions";
import FormReautenticaCodigoPhone from './FormReautenticaCodigoPhone';
import { useInitPage } from '../../useInitPage';

var recaptchaVerifier;

const functions = getFunctions();
const getUserByPhoneNumber = httpsCallable(functions, 'getUserByPhoneNumber');

function FormReautenticaConPhone(props) {
    const {currentUser} = useAuth();
    const mobilAccess = !useMediaQuery('(min-width:769px)', { noSsr: true });

    const {state} = useInitPage();
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

    useEffect(() => {
        setIsMounted(true);
        if (state !== null){
            if (state){
            }
        }
        return () => {setIsMounted(false)}
    }, [state]);


    const handleCloseIniciarSesion = () => {
        props.onGetReturn(true);
        emitCustomEvent('openLoadingPage', false);
    }

    const [txtBtnContinuar, setTxtBtnContinuar] = useState('Continuar');
    const [classNameBtnContinuar, setClassNameBtnContinuar] = useState('button__log__continuar');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [openFormVerificaCodigoPhone, setOpenFormVerificaCodigoPhone] = useState(false);

    /*variables del componente CountrySelectPhone*/
    const valueInputPhoneFormPrincipal = useState(props.phoneNumber);
    const [variableEstadoCargadoNewValuePhoneFormPrincipal, setVariableEstadoCargadoNewValuePhoneFormPrincipal] = useState(false);
    /*fin variables de componente CountrySelectPhone*/

    const handleClickContinuar = () => {
        if (txtBtnContinuar === 'Continuar'){
            if (isMounted){
                setVariableEstadoCargadoNewValuePhoneFormPrincipal(true);
            }
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

    /*atencion del valor ingresado del componente CountrySelectPhone*/
    useEffect(() => {
        if (variableEstadoCargadoNewValuePhoneFormPrincipal){
            if ((valueInputPhoneFormPrincipal[0] !== '')) {
                emitCustomEvent('openLoadingPage', true);
                getUserByPhoneNumber(valueInputPhoneFormPrincipal[0])  
                .then((userRecord) => {
                    if (userRecord.data.uid === currentUser.uid){
                        const auth = getAuth();
                        auth.languageCode = props.details.user[0].languages.split(',')[0];
                        recaptchaVerifier = new RecaptchaVerifier('recaptcha-container5', {
                            type: 'image', // 'audio'
                            size: 'normal', // 'normal, invisible' or 'compact'
                            badge: 'inline' //' bottomright' or 'inline' applies to invisible.                    
                        }, auth);
                        if (isMounted){                    
                            setTxtBtnContinuar('Cancelar');
                            setClassNameBtnContinuar('button__log__BW');
                            emitCustomEvent('openLoadingPage', false);
                        }                    
                        signInWithPhoneNumber(auth, valueInputPhoneFormPrincipal[0], recaptchaVerifier)
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
                                setTxtBtnContinuar('Continuar');
                                setClassNameBtnContinuar('button__log__continuar');
                                setMsg('No pudimos enviar el SMS al número de teléfono ' + String(valueInputPhoneFormPrincipal[0]));
                                setSeverityInfo('error');
                                setOpenMsg(true);
                            }                    
                            emitCustomEvent('openLoadingPage', false);
                        });    
                    }else{
                        //el usuario existe
                        emitCustomEvent('openLoadingPage', false);
                        if (recaptchaVerifier !== undefined)
                            if (!recaptchaVerifier.destroyed) 
                                recaptchaVerifier.clear();
                        if (isMounted){
                            setTxtBtnContinuar('Continuar');
                            setClassNameBtnContinuar('button__log__continuar');        
                            setMsg('El número ' + String(valueInputPhoneFormPrincipal[0]) + ' no se encuentra asociado a tu cuenta.');
                            setSeverityInfo('error');
                            setOpenMsg(true);
                        }
                    }
                })
                .catch((error) => {
                        //el usuario no existe
                        emitCustomEvent('openLoadingPage', false);
                        if (recaptchaVerifier !== undefined)
                            if (!recaptchaVerifier.destroyed) 
                                recaptchaVerifier.clear();
                        if (isMounted){
                            setTxtBtnContinuar('Continuar');
                            setClassNameBtnContinuar('button__log__continuar');        
                            setMsg('El número ' + String(valueInputPhoneFormPrincipal[0]) + ' no se encuentra asociado a ninguna cuenta.');
                            setSeverityInfo('error');
                            setOpenMsg(true);
                        }
                });
             }else{
                emitCustomEvent('openLoadingPage', false);
                if (isMounted){
                    setMsg('No ingresaste un número de teléfono válido');
                    setSeverityInfo('error');
                    setOpenMsg(true);
                }                    
            }
            if (isMounted){
                setVariableEstadoCargadoNewValuePhoneFormPrincipal(false);
            }       
        }         
    },[props, isMounted, valueInputPhoneFormPrincipal, variableEstadoCargadoNewValuePhoneFormPrincipal, currentUser]);
    /*fin atencion del valor ingresado del componente CountrySelectPhone*/

    const handleReturnFormVerificaCodigoPhone = () => {
        if (isMounted){
            setOpenFormVerificaCodigoPhone(false);
        }
    }

    const handleLinkedPhone = () => {
        handleReturnFormVerificaCodigoPhone ();
        props.onGetReautenticatedPhone();
    }

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
                <strong>Vamos a reautenticar tu cuenta</strong>
            </DialogTitle>
            <MuiDialogContent dividers style={{align: 'center'}}>
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
                        Vamos a enviarte un código de verificación al número <strong>{valueInputPhoneFormPrincipal[0]}</strong>. Se aplican tarifas estándar para mensajes y uso de datos.
                    </Typography>
                </>
                <div align='center' id="recaptcha-container5" className='recaptchaClass'></div>
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
            </MuiDialogContent>
            <Snackbar open={openMsg} autoHideDuration={6000} onClose={handleCloseMsg} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{width: '100%'}}>
                <Alert onClose={handleCloseMsg} severity={severityInfo}>{msg}</Alert>
            </Snackbar>
            </Dialog>
            {openFormVerificaCodigoPhone && (
                <FormReautenticaCodigoPhone
                    phoneNumber={valueInputPhoneFormPrincipal[0]}
                    details={props.details}
                    confirmationResult={confirmationResult}
                    onGetReturn={handleReturnFormVerificaCodigoPhone}
                    onGetUpdateProfile={handleLinkedPhone}
                    open={openFormVerificaCodigoPhone}
                />
            )}          
        </div>
    )
}

export default FormReautenticaConPhone