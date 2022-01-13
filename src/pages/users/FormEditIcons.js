import React, { useEffect } from 'react';
import '../login/Login.css';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import { withStyles } from '@material-ui/core/styles';
import logo from '../header/logo.svg';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function FormEditIcons(props) {
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
                >
                    <CloseIcon />
                </IconButton>
            </MuiDialogTitle>
        );
    });

    const handleCloseLogin = () => {
        props.onGetClose();
    }

    return (
        <div>
            <Dialog 
                fullScreen={mobilAccess}
                open={props.open}
                onClose = {handleCloseLogin}
                aria-labelledby="customized-dialog-title" 
                TransitionComponent={Transition}
                PaperProps = { { 
                    style : {  borderRadius : 15  } 
                } } 
                keepMounted
                disableEscapeKeyDown={false}
            >
            <DialogTitle
                onClose = {handleCloseLogin}
            >
                <strong>Esita tus preferencias de contacto</strong>
            </DialogTitle>
            <MuiDialogContent dividers>
                <img
                    style={{
                        transform: 'scale(2)',
                        display: 'block',
                        margin: '30px auto',
                    }}
                    src={logo}
                    alt='logo'
                /> 
                <div align='center'> 
                <Typography variant='h6'
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%'
                    }}
                >
                    <strong>{props.name}, te damos la bienvenida a byOO</strong>
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
                        justifyContent: 'center',
                    }}
                    >
                    Encontrá las mejores propuestas en la comunidad byOO.
                </Typography>
                </div>
            </MuiDialogContent>
            </Dialog>                          
        </div>
    )
}

export default FormEditIcons
