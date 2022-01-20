import React, {  useState, useCallback, useEffect } from 'react';
import { logout } from '../../services/firebase';
import logo from './logo_load.png';
import Login from '../login/Login'
import DehazeIcon from '@material-ui/icons/Dehaze';
import { Button, Divider } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Typography from '@material-ui/core/Typography';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import MessageIcon from '@mui/icons-material/Message';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import './Header.css';
import { getFirestore,
        Timestamp, 
        doc, 
        updateDoc, 
        arrayUnion, 
//        arrayRemove,
        getDoc } from "firebase/firestore";
import { useAuth } from '../../services/firebase';
import { getFunctions, httpsCallable } from "firebase/functions";
import { emitCustomEvent } from 'react-custom-events';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { getAuth } from "firebase/auth";
import FaceIcon from '@mui/icons-material/Face';
import SettingsIcon from '@mui/icons-material/Settings';
//import { motion } from "framer-motion";

const database = getFirestore();
const functions = getFunctions();
//const verifyIdToken = httpsCallable(functions, 'verifyIdToken');
const deleteUser = httpsCallable(functions, 'deleteUser');

function Header(details) {       
    const history = useHistory ();
    const [anchorEl, setAnchorEl] = useState(null);
    const [photoURL, setPhotoURL] = useState(null);
    const [openLogin, setOpenLogin] =useState(false);
    const open = Boolean(anchorEl);    
    const {currentUser} = useAuth();
    const [loadingAvatar, setLoadingAvatar] = useState(false);

    const handleClick = (event) => {      
        setAnchorEl(event.currentTarget);
    }
    
    const handleClose = () => {
        setAnchorEl(null);
    }
  
    const handleRegistrate = (event) => {
        setAnchorEl(null);
        setOpenLogin(true);
    }
  
    const handleIniSec = (event) => {
        setAnchorEl(null);
        setOpenLogin(true);
    }

    const handleCloseLogin = () => {
        setOpenLogin(false);
    }
    
    const handleAyuda = (event) => {
        history.push('/privacity');          
        setAnchorEl(null);
    }
    
    const handleCuenta = () => {
        history.push('/account-settings');          
        setAnchorEl(null);
    }

    const handleLogout = async () => {
        emitCustomEvent('openLoadingPage', true);
        logout()
        .then(()=>{
            setPhotoURL(null);
            handleClose(null);
            emitCustomEvent('openLoadingPage', false);
            emitCustomEvent('loged', false);
        })
        .catch((error)=>{
            setPhotoURL(null);
            handleClose(null);
            emitCustomEvent('openLoadingPage', false);
            emitCustomEvent('loged', false);
        });
    } 

//    const handleUpdateProfile = useCallback(async () => {
//        setLoadingAvatar(true);
//        setOpenLogin(false);
//        const auth = getAuth();
//        const currentUser1 = auth.currentUser;
//        const infoUser = doc(database, "users", currentUser1.uid);
//        try{                                  
//            const docSnap = await getDoc(infoUser);
//            if (docSnap.exists()) {
//                docSnap.data().sessions.forEach(function(element) {
//                    console.log(element)
//                    verifyIdToken(element.id)
//                    .then(async (result) => {
//                        if (result.data.uid !== undefined){
//                            console.log(result);
//                        }else{
//                            console.log(result.data.errorInfo.code);
//                            if (result.data.errorInfo.code === 'auth/id-token-revoked'){
//                                await updateDoc(infoUser, {
//                                    sessions: arrayRemove(element)
//                                })
//                                .then((result)=>{
//                                    console.log(result);
//                                })
//                                .catch((error)=>{
//                                    console.log(error);
//                                });
//                            }
//                        }
//                    })
//                })                    
//                const filtered = docSnap.data().sessions.filter(function(element){
//                    return element.id === currentUser1.accessToken;
//                });
//                if (filtered.length === 0){
//                    await updateDoc(infoUser, {
//                            sessions: arrayUnion(                
//                                {
//                                    id: currentUser1.accessToken,
//                                    date: Timestamp.now().toMillis(),
//                                    ip: details.user[0].ip, 
//                                    browser: details.user[1].browser.name,
//                                    os:{
//                                        name: details.user[1].os.name,
//                                        version: details.user[1].os.version,
//                                    },
//                                    location:{
//                                        city: details.user[0].city,//tigre
//                                        country: details.user[0].country_name, //argentina
//                                        region: details.user[0].region,
//                                        country_code: details.user[0].country_code,
//                                        currency_name: details.user[0].currency_name,
//                                        currency: details.user[0].currency,
//                                        lenguaje: details.user[0].languages.split(',')[0],
//                                        country_tld: details.user[0].country_tld,
//                                    },
//                                }
//                            )
//                        }
//                    )
//                    .then(()=>{
//                        if (currentUser1.providerData.length === 1){
//                            //tiene un solo proveedor
//                            if (currentUser1.providerData[0].providerId === 'phone'){
//                                //tiene un solo proveedor y es phone
//                                if (currentUser1.email !== null){
//                                    //tiene un solo proveedor, es phone y tiene un email asociado esta mal, hay que asignarle null a email
//                                }
//                            }
//                        }
//                        setPhotoURL(docSnap.data().profilePhoto);
//                    })
//                    .catch(()=>{
//                        emitCustomEvent('showMsg', 'Ha ocurrido un error al intentar acceder a los datos de tu cuenta/error');
//                        console.log('error')
//                        setLoadingAvatar(false);
//                    });
//                }else{
//                    setPhotoURL(docSnap.data().profilePhoto);
//                }
//            }else{
//                deleteUser(currentUser1.uid)
//                .then(()=>{
//                    logout()
//                    .then(()=>{
//                        emitCustomEvent('showMsg', 'Ha ocurrido un error al intentar acceder a los datos de tu cuenta, tenés que volver a registrarte/error');
//                    })
//                    .catch((error)=>{
//                        emitCustomEvent('showMsg', 'Ha ocurrido un error al intentar acceder a los datos de tu cuenta, tenés que volver a registrarte/error');
//                    });
//                })
//                .catch(()=>{
//                    console.log('error')
//                })
//                setLoadingAvatar(false);
//            }
//        }catch{
//            emitCustomEvent('showMsg', 'Ha ocurrido un error al intentar acceder a los datos de tu cuenta/error');
//            console.log('error')
//            setLoadingAvatar(false);
//        } 
//    },[details]);

const handleUpdateProfile = useCallback(async () => {
    console.log('agregar sesion');
    setLoadingAvatar(true);
    setOpenLogin(false);
    const auth = getAuth();
    const currentUser1 = auth.currentUser;
    const infoUser = doc(database, "users", currentUser1.uid);
    try{                                  
        const docSnap = await getDoc(infoUser);
        if (docSnap.exists()) {                  
            const filtered = docSnap.data().sessions.filter(function(element){
                return element.id === currentUser1.stsTokenManager.refreshToken;
            });
            if (filtered.length === 0){
                await updateDoc(infoUser, { 
                    sessions: arrayUnion(                
                        {
                            id: currentUser1.stsTokenManager.refreshToken,
                            date: Timestamp.now().toMillis(),
                            ip: details.user[0].ip, 
                            browser: details.user[1].browser.name,
                            os:{
                                name: details.user[1].os.name,
                                version: details.user[1].os.version,
                            },
                            location:{
                                city: details.user[0].city,//tigre
                                country: details.user[0].country_name, //argentina
                                region: details.user[0].region,
                                country_code: details.user[0].country_code,
                                currency_name: details.user[0].currency_name,
                                currency: details.user[0].currency,
                                lenguaje: details.user[0].languages.split(',')[0],
                                country_tld: details.user[0].country_tld,
                            },
                        }
                    )
                    }
                )
                .then(()=>{
                    if (currentUser1.providerData.length === 1){
                        //tiene un solo proveedor
                        if (currentUser1.providerData[0].providerId === 'phone'){
                            //tiene un solo proveedor y es phone
                            if (currentUser1.email !== null){
                                //tiene un solo proveedor, es phone y tiene un email asociado esta mal, hay que asignarle null a email
                            }
                        }
                    }
                    emitCustomEvent('loged', true);
                    setPhotoURL(docSnap.data().profilePhoto);
                })
                .catch(()=>{
                    emitCustomEvent('showMsg', 'Ha ocurrido un error al intentar acceder a los datos de tu cuenta/error');
                    console.log('error')
                    setLoadingAvatar(false);
                });
            }else{
                emitCustomEvent('loged', true);
                setPhotoURL(docSnap.data().profilePhoto);
            }
        }else{
            deleteUser(currentUser1.uid)
            .then(()=>{
                logout()
                .then(()=>{
                    emitCustomEvent('loged', false);
                    emitCustomEvent('showMsg', 'Ha ocurrido un error al intentar acceder a los datos de tu cuenta, tenés que volver a registrarte/error');
                })
                .catch((error)=>{
                    emitCustomEvent('loged', false);
                    emitCustomEvent('showMsg', 'Ha ocurrido un error al intentar acceder a los datos de tu cuenta, tenés que volver a registrarte/error');
                });
            })
            .catch(()=>{
                console.log('error')
            })
            setLoadingAvatar(false);
        }
    }catch{
        emitCustomEvent('showMsg', 'Ha ocurrido un error al intentar acceder a los datos de tu cuenta/error');
        console.log('error')
        setLoadingAvatar(false);
    } 
},[details]);


    const handleUpdateProfileBasic = useCallback(async () => {
        console.log('perfil basico');
        setLoadingAvatar(true);
        setOpenLogin(false);
        const auth = getAuth();
        const currentUser1 = auth.currentUser;
        const infoUser = doc(database, "users", currentUser1.uid);
        try{                                  
            const docSnap = await getDoc(infoUser);
            if (docSnap.exists()) {
                setPhotoURL(docSnap.data().profilePhoto);
            }else{
                setLoadingAvatar(false);
            }
        }catch{
            setLoadingAvatar(false);
        } 
    },[]);

    useEffect(() => {
        if (currentUser){
            handleUpdateProfileBasic();
        } 
    }, [currentUser, handleUpdateProfileBasic]);

    const avatarLoaded = () => {
        setLoadingAvatar(false);
    }

    const handlePerfil = () => {
        history.push('/users?show='+String(currentUser.uid)); 
        setAnchorEl(null);         
    }

    return (
        <div className='header'>
        {/*<Container maxWidth="xl">*/}
            <Link to='/'>
                <img
                    className='header__icon'
                    src={logo}
                    alt='logo'
                />            
            </Link>
            <div className='header__right'>
                { !currentUser ?
                    <Button className='header__servButton' disableFocusRipple={true}>
                        Presto Servicios
                    </Button>
                :
                    <Button className='header__servButton' disableFocusRipple={true}>
                        Mis Servicios
                    </Button>
                }
                <Button aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick} className='header__logButton' disableFocusRipple={true}>
                    <DehazeIcon className='header__barras'/>
                    {currentUser &&
                        /*
                        <Badge 
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            overlap="circular" 
                            color='error'
                            badgeContent="101" 
                        >
                        */
                            <Badge 
                                overlap="circular"
                                anchorOrigin={{ 
                                    vertical: "bottom", 
                                    horizontal: "right" 
                                }}
                                badgeContent={
                                        <Avatar sx={{bgcolor: '#44b700', color: '#44b700', width: 8, height: 8}}/>
                                }
                            > 
                                <Box sx={{ position: 'relative' }}>
                                {((loadingAvatar)&&(photoURL !== 'none')) ?
                                <CircularProgress
                                        className='header__avatar'
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            zIndex: 1,
                                        }}
                                    color="inherit"
                                />
                                :
                                null
                                }
                                <Avatar className='header__avatar' src={photoURL} onLoad={avatarLoaded}/>
                                </Box>
                            </Badge>
                        /*</Badge>*/
                    }
                    {!currentUser &&
                        <Avatar className='header__avatar'>
                            <AccountCircleIcon className='header__circleIcon'/>
                        </Avatar>
                    }
                </Button>
                { !currentUser &&
                <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >

                    <MenuItem onClick={handleRegistrate} className='login__menu__item'>
                        <ListItemIcon>
                            <AppRegistrationIcon fontSize="medium" />
                        </ListItemIcon>
                        <Typography variant="inherit">Registrate</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleIniSec} className='login__menu__item'>
                        <ListItemIcon>
                            <LoginIcon fontSize="medium" />
                        </ListItemIcon>
                        <Typography variant="inherit">Iniciá sesión</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleAyuda} className='login__menu__item'>
                        <ListItemIcon>
                            <HelpCenterIcon fontSize="medium" />
                        </ListItemIcon>
                        <Typography variant="inherit">Ayuda</Typography>
                    </MenuItem>
                </Menu>
                }
                { currentUser &&
                <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem className='login__menu__item'>
                        <ListItemIcon>
                            {/*<Badge 
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                overlap="circular" 
                                color='error'
                                badgeContent="1" 
                            >*/}
                                <MessageIcon fontSize="medium" />
                            {/*</Badge>*/}
                        </ListItemIcon>
                        <Typography variant="inherit">Mensajes</Typography>
                    </MenuItem>
                    <MenuItem className='login__menu__item'>
                        <ListItemIcon>
                            {/*<Badge 
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    overlap="circular" 
                                    color='error'
                                    badgeContent="1" 
                                >*/}
                                <NotificationsIcon fontSize="medium" />
                            {/*</Badge>*/}
                        </ListItemIcon>
                        <Typography variant="inherit">Notificaciones</Typography>
                    </MenuItem>
                    <MenuItem className='login__menu__item'>
                        <ListItemIcon>
                            <FavoriteIcon fontSize="medium" />
                        </ListItemIcon>
                        <Typography variant="inherit">Favoritos</Typography>                
                    </MenuItem>
                    <MenuItem onClick={handleCuenta} className='login__menu__item'>
                        <ListItemIcon>
                            {/*<Badge 
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    overlap="circular" 
                                    color='error'
                                    badgeContent="1" 
                                >*/}
                                <SettingsIcon fontSize="medium" />
                            {/*</Badge>*/}
                        </ListItemIcon>
                        <Typography variant="inherit">Ajustes de cuenta</Typography>                
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handlePerfil} className='login__menu__item'>
                        <ListItemIcon>
                            <FaceIcon fontSize="medium" />
                        </ListItemIcon>
                        <Typography variant="inherit">Mi perfil</Typography>                
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleAyuda} className='login__menu__item'>
                        <ListItemIcon>
                            <HelpCenterIcon fontSize="medium" />
                        </ListItemIcon>
                        <Typography variant="inherit">Ayuda</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout} className='login__menu__item'>
                        <ListItemIcon>
                            <LogoutIcon fontSize="medium" />
                        </ListItemIcon>
                        <Typography variant="inherit">Cerrar sesión</Typography>                
                    </MenuItem>
                </Menu>
                }
                <Login
                    userDetails={details}
                    open={openLogin}
                    onGetClose={handleCloseLogin}
                    onGetUpdateProfile={handleUpdateProfile}
                />
        </div>
    {/*</Container>*/}
    </div>
    )
}

export default Header