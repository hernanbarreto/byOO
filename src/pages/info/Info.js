import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import { useCustomEventListener } from 'react-custom-events';

function Info() {
    const[ openMsg, setOpenMsg] = useState(false);
    const [severityInfo, setSeverityInfo] = useState('success');
    const [msg, setMsg] = useState('');
    const handleCloseMsg = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpenMsg(false);
    };

    useCustomEventListener('showMsg', data => {
        setMsg(data.split('/')[0]);
        setSeverityInfo(data.split('/')[1]);
        setOpenMsg(true);
    });

    return (
        <div>
            <Snackbar open={openMsg} autoHideDuration={15000} onClose={handleCloseMsg} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{width: '100%'}}>
                <Alert onClose={handleCloseMsg} severity={severityInfo}>{msg}</Alert>
            </Snackbar>           
        </div>
    )
}

export default Info
