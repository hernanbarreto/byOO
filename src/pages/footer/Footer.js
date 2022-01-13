import React from 'react';
import './Footer.css';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import logoFooter from '../header/byOO_1.svg';
import { styled } from '@mui/material/styles';

function Footer() {

    const Img = styled('img')({
        display: 'flex',
    });  

    return (
        <div className='footer'>
            <Container maxWidth='xl'>
                <Box 
                    sx={{
                        transform: 'scale(0.3)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        bgcolor: '#a7a7a7',
                        mt: '-75px',
                        mb: '-75px',
                    }}
                >
                    <Img src={logoFooter} />
                </Box>
                <p>© 2022 byOO Todos los derechos reservados</p>
                <p>Privaci · Terms · Sitemap · Company details</p>
            </Container>      
        </div>
    )
}

export default Footer