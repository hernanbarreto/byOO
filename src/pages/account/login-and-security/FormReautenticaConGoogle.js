import React, { useState }from 'react';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import '../../login/Login.css'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getAuth,
        GoogleAuthProvider,  
        reauthenticateWithCredential, } from "firebase/auth";
import Button from '@mui/material/Button';
import { withStyles } from '@material-ui/core/styles';
import { emitCustomEvent } from 'react-custom-events';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import IconButton from '@mui/material/IconButton';
import { logout } from '../../../services/firebase';
import { getFirestore, 
    doc, 
    getDoc,
    updateDoc,
    arrayRemove,
    Timestamp, 
    arrayUnion, 
        } from "firebase/firestore";
import { useAuth } from '../../../services/firebase';
import GoogleLogin from 'react-google-login';
import GoogleIcon from '@mui/icons-material/Google';

function FormReautenticaConGoogle(props) {
    const {currentUser} = useAuth();
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

    const responseGoogleSuccess = (googleUser) => {
        const auth = getAuth();
        const antToken = auth.currentUser.accessToken;
        const credential = GoogleAuthProvider.credential(googleUser.getAuthResponse().id_token);
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
                setMsg('Ha ocurrido un error al obtener las credenciales de Google')
                setSeverityInfo('error')
                setOpenMsg(true);
            });
    }

    const responseGoogleError = (error) => {
        props.onGetError(error);
    }

    const handleErrorLoad = (error) => {
        console.log(error);
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
                <GoogleLogin
                    jsSrc={'https://apis.google.com/js/client.js'}
                    clientId={process.env.REACT_APP_GOOGLEID}
                    onSuccess={responseGoogleSuccess}
                    onFailure={responseGoogleError}
                    onScriptLoadFailure={handleErrorLoad}
                    scope= 'https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
                    cookiePolicy = {"single_host_origin"}
                    render={renderProps => (
                        <Button         
                            variant='outlined'
                            className='button__log'
                            startIcon={<GoogleIcon className='button__icon'/>}
                            onClick={e=>{renderProps.onClick(); props.onGetClick(true);}} 
                            disabled={renderProps.disabled}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%'
                            }}                                            
                            endIcon={<GoogleIcon sx={{color: 'white'}}/>}
                        >
                        Reautenticá con Google
                        </Button>
                    )}
                />             
            </MuiDialogContent>
            <Snackbar open={openMsg} autoHideDuration={6000} onClose={handleCloseMsg} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{width: '100%'}}>
                <Alert onClose={handleCloseMsg} severity={severityInfo}>{msg}</Alert>
            </Snackbar>
            </Dialog>            
        </div>
    )
}

export default FormReautenticaConGoogle
