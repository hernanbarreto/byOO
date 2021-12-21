import React from 'react'
import  CookieConsent from "react-cookie-consent" ; 
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import LockIcon from '@mui/icons-material/Lock';

function CookieAcept() {
    return (
        <div>
        <CookieConsent
            location="bottom"
            buttonText="Aceptar"
            flipButtons={true}
            style={{ 
              background: "white",
              width: '100%', 
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: 'black',
              borderStyle: 'solid',
              borderRadius: '10px',
            }}
            buttonStyle={{ 
              color: "#ffffff",
              backgroundColor: '#000000', 
              fontSize: "20px",
              borderRadius: '10px',

            }}
            expires={150}
            debug={true}
          >
          <Stack direction='row'>
          <Typography 
              variant="h5"
              display="block"
              gutterBottom
              style={{
                  width: '100%',
                  marginTop: 10,
                  color: 'black'
              }}
          >
              <strong>Tu privacidad</strong>
              <LockIcon color='primary'/>
          </Typography>
          </Stack>
          <Typography 
              variant="subtitle2"
              display="block"
              gutterBottom
              style={{
                  width: '100%',
                  marginTop: 10,
                  color: 'black'
              }}
          >
              Usamos cookies y tecnologías similares para personalizar el contenido, adaptar y medir los anuncios y ofrecer una mejor experiencia. Al hacer clic en Aceptar, aceptás lo establecido en nuestra Política de cookies.
          </Typography>
          </CookieConsent>            
        </div>
    )
}

export default CookieAcept
