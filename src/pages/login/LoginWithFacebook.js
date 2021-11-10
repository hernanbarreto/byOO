import React from 'react';
import './Login.css'
import { getAuth, 
         onAuthStateChanged, 
         signInWithCredential, 
         FacebookAuthProvider, 
         fetchSignInMethodsForEmail 
        } from "firebase/auth";
import { Button } from '@material-ui/core';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useHistory } from 'react-router-dom';

function LoginWithFacebook(p) {
    const handleError = (error) => {
        p.onGetError(error);
    }

    const history = useHistory();
    const auth = getAuth();
    const responseFacebook = (response) => {
        if (response.status !== 'unknown'){
            fetchSignInMethodsForEmail(auth, response.email)
            .then(providers => {
                if (providers.length === 0){
                    //el usuario no existe, puede entrar por google.com pero se debe terminar de registrar
                    p.onGetTerminarRegistrarte(true);
                    p.onGetFacebookUser(response);
                }else{
                    //el usuario existe, verifico si facebook.com es un proveedor asociado
                    if (providers.includes('facebook.com')){
                        if (window.location.href.indexOf('?code=') !== -1){
                            history.push((window.location.href.substring(0, window.location.href.indexOf('?code='))).replace('https://byoo.com.ar', ''))
                        }
                        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
                            unsubscribe();
                            // Check if we are already signed-in Firebase with the correct user.
                            if (!isUserEqual(response, firebaseUser)) {
                                // Build Firebase credential with the Google ID token.
                                const credential = FacebookAuthProvider.credential(response.accessToken);
                                // Sign in with credential from the Google user.
                                signInWithCredential(auth, credential)
                                .then((user) => {                                    
                                    p.onGetTerminarRegistrarte(false);
                                }) 
                                .catch((error) => {
                                });
                            } else {
                                console.log('User already signed-in Firebase.');
                            }
                            });    
                    }else{
                        //el usuario existe pero debe logearse por cualquiera de estos proveedores
                        p.onGetProviders(providers);
                        p.onGetEmail(response.email);
                    }
                }
            })
            .catch((error) => {
            }
        );
        }
    }

    function isUserEqual(response, firebaseUser) {
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

    return (
        <div>
            <FacebookLogin
                appId={process.env.REACT_APP_FACEBOOKID}
                fields="name,email,picture"
                scope=	'public_profile, email, user_birthday'
                responseType='id_token'
                accessType='online'
                version={'3.2'}
                isMobile={false}
                cookie={true}
                xfbml={true}                
                callback={responseFacebook}
                onFailure={handleError}
                render={renderProps => (
                    <Button         
                        variant='outlined'
                        className='button__log'
                        startIcon={<FacebookIcon className='button__icon'/>}
                        onClick={e=>{renderProps.onClick(); p.onGetClick(true)}} 
                        disabled={renderProps.isDisabled}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%'
                        }}                                            
                        endIcon={<FacebookIcon sx={{color: 'white'}}/>}
                    >
                    Ingresa con Facebook
                    </Button>
                )}                
            />          
        </div>
    )
}

export default LoginWithFacebook
