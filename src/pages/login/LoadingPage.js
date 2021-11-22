import React, { useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import { useCustomEventListener } from 'react-custom-events';

function LoadingPage() {
    const [open, setOpen] = useState(false);

    useCustomEventListener('openLoadingPage', data => {
        setOpen(data);
    });
    

    return (
            <Backdrop
                sx={{ color: 'rgb(78, 50, 126)', zIndex: (theme) => theme.zIndex.tooltip + 1 }}
                open={open}
            >
                <Box sx={{ m: 1, position: 'relative' }}>
                <CircularProgress 
                        size={60}
                        sx={{
                        color: 'rgb(78, 50, 126)',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1,
                        }}
                    color="inherit"
                />
                <img src={require('../header/logo_load.png').default} alt='logo_load.png'/>
                </Box>
            </Backdrop>                        
    )
}

export default LoadingPage
