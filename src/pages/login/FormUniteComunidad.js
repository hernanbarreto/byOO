import React, { useState, useEffect }from 'react';
import './Login.css';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import { withStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import { getAuth, 
         createUserWithEmailAndPassword, 
         onAuthStateChanged, 
         signInWithCredential, 
         GoogleAuthProvider, 
         FacebookAuthProvider, 
         signInWithPhoneNumber, 
         RecaptchaVerifier } from "firebase/auth";
import { emitCustomEvent } from 'react-custom-events';
import Link from '@mui/material/Link';
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();
const updateUser = httpsCallable(functions, 'updateUser');

var recaptchaVerifier;
function FormUniteComunidad(props) {
    const [isMounted, setIsMounted] = useState(true);
    const mobilAccess = !useMediaQuery('(min-width:769px)', { noSsr: true });
    const [cancel, setCancel] = useState(false);
    const styles = (theme) => ({});

    useEffect(() => {
        setIsMounted(true);
        return () => {setIsMounted(false)}
    }, []);      
      
    const DialogTitle = withStyles(styles)((props) => {
        const { children } = props;
        return (
            <MuiDialogTitle disableTypography 
                style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }} 
            >
                <Typography  variant='subtitle2'
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%'
                    }}                            
                >{children}
            </Typography>
            </MuiDialogTitle>
        );
    });

    const handleCloseUniteComunidad = () => {
        props.onGetClose(true);
        emitCustomEvent('openLoadingPage', false);
    }

    function isUserEqual(googleUser, firebaseUser) {
        if (firebaseUser) {
          const providerData = firebaseUser.providerData;
          for (let i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === GoogleAuthProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.getBasicProfile().getId()) {
              // We don't need to reauth the Firebase connection.
              return true;
            }
          }
        }
        return false;
    }

    function isUserEqualF(response, firebaseUser) {
        if (firebaseUser) {
          const providerData = firebaseUser.providerData;
          for (let i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === FacebookAuthProvider.PROVIDER_ID &&
                providerData[i].uid === response.id) {
              // We don't need to reauth the Firebase connection.
              return true;
            }
          }
        }
        return false;
    }

    const handleClickContinuar = () => {
        const auth = getAuth();

        if (props.googleUser !== null){
            emitCustomEvent('openLoadingPage', true);
            //hay que crear usuario con google.com
            const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
                unsubscribe();
                // Check if we are already signed-in Firebase with the correct user.
                if (!isUserEqual(props.googleUser, firebaseUser)) {
                    // Build Firebase credential with the Google ID token.
                    const credential = GoogleAuthProvider.credential(props.googleUser.getAuthResponse().id_token);    
                    // Sign in with credential from the Google user.
                    signInWithCredential(auth, credential)
                    .then((user) => {
                        while(props.name === ''){}
                        let nombre ='';
                        let nombreOK ='';
                        nombre = props.name + ' ' + props.lastName;
                        nombre = nombre.toLowerCase();
                        nombre = nombre.split(' ');
                        for (var i=0; i<nombre.length; i++){
                            nombreOK = nombreOK + nombre[i][0].toUpperCase() + nombre[i].slice(1) + ' ';
                        }
                        nombreOK = nombreOK.slice(0,-1);
                        updateUser([user.user.uid, { emailVerified: false, displayName: nombreOK,}])
                        .then((userRecord) => {
                                props.onGetRegistred (userRecord.data);    
                                emitCustomEvent('openLoadingPage', false);
                            })
                        .catch((error) => {
                            try{
                                emitCustomEvent('showMsg', 'Error: ' + error + String('/') + String('error'));
                            }catch{}
                            handleCloseUniteComunidad ();                    
                            emitCustomEvent('openLoadingPage', false);
                        });                                                            
                    }) 
                    .catch((error) => {
                        try{
                            emitCustomEvent('showMsg', 'Error: ' + error.code.split('/')[1].replace(/-/g,' ') + String('/') + String('error'));
                        }catch{}
                        handleCloseUniteComunidad ();                    
                        emitCustomEvent('openLoadingPage', false);
                    });
                } else {
                    try{
                        emitCustomEvent('showMsg', 'Error: el usuario ya se encuentra logeado' + String('/') + String('error'));
                    }catch{}
                    handleCloseUniteComunidad ();                    
                    emitCustomEvent('openLoadingPage', false);
                }
            });
        }else{
            if (props.facebookUser !== null){
                emitCustomEvent('openLoadingPage', true);
                const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
                    unsubscribe();
                    // Check if we are already signed-in Firebase with the correct user.
                    if (!isUserEqualF(props.facebookUser, firebaseUser)) {
                        // Build Firebase credential with the Google ID token.
                        const credential = FacebookAuthProvider.credential(props.facebookUser.accessToken);                        
                        // Sign in with credential from the Google user.
                        signInWithCredential(auth, credential)
                        .then((user) => {
                            while(props.name === ''){}
                            let nombre ='';
                            let nombreOK ='';
                            nombre = props.name + ' ' + props.lastName;
                            nombre = nombre.toLowerCase();
                            nombre = nombre.split(' ');
                            for (var i=0; i<nombre.length; i++){
                                nombreOK = nombreOK + nombre[i][0].toUpperCase() + nombre[i].slice(1) + ' ';
                            }
                            nombreOK = nombreOK.slice(0,-1);
                            updateUser([user.user.uid, { emailVerified: false, displayName: nombreOK,}])
                            .then((user) => {
                                props.onGetRegistred (user.data);    
                                emitCustomEvent('openLoadingPage', false);
                            })
                            .catch((error) => {
                                try{
                                    emitCustomEvent('showMsg', 'Error: ' + error + String('/') + String('error'));
                                }catch{}
                                handleCloseUniteComunidad ();                    
                                emitCustomEvent('openLoadingPage', false);
                            });                                
                        }) 
                        .catch((error) => {
                            try{
                                emitCustomEvent('showMsg', error.code.split('/')[1].replace(/-/g,' ') + String('/') + String('error'));
                            }catch{}
                            handleCloseUniteComunidad ();                    
                            emitCustomEvent('openLoadingPage', false);
                        });
                    } else {
                        try{
                            emitCustomEvent('showMsg', 'Error: el usuario ya se encuentra logeado' + String('/') + String('error'));
                        }catch{}
                        handleCloseUniteComunidad ();                    
                        emitCustomEvent('openLoadingPage', false);
                    }
                    });    
            }else{
                if (props.phoneUser !== null){
                    setCancel(true);
                //Hay que crear usuario con phone
                    auth.languageCode = props.lenguaje;
                    recaptchaVerifier = new RecaptchaVerifier('recaptcha-container2', {
                        type: 'image', // 'audio'
                        size: 'normal', // 'normal, invisible' or 'compact'
                        badge: 'inline' //' bottomright' or 'inline' applies to invisible.                    
                    }, auth);
                    signInWithPhoneNumber(auth, props.phoneNumber, recaptchaVerifier)
                    .then((confirmationResult) => {
                        emitCustomEvent('openLoadingPage', true);
                        if (recaptchaVerifier !== undefined)
                            if (!recaptchaVerifier.destroyed) 
                                recaptchaVerifier.clear();
                        props.onGetConfirmationResult(confirmationResult);
                        props.onGetOpenFormVerificaCodigoPhone(true);
                        if (isMounted)
                             setCancel(false);
                        emitCustomEvent('openLoadingPage', false);
                    }).catch((error) => {
                        // Error; SMS not sent
                        // ...
                        if (recaptchaVerifier !== undefined)
                            if (!recaptchaVerifier.destroyed) 
                                recaptchaVerifier.clear();
                        if (isMounted)
                             setCancel(false);
                        emitCustomEvent('openLoadingPage', false);
                        try{
                            emitCustomEvent('showMsg', String('No pudimos enviar el SMS al número de teléfono ') + String(props.phoneNumber) + String('/') + String('error'));
                        }catch{}
                        handleCloseUniteComunidad ();                    
                    });                                    
                }else{
                    //hay que crear usuario con mail
                    emitCustomEvent('openLoadingPage', true);
                    createUserWithEmailAndPassword(auth, props.email, props.pass)
                    .then((user) => {
                        while(props.name === ''){}
                        let nombre ='';
                        let nombreOK ='';
                        nombre = props.name + ' ' + props.lastName;
                        nombre = nombre.toLowerCase();
                        nombre = nombre.split(' ');
                        for (var i=0; i<nombre.length; i++){
                            nombreOK = nombreOK + nombre[i][0].toUpperCase() + nombre[i].slice(1) + ' ';
                        }
                        nombreOK = nombreOK.slice(0,-1);
                        updateUser([user.user.uid, { emailVerified: false, displayName: nombreOK,}])
                        .then((user) => {
                            props.onGetRegistred (user.data);    
                            emitCustomEvent('openLoadingPage', false);
                        })
                        .catch((error) => {
                            try{
                                emitCustomEvent('showMsg', 'Error: ' + error + String('/') + String('error'));
                            }catch{}
                            handleCloseUniteComunidad ();                    
                            emitCustomEvent('openLoadingPage', false);
                        });                                
                    })
                    .catch((error) => {
                        try{
                            emitCustomEvent('showMsg', 'Error: ' + error.code.split('/')[1].replace(/-/g,' ') + String('/') + String('error'));
                        }catch{}
                        handleCloseUniteComunidad ();                    
                        emitCustomEvent('openLoadingPage', false);
                    });
                }
            }
        }
    }
    
    const handleClickRechazar = () => {
        handleCloseUniteComunidad ();    
    }

    const handleClickCancelar = () => {
        if (recaptchaVerifier !== undefined)
            if (!recaptchaVerifier.destroyed) 
                recaptchaVerifier.clear();
        if (isMounted)
        setCancel(false);
    }

    useEffect(() => {
        if (props.open){
            if (isMounted)
            setCancel(false);
        }         
    }, [props, isMounted]);

    const handleMasInformacion = () =>{

    }

    return (
        <div>
            <Dialog 
                fullScreen={mobilAccess}
                open={props.open}
                aria-labelledby="customized-dialog-title" 
                PaperProps = { { 
                    style : {  borderRadius : 15  } 
                } } 
                keepMounted
                disableEscapeKeyDown={true}
            >
            <DialogTitle>
                <strong>Unite a nuestra comunidad</strong>
            </DialogTitle>
            <MuiDialogContent dividers style={{align: 'center'}}>
                <Typography variant='h6'>
                    <strong>byOO es una comunidad a la que todos pueden pertenecer</strong>
                </Typography> 
                <Typography 
                    variant="subtitle2"
                    display="block"
                    gutterBottom
                    style={{
                        width: '100%',
                        marginTop: 10,
                        color: 'gray'
                    }}
                    >
                    Para garantizar esto, te pedimos que te comprometas con lo siguiente:
                </Typography>
                <Typography 
                    variant="subtitle2"
                    display="block"
                    gutterBottom
                    style={{
                        width: '100%',
                        marginTop: 10,
                        color: 'black'
                    }}
                    >
                    <strong>El compromiso de la comunidad byOO</strong>
                </Typography>
                <Typography 
                    variant="subtitle2"
                    display="block"
                    gutterBottom
                    style={{
                        width: '100%',
                        marginTop: -5,
                        color: 'gray'
                    }}
                    >
                    Acepto tratar a todos los miembros de la comunidad de byOO con respeto y sin prejuicios, sin importar el origen, la religión, la nacionalidad, la etnia, el color de piel, si tienen una discapacidad, el sexo, la identidad de género, la orientación sexual ni la edad.
                </Typography>
                <Link
                    component="button"
                    onClick={handleMasInformacion}
                    sx={{
                        textDecoration: "underline #5472AD",
                        color: '#5472AD !important',
                        fontSize: '14px',
                    }} 
                >
                    <strong>Más información</strong>
                </Link>
                <Divider style={{width: '100%', marginTop:'20px', marginBottom:'5px'}}/>
                <div align='center' id="recaptcha-container2" className='recaptchaClass'></div>
                {!cancel ?
                    <Button
                        variant='outlined'
                        className='button__log__continuar'
                        onClick={handleClickContinuar}
                    >
                        Aceptar y continuar
                    </Button>
                :
                    null
                }
                {!cancel ?
                    <Button 
                        variant='outlined'
                        className='button__log__BW'
                        onClick={handleClickRechazar}
                    >
                        Rechazar
                    </Button>
                :
                    null
                }
                {cancel ?
                    <Button 
                        variant='outlined'
                        className='button__log__BW'
                        onClick={handleClickCancelar}
                    >
                        Cancelar
                    </Button>
                :
                    null
                }

            </MuiDialogContent>
            </Dialog>              
        </div>
    )
}

export default FormUniteComunidad
