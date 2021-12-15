import React, { useEffect, useState } from 'react';
import '../../login/Login.css';
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
         reauthenticateWithCredential,
        } from "firebase/auth";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { PinInput, PinInputField } from '@chakra-ui/react';
import {emitCustomEvent} from 'react-custom-events';
import { getFirestore, 
    doc,
    getDoc, 
    updateDoc,
    arrayRemove,
    Timestamp, 
    arrayUnion,} from "firebase/firestore";

import { logout } from '../../../services/firebase';
import { useAuth } from '../../../services/firebase';

function FormReautenticaCodigoPhone(props) {
    const {currentUser} = useAuth();
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
        setValue(value)
      }
    
    const handleComplete = (value) => {
        emitCustomEvent('openLoadingPage', true);
        setCodeVerification(value);
    }

    useEffect(() => {
        if (props.open){
            setValue('');
            setCodeVerification('');
        }             
    }, [props]);

    useEffect(() => {
        if (codeVerification !== ''){
            if (props.confirmationResult !== null){
                setCodeVerification('');
                const auth = getAuth();
                const antToken = auth.currentUser.accessToken;
                var credential = PhoneAuthProvider.credential(props.confirmationResult.verificationId, codeVerification);
                reauthenticateWithCredential(auth.currentUser, credential)
                .then(async() => {
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
                                            ip: props.details.user[0].ip, 
                                            browser: props.details.user[1].browser.name,
                                            os:{
                                                name: props.details.user[1].os.name,
                                                version: props.details.user[1].os.version,
                                            },
                                            location:{
                                                city: props.details.user[0].city,//tigre
                                                country: props.details.user[0].country_name, //argentina
                                                region: props.details.user[0].region,
                                                country_code: props.details.user[0].country_code,
                                                currency_name: props.details.user[0].currency_name,
                                                currency: props.details.user[0].currency,
                                                lenguaje: props.details.user[0].languages.split(',')[0],
                                                country_tld: props.details.user[0].country_tld,
                                            },
                                        }
                                    )
                                }
                                )
                                .then(()=>{
                                    props.onGetUpdateProfile(true);
                                    emitCustomEvent('openLoadingPage', false);
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
                .catch((error) => {
                    console.log(error);
                    emitCustomEvent('openLoadingPage', false);
                    setMsg('Ha ocurrido un error al obtener las credenciales de Teléfono')
                    setSeverityInfo('error')
                    setOpenMsg(true);
                });
            }
        }                
   }, [props, codeVerification, currentUser]);

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

export default FormReautenticaCodigoPhone