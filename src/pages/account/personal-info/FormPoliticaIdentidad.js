import React from 'react';
import '../../login/Login.css';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

function FormPoliticaIdentidad(props) {
    const mobilAccess = !useMediaQuery('(min-width:769px)', { noSsr: true });

    const styles = (theme) => ({});
    const DialogTitle = withStyles(styles)((props) => {
        const { children, onClose } = props;
        return (
            <MuiDialogTitle disableTypography 
                style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }} 
            >
                <IconButton aria-label="close"  onClick={onClose}>
                    <CloseIcon />
                </IconButton>
                <Typography variant='subtitle2'
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%'
                    }}
                >
                    {children}
                </Typography>
                <IconButton 
                    aria-label="close"  
                    onClick={onClose}
                    disabled={true}
                    style={{
                        color: 'white'
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </MuiDialogTitle>
        );
    });

    const handleClose = () => {
        props.onGetClose();
    }

    return (
        <div>
            <Dialog 
                fullScreen={mobilAccess}
                open={props.open}
                onClose = {handleClose}
                aria-labelledby="customized-dialog-title" 
                PaperProps = { { 
                    style : {  borderRadius : 15  } 
                } } 
                keepMounted
                disableEscapeKeyDown={true}
            >
            <DialogTitle onClose={handleClose}>
                <strong>Verificaci??n de identidad</strong>
            </DialogTitle>
            <MuiDialogContent dividers>
                <Typography variant='h6'>
                    <strong>C??mo verifica byOO la identidad</strong>
                </Typography>
                <Typography variant='subtitle2' sx={{mt:'20px'}}>
                    <strong>Proporciona un documento de identificaci??n oficial</strong>
                </Typography>
                <Typography variant='subtitle2' sx={{mt:'5px'}}>
                    Necesitamos que nos proporciones un documento de identificaci??n oficial para comprobar que eres quien dices ser. En algunos casos, los prestadores de servicio exigen que los clientes verifiquen su identidad antes de solicitar un servicio o presupuesto. Es posible que desde byOO tambi??n tengamos que verificar tu identidad para comprobar que eres quien dices ser. No te preocupes: no compartiremos tu documento de identificaci??n con ning??n prestador de servicio ni con otros usuarios de byOO.
                </Typography>
                <Typography variant='subtitle2' sx={{mt:'20px'}}>
                    <strong>??C??mo a??ado un documento de identificaci??n?</strong>
                </Typography>
                <Typography variant='subtitle2' sx={{mt:'5px'}}>
                    Puedes hacer una foto de tu documento de identificaci??n con la c??mara de tu m??vil, de un ordenador o de una tablet. Tambi??n puedes subir una imagen que ya tengas guardada en tu dispositivo.
                </Typography>
                <Typography variant='subtitle2' sx={{mt:'20px'}}>
                    <strong>??Qu?? deber??a verse en la foto?</strong>
                </Typography>
                <Typography variant='subtitle2' sx={{mt:'5px'}}>
                    Haz una foto del anverso y del reverso.
                </Typography>
                <Typography variant='subtitle2' sx={{mt:'20px'}}>
                    <strong>Hacerse un selfie</strong>
                </Typography>
                <Typography variant='subtitle2' sx={{mt:'5px'}}>
                    Si te pedimos que te saques una foto, es para cotejarla con la del documento de identificaci??n que nos hayas proporcionado. As?? podremos comprobar que eres quien dices ser.
                </Typography>
                <Typography variant='subtitle2' sx={{mt:'20px'}}>
                    <strong>Privacidad</strong>
                </Typography>
                <Typography variant='subtitle2' sx={{mt:'5px'}}>
                    La informaci??n que proporciones a lo largo de este proceso est?? sujeta a nuestra Pol??tica de Privacidad.
                </Typography>
            </MuiDialogContent>
            </Dialog>                          
        </div>
    )
}

export default FormPoliticaIdentidad
