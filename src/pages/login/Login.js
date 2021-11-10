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
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";

function Login(props) {
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


    const handleCloseFormRecoveryPassword = (value) => {
        setOpenFormRecoveryPassword(!value);
    }

    const handleReturnFormRecoveryPassword = (value) => {
        setOpenFormRecoveryPassword(!value);
        setOpenFormIniciarSesion(true);
    }

    const handleCloseFormIniciarSesion = (value) => {
        setOpenFormIniciarSesion(!value);
    }

    const handleReturnFormIniciarSesion = (value) => {
        setOpenFormIniciarSesion(!value);
        setOpenFormLogin(true);
    }

    const handleRecoveryPassFormIniciarSesion = () => {
        setOpenFormIniciarSesion(false);
        setOpenFormRecoveryPassword(true);
    }

    const handleCloseUniteComunidad = () => {
        setOpenFormUniteComunidad(false);
    }

    const handleRegistred = (profile) => {
        handleCreateDatabase(profile);
    }

    const handleRegistredRegistro = (profile) => {
        setOpenFormVerificaCodigoPhoneRegistro(false);
        setOpenFormBienvenidos(true);
        handleCreateDatabase(profile);
    }

    const handleContinuarFormBienvenidos = () => {
        setOpenFormBienvenidos(false);        
        setOpenFormCreaTuPerfil(true);
    }

    const handleReturnFormRegistrate = () => {
        setopenFormRegistrate (false);
        setOpenFormLogin(true);
    }

    const handleCloseFormRegistrate = () => {
        setGoogleUser(null);
        setFacebookUser(null);
        setPhoneUser(null);
        setopenFormRegistrate (false);
        setOpenFormUniteComunidad(true);
    }

    const handlePasswordFormRegistrate = (password) => {
        setValueInputPasswordFormRegistrate(password);
    }
    
    const handleNameFormRegistrate = (name) => {
        setValueInputNameFormRegistrate(name);
    }

    const handleReturnFormTerminaDeRegistrarte = () => {
        setOpenFormTerminaDeRegistrarte(false);
        setOpenFormLogin(true);        
    }

    const handleCloseFormTerminaDeRegistrarte = () => {
        setOpenFormTerminaDeRegistrarte(false);
        setOpenFormUniteComunidad(true);        
    }
        
    const handleCloseFormLogin = () => {
        setOpenFormLogin(false);
        props.onGetClose(true);
    }

    const handleValueEmailFormPrincipal = (email) => {
        setValueInputEmailFormPrincipal(email);
    }

    const handleOpenFormRegistrate = () => {
        setOpenFormLogin(false);
        setopenFormRegistrate(true);
    }

    const handleOpenFormIniciarSesion = () => {
        setOpenFormLogin(false);
        setOpenFormIniciarSesion(true);
    }

    const handleOpenFormTerminaDeRegistrarte = () => {
        setOpenFormLogin(false);
        setOpenFormTerminaDeRegistrarte(true);
    }

    const handleFacebookUser = (user) => {
        console.log('-------------------------')
        console.log('facebook:')
        console.log(user);
        console.log('-------------------------')
        setFacebookUser(user);
    }

    const handleGoogleUser = (user) => {
        console.log('-------------------------')
        console.log('google:')
        console.log(user);
        console.log('-------------------------')
        setGoogleUser(user);
    }

    const handleNameFormTerminaDeRegistrarte = (name) => {
        setNameFormTerminaDeRegistrarte(name);
    }

    const handleApellidoFormTerminaDeRegistrarte = (lastName) => {
        setApellidoFormTerminaDeRegistrarte(lastName);
    }

    const handleEmailFormTerminaDeRegistrarte = (email) => {
        setEmailFormTerminaDeRegistrarte(email);
    }

    const handleReturnFormTerminaDeRegistrartePhone = () => {
        setOpenFormTerminaDeRegistrartePhone(false);
        setOpenFormLogin(true);        
    }

    const handleCloseFormTerminaDeRegistrartePhone = () => {
        setGoogleUser(null);
        setFacebookUser(null);
        setPhoneUser(true);
        setOpenFormTerminaDeRegistrartePhone(false);        
        setOpenFormUniteComunidad(true);
    }    

    const handleNameFormTerminaDeRegistrartePhone = (name) => {
        setValueInputNameFormRegistrate(name);
    }

    const handleReturnFormVerificaCodigoPhone = () => {
        setOpenFormVerificaCodigoPhone(false);
        setOpenFormLogin(true);
    }

    const handleReturnFormVerificaCodigoPhoneRegistro = () => {
        setOpenFormVerificaCodigoPhoneRegistro(false);
        setOpenFormUniteComunidad(true);
    }    

    const handleOpenFormVerificaCodigoPhone = () => {
        setOpenFormLogin(false);
        setOpenFormVerificaCodigoPhone(true);
    }

    const handleOpenFormVerificaCodigoPhoneUnite = () => {
        setOpenFormUniteComunidad(false);
        setOpenFormVerificaCodigoPhoneRegistro(true);
    }

    const handlePhoneNumberFormLogin = (phone) =>{
        setPhoneNumberFormLogin(phone);
    }

    const handleConfirmationResultFormLogin = (result) => {
        setConfirmationResultFormLogin(result);
    }

    const handleOpenFormTerminaDeRegistrartePhone = () => {
        setOpenFormLogin(false);
        setOpenFormTerminaDeRegistrartePhone(true);
    }

    const handleCloseFormVerificaCodigoPhone = () => {
        setOpenFormVerificaCodigoPhone(false);
    }

    const handleCloseFormVerificaCodigoPhoneRegistro = () => {
    }

    const handleRegistred1 = () => {

    }

    const handleAgeFormTerminaDeRegistrartePhone = (age) => {
        setValueAgeFormRegistrate(age);
    }    

    const handleAgeFormRegistrate = (age) => {
        setValueAgeFormRegistrate(age);
    }

    const handleAgeFormTerminaDeRegistrarte = (age) => {
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

        await setDoc(doc(database, "users", profile.uid), {
          userId: profile.uid,
          name: nombre,
          lastName: apellido,
          age: valueAgeFormRegistrate,
          profilePhoto: null,
          googlePhoto: null,
          facebookPhoto: null,
          promotions: promotions,
        })
        .then(()=>{
            setOpenFormUniteComunidad(false);
            setOpenFormBienvenidos(true);
        })
        .catch(()=>{
            console.log('error al crear');
        });
    }

    const handleExisteCuenta = (providers) => {
        setProviders(providers);
        setOpenFormLogin(false);
        setOpenFormExisteCuenta(true);
    }

    const handleEmailExisteCuenta = (email) => {
        setEmailFormExisteCuenta(email);
    }

    const handleReturnFormExisteCuenta = () => {
        setOpenFormExisteCuenta(false);
        setOpenFormLogin(true);
    }

    const handleCloseFormExisteCuenta = () => {
        setOpenFormExisteCuenta(false);
    }

    const handleRecoveryPassFormExisteCuenta = () => {
        setOpenFormExisteCuenta(false);
        setOpenFormRecoveryPasswordFromExisteCuenta(true);
    }

    const handleCloseFormRecoveryPasswordFromExisteCuenta = () => {
        setOpenFormRecoveryPasswordFromExisteCuenta(false);
    }

    const handleReturnFormRecoveryPasswordFromExisteCuenta = () => {
        setOpenFormRecoveryPasswordFromExisteCuenta(false);
        setOpenFormExisteCuenta(true);
    }

    const handleFinish = () => {
        setOpenFormCreaTuPerfil(false);
        props.onGetUpdateProfile();
    }

    const handlePromotions = (value) => {
        setPromotions(value);
    }

    useEffect(() => {
        setOpenFormLogin(props.open);
    }, [props]);

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
        />
        :null}
        </div>
    
    );
}

export default Login