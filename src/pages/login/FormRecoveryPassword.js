import React, { useState, useEffect }from 'react';
import InputEmail from './InputEmail';
import './Login.css'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getAuth, 
         sendPasswordResetEmail, 
         fetchSignInMethodsForEmail } from "firebase/auth";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { emitCustomEvent } from 'react-custom-events';
import { Divider } from '@material-ui/core';
import LoadingPage from './LoadingPage';

function FormRecoveryPassword(props) { 
    const mobilAccess = !useMediaQuery('(min-width:769px)', { noSsr: true });
    const [loadingDialog, setLoadingDialog] = useState(false);

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

    const handleCloseRecuperarPSW = () => {
        props.onGetReturn(true);
        setLoadingDialog(false);
    }

    /*submit Restablecer Pass*/
    const handleClickRecuperarPSW = async () => {      
        setSubmitEmailFormPrincipal(true);        
    }
    /*fin submit restablecer pass*/

    const handleEnter = () => {
        setSubmitEmailFormPrincipal(true);        
    }

    /*variables del componente InputEmail Form Principal*/
    const styleInputEmailFormPrincipal = { marginTop: "30px" };
    const [valueInputEmailFormPrincipal, setValueInputEmailFormPrincipal] = useState(props.email);
    const [submitEmailFormPrincipal, setSubmitEmailFormPrincipal] = useState(false);
    const [variableEstadoCargadoNewValueEmailFormPrincipal, setVariableEstadoCargadoNewValueEmailFormPrincipal] = useState(false);
    const submitValueEmailFormPrincipal = (value) => {
        setSubmitEmailFormPrincipal(value);
    }
    const getValueEmailFormPrincipal = (email) => {
        setValueInputEmailFormPrincipal(email);
        setVariableEstadoCargadoNewValueEmailFormPrincipal(true);
    }
    /*fin variables del componente InputEmail Form Principal*/
    
    /*atencion del valor ingresado del componente Input Email del form principal*/
    useEffect(() => {
        if (variableEstadoCargadoNewValueEmailFormPrincipal){
            if ((valueInputEmailFormPrincipal !== '')) { 
                setLoadingDialog(true);
                const auth = getAuth();
                fetchSignInMethodsForEmail(auth, valueInputEmailFormPrincipal)
                    .then(providers => {
                        if ((providers.length) === 0) {
                            //email inexistente, debe crear password
                            setMsg('No existe ninguna cuenta asociada a ' + String(valueInputEmailFormPrincipal));
                            setSeverityInfo('info');
                            setOpenMsg(true);
                            setLoadingDialog(false);
                        } else {
                            //email existente,
                            if ((providers.find(element => element === 'password')) !== undefined){
                                sendPasswordResetEmail(auth, valueInputEmailFormPrincipal)
                                .then(() => {
                                    props.onGetClose(true);
                                    emitCustomEvent('showMsg', String('Hemos enviado un enlace para restablecer tu contraseña a la dirección ') + String(valueInputEmailFormPrincipal) + String('/') + String('success'));
                                    setLoadingDialog(false);
                                })
                                .catch((error) => {
                                    if (error.message.includes('auth/user-not-found')){
                                        setLoadingDialog(false);
                                        setMsg('No existe ninguna cuenta asociada a ' + String(valueInputEmailFormPrincipal));
                                        setSeverityInfo('info');
                                        setOpenMsg(true);
                                    }else{
                                        setLoadingDialog(false);
                                        setMsg('Ha ocurrido un error, volvé a intentarlo')
                                        setSeverityInfo('info')
                                        setOpenMsg(true);
                                    }
                                }
                                );                                            
                            }else{
                                setLoadingDialog(false);
                                setMsg('La cuenta ' + String(valueInputEmailFormPrincipal) + ' no tiene configurado un ingreso mediante contraseña');
                                setSeverityInfo('info');
                                setOpenMsg(true);                    
                            }
                        }
                })
                .catch((error) => {
                    setLoadingDialog(false);
                    setMsg('Ha ocurrido un error, volvé a intentarlo');
                    setSeverityInfo('info');
                    setOpenMsg(true);
                });           
            }
            setVariableEstadoCargadoNewValueEmailFormPrincipal(false);
        } 
    },[props, valueInputEmailFormPrincipal, variableEstadoCargadoNewValueEmailFormPrincipal]);
    /*fin atencion del valor ingresado del componente Input Email del form principal*/

    return (
        <div>
            <Dialog 
                fullScreen={mobilAccess}
                open={props.open}
                onClose = {handleCloseRecuperarPSW}
                aria-labelledby="customized-dialog-title" 
                PaperProps = { { 
                    style : {  borderRadius : 15  } 
                } } 
                keepMounted
                disableEscapeKeyDown={true}
            >
            <LoadingPage 
                open={loadingDialog}
            />
            <DialogTitle 
                onClose={handleCloseRecuperarPSW}
            >
                <strong>Restablecer contraseña</strong>
            </DialogTitle>
            <MuiDialogContent dividers style={{align: 'center'}}> 
                <Typography 
                    variant="caption"
                    display="block"
                    gutterBottom
                    style={{
                        width: '100%',
                        marginTop: 10,
                        color: 'gray'
                    }}
                    >
                    Ingresá la dirección de correo electrónico asociada a tu cuenta y te vamos a enviar un enlace para restablecer tu contraseña.
                </Typography>
                    <InputEmail 
                        style={styleInputEmailFormPrincipal}
                        onGetValueEmail={getValueEmailFormPrincipal} 
                        verify={submitEmailFormPrincipal} 
                        onSubmitValueEmail={submitValueEmailFormPrincipal} 
                        close={!props.open}
                        onGetEnter={handleEnter}
                        email={props.email}
                    />
                <Divider style={{width: '100%', marginTop:'20px', marginBottom:'5px'}}/>
                <Button 
                    variant='outlined'
                    className='button__log__continuar'
                    onClick={handleClickRecuperarPSW}
                >
                    Enviá un enlace para restablecer la contraseña
                </Button>
                <Box 
                    sx={{
                        width: '100%',
                        height: '8rem',
                    }} 
                >
                </Box>                  
            </MuiDialogContent>
            <Snackbar open={openMsg} autoHideDuration={6000} onClose={handleCloseMsg} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{width: '100%'}}>
                <Alert onClose={handleCloseMsg} severity={severityInfo}>{msg}</Alert>
            </Snackbar>
            </Dialog>                          
        </div>
    )
}

export default FormRecoveryPassword
