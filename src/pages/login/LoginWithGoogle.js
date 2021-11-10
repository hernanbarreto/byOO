import React from 'react';
import './Login.css'
import GoogleLogin from 'react-google-login';
import GoogleIcon from '@mui/icons-material/Google';
import { getAuth, 
         onAuthStateChanged, 
         signInWithCredential, 
         GoogleAuthProvider, 
         fetchSignInMethodsForEmail } from "firebase/auth";
import { Button } from '@material-ui/core'

function LoginWithGoogle(p) {
    const auth = getAuth();
    const responseGoogleSuccess = (googleUser) => {
        fetchSignInMethodsForEmail(auth, googleUser.profileObj.email)
        .then(providers => {
            if (providers.length === 0){
                //el usuario no existe, puede entrar por google.com pero se debe terminar de registrar
                p.onGetTerminarRegistrarte(true);
                p.onGetGoogleUser(googleUser);
            }else{
                //el usuario existe, verifico si google.com es un proveedor asociado
                if (providers.includes('google.com')){
                    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
                        unsubscribe();
                        if (!isUserEqual(googleUser, firebaseUser)) {
                            const credential = GoogleAuthProvider.credential(googleUser.getAuthResponse().id_token);
                            signInWithCredential(auth, credential)
                            .then((user) => {
                                p.onGetTerminarRegistrarte(false);
                            }) 
                            .catch((error) => {
                            });
                        }else {
                            console.log('User already signed-in Firebase.');
                        }
                    });    
                }else{
                    //el usuario existe pero debe logearse por cualquiera de estos proveedores
                    p.onGetProviders(providers);
                    p.onGetEmail(googleUser.profileObj.email);
                }
            }
        })
        .catch((error) => {
        }
    );        
}

    const responseGoogleError = (error) => {
        p.onGetError(error);
    }

    const handleErrorLoad = (error) => {
        console.log(error);
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

    return (
        <div>
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
                        onClick={e=>{renderProps.onClick(); p.onGetClick(true);}} 
                        disabled={renderProps.disabled}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%'
                        }}                                            
                        endIcon={<GoogleIcon sx={{color: 'white'}}/>}
                    >
                    Ingresa con Google
                    </Button>
                )}
            />            
        </div>
    )
}

export default LoginWithGoogle
