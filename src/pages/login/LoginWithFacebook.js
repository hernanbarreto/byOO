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

function LoginWithFacebook(p) {
    const handleError = (error) => {
        p.onGetError(error);
    }

    const auth = getAuth();
    const responseFacebook = (response) => {
        if (response.status !== 'unknown'){
            fetchSignInMethodsForEmail(auth, response.email)
            .then(providers => {
                if (providers.length === 0){
                    p.onGetTerminarRegistrarte(true);
                    p.onGetFacebookUser(response);
                }else{
                    if (providers.includes('facebook.com')){
                        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
                            unsubscribe();
                            if (!isUserEqual(response, firebaseUser)) {
                                const credential = FacebookAuthProvider.credential(response.accessToken);
                                signInWithCredential(auth, credential)
                                .then((user) => {                                    
                                    p.onGetTerminarRegistrarte(false);
                                    p.onGetUpdateProfile(true);
                                }) 
                                .catch((error) => {
                                });
                            } else {
                                console.log('User already signed-in Firebase.');
                            }
                            });    
                    }else{
                        p.onGetProviders(providers);
                        p.onGetEmail(response.email);
                    }
                }
            })
            .catch((error) => {
            });
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
