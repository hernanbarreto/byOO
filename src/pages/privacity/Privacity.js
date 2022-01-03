import React, { useEffect } from 'react'
import { useInitPage } from '../useInitPage';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function Privacity() {
    const {state} = useInitPage();

    useEffect(() => {
        if (state !== null){
            if (state){
            }
        }         
    }, [state]);

    return (
        <div>
            <Container maxWidth='lg'>
                <Box sx={{minHeight: '100vh'}}>
                <Typography 
                        variant='h4'
                        sx={{
                            pt: '50px',
                        }}
                    >
                        <strong>Política de privacidad</strong>
                </Typography>
                </Box>
            </Container>
        </div>
    )
}

export default Privacity
