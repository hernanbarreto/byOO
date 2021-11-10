import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';

function LoadingPage(props) {
    return (
        <div>
            <Backdrop
                sx={{ color: 'rgb(78, 50, 126)', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={props.open}
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
        </div>
    )
}

export default LoadingPage
