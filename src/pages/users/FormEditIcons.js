import React, { useEffect, useState, useCallback } from 'react';
import '../login/Login.css';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { withStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@mui/material/TextField';
import CustomizedSwitch from  '../custom/CustomSwitch';
import {  Divider } from '@material-ui/core';
import { useAuth } from '../../services/firebase';
import { 
    doc,
    getDoc,
    updateDoc,
    getFirestore,
    } from "firebase/firestore";
import Skeleton from '@mui/material/Skeleton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert'; 
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import Tabs from '@mui/material/Tabs';
import TabContext from '@mui/lab/TabContext'; 
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();
const getUserBy = httpsCallable(functions, 'getUser');  

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const database = getFirestore();

const facebookAccountStart = /https:\/\/www.facebook.com\/[a-zA-Z]+/i;
const instagramAccountStart = /https:\/\/www.instagram.com\/[a-zA-Z]+/i;
const twitterAccountStart = /https:\/\/twitter.com\/[a-zA-Z]+/i;
const linkedinAccountStart = /https:\/\/[a-z][a-z].linkedin.com\/in\/[a-zA-Z]+/i;

function FormEditIcons(props) {
    const [ openMsg, setOpenMsg] = useState(false);
    const [severityInfo, setSeverityInfo] = useState('success');
    const [msg, setMsg] = useState('');
    const handleCloseMsg = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpenMsg(false);
    };

    const mobilAccess = !useMediaQuery('(min-width:769px)', { noSsr: true });

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
                <IconButton 
                    aria-label="close"  
                    onClick={onClose}
                    disabled={true}
                    style={{
                        color: 'white'
                    }}
                >
                    <CloseIcon />
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
                >
                    <CloseIcon />
                </IconButton>
            </MuiDialogTitle>
        );
    });

    const handleCloseLogin = () => {
        props.onGetClose();
    }

    const {currentUser} = useAuth();
    const [loadedPage, setLoadedPage] = useState(false);
    const [loadingPreferences, setLoadingPreferences] = useState(false);

    /*Facebook Profile*/
    const [stateErrorFacebookProfile, setStateErrorFacebookProfile] = useState(false);
    const [valueInputFacebookProfile, setValueInputFacebookProfile] = useState('');
    const [facebookProfile, setFacebookProfile] = useState(false);
    const [helperTextFacebook, setHelperTextFacebook] = useState('');

    const handleChangeFacebookProfile = (e) => {
        setStateErrorFacebookProfile(false);
        setHelperTextFacebook('');
        setValueInputFacebookProfile(e.target.value);
    }

    const handleKeyFacebookProfile = (e) => {
        if (e.key === 'Enter') {
            e.target.blur();
            handleVincularFacebookProfile();
        }
    } 

    const handleVincularFacebookProfile = async() => {
        if (valueInputFacebookProfile !== ''){
            if (valueInputFacebookProfile.search(facebookAccountStart) === 0){
                const infoUser = doc(database, "users", currentUser.uid);
                try{                                  
                    await updateDoc(infoUser, {
                        'profileIcons.facebook.show': true,
                        'profileIcons.facebook.url': valueInputFacebookProfile,
                    })
                    .then(()=>{
                        setFacebookProfile(true);                                            
                    })
                    .catch(()=>{
                        setMsg('Ha ocurrido un error al intentar actualizar tu información');
                        setSeverityInfo('error');
                        setOpenMsg(true); 
                    });
                }catch{
                    setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                    setSeverityInfo('error');
                    setOpenMsg(true);
                }       
            }else{
                setStateErrorFacebookProfile(true);
                setHelperTextFacebook('La URL de tu usuario de Facebook debe comenzar con https://www.facebook.com/');    
            }
        }else{
            setStateErrorFacebookProfile(true);
            setHelperTextFacebook('Debés ingresar una URL')
        }
    }

    const handleDesvincularFacebookProfile = async() => {
        const infoUser = doc(database, "users", currentUser.uid);
        try{                                  
            await updateDoc(infoUser, {
                'profileIcons.facebook.show': false,
                'profileIcons.facebook.url': '',
            })
            .then(()=>{
                setFacebookProfile(false);                                            
                setValueInputFacebookProfile('');
            })
            .catch(()=>{
                setMsg('Ha ocurrido un error al intentar actualizar tu información');
                setSeverityInfo('error');
                setOpenMsg(true); 
            });
        }catch{
            setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
            setSeverityInfo('error');
            setOpenMsg(true);
        } 
    }
    /*Fin Facebook Profile*/

    /*Instagram Profile*/
    const [stateErrorInstagramProfile, setStateErrorInstagramProfile] = useState(false);
    const [valueInputInstagramProfile, setValueInputInstagramProfile] = useState('');
    const [instagramProfile, setInstagramProfile] = useState(false);
    const [helperTextInstagram, setHelperTextInstagram] = useState('');

    const handleChangeInstagramProfile = (e) => {
        setStateErrorInstagramProfile(false);
        setHelperTextInstagram('');
        setValueInputInstagramProfile(e.target.value);
    }

    const handleKeyInstagramProfile = (e) => {
        if (e.key === 'Enter') {
            e.target.blur();
            handleVincularInstagramProfile();
        }
    } 

    const handleVincularInstagramProfile = async() => {
        if (valueInputInstagramProfile !== ''){
            if (valueInputInstagramProfile.search(instagramAccountStart) === 0){
                const infoUser = doc(database, "users", currentUser.uid);
                try{                                  
                    await updateDoc(infoUser, {
                        'profileIcons.instagram.show': true,
                        'profileIcons.instagram.url': valueInputInstagramProfile,
                    })
                    .then(()=>{
                        setInstagramProfile(true);                                            
                    })
                    .catch(()=>{
                        setMsg('Ha ocurrido un error al intentar actualizar tu información');
                        setSeverityInfo('error');
                        setOpenMsg(true); 
                    });
                }catch{
                    setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                    setSeverityInfo('error');
                    setOpenMsg(true);
                }       
            }else{
                setStateErrorInstagramProfile(true);
                setHelperTextInstagram('La URL de tu usuario de Instagram debe comenzar con https://www.instagram.com/');    
            }
        }else{
            setStateErrorInstagramProfile(true);
            setHelperTextInstagram('Debés ingresar una URL')
        }
    }

    const handleDesvincularInstagramProfile = async() => {
        const infoUser = doc(database, "users", currentUser.uid);
        try{                                  
            await updateDoc(infoUser, {
                'profileIcons.instagram.show': false,
                'profileIcons.instagram.url': '',
            })
            .then(()=>{
                setInstagramProfile(false);                                            
                setValueInputInstagramProfile('');
            })
            .catch(()=>{
                setMsg('Ha ocurrido un error al intentar actualizar tu información');
                setSeverityInfo('error');
                setOpenMsg(true); 
            });
        }catch{
            setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
            setSeverityInfo('error');
            setOpenMsg(true);
        } 
    }
    /*Fin Instagram Profile*/

    /*Twitter Profile*/
    const [stateErrorTwitterProfile, setStateErrorTwitterProfile] = useState(false);
    const [valueInputTwitterProfile, setValueInputTwitterProfile] = useState('');
    const [twitterProfile, setTwitterProfile] = useState(false);
    const [helperTextTwitter, setHelperTextTwitter] = useState('');

    const handleChangeTwitterProfile = (e) => {
        setStateErrorTwitterProfile(false);
        setHelperTextTwitter('');
        setValueInputTwitterProfile(e.target.value);
    }

    const handleKeyTwitterProfile = (e) => {
        if (e.key === 'Enter') {
            e.target.blur();
            handleVincularTwitterProfile();
        }
    } 

    const handleVincularTwitterProfile = async() => {
        if (valueInputTwitterProfile !== ''){
            if (valueInputTwitterProfile.search(twitterAccountStart) === 0){
                const infoUser = doc(database, "users", currentUser.uid);
                try{                                  
                    await updateDoc(infoUser, {
                        'profileIcons.twitter.show': true,
                        'profileIcons.twitter.url': valueInputTwitterProfile,
                    })
                    .then(()=>{
                        setTwitterProfile(true);                                            
                    })
                    .catch(()=>{
                        setMsg('Ha ocurrido un error al intentar actualizar tu información');
                        setSeverityInfo('error');
                        setOpenMsg(true); 
                    });
                }catch{
                    setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                    setSeverityInfo('error');
                    setOpenMsg(true);
                }       
            }else{
                setStateErrorTwitterProfile(true);
                setHelperTextTwitter('La URL de tu usuario de Twitter debe comenzar con https://twitter.com/');    
            }
        }else{
            setStateErrorTwitterProfile(true);
            setHelperTextTwitter('Debés ingresar una URL')
        }
    }

    const handleDesvincularTwitterProfile = async() => {
        const infoUser = doc(database, "users", currentUser.uid);
        try{                                  
            await updateDoc(infoUser, {
                'profileIcons.twitter.show': false,
                'profileIcons.twitter.url': '',
            })
            .then(()=>{
                setTwitterProfile(false);                                            
                setValueInputTwitterProfile('');
            })
            .catch(()=>{
                setMsg('Ha ocurrido un error al intentar actualizar tu información');
                setSeverityInfo('error');
                setOpenMsg(true); 
            });
        }catch{
            setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
            setSeverityInfo('error');
            setOpenMsg(true);
        } 
    }
    /*Fin Twitter Profile*/

    /*Linkedin Profile*/
    const [stateErrorLinkedinProfile, setStateErrorLinkedinProfile] = useState(false);
    const [valueInputLinkedinProfile, setValueInputLinkedinProfile] = useState('');
    const [linkedinProfile, setLinkedinProfile] = useState(false);
    const [helperTextLinkedin, setHelperTextLinkedin] = useState('');

    const handleChangeLinkedinProfile = (e) => {
        setStateErrorLinkedinProfile(false);
        setHelperTextLinkedin('');
        setValueInputLinkedinProfile(e.target.value);
    }

    const handleKeyLinkedinProfile = (e) => {
        if (e.key === 'Enter') {
            e.target.blur();
            handleVincularLinkedinProfile();
        }
    } 

    const handleVincularLinkedinProfile = async() => {
        if (valueInputLinkedinProfile !== ''){
            if (valueInputLinkedinProfile.search(linkedinAccountStart) === 0){
                const infoUser = doc(database, "users", currentUser.uid);
                try{                                  
                    await updateDoc(infoUser, {
                        'profileIcons.linkedin.show': true,
                        'profileIcons.linkedin.url': valueInputLinkedinProfile,
                    })
                    .then(()=>{
                        setLinkedinProfile(true);                                            
                    })
                    .catch(()=>{
                        setMsg('Ha ocurrido un error al intentar actualizar tu información');
                        setSeverityInfo('error');
                        setOpenMsg(true); 
                    });
                }catch{
                    setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                    setSeverityInfo('error');
                    setOpenMsg(true);
                }       
            }else{
                setStateErrorLinkedinProfile(true);
                setHelperTextLinkedin('La URL de tu usuario de LinkedIn debe comenzar con ej. https://ar.linkedin.com/in/');    
            }
        }else{
            setStateErrorLinkedinProfile(true);
            setHelperTextLinkedin('Debés ingresar una URL')
        }
    }

    const handleDesvincularLinkedinProfile = async() => {
        const infoUser = doc(database, "users", currentUser.uid);
        try{                                  
            await updateDoc(infoUser, {
                'profileIcons.linkedin.show': false,
                'profileIcons.linkedin.url': '',
            })
            .then(()=>{
                setLinkedinProfile(false);                                            
                setValueInputLinkedinProfile('');
            })
            .catch(()=>{
                setMsg('Ha ocurrido un error al intentar actualizar tu información');
                setSeverityInfo('error');
                setOpenMsg(true); 
            });
        }catch{
            setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
            setSeverityInfo('error');
            setOpenMsg(true);
        } 
    }
    /*Fin Linkedin Profile*/

    /*whatsapp contact*/
    const [whatsappContact, setWhatsappContact] = useState(false);

    const handleVincularWhatsappContact = () => {
        getUserBy(currentUser.uid)
        .then(async (user)=>{
            if (user.data.phoneNumber !== null){
                const infoUser = doc(database, "users", currentUser.uid);
                try{                                  
                    await updateDoc(infoUser, {
                        'profileIcons.whatsapp.show': true,
                    })
                    .then(()=>{
                        setWhatsappContact(true);                                            
                    })
                    .catch(()=>{
                        setMsg('Ha ocurrido un error al intentar actualizar tu información');
                        setSeverityInfo('error');
                        setOpenMsg(true); 
                    });
                }catch{
                    setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                    setSeverityInfo('error');
                    setOpenMsg(true);
                }       
            }else{
                setMsg('No es posible que te contacten por Whatsapp porque no tenés configurado un número telefónico');
                setSeverityInfo('error');
                setOpenMsg(true);     
            }
        })
        .catch((error)=>{
            setMsg('Ha ocurrido un error al intentar actualizar tu información');
            setSeverityInfo('error');
            setOpenMsg(true); 
        })
    }

    const handleDesvincularWhatsappContact = async() => {
        const infoUser = doc(database, "users", currentUser.uid);
        try{                                  
            await updateDoc(infoUser, {
                'profileIcons.whatsapp.show': false,
            })
            .then(()=>{
                setWhatsappContact(false);                                            
            })
            .catch(()=>{
                setMsg('Ha ocurrido un error al intentar actualizar tu información');
                setSeverityInfo('error');
                setOpenMsg(true); 
            });
        }catch{
            setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
            setSeverityInfo('error');
            setOpenMsg(true);
        } 
    }
    /*fin whatsapp contact*/   

    /*telegram contact*/
    const [telegramContact, setTelegramContact] = useState(false);

    const handleVincularTelegramContact = () => {
        getUserBy(currentUser.uid)
        .then(async (user)=>{
            if (user.data.phoneNumber !== null){
                const infoUser = doc(database, "users", currentUser.uid);
                try{                                  
                    await updateDoc(infoUser, {
                        'profileIcons.telegram.show': true,
                    })
                    .then(()=>{
                        setTelegramContact(true);                                            
                    })
                    .catch(()=>{
                        setMsg('Ha ocurrido un error al intentar actualizar tu información');
                        setSeverityInfo('error');
                        setOpenMsg(true); 
                    });
                }catch{
                    setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                    setSeverityInfo('error');
                    setOpenMsg(true);
                }       
            }else{
                setMsg('No es posible que te contacten por Telegram porque no tenés configurado un número telefónico');
                setSeverityInfo('error');
                setOpenMsg(true);     
            }
        })
        .catch((error)=>{
            setMsg('Ha ocurrido un error al intentar actualizar tu información');
            setSeverityInfo('error');
            setOpenMsg(true); 
        })
    }

    const handleDesvincularTelegramContact = async() => {
        const infoUser = doc(database, "users", currentUser.uid);
        try{                                  
            await updateDoc(infoUser, {
                'profileIcons.telegram.show': false,
            })
            .then(()=>{
                setTelegramContact(false);                                            
            })
            .catch(()=>{
                setMsg('Ha ocurrido un error al intentar actualizar tu información');
                setSeverityInfo('error');
                setOpenMsg(true); 
            });
        }catch{
            setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
            setSeverityInfo('error');
            setOpenMsg(true);
        } 
    }
    /*fin Telegram contact*/   

    /*telegram contact*/
    const [emailContact, setEmailContact] = useState(false);

    const handleVincularEmailContact = () => {
        getUserBy(currentUser.uid)
        .then(async (user)=>{
            if (user.data.email !== null){
                const infoUser = doc(database, "users", currentUser.uid);
                try{                                  
                    await updateDoc(infoUser, {
                        'profileIcons.email.show': true,
                    })
                    .then(()=>{
                        setEmailContact(true);                                            
                    })
                    .catch(()=>{
                        setMsg('Ha ocurrido un error al intentar actualizar tu información');
                        setSeverityInfo('error');
                        setOpenMsg(true); 
                    });
                }catch{
                    setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                    setSeverityInfo('error');
                    setOpenMsg(true);
                }       
            }else{
                setMsg('No es posible que te contacten por correo electrónico porque no tenés configurado uno.');
                setSeverityInfo('error');
                setOpenMsg(true);     
            }
        })
        .catch((error)=>{
            setMsg('Ha ocurrido un error al intentar actualizar tu información');
            setSeverityInfo('error');
            setOpenMsg(true); 
        })
    }

    const handleDesvincularEmailContact = async() => {
        const infoUser = doc(database, "users", currentUser.uid);
        try{                                  
            await updateDoc(infoUser, {
                'profileIcons.email.show': false,
            })
            .then(()=>{
                setEmailContact(false);                                            
            })
            .catch(()=>{
                setMsg('Ha ocurrido un error al intentar actualizar tu información');
                setSeverityInfo('error');
                setOpenMsg(true); 
            });
        }catch{
            setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
            setSeverityInfo('error');
            setOpenMsg(true);
        } 
    }
    /*fin Email contact*/   

    const getPreferences = useCallback(async() => {
        setLoadingPreferences(true);
        const infoUser = doc(database, "users", currentUser.uid);
        const docSnap = await getDoc(infoUser);

        setFacebookProfile(docSnap.data().profileIcons.facebook.show);
        setValueInputFacebookProfile(docSnap.data().profileIcons.facebook.url);
        setInstagramProfile(docSnap.data().profileIcons.instagram.show);
        setValueInputInstagramProfile(docSnap.data().profileIcons.instagram.url);
        setTwitterProfile(docSnap.data().profileIcons.twitter.show);
        setValueInputTwitterProfile(docSnap.data().profileIcons.twitter.url);
        setLinkedinProfile(docSnap.data().profileIcons.linkedin.show);
        setValueInputLinkedinProfile(docSnap.data().profileIcons.linkedin.url);
        setWhatsappContact(docSnap.data().profileIcons.whatsapp.show);
        setTelegramContact(docSnap.data().profileIcons.telegram.show);
        setEmailContact(docSnap.data().profileIcons.email.show);

        setLoadingPreferences(false);
    },[]);

    useEffect(() => {
        if (!loadedPage){
            getPreferences();
            setLoadedPage(true);
        }
    }, [getPreferences]);


    const StyledTabs = styled((props) => (
        <Tabs
          {...props}
          TabIndicatorProps={{ children: <span className="MuiTabs-indicator" /> }}
        />
        ))({
        '& .MuiTabs-indicator': {
            backgroundColor: 'black',
        },
      
    });
      
    const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
        ({ theme }) => ({
          textTransform: 'none',
          width: '50%',
          '&.Mui-selected': {
            color: '#000000',
            fontWeight: 'bold',
            backgroundColor: 'white',
          },
        }),
      );

    const [valueTab, setValueTab] = useState('social');

    const handleChangeTab = (event, newValue) => {
      setValueTab(newValue);
    };

    return (
        <div>
            <Dialog 
                fullScreen={mobilAccess}
                open={props.open}
                onClose = {handleCloseLogin}
                aria-labelledby="customized-dialog-title" 
                TransitionComponent={Transition}
                PaperProps = { { 
                    style : {  borderRadius : 15  } 
                } } 
                keepMounted
                disableEscapeKeyDown={false}
            >
            <DialogTitle
                onClose = {handleCloseLogin}
            >
                <strong>Edita tus preferencias</strong>
            </DialogTitle>
            <MuiDialogContent dividers>
                <TabContext value={valueTab}>
                    <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider' }}>
                        <StyledTabs
                            value={valueTab} 
                            onChange={handleChangeTab} 
                            aria-label="select tabs notifications"
                        >
                            <StyledTab label="Mis redes sociales"  value='social' />
                            <StyledTab label="Configuración de contacto"  value='contact' />
                        </StyledTabs>
                    </Box>
                    <TabPanel value='social'>                
                        {!loadingPreferences ?
                        <>
                        <CustomizedSwitch
                            label='Perfil de Facebook'
                            strong={true}
                            checked={facebookProfile}
                            onGetChange={e=>{
                                if(e){
                                    handleVincularFacebookProfile();
                                }else{
                                    handleDesvincularFacebookProfile();
                                }
                            }}
                        />
                        <Typography 
                            fontSize={{
                                lg: 15,
                                md: 15,
                                sm: 12,
                                xs: 12,
                            }}                                                                                
                            display="block"
                            gutterBottom
                            style={{
                                width: '100%',
                                marginTop: 10,
                            }}
                        >
                        Ingresa la URL de tu perfil de Facebook si querés que la comunidad byOO pueda verlo.
                        </Typography>
                        <TextField
                            disabled={props.disabled} 
                            error={stateErrorFacebookProfile}
                            helperText={helperTextFacebook}
                            value={valueInputFacebookProfile}
                            onChange={handleChangeFacebookProfile} 
                            label="URL de tu perfil de Facebook" 
                            variant="outlined" 
                            style={{
                                width: '100%',
                                marginTop: '10px',
                                marginBottom: '20px',
                            }}
                            autoComplete="new-password"
                            onKeyDown={e => handleKeyFacebookProfile(e) }
                        />
                        </>
                        :
                        <>
                            <Skeleton variant="text" width="100%"/>
                            <Skeleton variant="text" width="100%"/>
                            <Skeleton variant="text" width="100%"/>
                        </>
                        }
                        <Divider/> 
                        {!loadingPreferences ?
                        <>
                        <CustomizedSwitch
                            label='Perfil de Instagram'
                            strong={true}
                            checked={instagramProfile}
                            onGetChange={e=>{
                                if(e){
                                    handleVincularInstagramProfile();
                                }else{
                                    handleDesvincularInstagramProfile();
                                }
                            }}
                        />
                        <Typography 
                            fontSize={{
                                lg: 15,
                                md: 15,
                                sm: 12,
                                xs: 12,
                            }}                                                                                
                            display="block"
                            gutterBottom
                            style={{
                                width: '100%',
                                marginTop: 10,
                            }}
                        >
                        Ingresa la URL de tu perfil de Instagram si querés que la comunidad byOO pueda verlo.
                        </Typography>
                        <TextField
                            disabled={props.disabled} 
                            error={stateErrorInstagramProfile}
                            helperText={helperTextInstagram}
                            value={valueInputInstagramProfile}
                            onChange={handleChangeInstagramProfile} 
                            label="URL de tu perfil de Instagram" 
                            variant="outlined" 
                            style={{
                                width: '100%',
                                marginTop: '10px',
                                marginBottom: '20px',
                            }}
                            autoComplete="new-password"
                            onKeyDown={e => handleKeyInstagramProfile(e) }
                        />
                        </>
                        :
                        <>
                            <Skeleton variant="text" width="100%"/>
                            <Skeleton variant="text" width="100%"/>
                            <Skeleton variant="text" width="100%"/>
                        </>
                        }
                        <Divider/>               
                        {!loadingPreferences ?
                        <>
                        <CustomizedSwitch
                            label='Perfil de Twitter'
                            strong={true}
                            checked={twitterProfile}
                            onGetChange={e=>{
                                if(e){
                                    handleVincularTwitterProfile();
                                }else{
                                    handleDesvincularTwitterProfile();
                                }
                            }}
                        />
                        <Typography 
                            fontSize={{
                                lg: 15,
                                md: 15,
                                sm: 12,
                                xs: 12,
                            }}                                                                                
                            display="block"
                            gutterBottom
                            style={{
                                width: '100%',
                                marginTop: 10,
                            }}
                        >
                        Ingresa la URL de tu perfil de Twitter si querés que la comunidad byOO pueda verlo.
                        </Typography>
                        <TextField
                            disabled={props.disabled} 
                            error={stateErrorTwitterProfile}
                            helperText={helperTextTwitter}
                            value={valueInputTwitterProfile}
                            onChange={handleChangeTwitterProfile} 
                            label="URL de tu perfil de Twitter" 
                            variant="outlined" 
                            style={{
                                width: '100%',
                                marginTop: '10px',
                                marginBottom: '20px',
                            }}
                            autoComplete="new-password"
                            onKeyDown={e => handleKeyTwitterProfile(e) }
                        />
                        </>
                        :
                        <>
                            <Skeleton variant="text" width="100%"/>
                            <Skeleton variant="text" width="100%"/>
                            <Skeleton variant="text" width="100%"/>
                        </>
                        }
                        <Divider/>               
                        {!loadingPreferences ?
                        <>
                        <CustomizedSwitch
                            label='Perfil de LinkedIn'
                            strong={true}
                            checked={linkedinProfile}
                            onGetChange={e=>{
                                if(e){
                                    handleVincularLinkedinProfile();
                                }else{
                                    handleDesvincularLinkedinProfile();
                                }
                            }}
                        />
                        <Typography 
                            fontSize={{
                                lg: 15,
                                md: 15,
                                sm: 12,
                                xs: 12,
                            }}                                                                                
                            display="block"
                            gutterBottom
                            style={{
                                width: '100%',
                                marginTop: 10,
                            }}
                        >
                        Ingresa la URL de tu perfil de LinkedIn si querés que la comunidad byOO pueda verlo.
                        </Typography>
                        <TextField
                            disabled={props.disabled} 
                            error={stateErrorLinkedinProfile}
                            helperText={helperTextLinkedin}
                            value={valueInputLinkedinProfile}
                            onChange={handleChangeLinkedinProfile} 
                            label="URL de tu perfil de LinkedIn" 
                            variant="outlined" 
                            style={{
                                width: '100%',
                                marginTop: '10px',
                                marginBottom: '20px',
                            }}
                            autoComplete="new-password"
                            onKeyDown={e => handleKeyLinkedinProfile(e) }
                        />
                        </>
                        :
                        <>
                            <Skeleton variant="text" width="100%"/>
                            <Skeleton variant="text" width="100%"/>
                            <Skeleton variant="text" width="100%"/>
                        </>
                        }
                        <Divider/> 
                    </TabPanel>
                    <TabPanel value='contact'>
                    {!loadingPreferences ?
                        <>
                        <CustomizedSwitch
                            label='Permiti que te contacten por Whatsapp'
                            strong={true}
                            checked={whatsappContact}
                            onGetChange={e=>{
                                if(e){
                                    handleVincularWhatsappContact();
                                }else{
                                    handleDesvincularWhatsappContact();
                                }
                            }}
                        />
                        <Typography 
                            fontSize={{
                                lg: 15,
                                md: 15,
                                sm: 12,
                                xs: 12,
                            }}                                                                                
                            display="block"
                            gutterBottom
                            style={{
                                width: '100%',
                                marginTop: 10,
                            }}
                        >
                        Al habilitar esta opción, quienes vean tu perfil puede contactarte a través de Whatsapp.
                        </Typography>
                        </>
                        :
                        <>
                            <Skeleton variant="text" width="100%"/>
                            <Skeleton variant="text" width="100%"/>
                        </>
                        }
                        <Divider/> 
                        {!loadingPreferences ?
                        <>
                        <CustomizedSwitch
                            label='Permiti que te contacten por Telegram'
                            strong={true}
                            checked={telegramContact}
                            onGetChange={e=>{
                                if(e){
                                    handleVincularTelegramContact();
                                }else{
                                    handleDesvincularTelegramContact();
                                }
                            }}
                        />
                        <Typography 
                            fontSize={{
                                lg: 15,
                                md: 15,
                                sm: 12,
                                xs: 12,
                            }}                                                                                
                            display="block"
                            gutterBottom
                            style={{
                                width: '100%',
                                marginTop: 10,
                            }}
                        >
                        Al habilitar esta opción, quienes vean tu perfil puede contactarte a través de Telegram.
                        </Typography>
                        </>
                        :
                        <>
                            <Skeleton variant="text" width="100%"/>
                            <Skeleton variant="text" width="100%"/>
                        </>
                        }
                        <Divider/> 
                        {!loadingPreferences ?
                        <>
                        <CustomizedSwitch
                            label='Permiti que te contacten por correo electrónico'
                            strong={true}
                            checked={emailContact}
                            onGetChange={e=>{
                                if(e){
                                    handleVincularEmailContact();
                                }else{
                                    handleDesvincularEmailContact();
                                }
                            }}
                        />
                        <Typography 
                            fontSize={{
                                lg: 15,
                                md: 15,
                                sm: 12,
                                xs: 12,
                            }}                                                                                
                            display="block"
                            gutterBottom
                            style={{
                                width: '100%',
                                marginTop: 10,
                            }}
                        >
                        Al habilitar esta opción, quienes vean tu perfil puede contactarte a través de tu correo electrónico.
                        </Typography>
                        </>
                        :
                        <>
                            <Skeleton variant="text" width="100%"/>
                            <Skeleton variant="text" width="100%"/>
                        </>
                        }
                        <Divider/>
                    </TabPanel>
                </TabContext>
            </MuiDialogContent>
            </Dialog> 
            <Snackbar open={openMsg} autoHideDuration={6000} onClose={handleCloseMsg} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{width: '100%'}}>
                <Alert onClose={handleCloseMsg} severity={severityInfo}>{msg}</Alert>
            </Snackbar>            
        </div>
    )
}

export default FormEditIcons
