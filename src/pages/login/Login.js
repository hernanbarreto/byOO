import React, { useState, useEffect } from 'react';
import FormLogin from './FormLogin';
import FormRegistrate from './FormRegistrate';
import FormRecoveryPassword from './FormRecoveryPassword';
import FormIniciarSesion from './FormIniciarSesion';
import FormUniteComunidad from './FormUniteComunidad';
import FormBienvenidos from './FormBienvenidos';
import FormTerminaDeRegistrate from './FormTerminaDeRegistrarte';
import FormTerminaDeRegistratePhone from './FormTerminaDeRegistrartePhone';
import FormVerificaCodigoPhone from './FormVerificaCodigoPhone';
import FormExisteCuenta from './FormExisteCuenta';
import FormCreaTuPerfil from './FormCreaTuPerfil';
import './Login.css';
import { getFirestore, doc, setDoc, updateDoc } from "firebase/firestore";
import { auth, logout} from '../../services/firebase';
import { getAuth } from "firebase/auth";
import { emitCustomEvent } from 'react-custom-events';

function Login(props) {
    const [isMounted, setIsMounted] = useState(true);
    const [openFormLogin, setOpenFormLogin] = useState(false);
    const [openFormRecoveryPassword, setOpenFormRecoveryPassword] = useState(false);
    const [openFormIniciarSesion, setOpenFormIniciarSesion] = useState(false);
    const [openFormUniteComunidad, setOpenFormUniteComunidad] = useState(false);
    const [openFormBienvenidos, setOpenFormBienvenidos] = useState(false);
    const [openFormRegistrate, setopenFormRegistrate] = useState(false);
    const [valueInputPasswordFormRegistrate, setValueInputPasswordFormRegistrate] = useState('');
    const [valueInputNameFormRegistrate, setValueInputNameFormRegistrate] = useState('');
    const [openFormTerminaDeRegistrarte, setOpenFormTerminaDeRegistrarte] = useState(false); 
    const [phoneUser, setPhoneUser] = useState(null);
    const [googleUser, setGoogleUser] = useState(null);
    const [facebookUser, setFacebookUser] = useState(null);
    const [nombreFormTerminaDeRegistrarte, setNameFormTerminaDeRegistrarte] = useState('');
    const [apellidoFormTerminaDeRegistrarte, setApellidoFormTerminaDeRegistrarte] = useState('');
    const [emailFormTerminaDeRegistrarte, setEmailFormTerminaDeRegistrarte] = useState('');
    const [valueInputEmailFormPrincipal, setValueInputEmailFormPrincipal] = useState('');
    const [openFormTerminaDeRegistrartePhone, setOpenFormTerminaDeRegistrartePhone] = useState(false); 
    const [openFormVerificaCodigoPhone, setOpenFormVerificaCodigoPhone] = useState(false);
    const [phoneNumberFormLogin, setPhoneNumberFormLogin] = useState('');
    const [confirmationResultFormLogin, setConfirmationResultFormLogin] = useState(null);
    const [openFormVerificaCodigoPhoneRegistro, setOpenFormVerificaCodigoPhoneRegistro] = useState(false);
    const [valueAgeFormRegistrate, setValueAgeFormRegistrate] = useState(null);
    const [providers, setProviders] = useState(null);
    const [openFormExisteCuenta, setOpenFormExisteCuenta] = useState(false);
    const [emailFormExisteCuenta, setEmailFormExisteCuenta] = useState(null);
    const [openFormRecoveryPasswordFromExisteCuenta, setOpenFormRecoveryPasswordFromExisteCuenta] = useState(false);
    const [openFormCreaTuPerfil, setOpenFormCreaTuPerfil] = useState(false);
    const [promotions, setPromotions] = useState(false);
    const [countryCodeFormLogin, setCountryCodeFormLogin] = useState(null);

    useEffect(() => {
        setIsMounted(true);
        return () => {setIsMounted(false)}
    }, []);

    const handleCloseFormRecoveryPassword = (value) => {
        if (isMounted)
        setOpenFormRecoveryPassword(!value);
    }

    const handleReturnFormRecoveryPassword = (value) => {
        if (isMounted){
        setOpenFormRecoveryPassword(!value);
        setOpenFormIniciarSesion(true);
        }
    }

    const handleCloseFormIniciarSesion = (value) => {
        if (isMounted)
        setOpenFormIniciarSesion(!value);
    }

    const handleReturnFormIniciarSesion = (value) => {
        if (isMounted){
        setOpenFormIniciarSesion(!value);
        setOpenFormLogin(true);
        }
        props.onGetClose(false);
    }

    const handleRecoveryPassFormIniciarSesion = () => {
        if (isMounted){
        setOpenFormIniciarSesion(false);
        setOpenFormRecoveryPassword(true);
        }
    }

    const handleCloseUniteComunidad = () => {
        if (isMounted)
        setOpenFormUniteComunidad(false);
    }

    const handleRegistred = (profile) => {
        handleCreateDatabase(profile);
    }

    const handleRegistredRegistro = (profile) => {
        if (isMounted){
        setOpenFormVerificaCodigoPhoneRegistro(false);
        setOpenFormBienvenidos(true);
        }
        handleCreateDatabase(profile);
    }

    const handleContinuarFormBienvenidos = () => {
        if (isMounted){
        setOpenFormBienvenidos(false);        
        setOpenFormCreaTuPerfil(true);
        }
    }

    const handleReturnFormRegistrate = () => {
        if (isMounted){
        setopenFormRegistrate (false);
        setOpenFormLogin(true);
        }
        props.onGetClose(false);
    }

    const handleCloseFormRegistrate = () => {
        if (isMounted){
        setGoogleUser(null);
        setFacebookUser(null);
        setPhoneUser(null);
        setopenFormRegistrate (false);
        setOpenFormUniteComunidad(true);
        }
    }

    const handlePasswordFormRegistrate = (password) => {
        if (isMounted)
        setValueInputPasswordFormRegistrate(password);
    }
    
    const handleNameFormRegistrate = (name) => {
        if (isMounted)
        setValueInputNameFormRegistrate(name);
    }

    const handleReturnFormTerminaDeRegistrarte = () => {
        if (isMounted){
        setOpenFormTerminaDeRegistrarte(false);
        setOpenFormLogin(true);
        }
        props.onGetClose(false);        
    }

    const handleCloseFormTerminaDeRegistrarte = () => {
        if (isMounted){
        setOpenFormTerminaDeRegistrarte(false);
        setOpenFormUniteComunidad(true);   
        }     
    }
        
    const handleCloseFormLogin = () => {
        if (isMounted)
        setOpenFormLogin(false);
        props.onGetClose(true);
    }

    const handleValueEmailFormPrincipal = (email) => {
        if (isMounted)
        setValueInputEmailFormPrincipal(email);
    }

    const handleOpenFormRegistrate = () => {
        if (isMounted)
        setOpenFormLogin(false);
        props.onGetClose(true);
        if (isMounted)
        setopenFormRegistrate(true);
    }

    const handleOpenFormIniciarSesion = () => {
        if (isMounted)
        setOpenFormLogin(false);
        props.onGetClose(true);
        if (isMounted)
        setOpenFormIniciarSesion(true);
    }

    const handleOpenFormTerminaDeRegistrarte = () => {
        if (isMounted)
        setOpenFormLogin(false);
        props.onGetClose(true);
        if (isMounted)
        setOpenFormTerminaDeRegistrarte(true);
    }

    const handleFacebookUser = (user) => {
        if (isMounted)
        setFacebookUser(user);
    }

    const handleGoogleUser = (user) => {
        if (isMounted)
        setGoogleUser(user);
    }

    const handleNameFormTerminaDeRegistrarte = (name) => {
        if (isMounted)
        setNameFormTerminaDeRegistrarte(name);
    }

    const handleApellidoFormTerminaDeRegistrarte = (lastName) => {
        if (isMounted)
        setApellidoFormTerminaDeRegistrarte(lastName);
    }

    const handleEmailFormTerminaDeRegistrarte = (email) => {
        if (isMounted)
        setEmailFormTerminaDeRegistrarte(email);
    }

    const handleReturnFormTerminaDeRegistrartePhone = () => {
        if (isMounted){
        setOpenFormTerminaDeRegistrartePhone(false);
        setOpenFormLogin(true);
        }
        props.onGetClose(false);        
    }

    const handleCloseFormTerminaDeRegistrartePhone = () => {
        if (isMounted){
        setGoogleUser(null);
        setFacebookUser(null);
        setPhoneUser(true);
        setOpenFormTerminaDeRegistrartePhone(false);        
        setOpenFormUniteComunidad(true);
        }
    }    

    const handleNameFormTerminaDeRegistrartePhone = (name) => {
        if (isMounted)
        setValueInputNameFormRegistrate(name);
    }

    const handleReturnFormVerificaCodigoPhone = () => {
        if (isMounted){
        setOpenFormVerificaCodigoPhone(false);
        setOpenFormLogin(true);
        }
        props.onGetClose(false);
    }

    const handleReturnFormVerificaCodigoPhoneRegistro = () => {
        if (isMounted){
        setOpenFormVerificaCodigoPhoneRegistro(false);
        setOpenFormUniteComunidad(true);
        }
    }    

    const handleOpenFormVerificaCodigoPhone = () => {
        if (isMounted)
        setOpenFormLogin(false);
        props.onGetClose(true);
        if (isMounted)
        setOpenFormVerificaCodigoPhone(true);
    }

    const handleOpenFormVerificaCodigoPhoneUnite = () => {
        if (isMounted){
        setOpenFormUniteComunidad(false);
        setOpenFormVerificaCodigoPhoneRegistro(true);
        }
    }

    const handlePhoneNumberFormLogin = (phone) =>{
        if (isMounted){
        setPhoneNumberFormLogin(phone[0]);
        setCountryCodeFormLogin(phone[1]);
        }
    }

    const handleConfirmationResultFormLogin = (result) => {
        if (isMounted)
        setConfirmationResultFormLogin(result);
    }

    const handleOpenFormTerminaDeRegistrartePhone = () => {
        if (isMounted)
        setOpenFormLogin(false);
        props.onGetClose(true);
        if (isMounted)
        setOpenFormTerminaDeRegistrartePhone(true);
    }

    const handleCloseFormVerificaCodigoPhone = () => {
        if (isMounted)
        setOpenFormVerificaCodigoPhone(false);
    }

    const handleCloseFormVerificaCodigoPhoneRegistro = () => {
    }

    const handleRegistred1 = (user) => {
    }

    const handleAgeFormTerminaDeRegistrartePhone = (age) => {
        if (isMounted)
        setValueAgeFormRegistrate(age);
    }    

    const handleAgeFormRegistrate = (age) => {
        if (isMounted)
        setValueAgeFormRegistrate(age);
    }

    const handleAgeFormTerminaDeRegistrarte = (age) => {
        if (isMounted)
        setValueAgeFormRegistrate(age);
    }    

    const database = getFirestore();
    const handleCreateDatabase = async (profile) => {
        let nombre='';
        let nombres = valueInputNameFormRegistrate.split('/')[0].split(' ');
        for (let i=0; i<nombres.length; i++){
            nombre += nombres[i][0].toUpperCase() + nombres[i].slice(1) + ' ';
        }
        nombre = nombre.slice(0,-1);

        let apellido='';
        let apellidos = valueInputNameFormRegistrate.split('/')[1].split(' ');
        for (let i=0; i<apellidos.length; i++){
            apellido += apellidos[i][0].toUpperCase() + apellidos[i].slice(1) + ' ';
        }
        apellido = apellido.slice(0,-1);
        let em = false;
        if (profile.email !== null) em = true;
        let ph = false;
        if (profile.phoneNumber !== null) ph = true;

        await setDoc(doc(database, "users", profile.uid), {
            userId: profile.uid,
            name: nombre,
            countryCode: countryCodeFormLogin,
            lastName: apellido,
            age: valueAgeFormRegistrate,
            sex:null,
            profilePhoto: null,
            googlePhoto: null,
            facebookPhoto: null,
            promotions: promotions,
            accountVerified: false,
            identificationFront: null,
            identificationBack: null,
            address:{
                lat: null,
                lng: null,
                description: '',
            },
            account:{
                created:{
                    date: auth.currentUser.metadata.createdAt,
                    ip: props.userDetails.user[0].ip, 
                    browser: props.userDetails.user[1].browser.name,
                    os:{
                        name: props.userDetails.user[1].os.name,
                        version: props.userDetails.user[1].os.version,
                    },
                    location:{
                        city: props.userDetails.user[0].city,//tigre
                        country: props.userDetails.user[0].country_name, //argentina
                        region: props.userDetails.user[0].region,
                        country_code: props.userDetails.user[0].country_code,
                        currency_name: props.userDetails.user[0].currency_name,
                        currency: props.userDetails.user[0].currency,
                        lenguaje: props.userDetails.user[0].languages.split(',')[0],
                        country_tld: props.userDetails.user[0].country_tld,
                    },
                },
            },
            sessions:[],
            notifications:{
                preferences:{
                    tips_news:{
                        tips_services:{
                            email: promotions && em,
                            textMessage: promotions && ph,
                            browser: promotions,
                        },
                        tips_budget:{
                            email: promotions && em,
                            textMessage: promotions && ph,
                            browser: promotions,
                        },
                        news:{
                            email: promotions && em,
                            textMessage: promotions && ph,
                            browser: promotions,
                        },
                        comments:{
                            email: promotions && em,
                            textMessage: promotions && ph,
                            browser: promotions,
                        },
                        normative:{
                            email: em,
                            textMessage: ph,
                            browser: true,
                        },
                    },
                    account:{
                        activity:{
                            email: em,
                            textMessage: ph,
                            browser: true,
                        },
                        policy:{
                            email: em,
                            textMessage: ph,
                            browser: true,
                        },
                        reminder:{
                            email: em,
                            textMessage: ph,
                            browser: true,
                        },
                        messages:{
                            email: em,
                            textMessage: ph,
                            browser: true,
                        },
                    },
                },
                messages:[],
            },
        })
        .then(()=>{
            if (isMounted){
            setOpenFormUniteComunidad(false);
            setOpenFormBienvenidos(true);
            }
        })
        .catch(()=>{
            console.log('error al crear');
        });
    }

    const handleExisteCuenta = (providers) => {
        if (isMounted){
        setProviders(providers);
        setOpenFormLogin(false);
        }
        props.onGetClose(true);
        if (isMounted)
        setOpenFormExisteCuenta(true);
    }

    const handleEmailExisteCuenta = (email) => {
        if (isMounted)
        setEmailFormExisteCuenta(email);
    }

    const handleReturnFormExisteCuenta = () => {
        if (isMounted){
        setOpenFormExisteCuenta(false);
        setOpenFormLogin(true);
        }
        props.onGetClose(false);
    }

    const handleCloseFormExisteCuenta = () => {
        if (isMounted)
        setOpenFormExisteCuenta(false);
    }

    const handleRecoveryPassFormExisteCuenta = () => {
        if (isMounted){
        setOpenFormExisteCuenta(false);
        setOpenFormRecoveryPasswordFromExisteCuenta(true);
        }
    }

    const handleCloseFormRecoveryPasswordFromExisteCuenta = () => {
        if (isMounted)
        setOpenFormRecoveryPasswordFromExisteCuenta(false);
    }

    const handleReturnFormRecoveryPasswordFromExisteCuenta = () => {
        if (isMounted){
        setOpenFormRecoveryPasswordFromExisteCuenta(false);
        setOpenFormExisteCuenta(true);
        }
    }

    const handleFinish = async () => {
        if (isMounted)
            setOpenFormCreaTuPerfil(false);
        
        const auth = getAuth();
        const currentUser1 = auth.currentUser;
        const infoUser = doc(database, "users", currentUser1.uid);

        let em = false;
        if (currentUser1.email !== null) em = true;
        let ph = false;
        if (currentUser1.phoneNumber !== null) ph = true;

        await updateDoc(infoUser, {
            'notifications.preferences.tips_news.tips_services.email': promotions && em,
            'notifications.preferences.tips_news.tips_services.textMessage': promotions && ph,
            'notifications.preferences.tips_news.tips_services.browser': promotions,

            'notifications.preferences.tips_news.tips_budget.email': promotions && em,
            'notifications.preferences.tips_news.tips_budget.textMessage': promotions && ph,
            'notifications.preferences.tips_news.tips_budget.browser': promotions,

            'notifications.preferences.tips_news.news.email': promotions && em,
            'notifications.preferences.tips_news.news.textMessage': promotions && ph,
            'notifications.preferences.tips_news.news.browser': promotions,

            'notifications.preferences.tips_news.comments.email': promotions && em,
            'notifications.preferences.tips_news.comments.textMessage': promotions && ph,
            'notifications.preferences.tips_news.comments.browser': promotions,

            'notifications.preferences.tips_news.normative.email': em,
            'notifications.preferences.tips_news.normative.textMessage': ph,
            'notifications.preferences.tips_news.normative.browser': true,

            'notifications.preferences.account.activity.email': em,
            'notifications.preferences.account.activity.textMessage': ph,
            'notifications.preferences.account.activity.browser': true,

            'notifications.preferences.account.policy.email': em,
            'notifications.preferences.account.policy.textMessage': ph,
            'notifications.preferences.account.policy.browser': true,

            'notifications.preferences.account.reminder.email': em,
            'notifications.preferences.account.reminder.textMessage': ph,
            'notifications.preferences.account.reminder.browser': true,

            'notifications.preferences.account.messages.email': em,
            'notifications.preferences.account.messages.textMessage': ph,
            'notifications.preferences.account.messages.browser': true,            
        })
        .then(()=>{
            props.onGetUpdateProfile();
        })
        .catch(()=>{
            logout()
            .then(()=>{
                emitCustomEvent('showMsg', 'Ha ocurrido un error al intentar acceder a los datos de tu cuenta, tenés que volver a registrarte/error');
            })
            .catch((error)=>{
                emitCustomEvent('showMsg', 'Ha ocurrido un error al intentar acceder a los datos de tu cuenta, tenés que volver a registrarte/error');
            });
        });
    }

    const handleUpdateProfile = () => {
        props.onGetUpdateProfile();
    }

    const handlePromotions = (value) => {
        if (isMounted)
        setPromotions(value);
    }

    useEffect(() => {
        if (props.open){
            if (isMounted){
            setOpenFormRecoveryPassword(false);
            setOpenFormIniciarSesion(false);
            setOpenFormUniteComunidad(false);
            setOpenFormBienvenidos(false);
            setopenFormRegistrate(false);
            setValueInputPasswordFormRegistrate('');
            setValueInputNameFormRegistrate('');
            setOpenFormTerminaDeRegistrarte(false); 
            setPhoneUser(null);
            setGoogleUser(null);
            setFacebookUser(null);
            setNameFormTerminaDeRegistrarte('');
            setApellidoFormTerminaDeRegistrarte('');
            setEmailFormTerminaDeRegistrarte('');
            setValueInputEmailFormPrincipal('');
            setOpenFormTerminaDeRegistrartePhone(false); 
            setOpenFormVerificaCodigoPhone(false);
            setPhoneNumberFormLogin('');
            setConfirmationResultFormLogin(null);
            setOpenFormVerificaCodigoPhoneRegistro(false);
            setValueAgeFormRegistrate(null);
            setProviders(null);
            setOpenFormExisteCuenta(false);
            setEmailFormExisteCuenta(null);
            setOpenFormRecoveryPasswordFromExisteCuenta(false);
            setOpenFormCreaTuPerfil(false);
            setPromotions(false);
            setCountryCodeFormLogin(null);
            }
        }
        if (isMounted)
        setOpenFormLogin(props.open);        
    }, [props.open, isMounted]);

    return (
        <div>
        {openFormLogin ?
        <FormLogin
            onGetClose={handleCloseFormLogin}
            onGetOpenFormRegistrate={handleOpenFormRegistrate}
            onGetOpenFormIniciarSesion={handleOpenFormIniciarSesion}
            onGetValueInputEmailFormPrincipal={handleValueEmailFormPrincipal}
            onGetOpenFormTerminaDeRegistrarte={handleOpenFormTerminaDeRegistrarte}
            onGetFacebookUser={handleFacebookUser}
            onGetGoogleUser={handleGoogleUser}
            onGetNameFormTerminaDeRegistrarte={handleNameFormTerminaDeRegistrarte}
            onGetApellidoFormTerminaDeRegistrarte={handleApellidoFormTerminaDeRegistrarte}
            onGetEmailFormTerminaDeRegistrarte={handleEmailFormTerminaDeRegistrarte}
            onGetOpenFormVerificaCodigoPhone={handleOpenFormVerificaCodigoPhone}
            onGetOpenFormTerminaDeRegistrartePhone={handleOpenFormTerminaDeRegistrartePhone} 
            onGetPhoneNumber={handlePhoneNumberFormLogin}
            onGetConfirmationResult={handleConfirmationResultFormLogin}
            onGetExisteCuenta={handleExisteCuenta}
            onGetEmail={handleEmailExisteCuenta}
            onGetUpdateProfile={handleUpdateProfile}
            country={props.userDetails.user[0].country}
            lenguaje={props.userDetails.user[0].languages.split(',')[0]}
            open={openFormLogin}
        />
        :null}
        {openFormRegistrate ?
        <FormRegistrate
            email={valueInputEmailFormPrincipal}
            onGetReturn={handleReturnFormRegistrate}
            onGetClose={handleCloseFormRegistrate}
            onGetPassword={handlePasswordFormRegistrate}
            onGetName={handleNameFormRegistrate}
            onGetAge={handleAgeFormRegistrate}
            onGetPromotions={handlePromotions} 
            open={openFormRegistrate}
        />
        :null}
        {openFormTerminaDeRegistrarte ?
        <FormTerminaDeRegistrate
            nombre={nombreFormTerminaDeRegistrarte}
            email={emailFormTerminaDeRegistrarte}
            apellido={apellidoFormTerminaDeRegistrarte}
            onGetReturn={handleReturnFormTerminaDeRegistrarte}
            onGetClose={handleCloseFormTerminaDeRegistrarte}
            onGetAge={handleAgeFormTerminaDeRegistrarte}
            onGetName={handleNameFormRegistrate}
            onGetPromotions={handlePromotions} 
            open={openFormTerminaDeRegistrarte}
        />
        :null}
        {openFormVerificaCodigoPhone ?
        <FormVerificaCodigoPhone
            phoneNumber={phoneNumberFormLogin}
            name={valueInputNameFormRegistrate}
            confirmationResult={confirmationResultFormLogin}
            onGetReturn={handleReturnFormVerificaCodigoPhone}
            onGetClose={handleCloseFormVerificaCodigoPhone}
            onGetRegistred={handleRegistred1}
            onGetUpdateProfile={handleUpdateProfile}
            open={openFormVerificaCodigoPhone}
        />
        :null}
        {openFormVerificaCodigoPhoneRegistro ?
        <FormVerificaCodigoPhone
            phoneNumber={phoneNumberFormLogin}
            name={valueInputNameFormRegistrate}
            confirmationResult={confirmationResultFormLogin}
            onGetReturn={handleReturnFormVerificaCodigoPhoneRegistro}
            onGetClose={handleCloseFormVerificaCodigoPhoneRegistro}
            onGetRegistred={handleRegistredRegistro}
            open={openFormVerificaCodigoPhoneRegistro}
        />
        :null}
        {openFormTerminaDeRegistrartePhone ?
        <FormTerminaDeRegistratePhone
            onGetReturn={handleReturnFormTerminaDeRegistrartePhone}
            onGetClose={handleCloseFormTerminaDeRegistrartePhone}
            onGetName={handleNameFormTerminaDeRegistrartePhone}
            onGetAge={handleAgeFormTerminaDeRegistrartePhone}
            onGetPromotions={handlePromotions}             
            open={openFormTerminaDeRegistrartePhone}
        />
        :null}
        {openFormUniteComunidad ?
        <FormUniteComunidad
            name={valueInputNameFormRegistrate.split('/')[0]}
            lastName={valueInputNameFormRegistrate.split('/')[1]}
            email={valueInputEmailFormPrincipal}
            pass={valueInputPasswordFormRegistrate}
            googleUser={googleUser}
            facebookUser={facebookUser}
            phoneUser={phoneUser}
            phoneNumber={phoneNumberFormLogin}
            onGetClose={handleCloseUniteComunidad}
            onGetRegistred={handleRegistred}
            onGetConfirmationResult={handleConfirmationResultFormLogin}
            onGetOpenFormVerificaCodigoPhone={handleOpenFormVerificaCodigoPhoneUnite}
            lenguaje={props.userDetails.user[0].languages.split(',')[0]}
            open={openFormUniteComunidad}
        />
        :null}
        {openFormBienvenidos ?
        <FormBienvenidos 
            onGetContinuar={handleContinuarFormBienvenidos}
            name={valueInputNameFormRegistrate.split('/')[0].split(' ')[0][0].toUpperCase() + valueInputNameFormRegistrate.split('/')[0].split(' ')[0].slice(1)}
            open={openFormBienvenidos}
        />
        :null}
        {openFormIniciarSesion ?
        <FormIniciarSesion
            email={valueInputEmailFormPrincipal}
            onGetClose={handleCloseFormIniciarSesion}
            onGetReturn={handleReturnFormIniciarSesion}
            onGetRecoveryPass={handleRecoveryPassFormIniciarSesion}
            onGetUpdateProfile={handleUpdateProfile}
            open={openFormIniciarSesion}
        />
        :null}
        {openFormRecoveryPassword ?
        <FormRecoveryPassword
            onGetClose={handleCloseFormRecoveryPassword}
            onGetReturn={handleReturnFormRecoveryPassword}
            email={valueInputEmailFormPrincipal}
            open={openFormRecoveryPassword}
        />
        :null}
        {openFormExisteCuenta ?
        <FormExisteCuenta
            providers={providers}
            lenguaje={props.userDetails.user[0].languages.split(',')[0]}
            open={openFormExisteCuenta}
            email={emailFormExisteCuenta}
            onGetReturn={handleReturnFormExisteCuenta}
            onGetClose={handleCloseFormExisteCuenta}
            onGetRecoveryPass={handleRecoveryPassFormExisteCuenta}
            onGetOpenFormTerminaDeRegistrarte={handleOpenFormTerminaDeRegistrarte}
            onGetFacebookUser={handleFacebookUser}
            onGetGoogleUser={handleGoogleUser}
            onGetNameFormTerminaDeRegistrarte={handleNameFormTerminaDeRegistrarte}
            onGetApellidoFormTerminaDeRegistrarte={handleApellidoFormTerminaDeRegistrarte}
            onGetEmailFormTerminaDeRegistrarte={handleEmailFormTerminaDeRegistrarte}
            onGetUpdateProfile={handleUpdateProfile}
        />
        :null}
        {openFormRecoveryPasswordFromExisteCuenta ?
        <FormRecoveryPassword
            onGetClose={handleCloseFormRecoveryPasswordFromExisteCuenta}
            onGetReturn={handleReturnFormRecoveryPasswordFromExisteCuenta}
            email={''}
            open={openFormRecoveryPasswordFromExisteCuenta}
        />
        :null}
        {openFormCreaTuPerfil ?
        <FormCreaTuPerfil
            open={openFormCreaTuPerfil}
            onGetFinish={handleFinish}
            email={valueInputEmailFormPrincipal}
            pass={valueInputPasswordFormRegistrate}
            googleUser={googleUser}
            facebookUser={facebookUser}
            phoneUser={phoneUser}
            name={valueInputNameFormRegistrate.split('/')[0].split(' ')[0][0].toUpperCase() + valueInputNameFormRegistrate.split('/')[0].split(' ')[0].slice(1)}
            country={props.userDetails.user[0].country}
            lenguaje={props.userDetails.user[0].languages.split(',')[0]}
        />
        :null}
        </div>
    
    );
}

export default Login