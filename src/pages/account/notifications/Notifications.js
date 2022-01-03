import React, { useEffect, useState, useCallback } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import notifications from '../../../images/svg/undraw_selection_re_ycpo.svg';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import { useHistory } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {  Divider } from '@material-ui/core';
import { useAuth } from '../../../services/firebase';
import '../../login/Login.css';
import Skeleton from '@mui/material/Skeleton';
import { logout } from '../../../services/firebase';
import { emitCustomEvent } from 'react-custom-events';
import { useInitPage } from '../../useInitPage';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import {
    updateDoc,
    doc, 
    getDoc,
    getFirestore,} from "firebase/firestore";
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import Tabs from '@mui/material/Tabs';
import TabContext from '@mui/lab/TabContext';
import CustomizedSwitch from '../../custom/CustomSwitch';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ListItemIcon from '@mui/material/ListItemIcon';
import FollowTheSignsIcon from '@mui/icons-material/FollowTheSigns';
import CalculateIcon from '@mui/icons-material/Calculate';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import CommentIcon from '@mui/icons-material/Comment';
import GavelIcon from '@mui/icons-material/Gavel';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import PolicyIcon from '@mui/icons-material/Policy';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ChatIcon from '@mui/icons-material/Chat';

const database = getFirestore();

function Notifications(details) {
    const [ openMsg, setOpenMsg] = useState(false);
    const [severityInfo, setSeverityInfo] = useState('success');
    const [msg, setMsg] = useState('');
    const handleCloseMsg = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpenMsg(false);
    };

    const history = useHistory ();
    const mobilAccess = !useMediaQuery('(min-width:769px)', { noSsr: true });
    const {state} = useInitPage();
    const {currentUser} = useAuth();
    const [isMounted, setIsMounted] = useState(true);

    const Img = styled('img')({
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100px',
    });    

    const handleCuenta = () => {
        history.push('/account-settings');          
    }

    const breadcrumbs = [
        <Link
          key={1}
          underline="none"
          onClick={handleCuenta}
          sx={{
            color: '#222222 !important',
            textDecoration: "underline #222222",
            fontSize: '16px',
            cursor: 'pointer'
        }} 
        >
            Cuenta
        </Link>,
        <Typography color="text.primary" key={2}>
            Notificaciones
        </Typography>,
    ];    

    const [loadingCreated, setLoadingCreated] = useState(true);

    const [accountActivityEmail, setAccountActivityEmail] = useState(false);
    const [accountActivityText, setAccountActivityText] = useState(false);
    const [accountActivityBrowser, setAccountActivityBrowser] = useState(false);

    const [accountMessagesEmail, setAccountMessagesEmail] = useState(false);
    const [accountMessagesText, setAccountMessagesText] = useState(false);
    const [accountMessagesBrowser, setAccountMessagesBrowser] = useState(false);

    const [accountPolicyEmail, setAccountPolicyEmail] = useState(false);
    const [accountPolicyText, setAccountPolicyText] = useState(false);
    const [accountPolicyBrowser, setAccountPolicyBrowser] = useState(false);

    const [accountReminderEmail, setAccountReminderEmail] = useState(false);
    const [accountReminderText, setAccountReminderText] = useState(false);
    const [accountReminderBrowser, setAccountReminderBrowser] = useState(false);

    const [tipsCommentsEmail, setTipsCommentsEmail] = useState(false);
    const [tipsCommentsText, setTipsCommentsText] = useState(false);
    const [tipsCommentsBrowser, setTipsCommentsBrowser] = useState(false);

    const [tipsNewsEmail, setTipsNewsEmail] = useState(false);
    const [tipsNewsText, setTipsNewsText] = useState(false);
    const [tipsNewsBrowser, setTipsNewsBrowser] = useState(false);

    const [tipsNormativeEmail, setTipsNormativeEmail] = useState(false);
    const [tipsNormativeText, setTipsNormativeText] = useState(false);
    const [tipsNormativeBrowser, setTipsNormativeBrowser] = useState(false);

    const [tipsBudgetEmail, setTipsBudgetEmail] = useState(false);
    const [tipsBudgetText, setTipsBudgetText] = useState(false);
    const [tipsBudgetBrowser, setTipsBudgetBrowser] = useState(false);

    const [tipsServicesEmail, setTipsServicesEmail] = useState(false);
    const [tipsServicesText, setTipsServicesText] = useState(false);
    const [tipsServicesBrowser, setTipsServicesBrowser] = useState(false);

    const handleUpdateProfile = useCallback(async () => {
        const infoUser = doc(database, "users", currentUser.uid);
        try{                                  
            const docSnap = await getDoc(infoUser);
            if (docSnap.exists()) {
                if (isMounted){
                    setAccountActivityEmail(docSnap.data().notifications.preferences.account.activity.email);
                    setAccountActivityText(docSnap.data().notifications.preferences.account.activity.textMessage);
                    setAccountActivityBrowser(docSnap.data().notifications.preferences.account.activity.browser);
                    setAccountMessagesEmail(docSnap.data().notifications.preferences.account.messages.email);
                    setAccountMessagesText(docSnap.data().notifications.preferences.account.messages.textMessage);
                    setAccountMessagesBrowser(docSnap.data().notifications.preferences.account.messages.browser);
                    setAccountPolicyEmail(docSnap.data().notifications.preferences.account.policy.email);
                    setAccountPolicyText(docSnap.data().notifications.preferences.account.policy.textMessage);
                    setAccountPolicyBrowser(docSnap.data().notifications.preferences.account.policy.browser);
                    setAccountReminderEmail(docSnap.data().notifications.preferences.account.reminder.email);
                    setAccountReminderText(docSnap.data().notifications.preferences.account.reminder.textMessage);
                    setAccountReminderBrowser(docSnap.data().notifications.preferences.account.reminder.browser);
                    setTipsCommentsEmail(docSnap.data().notifications.preferences.tips_news.comments.email);
                    setTipsCommentsText(docSnap.data().notifications.preferences.tips_news.comments.textMessage);
                    setTipsCommentsBrowser(docSnap.data().notifications.preferences.tips_news.comments.browser);
                    setTipsNewsEmail(docSnap.data().notifications.preferences.tips_news.news.email);
                    setTipsNewsText(docSnap.data().notifications.preferences.tips_news.news.textMessage);
                    setTipsNewsBrowser(docSnap.data().notifications.preferences.tips_news.news.browser);
                    setTipsNormativeEmail(docSnap.data().notifications.preferences.tips_news.normative.email);
                    setTipsNormativeText(docSnap.data().notifications.preferences.tips_news.normative.textMessage);
                    setTipsNormativeBrowser(docSnap.data().notifications.preferences.tips_news.normative.browser);
                    setTipsBudgetEmail(docSnap.data().notifications.preferences.tips_news.tips_budget.email);
                    setTipsBudgetText(docSnap.data().notifications.preferences.tips_news.tips_budget.textMessage);
                    setTipsBudgetBrowser(docSnap.data().notifications.preferences.tips_news.tips_budget.browser);
                    setTipsServicesEmail(docSnap.data().notifications.preferences.tips_news.tips_services.email);
                    setTipsServicesText(docSnap.data().notifications.preferences.tips_news.tips_services.textMessage);
                    setTipsServicesBrowser(docSnap.data().notifications.preferences.tips_news.tips_services.browser);                

                    setLoadingCreated(false);
                }
            }else{
                logout()
                .then(()=>{
                    emitCustomEvent('showMsg', 'Ha ocurrido un error al intentar acceder a los datos de tu cuenta/error');
                    console.log('error')
                })
                .catch((error)=>{
                    emitCustomEvent('showMsg', 'Ha ocurrido un error al intentar acceder a los datos de tu cuenta/error');
                    console.log('error')
                });
            }
        }catch{
        } 
    },[currentUser, isMounted]);

    const clearStates = useCallback(() => {
        if(isMounted){
            setLoadingCreated(true);

            setAccountActivityEmail(false);
            setAccountActivityText(false);
            setAccountActivityBrowser(false);
            setAccountMessagesEmail(false);
            setAccountMessagesText(false);
            setAccountMessagesBrowser(false);
            setAccountPolicyEmail(false);
            setAccountPolicyText(false);
            setAccountPolicyBrowser(false);
            setAccountReminderEmail(false);
            setAccountReminderText(false);
            setAccountReminderBrowser(false);
            setTipsCommentsEmail(false);
            setTipsCommentsText(false);
            setTipsCommentsBrowser(false);
            setTipsNewsEmail(false);
            setTipsNewsText(false);
            setTipsNewsBrowser(false);
            setTipsNormativeEmail(false);
            setTipsNormativeText(false);
            setTipsNormativeBrowser(false);
            setTipsBudgetEmail(false);
            setTipsBudgetText(false);
            setTipsBudgetBrowser(false);
            setTipsServicesEmail(false);
            setTipsServicesText(false);
            setTipsServicesBrowser(false);                
        }
    },[isMounted]);

    useEffect(() => {
        setIsMounted(true);
        if (state !== null){
            if (state){
                clearStates();
                handleUpdateProfile();
            }
        }
        return () => {setIsMounted(false)}
    }, [state, handleUpdateProfile, clearStates]);

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

    const [valueTab, setValueTab] = useState('ofers');

    const handleChangeTab = (event, newValue) => {
      setValueTab(newValue);
    };

    return (
        <div>
            <Container maxWidth='lg'>
                <Box sx={{minHeight: '100vh'}}>
                    <Paper
                        variant='string' 
                        sx={{ 
                            pt: '50px', 
                            pb: '50px', 
                        }}
                    >
                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            spacing={{ xs: 3 }}
                            style={{
                                marginTop: '30px',
                                marginBottom: '30px',
                            }}
                        >
                            <Container maxWidth="md">
                                <Box>
                                    {!mobilAccess ?
                                        <Breadcrumbs
                                            separator={<NavigateNextIcon fontSize="small" />}
                                            aria-label="breadcrumb"
                                        >
                                            {breadcrumbs}
                                        </Breadcrumbs>
                                    :
                                    <Link
                                        component={ArrowBackIosIcon}
                                        onClick={handleCuenta}
                                        sx={{
                                            color: '#000000 !important',
                                            fontSize: '25px',
                                        }} 
                                    />
                                    }
                                    <Typography
                                        fontSize={{
                                            lg: 30,
                                            md: 30,
                                            sm: 25,
                                            xs: 25,
                                        }}                                                                                
                                        sx={{
                                            marginTop: '40px',
                                            marginBottom: '20px',
                                        }}
                                    >
                                        <strong>Notificaciones</strong>
                                    </Typography>
                                    <TabContext value={valueTab}>
                                        <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider' }}>
                                            <StyledTabs
                                                value={valueTab} 
                                                onChange={handleChangeTab} 
                                                aria-label="select tabs notifications"
                                            >
                                                <StyledTab label="Consejos y novedades"  value='ofers' />
                                                <StyledTab label="Cuenta"  value='account' />
                                            </StyledTabs>
                                        </Box>
                                        <TabPanel value='ofers'>
                                            <Typography
                                                fontSize={{
                                                    lg: 25,
                                                    md: 25,
                                                    sm: 20,
                                                    xs: 20,
                                                }}                                                                                
                                                sx={{
                                                    marginTop: '0px',
                                                }}
                                            >
                                                <strong>Consejos de byOO</strong>
                                            </Typography>
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
                                                Te vamos a enviar recomendaciones para tus servicios y presupuestos.
                                            </Typography>
                                            <Accordion
                                                sx={{
                                                    marginTop: '20px',
                                                    marginBottom: '20px',
                                                }}
                                            >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel-name"
                                                id="panel-name"
                                            >
                                            <ListItemIcon>
                                                <FollowTheSignsIcon fontSize="medium" />
                                            </ListItemIcon>
                                            <Typography><strong>Consejos sobre servicios</strong></Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                            <Divider/>
                                            <Typography 
                                                fontSize={{
                                                    lg: 19,
                                                    md: 19,
                                                    sm: 15,
                                                    xs: 15,
                                                }}                                                                                
                                                display="block"
                                                gutterBottom
                                                style={{
                                                    width: '100%',
                                                    marginTop: 10,
                                                }}
                                            >
                                                <strong>Consejos sobre servicios</strong>
                                            </Typography>
                                            {!loadingCreated ?
                                            <>
                                            <CustomizedSwitch
                                                label='Correo electrónico'
                                                strong={false}
                                                checked={tipsServicesEmail}
                                                onGetChange={async (e)=>{
                                                    if (currentUser.email !== null){
                                                        const infoUser = doc(database, "users", currentUser.uid);
                                                        try{                                  
                                                            await updateDoc(infoUser, {
                                                                'notifications.preferences.tips_news.tips_services.email': e,
                                                            })
                                                            .then(()=>{
                                                                if (isMounted){
                                                                    setTipsServicesEmail(e);                                            
                                                                }
                                                            })
                                                            .catch(()=>{
                                                                if (isMounted){
                                                                    setMsg('Ha ocurrido un error al intentar actualizar tu información');
                                                                    setSeverityInfo('error');
                                                                    setOpenMsg(true); 
                                                                }                                       
                                                            });
                                                        }catch{
                                                            if (isMounted){
                                                                setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                                                                setSeverityInfo('error');
                                                                setOpenMsg(true);
                                                            }                                        
                                                        } 
                                                    }else{
                                                        if (isMounted){
                                                            setMsg('No es posible actualizar la información porque no tenés un correo asociado a tu cuenta');
                                                            setSeverityInfo('error');
                                                            setOpenMsg(true);
                                                        }                                        
                                                    }
                                                }}
                                            />    
                                            <CustomizedSwitch
                                                label='Mensaje de texto'
                                                strong={false}
                                                checked={tipsServicesText}
                                                onGetChange={async (e)=>{
                                                    if (currentUser.phoneNumber !== null){
                                                        const infoUser = doc(database, "users", currentUser.uid);
                                                        try{                                  
                                                            await updateDoc(infoUser, {
                                                                'notifications.preferences.tips_news.tips_services.textMessage': e,
                                                            })
                                                            .then(()=>{
                                                                if (isMounted){
                                                                    setTipsServicesText(e);                                            
                                                                }
                                                            })
                                                            .catch(()=>{
                                                                if (isMounted){
                                                                    setMsg('Ha ocurrido un error al intentar actualizar tu información');
                                                                    setSeverityInfo('error');
                                                                    setOpenMsg(true);
                                                                }                                        
                                                            });
                                                        }catch{
                                                            if (isMounted){
                                                                setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                                                                setSeverityInfo('error');
                                                                setOpenMsg(true);
                                                            }                                        
                                                        } 
                                                    }else{
                                                        if (isMounted){
                                                            setMsg('No es posible actualizar la información porque no tenés un número telefónico asociado a tu cuenta');
                                                            setSeverityInfo('error');
                                                            setOpenMsg(true);
                                                        }                                        
                                                    }
                                                }}
                                            />    
                                            <CustomizedSwitch
                                                label='Notificaciones en el navegador'
                                                strong={false}
                                                checked={tipsServicesBrowser}
                                                onGetChange={async (e)=>{
                                                    const infoUser = doc(database, "users", currentUser.uid);
                                                    try{                                  
                                                        await updateDoc(infoUser, {
                                                            'notifications.preferences.tips_news.tips_services.browser': e,
                                                        })
                                                        .then(()=>{
                                                            if (isMounted){
                                                                setTipsServicesBrowser(e);                                            
                                                            }
                                                        })
                                                        .catch(()=>{
                                                            if (isMounted){
                                                                setMsg('Ha ocurrido un error al intentar actualizar tu información');
                                                                setSeverityInfo('error');
                                                                setOpenMsg(true);
                                                            }                                        
                                                        });
                                                    }catch{
                                                        if (isMounted){
                                                            setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                                                            setSeverityInfo('error');
                                                            setOpenMsg(true);
                                                        }                                        
                                                    } 
                                                }}
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
                                            </AccordionDetails>
                                            </Accordion>
                                            <Accordion
                                                sx={{
                                                    marginTop: '20px',
                                                    marginBottom: '20px',
                                                }}                                    
                                            >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel-name"
                                                id="panel-name"
                                            >
                                            <ListItemIcon>
                                                <CalculateIcon fontSize="medium" />
                                            </ListItemIcon>
                                            <Typography><strong>Consejos sobre presupuestos</strong></Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                            <Divider/>
                                            <Typography 
                                                fontSize={{
                                                    lg: 19,
                                                    md: 19,
                                                    sm: 15,
                                                    xs: 15,
                                                }}                                                                                
                                                display="block"
                                                gutterBottom
                                                style={{
                                                    width: '100%',
                                                    marginTop: 10,
                                                }}
                                            >
                                                <strong>Consejos sobre presupuestos</strong>
                                            </Typography>
                                            {!loadingCreated ?
                                            <>
                                            <CustomizedSwitch
                                                label='Correo electrónico'
                                                strong={false}
                                                checked={tipsBudgetEmail}
                                                onGetChange={async (e)=>{
                                                    if (currentUser.email !== null){
                                                        const infoUser = doc(database, "users", currentUser.uid);
                                                        try{                                  
                                                            await updateDoc(infoUser, {
                                                                'notifications.preferences.tips_news.tips_budget.email': e,
                                                            })
                                                            .then(()=>{
                                                                if (isMounted){
                                                                    setTipsBudgetEmail(e);                                            
                                                                }
                                                            })
                                                            .catch(()=>{
                                                                if (isMounted){
                                                                    setMsg('Ha ocurrido un error al intentar actualizar tu información');
                                                                    setSeverityInfo('error');
                                                                    setOpenMsg(true); 
                                                                }                                       
                                                            });
                                                        }catch{
                                                            if (isMounted){
                                                                setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                                                                setSeverityInfo('error');
                                                                setOpenMsg(true);
                                                            }                                        
                                                        } 
                                                    }else{
                                                        if (isMounted){
                                                            setMsg('No es posible actualizar la información porque no tenés un correo asociado a tu cuenta');
                                                            setSeverityInfo('error');
                                                            setOpenMsg(true);
                                                        }                                        
                                                    }
                                                }}                                            />    
                                            <CustomizedSwitch
                                                label='Mensaje de texto'
                                                strong={false}
                                                checked={tipsBudgetText}
                                                onGetChange={async (e)=>{
                                                    if (currentUser.phoneNumber !== null){
                                                        const infoUser = doc(database, "users", currentUser.uid);
                                                        try{                                  
                                                            await updateDoc(infoUser, {
                                                                'notifications.preferences.tips_news.tips_budget.textMessage': e,
                                                            })
                                                            .then(()=>{
                                                                if (isMounted){
                                                                    setTipsBudgetText(e);                                            
                                                                }
                                                            })
                                                            .catch(()=>{
                                                                if (isMounted){
                                                                    setMsg('Ha ocurrido un error al intentar actualizar tu información');
                                                                    setSeverityInfo('error');
                                                                    setOpenMsg(true);
                                                                }                                        
                                                            });
                                                        }catch{
                                                            if (isMounted){
                                                                setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                                                                setSeverityInfo('error');
                                                                setOpenMsg(true);
                                                            }                                        
                                                        } 
                                                    }else{
                                                        if (isMounted){
                                                            setMsg('No es posible actualizar la información porque no tenés un número telefónico asociado a tu cuenta');
                                                            setSeverityInfo('error');
                                                            setOpenMsg(true);
                                                        }                                        
                                                    }
                                                }}
                                            />    
                                            <CustomizedSwitch
                                                label='Notificaciones en el navegador'
                                                strong={false}
                                                checked={tipsBudgetBrowser}
                                                onGetChange={async (e)=>{
                                                    const infoUser = doc(database, "users", currentUser.uid);
                                                    try{                                  
                                                        await updateDoc(infoUser, {
                                                            'notifications.preferences.tips_news.tips_budget.browser': e,
                                                        })
                                                        .then(()=>{
                                                            if (isMounted){
                                                                setTipsBudgetBrowser(e);                                            
                                                            }
                                                        })
                                                        .catch(()=>{
                                                            if (isMounted){
                                                                setMsg('Ha ocurrido un error al intentar actualizar tu información');
                                                                setSeverityInfo('error');
                                                                setOpenMsg(true);
                                                            }                                        
                                                        });
                                                    }catch{
                                                        if (isMounted){
                                                            setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                                                            setSeverityInfo('error');
                                                            setOpenMsg(true);
                                                        }                                        
                                                    } 
                                                }}
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
                                            </AccordionDetails>
                                            </Accordion>
                                        <Divider width='100%'/>                                        
                                        <Typography
                                                fontSize={{
                                                    lg: 25,
                                                    md: 25,
                                                    sm: 20,
                                                    xs: 20,
                                                }}                                                                                
                                                sx={{
                                                    marginTop: '10px',
                                                }}
                                            >
                                                <strong>Novedades de byOO</strong>
                                            </Typography>
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
                                                Mantenete al tanto de las últimas novedades de byOO.
                                            </Typography>
                                            <Accordion
                                                sx={{
                                                    marginTop: '20px',
                                                    marginBottom: '20px',
                                                }}                                    
                                            >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel-name"
                                                id="panel-name"
                                            >
                                            <ListItemIcon>
                                                <NewspaperIcon fontSize="medium" />
                                            </ListItemIcon>
                                            <Typography><strong>Novedades</strong></Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                            <Divider/>
                                            <Typography 
                                                fontSize={{
                                                    lg: 19,
                                                    md: 19,
                                                    sm: 15,
                                                    xs: 15,
                                                }}                                                                                
                                                display="block"
                                                gutterBottom
                                                style={{
                                                    width: '100%',
                                                    marginTop: 10,
                                                }}
                                            >
                                                <strong>Novedades</strong>
                                            </Typography>
                                            {!loadingCreated ?
                                            <>
                                            <CustomizedSwitch
                                                label='Correo electrónico'
                                                strong={false}
                                                checked={tipsNewsEmail}
                                                onGetChange={async (e)=>{
                                                    if (currentUser.email !== null){
                                                        const infoUser = doc(database, "users", currentUser.uid);
                                                        try{                                  
                                                            await updateDoc(infoUser, {
                                                                'notifications.preferences.tips_news.news.email': e,
                                                            })
                                                            .then(()=>{
                                                                if (isMounted){
                                                                    setTipsNewsEmail(e);                                            
                                                                }
                                                            })
                                                            .catch(()=>{
                                                                if (isMounted){
                                                                    setMsg('Ha ocurrido un error al intentar actualizar tu información');
                                                                    setSeverityInfo('error');
                                                                    setOpenMsg(true); 
                                                                }                                       
                                                            });
                                                        }catch{
                                                            if (isMounted){
                                                                setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                                                                setSeverityInfo('error');
                                                                setOpenMsg(true);
                                                            }                                        
                                                        } 
                                                    }else{
                                                        if (isMounted){
                                                            setMsg('No es posible actualizar la información porque no tenés un correo asociado a tu cuenta');
                                                            setSeverityInfo('error');
                                                            setOpenMsg(true);
                                                        }                                        
                                                    }
                                                }}           
                                            />
                                            <CustomizedSwitch
                                                label='Mensaje de texto'
                                                strong={false}
                                                checked={tipsNewsText}
                                                onGetChange={async (e)=>{
                                                    if (currentUser.phoneNumber !== null){
                                                        const infoUser = doc(database, "users", currentUser.uid);
                                                        try{                                  
                                                            await updateDoc(infoUser, {
                                                                'notifications.preferences.tips_news.news.textMessage': e,
                                                            })
                                                            .then(()=>{
                                                                if (isMounted){
                                                                    setTipsNewsText(e);                                            
                                                                }
                                                            })
                                                            .catch(()=>{
                                                                if (isMounted){
                                                                    setMsg('Ha ocurrido un error al intentar actualizar tu información');
                                                                    setSeverityInfo('error');
                                                                    setOpenMsg(true);
                                                                }                                        
                                                            });
                                                        }catch{
                                                            if (isMounted){
                                                                setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                                                                setSeverityInfo('error');
                                                                setOpenMsg(true);
                                                            }                                        
                                                        } 
                                                    }else{
                                                        if (isMounted){
                                                            setMsg('No es posible actualizar la información porque no tenés un número telefónico asociado a tu cuenta');
                                                            setSeverityInfo('error');
                                                            setOpenMsg(true);
                                                        }                                        
                                                    }
                                                }}
                                            />    
                                            <CustomizedSwitch
                                                label='Notificaciones en el navegador'
                                                strong={false}
                                                checked={tipsNewsBrowser}
                                                onGetChange={async (e)=>{
                                                    const infoUser = doc(database, "users", currentUser.uid);
                                                    try{                                  
                                                        await updateDoc(infoUser, {
                                                            'notifications.preferences.tips_news.news.browser': e,
                                                        })
                                                        .then(()=>{
                                                            if (isMounted){
                                                                setTipsNewsBrowser(e);                                            
                                                            }
                                                        })
                                                        .catch(()=>{
                                                            if (isMounted){
                                                                setMsg('Ha ocurrido un error al intentar actualizar tu información');
                                                                setSeverityInfo('error');
                                                                setOpenMsg(true);
                                                            }                                        
                                                        });
                                                    }catch{
                                                        if (isMounted){
                                                            setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                                                            setSeverityInfo('error');
                                                            setOpenMsg(true);
                                                        }                                        
                                                    } 
                                                }}
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
                                            </AccordionDetails>
                                            </Accordion>
                                            <Accordion
                                                sx={{
                                                    marginTop: '20px',
                                                    marginBottom: '20px',
                                                }}                                    
                                            >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel-name"
                                                id="panel-name"
                                            >
                                            <ListItemIcon>
                                                <CommentIcon fontSize="medium" />
                                            </ListItemIcon>
                                            <Typography><strong>Comentarios</strong></Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                            <Divider/>
                                            <Typography 
                                                fontSize={{
                                                    lg: 19,
                                                    md: 19,
                                                    sm: 15,
                                                    xs: 15,
                                                }}                                                                                
                                                display="block"
                                                gutterBottom
                                                style={{
                                                    width: '100%',
                                                    marginTop: 10,
                                                }}
                                            >
                                                <strong>Comentarios</strong>
                                            </Typography>
                                            {!loadingCreated ?
                                            <>
                                            <CustomizedSwitch
                                                label='Correo electrónico'
                                                strong={false}
                                                checked={tipsCommentsEmail}
                                                onGetChange={async (e)=>{
                                                    if (currentUser.email !== null){
                                                        const infoUser = doc(database, "users", currentUser.uid);
                                                        try{                                  
                                                            await updateDoc(infoUser, {
                                                                'notifications.preferences.tips_news.comments.email': e,
                                                            })
                                                            .then(()=>{
                                                                if (isMounted){
                                                                    setTipsCommentsEmail(e);                                            
                                                                }
                                                            })
                                                            .catch(()=>{
                                                                if (isMounted){
                                                                    setMsg('Ha ocurrido un error al intentar actualizar tu información');
                                                                    setSeverityInfo('error');
                                                                    setOpenMsg(true); 
                                                                }                                       
                                                            });
                                                        }catch{
                                                            if (isMounted){
                                                                setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                                                                setSeverityInfo('error');
                                                                setOpenMsg(true);
                                                            }                                        
                                                        } 
                                                    }else{
                                                        if (isMounted){
                                                            setMsg('No es posible actualizar la información porque no tenés un correo asociado a tu cuenta');
                                                            setSeverityInfo('error');
                                                            setOpenMsg(true);
                                                        }                                        
                                                    }
                                                }}           
                                            />    
                                            <CustomizedSwitch
                                                label='Mensaje de texto'
                                                strong={false}
                                                checked={tipsCommentsText}
                                                onGetChange={async (e)=>{
                                                    if (currentUser.phoneNumber !== null){
                                                        const infoUser = doc(database, "users", currentUser.uid);
                                                        try{                                  
                                                            await updateDoc(infoUser, {
                                                                'notifications.preferences.tips_news.comments.textMessage': e,
                                                            })
                                                            .then(()=>{
                                                                if (isMounted){
                                                                    setTipsCommentsText(e);                                            
                                                                }
                                                            })
                                                            .catch(()=>{
                                                                if (isMounted){
                                                                    setMsg('Ha ocurrido un error al intentar actualizar tu información');
                                                                    setSeverityInfo('error');
                                                                    setOpenMsg(true);
                                                                }                                        
                                                            });
                                                        }catch{
                                                            if (isMounted){
                                                                setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                                                                setSeverityInfo('error');
                                                                setOpenMsg(true);
                                                            }                                        
                                                        } 
                                                    }else{
                                                        if (isMounted){
                                                            setMsg('No es posible actualizar la información porque no tenés un número telefónico asociado a tu cuenta');
                                                            setSeverityInfo('error');
                                                            setOpenMsg(true);
                                                        }                                        
                                                    }
                                                }}
                                            />    
                                            <CustomizedSwitch
                                                label='Notificaciones en el navegador'
                                                strong={false}
                                                checked={tipsCommentsBrowser}
                                                onGetChange={async (e)=>{
                                                    const infoUser = doc(database, "users", currentUser.uid);
                                                    try{                                  
                                                        await updateDoc(infoUser, {
                                                            'notifications.preferences.tips_news.comments.browser': e,
                                                        })
                                                        .then(()=>{
                                                            if (isMounted){
                                                                setTipsCommentsBrowser(e);                                            
                                                            }
                                                        })
                                                        .catch(()=>{
                                                            if (isMounted){
                                                                setMsg('Ha ocurrido un error al intentar actualizar tu información');
                                                                setSeverityInfo('error');
                                                                setOpenMsg(true);
                                                            }                                        
                                                        });
                                                    }catch{
                                                        if (isMounted){
                                                            setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                                                            setSeverityInfo('error');
                                                            setOpenMsg(true);
                                                        }                                        
                                                    } 
                                                }}
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
                                            </AccordionDetails>
                                            </Accordion>
                                            <Accordion
                                                sx={{
                                                    marginTop: '20px',
                                                    marginBottom: '20px',
                                                }}                                    
                                            >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel-name"
                                                id="panel-name"
                                            >
                                            <ListItemIcon>
                                                <GavelIcon fontSize="medium" />
                                            </ListItemIcon>
                                            <Typography><strong>Normativa sobre servicios</strong></Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                            <Divider/>
                                            <Typography 
                                                fontSize={{
                                                    lg: 19,
                                                    md: 19,
                                                    sm: 15,
                                                    xs: 15,
                                                }}                                                                                
                                                display="block"
                                                gutterBottom
                                                style={{
                                                    width: '100%',
                                                    marginTop: 10,
                                                }}
                                            >
                                                <strong>Normativas sobre servicios</strong>
                                            </Typography>
                                            {!loadingCreated ?
                                            <>
                                            <CustomizedSwitch
                                                label='Correo electrónico'
                                                strong={false}
                                                checked={tipsNormativeEmail}
                                                onGetChange={async (e)=>{
                                                    if (currentUser.email !== null){
                                                        const infoUser = doc(database, "users", currentUser.uid);
                                                        try{                                  
                                                            await updateDoc(infoUser, {
                                                                'notifications.preferences.tips_news.normative.email': e,
                                                            })
                                                            .then(()=>{
                                                                if (isMounted){
                                                                    setTipsNormativeEmail(e);                                            
                                                                }
                                                            })
                                                            .catch(()=>{
                                                                if (isMounted){
                                                                    setMsg('Ha ocurrido un error al intentar actualizar tu información');
                                                                    setSeverityInfo('error');
                                                                    setOpenMsg(true); 
                                                                }                                       
                                                            });
                                                        }catch{
                                                            if (isMounted){
                                                                setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                                                                setSeverityInfo('error');
                                                                setOpenMsg(true);
                                                            }                                        
                                                        } 
                                                    }else{
                                                        if (isMounted){
                                                            setMsg('No es posible actualizar la información porque no tenés un correo asociado a tu cuenta');
                                                            setSeverityInfo('error');
                                                            setOpenMsg(true);
                                                        }                                        
                                                    }
                                                }}          
                                            />    
                                            <CustomizedSwitch
                                                label='Mensaje de texto'
                                                strong={false}
                                                checked={tipsNormativeText}
                                                onGetChange={async (e)=>{
                                                    if (currentUser.phoneNumber !== null){
                                                        const infoUser = doc(database, "users", currentUser.uid);
                                                        try{                                  
                                                            await updateDoc(infoUser, {
                                                                'notifications.preferences.tips_news.normative.textMessage': e,
                                                            })
                                                            .then(()=>{
                                                                if (isMounted){
                                                                    setTipsNormativeText(e);                                            
                                                                }
                                                            })
                                                            .catch(()=>{
                                                                if (isMounted){
                                                                    setMsg('Ha ocurrido un error al intentar actualizar tu información');
                                                                    setSeverityInfo('error');
                                                                    setOpenMsg(true);
                                                                }                                        
                                                            });
                                                        }catch{
                                                            if (isMounted){
                                                                setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                                                                setSeverityInfo('error');
                                                                setOpenMsg(true);
                                                            }                                        
                                                        } 
                                                    }else{
                                                        if (isMounted){
                                                            setMsg('No es posible actualizar la información porque no tenés un número telefónico asociado a tu cuenta');
                                                            setSeverityInfo('error');
                                                            setOpenMsg(true);
                                                        }                                        
                                                    }
                                                }}
                                            />    
                                            <CustomizedSwitch
                                                label='Notificaciones en el navegador'
                                                strong={false}
                                                checked={tipsNormativeBrowser}
                                                onGetChange={async (e)=>{
                                                    const infoUser = doc(database, "users", currentUser.uid);
                                                    try{                                  
                                                        await updateDoc(infoUser, {
                                                            'notifications.preferences.tips_news.normative.browser': e,
                                                        })
                                                        .then(()=>{
                                                            if (isMounted){
                                                                setTipsNormativeBrowser(e);                                            
                                                            }
                                                        })
                                                        .catch(()=>{
                                                            if (isMounted){
                                                                setMsg('Ha ocurrido un error al intentar actualizar tu información');
                                                                setSeverityInfo('error');
                                                                setOpenMsg(true);
                                                            }                                        
                                                        });
                                                    }catch{
                                                        if (isMounted){
                                                            setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                                                            setSeverityInfo('error');
                                                            setOpenMsg(true);
                                                        }                                        
                                                    } 
                                                }}
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
                                            </AccordionDetails>
                                            </Accordion>
                                        <Divider width='100%'/>   
                                        </TabPanel>
                                        <TabPanel value='account'>
                                        <Typography
                                                fontSize={{
                                                    lg: 25,
                                                    md: 25,
                                                    sm: 20,
                                                    xs: 20,
                                                }}                                                                                
                                                sx={{
                                                    marginTop: '0px',
                                                }}
                                            >
                                                <strong>Actividad de la cuenta y políticas</strong>
                                            </Typography>
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
                                                Confirmá los servicios, consultá la actividad de tu cuenta y descubrí las políticas más importantes de byOO.
                                            </Typography>
                                            <Accordion
                                                sx={{
                                                    marginTop: '20px',
                                                    marginBottom: '20px',
                                                }}                                    
                                            >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel-name"
                                                id="panel-name"
                                            >
                                            <ListItemIcon>
                                                <LocalActivityIcon fontSize="medium" />
                                            </ListItemIcon>
                                            <Typography><strong>Actividad de la cuenta</strong></Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                            <Divider/>
                                            <Typography 
                                                fontSize={{
                                                    lg: 19,
                                                    md: 19,
                                                    sm: 15,
                                                    xs: 15,
                                                }}                                                                                
                                                display="block"
                                                gutterBottom
                                                style={{
                                                    width: '100%',
                                                    marginTop: 10,
                                                }}
                                            >
                                                <strong>Actividad de la cuenta</strong>
                                            </Typography>
                                            {!loadingCreated ?
                                            <>
                                            <CustomizedSwitch
                                                label='Correo electrónico'
                                                strong={false}
                                                checked={accountActivityEmail}
                                                onGetChange={async (e)=>{
                                                    if (currentUser.email !== null){
                                                        const infoUser = doc(database, "users", currentUser.uid);
                                                        try{                                  
                                                            await updateDoc(infoUser, {
                                                                'notifications.preferences.account.activity.email': e,
                                                            })
                                                            .then(()=>{
                                                                if (isMounted){
                                                                    setAccountActivityEmail(e);                                            
                                                                }
                                                            })
                                                            .catch(()=>{
                                                                if (isMounted){
                                                                    setMsg('Ha ocurrido un error al intentar actualizar tu información');
                                                                    setSeverityInfo('error');
                                                                    setOpenMsg(true); 
                                                                }                                       
                                                            });
                                                        }catch{
                                                            if (isMounted){
                                                                setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                                                                setSeverityInfo('error');
                                                                setOpenMsg(true);
                                                            }                                        
                                                        } 
                                                    }else{
                                                        if (isMounted){
                                                            setMsg('No es posible actualizar la información porque no tenés un correo asociado a tu cuenta');
                                                            setSeverityInfo('error');
                                                            setOpenMsg(true);
                                                        }                                        
                                                    }
                                                }}          
                                            />    
                                            <CustomizedSwitch
                                                label='Mensaje de texto'
                                                strong={false}
                                                checked={accountActivityText}
                                                onGetChange={async (e)=>{
                                                    if (currentUser.phoneNumber !== null){
                                                        const infoUser = doc(database, "users", currentUser.uid);
                                                        try{                                  
                                                            await updateDoc(infoUser, {
                                                                'notifications.preferences.account.activity.textMessage': e,
                                                            })
                                                            .then(()=>{
                                                                if (isMounted){
                                                                    setAccountActivityText(e);                                            
                                                                }
                                                            })
                                                            .catch(()=>{
                                                                if (isMounted){
                                                                    setMsg('Ha ocurrido un error al intentar actualizar tu información');
                                                                    setSeverityInfo('error');
                                                                    setOpenMsg(true);
                                                                }                                        
                                                            });
                                                        }catch{
                                                            if (isMounted){
                                                                setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                                                                setSeverityInfo('error');
                                                                setOpenMsg(true);
                                                            }                                        
                                                        } 
                                                    }else{
                                                        if (isMounted){
                                                            setMsg('No es posible actualizar la información porque no tenés un número telefónico asociado a tu cuenta');
                                                            setSeverityInfo('error');
                                                            setOpenMsg(true);
                                                        }                                        
                                                    }
                                                }}
                                            />    
                                            <CustomizedSwitch
                                                label='Notificaciones en el navegador'
                                                strong={false}
                                                checked={accountActivityBrowser}
                                                onGetChange={async (e)=>{
                                                    const infoUser = doc(database, "users", currentUser.uid);
                                                    try{                                  
                                                        await updateDoc(infoUser, {
                                                            'notifications.preferences.account.activity.browser': e,
                                                        })
                                                        .then(()=>{
                                                            if (isMounted){
                                                                setAccountActivityBrowser(e);                                            
                                                            }
                                                        })
                                                        .catch(()=>{
                                                            if (isMounted){
                                                                setMsg('Ha ocurrido un error al intentar actualizar tu información');
                                                                setSeverityInfo('error');
                                                                setOpenMsg(true);
                                                            }                                        
                                                        });
                                                    }catch{
                                                        if (isMounted){
                                                            setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                                                            setSeverityInfo('error');
                                                            setOpenMsg(true);
                                                        }                                        
                                                    } 
                                                }}
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
                                            </AccordionDetails>
                                            </Accordion>
                                            <Accordion
                                                sx={{
                                                    marginTop: '20px',
                                                    marginBottom: '20px',
                                                }}                                    
                                            >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel-name"
                                                id="panel-name"
                                            >
                                            <ListItemIcon>
                                                <PolicyIcon fontSize="medium" />
                                            </ListItemIcon>
                                            <Typography><strong>Políticas sobre los clientes y profesionales</strong></Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                            <Divider/>
                                            <Typography 
                                                fontSize={{
                                                    lg: 19,
                                                    md: 19,
                                                    sm: 15,
                                                    xs: 15,
                                                }}                                                                                
                                                display="block"
                                                gutterBottom
                                                style={{
                                                    width: '100%',
                                                    marginTop: 10,
                                                }}
                                            >
                                                <strong>Políticas sobre los clientes y profesionales</strong>
                                            </Typography>
                                            {!loadingCreated ?
                                            <>
                                            <CustomizedSwitch
                                                label='Correo electrónico'
                                                strong={false}
                                                checked={accountPolicyEmail}
                                                onGetChange={async (e)=>{
                                                    if (currentUser.email !== null){
                                                        const infoUser = doc(database, "users", currentUser.uid);
                                                        try{                                  
                                                            await updateDoc(infoUser, {
                                                                'notifications.preferences.account.policy.email': e,
                                                            })
                                                            .then(()=>{
                                                                if (isMounted){
                                                                    setAccountPolicyEmail(e);                                            
                                                                }
                                                            })
                                                            .catch(()=>{
                                                                if (isMounted){
                                                                    setMsg('Ha ocurrido un error al intentar actualizar tu información');
                                                                    setSeverityInfo('error');
                                                                    setOpenMsg(true); 
                                                                }                                       
                                                            });
                                                        }catch{
                                                            if (isMounted){
                                                                setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                                                                setSeverityInfo('error');
                                                                setOpenMsg(true);
                                                            }                                        
                                                        } 
                                                    }else{
                                                        if (isMounted){
                                                            setMsg('No es posible actualizar la información porque no tenés un correo asociado a tu cuenta');
                                                            setSeverityInfo('error');
                                                            setOpenMsg(true);
                                                        }                                        
                                                    }
                                                }}          
                                            />    
                                            <CustomizedSwitch
                                                label='Mensaje de texto'
                                                strong={false}
                                                checked={accountPolicyText}
                                                onGetChange={async (e)=>{
                                                    if (currentUser.phoneNumber !== null){
                                                        const infoUser = doc(database, "users", currentUser.uid);
                                                        try{                                  
                                                            await updateDoc(infoUser, {
                                                                'notifications.preferences.account.policy.textMessage': e,
                                                            })
                                                            .then(()=>{
                                                                if (isMounted){
                                                                    setAccountPolicyText(e);                                            
                                                                }
                                                            })
                                                            .catch(()=>{
                                                                if (isMounted){
                                                                    setMsg('Ha ocurrido un error al intentar actualizar tu información');
                                                                    setSeverityInfo('error');
                                                                    setOpenMsg(true);
                                                                }                                        
                                                            });
                                                        }catch{
                                                            if (isMounted){
                                                                setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                                                                setSeverityInfo('error');
                                                                setOpenMsg(true);
                                                            }                                        
                                                        } 
                                                    }else{
                                                        if (isMounted){
                                                            setMsg('No es posible actualizar la información porque no tenés un número telefónico asociado a tu cuenta');
                                                            setSeverityInfo('error');
                                                            setOpenMsg(true);
                                                        }                                        
                                                    }
                                                }}
                                            />    
                                            <CustomizedSwitch
                                                label='Notificaciones en el navegador'
                                                strong={false}
                                                checked={accountPolicyBrowser}
                                                onGetChange={async (e)=>{
                                                    const infoUser = doc(database, "users", currentUser.uid);
                                                    try{                                  
                                                        await updateDoc(infoUser, {
                                                            'notifications.preferences.account.policy.browser': e,
                                                        })
                                                        .then(()=>{
                                                            if (isMounted){
                                                                setAccountPolicyBrowser(e);                                            
                                                            }
                                                        })
                                                        .catch(()=>{
                                                            if (isMounted){
                                                                setMsg('Ha ocurrido un error al intentar actualizar tu información');
                                                                setSeverityInfo('error');
                                                                setOpenMsg(true);
                                                            }                                        
                                                        });
                                                    }catch{
                                                        if (isMounted){
                                                            setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                                                            setSeverityInfo('error');
                                                            setOpenMsg(true);
                                                        }                                        
                                                    } 
                                                }}
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
                                            </AccordionDetails>
                                            </Accordion>
                                        <Divider width='100%'/>                                        
                                        <Typography
                                                fontSize={{
                                                    lg: 25,
                                                    md: 25,
                                                    sm: 20,
                                                    xs: 20,
                                                }}                                                                                
                                                sx={{
                                                    marginTop: '10px',
                                                }}
                                            >
                                                <strong>Recordatorios</strong>
                                            </Typography>
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
                                                Recibí recordatorios importantes sobre tus servicios, tus anuncios y la actividad de tu cuenta.
                                            </Typography>
                                            <Accordion
                                                sx={{
                                                    marginTop: '20px',
                                                    marginBottom: '20px',
                                                }}                                    
                                            >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel-name"
                                                id="panel-name"
                                            >
                                            <ListItemIcon>
                                                <PendingActionsIcon fontSize="medium" />
                                            </ListItemIcon>
                                            <Typography><strong>Recordatorios</strong></Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                            <Divider/>
                                            <Typography 
                                                fontSize={{
                                                    lg: 19,
                                                    md: 19,
                                                    sm: 15,
                                                    xs: 15,
                                                }}                                                                                
                                                display="block"
                                                gutterBottom
                                                style={{
                                                    width: '100%',
                                                    marginTop: 10,
                                                }}
                                            >
                                                <strong>Recordatorios</strong>
                                            </Typography>
                                            {!loadingCreated ?
                                            <>
                                            <CustomizedSwitch
                                                label='Correo electrónico'
                                                strong={false}
                                                checked={accountReminderEmail}
                                                onGetChange={async (e)=>{
                                                    if (currentUser.email !== null){
                                                        const infoUser = doc(database, "users", currentUser.uid);
                                                        try{                                  
                                                            await updateDoc(infoUser, {
                                                                'notifications.preferences.account.reminder.email': e,
                                                            })
                                                            .then(()=>{
                                                                if (isMounted){
                                                                    setAccountReminderEmail(e);                                            
                                                                }
                                                            })
                                                            .catch(()=>{
                                                                if (isMounted){
                                                                    setMsg('Ha ocurrido un error al intentar actualizar tu información');
                                                                    setSeverityInfo('error');
                                                                    setOpenMsg(true); 
                                                                }                                       
                                                            });
                                                        }catch{
                                                            if (isMounted){
                                                                setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                                                                setSeverityInfo('error');
                                                                setOpenMsg(true);
                                                            }                                        
                                                        } 
                                                    }else{
                                                        if (isMounted){
                                                            setMsg('No es posible actualizar la información porque no tenés un correo asociado a tu cuenta');
                                                            setSeverityInfo('error');
                                                            setOpenMsg(true);
                                                        }                                        
                                                    }
                                                }}          
                                            />    
                                            <CustomizedSwitch
                                                label='Mensaje de texto'
                                                strong={false}
                                                checked={accountReminderText}
                                                onGetChange={async (e)=>{
                                                    if (currentUser.phoneNumber !== null){
                                                        const infoUser = doc(database, "users", currentUser.uid);
                                                        try{                                  
                                                            await updateDoc(infoUser, {
                                                                'notifications.preferences.account.reminder.textMessage': e,
                                                            })
                                                            .then(()=>{
                                                                if (isMounted){
                                                                    setAccountReminderText(e);                                            
                                                                }
                                                            })
                                                            .catch(()=>{
                                                                if (isMounted){
                                                                    setMsg('Ha ocurrido un error al intentar actualizar tu información');
                                                                    setSeverityInfo('error');
                                                                    setOpenMsg(true);
                                                                }                                        
                                                            });
                                                        }catch{
                                                            if (isMounted){
                                                                setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                                                                setSeverityInfo('error');
                                                                setOpenMsg(true);
                                                            }                                        
                                                        } 
                                                    }else{
                                                        if (isMounted){
                                                            setMsg('No es posible actualizar la información porque no tenés un número telefónico asociado a tu cuenta');
                                                            setSeverityInfo('error');
                                                            setOpenMsg(true);
                                                        }                                        
                                                    }
                                                }}
                                            />    
                                            <CustomizedSwitch
                                                label='Notificaciones en el navegador'
                                                strong={false}
                                                checked={accountReminderBrowser}
                                                onGetChange={async (e)=>{
                                                    const infoUser = doc(database, "users", currentUser.uid);
                                                    try{                                  
                                                        await updateDoc(infoUser, {
                                                            'notifications.preferences.account.reminder.browser': e,
                                                        })
                                                        .then(()=>{
                                                            if (isMounted){
                                                                setAccountReminderBrowser(e);                                            
                                                            }
                                                        })
                                                        .catch(()=>{
                                                            if (isMounted){
                                                                setMsg('Ha ocurrido un error al intentar actualizar tu información');
                                                                setSeverityInfo('error');
                                                                setOpenMsg(true);
                                                            }                                        
                                                        });
                                                    }catch{
                                                        if (isMounted){
                                                            setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                                                            setSeverityInfo('error');
                                                            setOpenMsg(true);
                                                        }                                        
                                                    } 
                                                }}
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
                                            </AccordionDetails>
                                            </Accordion>
                                        <Divider width='100%'/>   
                                        <Typography
                                                fontSize={{
                                                    lg: 25,
                                                    md: 25,
                                                    sm: 20,
                                                    xs: 20,
                                                }}                                                                                
                                                sx={{
                                                    marginTop: '10px',
                                                }}
                                            >
                                                <strong>Mensajes de los clientes y profesionales</strong>
                                            </Typography>
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
                                                Mantenete en contacto con los profesionales o los clientes en todo momento.
                                            </Typography>
                                            <Accordion
                                                sx={{
                                                    marginTop: '20px',
                                                    marginBottom: '20px',
                                                }}                                    
                                            >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel-name"
                                                id="panel-name"
                                            >
                                            <ListItemIcon>
                                                <ChatIcon fontSize="medium" />
                                            </ListItemIcon>
                                            <Typography><strong>Mensajes</strong></Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                            <Divider/>
                                            <Typography 
                                                fontSize={{
                                                    lg: 19,
                                                    md: 19,
                                                    sm: 15,
                                                    xs: 15,
                                                }}                                                                                
                                                display="block"
                                                gutterBottom
                                                style={{
                                                    width: '100%',
                                                    marginTop: 10,
                                                }}
                                            >
                                                <strong>Mensajes</strong>
                                            </Typography>
                                            {!loadingCreated ?
                                            <>
                                            <CustomizedSwitch
                                                label='Correo electrónico'
                                                strong={false}
                                                checked={accountMessagesEmail}
                                                onGetChange={async (e)=>{
                                                    if (currentUser.email !== null){
                                                        const infoUser = doc(database, "users", currentUser.uid);
                                                        try{                                  
                                                            await updateDoc(infoUser, {
                                                                'notifications.preferences.account.messages.email': e,
                                                            })
                                                            .then(()=>{
                                                                if (isMounted){
                                                                    setAccountMessagesEmail(e);                                            
                                                                }
                                                            })
                                                            .catch(()=>{
                                                                if (isMounted){
                                                                    setMsg('Ha ocurrido un error al intentar actualizar tu información');
                                                                    setSeverityInfo('error');
                                                                    setOpenMsg(true); 
                                                                }                                       
                                                            });
                                                        }catch{
                                                            if (isMounted){
                                                                setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                                                                setSeverityInfo('error');
                                                                setOpenMsg(true);
                                                            }                                        
                                                        } 
                                                    }else{
                                                        if (isMounted){
                                                            setMsg('No es posible actualizar la información porque no tenés un correo asociado a tu cuenta');
                                                            setSeverityInfo('error');
                                                            setOpenMsg(true);
                                                        }                                        
                                                    }
                                                }}          
                                            />    
                                            <CustomizedSwitch
                                                label='Mensaje de texto'
                                                strong={false}
                                                checked={accountMessagesText}
                                                onGetChange={async (e)=>{
                                                    if (currentUser.phoneNumber !== null){
                                                        const infoUser = doc(database, "users", currentUser.uid);
                                                        try{                                  
                                                            await updateDoc(infoUser, {
                                                                'notifications.preferences.account.messages.textMessage': e,
                                                            })
                                                            .then(()=>{
                                                                if (isMounted){
                                                                    setAccountMessagesText(e);                                            
                                                                }
                                                            })
                                                            .catch(()=>{
                                                                if (isMounted){
                                                                    setMsg('Ha ocurrido un error al intentar actualizar tu información');
                                                                    setSeverityInfo('error');
                                                                    setOpenMsg(true);
                                                                }                                        
                                                            });
                                                        }catch{
                                                            if (isMounted){
                                                                setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                                                                setSeverityInfo('error');
                                                                setOpenMsg(true);
                                                            }                                        
                                                        } 
                                                    }else{
                                                        if (isMounted){
                                                            setMsg('No es posible actualizar la información porque no tenés un número telefónico asociado a tu cuenta');
                                                            setSeverityInfo('error');
                                                            setOpenMsg(true);
                                                        }                                        
                                                    }
                                                }}
                                            />    
                                            <CustomizedSwitch
                                                label='Notificaciones en el navegador'
                                                strong={false}
                                                checked={accountMessagesBrowser}
                                                onGetChange={async (e)=>{
                                                    const infoUser = doc(database, "users", currentUser.uid);
                                                    try{                                  
                                                        await updateDoc(infoUser, {
                                                            'notifications.preferences.account.messages.browser': e,
                                                        })
                                                        .then(()=>{
                                                            if (isMounted){
                                                                setAccountMessagesBrowser(e);                                            
                                                            }
                                                        })
                                                        .catch(()=>{
                                                            if (isMounted){
                                                                setMsg('Ha ocurrido un error al intentar actualizar tu información');
                                                                setSeverityInfo('error');
                                                                setOpenMsg(true);
                                                            }                                        
                                                        });
                                                    }catch{
                                                        if (isMounted){
                                                            setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                                                            setSeverityInfo('error');
                                                            setOpenMsg(true);
                                                        }                                        
                                                    } 
                                                }}
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
                                            </AccordionDetails>
                                            </Accordion>
                                            <Divider width='100%'/>   
                                        </TabPanel>
                                    </TabContext>
                                </Box>
                            </Container>
                            <Container maxWidth="md"
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'center',
                                    width: '100%',
                                }}                            
                            >
                                <Paper
                                    variant='string'
                                    square={true}
                                    sx={{ 
                                        p: 2, 
                                        border: '1px solid lightgray',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            margin: '30px',
                                        }}                                        
                                    >
                                        <Img src={notifications} />
                                        <Typography 
                                            fontSize={{
                                                lg: 20,
                                                md: 20,
                                                sm: 15,
                                                xs: 15,
                                            }}                                                                                
                                            sx={{marginTop: '20px'}}
                                        >
                                            <strong>¿Como preferís que nos pongamos en contacto con vos?</strong>
                                        </Typography>
                                        <Typography 
                                            fontSize={{
                                                lg: 15,
                                                md: 15,
                                                sm: 12,
                                                xs: 12,
                                            }}                                                                                
                                            sx={{marginTop: '20px'}}
                                        >
                                            En esta sección vas a poder configurar la forma en la que byOO y la comunidad van a poder ponerse en contacto con vos. Además vas a poder configurar que información deseas recibir.
                                        </Typography>
                                    </Box>
                                </Paper> 
                            </Container>
                        </Stack>
                    </Paper>
                </Box>
                <Snackbar open={openMsg} autoHideDuration={6000} onClose={handleCloseMsg} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{width: '100%'}}>
                    <Alert onClose={handleCloseMsg} severity={severityInfo}>{msg}</Alert>
                </Snackbar>            
            </Container>
        </div>
    )
}

export default Notifications