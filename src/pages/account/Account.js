import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import personalInfo from '../../images/svg/undraw_personal_info_0okl.svg';
import security from '../../images/svg/undraw_Security_on_re_e491.svg';
import notifications from '../../images/svg/undraw_selection_re_ycpo.svg';
import social from '../../images/svg/undraw_Social_bio_re_0t9u.svg';
import generalPreferences from '../../images/svg/undraw_Active_options_re_8rj3.svg';
import professionalTools from '../../images/svg/undraw_qa_engineers_dg-5-p.svg';
import profile from '../../images/svg/undraw_Profile_re_4a55.svg';
import { auth } from '../../services/firebase';
import Link from '@mui/material/Link';
import { useHistory } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import FormEliminarCuenta from './login-and-security/FormEliminarCuenta';
import { useAuth } from '../../services/firebase';
import { emitCustomEvent } from 'react-custom-events';
import { getFunctions, httpsCallable } from "firebase/functions";
import { getFirestore, 
    doc, 
    getDoc } from "firebase/firestore";
import LoadingPage from '../login/LoadingPage';

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '150px',
}); 

const functions = getFunctions();
const deleteUser = httpsCallable(functions, 'deleteUser');

const database = getFirestore();

function Account() {
    const {currentUser} = useAuth();
    const [userName, setUserName] = useState(null);
    const [openFormEliminarCuenta, setOpenFormEliminarCuenta] = useState(false);
    const [userEmail, setUserMail] = useState(null);
    const [loadingDialog, setLoadingDialog] = useState(false);

    const handleUpdateProfile = async () => {
        const infoUser = doc(database, "users", currentUser.uid);
        try{                                  
            const docSnap = await getDoc(infoUser);
            if (docSnap.exists()) {
                setUserName(docSnap.data().name.split(' ')[0]);
                setUserMail(currentUser.email);
            }
        }catch{
            console.log('');
        } 
    }

    const clearStates = () => {
        setUserMail(null);
        setUserName(null);
    }

    useEffect(() => {
        if (currentUser){
            clearStates();
            handleUpdateProfile();
        }
    }, [currentUser]);


    useEffect(() => {
        window.scrollTo(0,0);
    }, []);

    const history = useHistory ();

    const handlePerfil = () => {
        history.push('/users/show');          
    }

    const handlePersonalInfo = () => {
        history.push('/account-settings/personal-info');          
    }

    const handleSesionAndSeg = () => {
        history.push('/account-settings/login-and-security');          
    }

    const handleNotifications = () => {
        history.push('/account-settings/notifications');          
    }

    const handleSocial = () => {
        history.push('/account-settings/privacy-and-sharing');          
    }

    const handlePreferences = () => {
        history.push('/account-settings/preferences');          
    }

    const handleProfesionalTools = () => {
        history.push('/account-settings/professional-tools');          
    }

    const handleEliminarCuenta = () => {
        setOpenFormEliminarCuenta(true);
    } 

    const handleClose = () => {
        setOpenFormEliminarCuenta(false);
    }

    const handleEliminar = () => {
        setOpenFormEliminarCuenta(false);
        setLoadingDialog(true);
        deleteUser(currentUser.uid)
        .then(()=>{
            auth.signOut().then(()=> {
                setLoadingDialog(false);
                emitCustomEvent('showMsg', 'Hemos eliminado la cuenta ' + userEmail + '/info');
            }).catch((error) => {
                setLoadingDialog(false);
                emitCustomEvent('showMsg', 'Hemos eliminado la cuenta ' + userEmail + '/info');
            })    
        })
        .catch((error)=> {
            setLoadingDialog(false);
            emitCustomEvent('showMsg', 'Ocurrió un error al eliminar la cuenta ' + userEmail + '. No te preocupes, nosotros nos encargaremos de eliminarla./info');
        })
    }

    return (
        <div>
            <LoadingPage 
                open={loadingDialog}
            />
            <FormEliminarCuenta
                open={openFormEliminarCuenta}
                name={userName}
                onGetClose={handleClose}
                onGetEliminar={handleEliminar}
            />
            <Container maxWidth="md">
                <Box sx={{ flexGrow: 10 }}>
                    <Typography 
                        variant='h4'
                        sx={{
                            marginTop: '50px',
                        }}
                    >
                        <strong>Cuenta</strong>
                    </Typography>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        sx={{
                            marginTop: '10px',
                            marginBottom: '50px',
                        }}


                    >
                        <Typography 
                            variant='subtitle1'
                        >
                            <strong>{auth.currentUser.displayName}</strong>,&nbsp;
                        </Typography>
                        <Typography 
                            variant='subtitle1'
                        >
                            {auth.currentUser.email}&nbsp;{'·'}&nbsp;
                        </Typography>
                        <Typography 
                            variant='subtitle1'
                        >
                            <Link
                                component="button"
                                onClick={handlePerfil}
                                sx={{
                                    textDecoration: "underline #5472AD",
                                    color: '#5472AD !important',
                                    fontSize: '16px',
                                }} 
                            >
                                <strong>Ir al perfil</strong>
                            </Link>
                        </Typography>
                    </Stack>
                    <Grid 
                        container 
                        spacing={{ xs: 2, md: 3 }} 
                        columns={{ xs: 4, sm: 8, md: 12 }}
                        direction={{ xs: 'column', sm: 'row' }}
                    >
                        <Grid item xs={2} sm={4} md={4} key={1}>
                            <Paper 
                                onClick={handlePersonalInfo}
                                elevation={3}
                                sx={{ 
                                    p: 2, 
                                    margin: 'auto', 
                                    maxWidth: 500, 
                                    flexGrow: 1, 
                                    cursor: 'pointer', 
                                    borderRadius: '10px',
                                }}
                            >
                                <Grid container spacing={2} direction="column"
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        minHeight: 320,    
                                    }}                                                                
                                >
                                    <Grid item>
                                        <Img src={personalInfo}/>
                                    </Grid>
                                    <Grid item sm container>
                                        <Grid item container direction="column" spacing={2}>
                                            <Grid item >
                                                <Typography gutterBottom variant="h6" component="div">
                                                    <strong>Información personal</strong>
                                                </Typography>
                                                <Typography variant="body2" gutterBottom>
                                                    Proporcioná tus datos personales para que la comunidad pueda ponerse en contacto con vos.
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={2} sm={4} md={4} key={2} >
                            <Paper 
                                onClick={handleSesionAndSeg}
                                elevation={3}
                                sx={{ 
                                    p: 2, 
                                    margin: 'auto', 
                                    maxWidth: 500, 
                                    flexGrow: 1, 
                                    cursor: 'pointer', 
                                    borderRadius: '10px'
                                }}
                            >
                                <Grid container spacing={2} direction="column"
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',   
                                        minHeight: 320,                                            
                                    }}                                                                
                                >
                                    <Grid item >
                                        <Img src={security} />
                                    </Grid>
                                    <Grid item sm container >
                                        <Grid item container spacing={2}>
                                            <Grid item >
                                                <Typography gutterBottom variant="h6" component="div">
                                                    <strong>Inicio de sesión y seguridad</strong>
                                                </Typography>
                                                <Typography variant="body2" gutterBottom>
                                                    Configurá el inicio de sesión de tu cuenta.
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={2} sm={4} md={4} key={3} >
                            <Paper 
                                onClick={handleNotifications}
                                elevation={3}
                                sx={{ 
                                    p: 2, 
                                    margin: 'auto', 
                                    maxWidth: 500, 
                                    flexGrow: 1, 
                                    cursor: 'pointer', 
                                    borderRadius: '10px',
                                }}
                            >
                                <Grid container spacing={2} direction="column"
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        minHeight: 320,    
                                    }}                                
                                >
                                    <Grid item>
                                        <Img src={notifications} />
                                    </Grid>
                                    <Grid item sm container>
                                        <Grid item container direction="column" spacing={2}>
                                            <Grid item>
                                                <Typography gutterBottom variant="h6" component="div">
                                                    <strong>Notificaciones</strong>
                                                </Typography>
                                                <Typography variant="body2" gutterBottom>
                                                    Elegí las preferencias de notificación y tu forma de contacto.
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={2} sm={4} md={4} key={4} >
                            <Paper 
                                onClick={handleSocial}
                                elevation={3}
                                sx={{ 
                                    p: 2, 
                                    margin: 'auto', 
                                    maxWidth: 500, 
                                    flexGrow: 1, 
                                    cursor: 'pointer', 
                                    borderRadius: '10px'
                                }}
                            >
                                <Grid container spacing={2} direction="column"
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        minHeight: 320,    
                                    }}                                                                
                                >
                                    <Grid item>
                                        <Img src={social} />
                                    </Grid>
                                    <Grid item sm container>
                                        <Grid item container direction="column" spacing={2}>
                                            <Grid item >
                                                <Typography gutterBottom variant="h6" component="div">
                                                    <strong>Privacidad y uso compartido</strong>
                                                </Typography>
                                                <Typography variant="body2" gutterBottom>
                                                    Controlá las aplicaciones conectadas, lo que compartís y quién puede verlo.
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={2} sm={4} md={4} key={5} >
                            <Paper 
                                onClick={handlePreferences}
                                elevation={3}
                                sx={{ 
                                    p: 2, 
                                    margin: 'auto', 
                                    maxWidth: 500, 
                                    flexGrow: 1, 
                                    cursor: 'pointer', 
                                    borderRadius: '10px'
                                }}
                            >
                                <Grid container spacing={2} direction="column"
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        minHeight: 320,    
                                    }}                                                                
                                >
                                    <Grid item>
                                        <Img src={generalPreferences} />
                                    </Grid>
                                    <Grid item sm container>
                                        <Grid item container direction="column" spacing={2}>
                                            <Grid item >
                                                <Typography gutterBottom variant="h6" component="div">
                                                    <strong>Preferencias generales</strong>
                                                </Typography>
                                                <Typography variant="body2" gutterBottom>
                                                    Configurá las preferencias de tu cuenta.
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={2} sm={4} md={4} key={6} >
                            <Paper 
                                onClick={handleProfesionalTools}
                                elevation={3}
                                sx={{ 
                                    p: 2, 
                                    margin: 'auto', 
                                    maxWidth: 500, 
                                    flexGrow: 1, 
                                    cursor: 'pointer', 
                                    borderRadius: '10px'
                                }}
                            >
                                <Grid container spacing={2} direction="column"
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        minHeight: 320,    
                                    }}                                                                
                                >
                                    <Grid item>
                                        <Img src={professionalTools} />
                                    </Grid>
                                    <Grid item sm container>
                                        <Grid item container direction="column" spacing={2}>
                                            <Grid item >
                                                <Typography gutterBottom variant="h6" component="div">
                                                <strong>Herramientas para profesionales</strong>
                                                </Typography>
                                                <Typography variant="body2" gutterBottom>
                                                Conseguí herramientas para profesionales que byOO tiene a tu disposición.
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={2} sm={4} md={4} key={7} >
                            <Paper 
                                onClick={handlePerfil}
                                elevation={3}
                                sx={{ 
                                    p: 2, 
                                    margin: 'auto', 
                                    maxWidth: 500, 
                                    flexGrow: 1, 
                                    cursor: 'pointer', 
                                    borderRadius: '10px'
                                }}
                            >
                                <Grid container spacing={2} direction="column"
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        minHeight: 320,    
                                    }}                                                                
                                >
                                    <Grid item>
                                        <Img src={profile} />
                                    </Grid>
                                    <Grid item sm container>
                                        <Grid item container direction="column" spacing={2}>
                                            <Grid item >
                                                <Typography gutterBottom variant="h6" component="div">
                                                    <strong>Tu perfil</strong>
                                                </Typography>
                                                <Typography variant="body2" gutterBottom>
                                                    Configurá tu perfil para que la comunidad byOO te conozca.
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Typography 
                        variant='subtitle1'
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: '50px',
                        }}
                    >
                        ¿Necesitás desactivar tu cuenta?
                    </Typography> 
                    <Typography 
                        variant='subtitle1'
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Link
                            component="button"
                            onClick={handleEliminarCuenta}
                            sx={{
                                color: '#5472AD !important',
                                fontSize: '14px',
                                marginBottom: '50px',
                            }} 
                        >
                            <strong>Resolvelo ahora</strong>
                        </Link>
                    </Typography> 
                </Box>
            </Container>
        </div>
    )
}

export default Account