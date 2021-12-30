import React, {  useState, useCallback, useEffect } from 'react';
import { logout } from '../../services/firebase';
import logo from './byOO_1.svg';
import Login from '../login/Login'
import DehazeIcon from '@material-ui/icons/Dehaze';
import { Button, Divider } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Typography from '@material-ui/core/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import MessageIcon from '@mui/icons-material/Message';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
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
//import { motion } from "framer-motion";

const database = getFirestore();
const functions = getFunctions();
//const verifyIdToken = httpsCallable(functions, 'verifyIdToken');
const deleteUser = httpsCallable(functions, 'deleteUser');

function Header(details) {
//    const icon = {
//        hidden: {
//          opacity: 0,
//          pathLength: 0,
//          fill: "rgba(255, 255, 255, 0)"
//        },
//        visible: {
//          opacity: 1,
//          pathLength: 1,
//          fill: "rgba(255, 255, 255, 1)"
//        }
//      };
        
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
        })
        .catch((error)=>{
            setPhotoURL(null);
            handleClose(null);
            emitCustomEvent('openLoadingPage', false);
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
                    
                    

//                    notifications:{
//                        preferences:{
//                            tips_news:{
//                                tips_services:{
//                                    email: false,
//                                    textMessage: false,
//                                    browser: false,
//                                },
//                                tips_budget:{
//                                    email: false,
//                                    textMessage: false,
//                                    browser: false,
//                                },
//                                news:{
//                                    email: false,
//                                    textMessage: false,
//                                    browser: false,
//                                },
//                                comments:{
//                                    email: false,
//                                    textMessage: false,
//                                    browser: false,
//                                },
//                                normative:{
//                                    email: false,
//                                    textMessage: false,
//                                    browser: false,
//                                },
//                            },
//                            account:{
//                                activity:{
//                                    email: false,
//                                    textMessage: false,
//                                    browser: false,
//                                },
//                                policy:{
//                                    email: false,
//                                    textMessage: false,
//                                    browser: false,
//                                },
//                                reminder:{
//                                    email: false,
//                                    textMessage: false,
//                                    browser: false,
//                                },
//                                messages:{
//                                    email: false,
//                                    textMessage: false,
//                                    browser: false,
//                                },
//                            },
//                        },
//                        messages:[],
//                    },
        


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
                    setPhotoURL(docSnap.data().profilePhoto);
                })
                .catch(()=>{
                    emitCustomEvent('showMsg', 'Ha ocurrido un error al intentar acceder a los datos de tu cuenta/error');
                    console.log('error')
                    setLoadingAvatar(false);
                });
            }else{
                setPhotoURL(docSnap.data().profilePhoto);
            }
        }else{
            deleteUser(currentUser1.uid)
            .then(()=>{
                logout()
                .then(()=>{
                    emitCustomEvent('showMsg', 'Ha ocurrido un error al intentar acceder a los datos de tu cuenta, tenés que volver a registrarte/error');
                })
                .catch((error)=>{
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

    return (
        <div className='header'>
        {/*<Container maxWidth="xl">*/}
            <Link to='/'>
                <img
                    className='header__icon'
                    src={logo}
                    alt='logo'
                />            

{/*<div
        style={{
        position: "relative",
        width: 50,
        height: 50,
        margin: 8,
        backgroundColor: 'red'
      }}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 50 50"
        style={{ position: "absolute" }}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 360 }}
        transition={{
          ease: "easeInOut",
          duration: 2,
          flip: Infinity,
          repeatDelay: 5
        }}
      >
        <defs>
          <path
            id="a"
            color='red'
            d="M25 0c13.807 0 25 11.193 25 25S38.807 50 25 50 0 38.807 0 25 11.193 0 25 0z"
          />
          <clipPath id="b">
            <use xlinkHref="#a" />
          </clipPath>
          <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="100%">
            <motion.stop
              stopColor="#2B00FF"
              animate={{
                stopColor: [
                  "#0055FF",
                  "#FFF9DA",
                  "#E7FFF7",
                  "#FFC6A8",
                  "#FF7744",
                  "#F3F2F2"
                ]
              }}
              transition={{
                yoyo: Infinity,
                ease: "linear",
                duration: 8
              }}
              offset="25%"
            />
            <motion.stop
              stopColor="#0055FF"
              animate={{
                stopColor: [
                  "#0055FF",
                  "#FFF9DA",
                  "#FFC6A8",
                  "#FF7744",
                  "#2B00FF"
                ]
              }}
              transition={{
                yoyo: Infinity,
                ease: "linear",
                duration: 8
              }}
              offset="50%"
            />
            <motion.stop
              stopColor="#D4504C"
              animate={{
                stopColor: ["#FFF9DA", "#E7FFF7", "#0055FF"]
              }}
              transition={{
                yoyo: Infinity,
                ease: "linear",
                duration: 8
              }}
              offset="75%"
            />
            <motion.stop
              stopColor="#FF7744"
              animate={{
                stopColor: ["#D4504C", "#2B00FF", "#E7FFF7", "#FFF9DA"]
              }}
              transition={{
                yoyo: Infinity,
                ease: "linear",
                duration: 8
              }}
              offset="100%"
            />
          </linearGradient>
        </defs>
        <use
          fill="transparent"
          stroke="url(#linear)"
          strokeWidth="4"
          clip-path="url(#b)"
          xlinkHref="#a"
        />
        <motion.path
          animate={{ rotate: 360 }}
          transition={{
            ease: "easeInOut",
            flip: Infinity,
            repeatDelay: 5,
            duration: 2
          }}
          d="M28.364 30.8a10.282 10.282 0 010-12.6l1.438-1.867c1.853-2.406 1.523-5.791-.761-7.815-2.285-2.024-5.776-2.024-8.061 0s-2.615 5.409-.762 7.815l1.438 1.867a10.282 10.282 0 010 12.6l-1.438 1.867c-1.853 2.406-1.523 5.791.762 7.815s5.776 2.024 8.061 0c2.284-2.024 2.614-5.409.761-7.815zm-5.35-17.967a1.946 1.946 0 011.232-1.799 2.039 2.039 0 012.179.42 1.91 1.91 0 01.434 2.121 2 2 0 01-1.846 1.202c-1.103 0-1.997-.87-1.999-1.944zm1.999 25.277a1.998 1.998 0 01-1.848-1.196 1.907 1.907 0 01.43-2.12 2.034 2.034 0 012.176-.423 1.943 1.943 0 011.232 1.796c-.001 1.071-.891 1.94-1.99 1.943z"
        />
      </motion.svg>
    </div>
*/}
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
                                            color: '#5f5f5f',
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
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Fade}
                        PaperProps={{
                            style: {
                                borderRadius: 10,
                                transform: 'translateX(-4.5vw) translateY(55px)',
                            }
                        }}
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
                        id="fade-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Fade}
                        PaperProps={{
                            style: {
                                borderRadius: 10,
                                transform: 'translateX(-5vw) translateY(55px)',
                            }
                        }}
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
                                <AccountCircleIcon fontSize="medium" />
                            {/*</Badge>*/}
                        </ListItemIcon>
                        <Typography variant="inherit">Cuenta</Typography>                
                    </MenuItem>
                    <Divider />
                    <MenuItem className='login__menu__item'>
                        <ListItemIcon>
                            <HomeRepairServiceIcon fontSize="medium" />
                        </ListItemIcon>
                        <Typography variant="inherit">Modo prestador de servicios</Typography>                
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