import * as React from 'react';
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

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100px',
}); 

function Account() {
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

    const handleAccountDelete = () => {
        history.push('/account-delete/reasons');          
    } 

    return (
        <div>
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
                    <Typography 
                        variant='subtitle1'
                        sx={{
                            marginTop: '10px',
                            marginBottom: '50px',
                        }}
                    >
                        <strong>{auth.currentUser.displayName}</strong>,&nbsp;{auth.currentUser.email}&nbsp;{'·'}&nbsp;
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
                                    <Grid container spacing={2}>
                                        <Grid item>
                                            <Img src={personalInfo} />
                                        </Grid>
                                        <Grid item xs={12} sm container>
                                            <Grid item xs container direction="column" spacing={2}>
                                                <Grid item xs>
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
                                    <Grid container spacing={2}>
                                        <Grid item>
                                            <Img src={security} />
                                        </Grid>
                                        <Grid item xs={12} sm container>
                                            <Grid item xs container direction="column" spacing={2}>
                                                <Grid item xs>
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
                                        borderRadius: '10px'
                                    }}
                                >
                                    <Grid container spacing={2}>
                                        <Grid item>
                                            <Img src={notifications} />
                                        </Grid>
                                        <Grid item xs={12} sm container>
                                            <Grid item xs container direction="column" spacing={2}>
                                                <Grid item xs>
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
                                    <Grid container spacing={2}>
                                        <Grid item>
                                            <Img src={social} />
                                        </Grid>
                                        <Grid item xs={12} sm container>
                                            <Grid item xs container direction="column" spacing={2}>
                                                <Grid item xs>
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
                                    <Grid container spacing={2}>
                                        <Grid item>
                                            <Img src={generalPreferences} />
                                        </Grid>
                                        <Grid item xs={12} sm container>
                                            <Grid item xs container direction="column" spacing={2}>
                                                <Grid item xs>
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
                                    <Grid container spacing={2}>
                                        <Grid item>
                                            <Img src={professionalTools} />
                                        </Grid>
                                        <Grid item xs={12} sm container>
                                            <Grid item xs container direction="column" spacing={2}>
                                                <Grid item xs>
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
                                    <Grid container spacing={2}>
                                        <Grid item>
                                            <Img src={profile} />
                                        </Grid>
                                        <Grid item xs={12} sm container>
                                            <Grid item xs container direction="column" spacing={2}>
                                                <Grid item xs>
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
                            onClick={handleAccountDelete}
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