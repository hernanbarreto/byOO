import React from 'react';
import '../../login/Login.css';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@mui/material/IconButton';
import { withStyles } from '@material-ui/core/styles';
import logo from  '../../../images/svg/undraw_throw_away_re_x60k.svg';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { styled } from '@mui/material/styles';

function FormEliminarCuenta(props) {
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

    const handleClickContinuar = () => {
        props.onGetEliminar(true);
    } 

    const handleCloseEliminarCuenta = () => {
        props.onGetClose(true);
    }

    const Img = styled('img')({
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '150px',
    });     

    return (
        <div>
            <Dialog 
                fullScreen={mobilAccess}
                open={props.open}
                onClose = {handleCloseEliminarCuenta}
                aria-labelledby="customized-dialog-title" 
                PaperProps = { { 
                    style : {  borderRadius : 15  } 
                } } 
                keepMounted
                disableEscapeKeyDown={true}
            >
            <DialogTitle
                onClose={handleCloseEliminarCuenta}
            >
                <strong>Eliminá tu cuenta</strong>
            </DialogTitle>
            <MuiDialogContent dividers>
                <Img
                    src={logo}
                    alt='logo'
                /> 
                <div align='center'> 
                <Typography variant='h6'
                    style={{
                        marginTop: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%'
                    }}
                >
                    <strong>{props.name}, ¿estas seguro que querés eliminar tu cuenta?</strong>
                </Typography> 
                <Typography 
                    variant="subtitle2"
                    gutterBottom
                    style={{
                        width: '100%',
                        marginTop: 10,
                        color: 'gray',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'left',
                    }}
                    >
                    <SentimentVeryDissatisfiedIcon  sx={{width: 80, height: 80}} /> Esta es nuestra despedida, al eliminar tu cuenta de byOO perderás toda la información almacenada en la plataforma y ya no recibirás correos promocionales.
                </Typography>
                </div>
                <Button 
                    variant='outlined'
                    className='button__log__BW'
                    onClick={handleClickContinuar}
                >
                    Confirmar
                </Button>
            </MuiDialogContent>
            </Dialog>                          
        </div>
    )
}

export default FormEliminarCuenta