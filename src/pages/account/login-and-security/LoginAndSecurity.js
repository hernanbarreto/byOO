import React, { useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import security from '../../../images/svg/undraw_Security_on_re_e491.svg';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import { useHistory } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {  Divider } from '@material-ui/core';
import { useAuth } from '../../../services/firebase';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ListItemIcon from '@mui/material/ListItemIcon';
import PasswordIcon from '@mui/icons-material/Password';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import GroupsIcon from '@mui/icons-material/Groups';
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();
const getUser = httpsCallable(functions, 'getUser');

function LoginAndSecurity() {
    useEffect(() => {
        window.scrollTo(0,0);
    }, []);

    const history = useHistory ();
    const mobilAccess = !useMediaQuery('(min-width:769px)', { noSsr: true });
    const {currentUser} = useAuth();

    const Img = styled('img')({
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100px',
    }); 
    
    const handleCuenta = () => {
        history.push('/account-settings');          
    }

    useEffect(() => {
        if (currentUser){
            getUser(currentUser.uid)
            .then((user)=>{
                console.log(user.data);
            });    
        }
    }, [currentUser]);

    const breadcrumbs = [
        <Link
          key={1}
          underline="none"
          onClick={handleCuenta}
          sx={{
            color: '#222222 !important',
            textDecoration: "underline #222222",
            fontSize: '14px',
            cursor: 'pointer'
        }} 
        >
            Cuenta
        </Link>,
        <Typography color="text.primary" key={2}>
            Inicio de sesión y seguridad
        </Typography>,
      ];    
    
    return (
        <div>
            <Container maxWidth="lg" >
                <Box sx={{ flexGrow: 10 }}>
                    <Paper
                        variant='string' 
                        sx={{ 
                            marginTop: '50px', 
                            marginBottom: '50px', 
                        }}
                    >
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={{ xs: 3, sm: 10, md: 15 }}
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
                                            fontSize: '14px',
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
                                            marginTop: '20px',
                                            marginBottom: '20px',
                                        }}
                                    >
                                        <strong>Inicio de sesión y seguridad</strong>
                                    </Typography>
                                    <Divider/>
                                    <Accordion
                                        sx={{
                                            marginTop: '40px',
                                            marginBottom: '20px',
                                        }}                                    
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel-password"
                                            id="panel-password"
                                        >
                                        <ListItemIcon>
                                            <PasswordIcon fontSize="medium" />
                                        </ListItemIcon>
                                        <Typography><strong>Contraseña</strong></Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                        <Typography>
                                            Datos de la contraseña
                                        </Typography>
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
                                            aria-controls="panel-phone"
                                            id="panel-phone"
                                        >
                                        <ListItemIcon>
                                            <ContactPhoneIcon fontSize="medium" />
                                        </ListItemIcon>
                                        <Typography><strong>Número de teléfono</strong></Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                        <Typography>
                                            Datos del teléfono
                                        </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion
                                        sx={{
                                            marginTop: '20px',
                                            marginBottom: '40px',
                                        }}                                    
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel-social"
                                            id="panel-social"
                                        >
                                        <ListItemIcon>
                                            <GroupsIcon fontSize="medium" />
                                        </ListItemIcon>
                                        <Typography><strong>Proveedores externos</strong></Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                        <Typography>
                                            Datos de ingreso de redes sociales
                                        </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Divider/>
                                    <Typography
                                        fontSize={{
                                            lg: 30,
                                            md: 30,
                                            sm: 25,
                                            xs: 25,
                                        }}                                                                                
                                        sx={{
                                            marginTop: '20px',
                                            marginBottom: '20px',
                                        }}
                                    >
                                        <strong>Último ingreso</strong>
                                    </Typography>
                                    <Stack
                                        direction={{ xs: 'column', sm: 'row' }}
                                        spacing={{ xs: 3, sm: 10, md: 15 }}
                                        style={{
                                            marginTop: '10px',
                                            marginBottom: '10px',
                                        }}
                                    >
                                        <ListItemIcon>
                                            <ContactPhoneIcon fontSize="large" />
                                            <Typography><strong>Número de teléfono</strong></Typography>                                    
                                        </ListItemIcon>
                                    </Stack>
                                </Box>
                            </Container>                          
                            <Container maxWidth="xs" >
                                <Paper
                                    variant='string'
                                    square={true}
                                    sx={{ 
                                        p: 2, 
                                        border: '1px solid gray',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            margin: '30px',
                                        }} 
                                    >
                                        <Img src={security} />
                                        <Typography 
                                            fontSize={{
                                                lg: 20,
                                                md: 20,
                                                sm: 15,
                                                xs: 15,
                                            }}                                                                                
                                            sx={{marginTop: '20px'}}
                                        >
                                            <strong>Vamos a hacer que tu cuenta sea más segura</strong>
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
                                            Siempre estamos trabajando para aumentar la seguridad en nuestra comunidad. Por eso, revisamos todas las cuentas para asegurarnos de que sean lo más seguras posible.
                                        </Typography>
                                    </Box>
                                </Paper> 
                            </Container>
                        </Stack>
                    </Paper> 
                </Box>
            </Container>
        </div>
    )
}

export default LoginAndSecurity
