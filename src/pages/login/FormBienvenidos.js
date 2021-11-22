import React from 'react';
import './Login.css';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import { withStyles } from '@material-ui/core/styles';
import logo from '../header/logo.svg';
import {emitCustomEvent} from 'react-custom-events';

function FormBienvenidos(props) {
    const mobilAccess = !useMediaQuery('(min-width:769px)', { noSsr: true });

    const styles = (theme) => ({});
    const DialogTitle = withStyles(styles)((props) => {
        const { children } = props;
        return (
            <MuiDialogTitle disableTypography 
                style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }} 
            >
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
            </MuiDialogTitle>
        );
    });

    const handleClickContinuar = () => {
        emitCustomEvent('openLoadingPage', false);
        props.onGetContinuar(true);
    } 

    return (
        <div>
            <Dialog 
                fullScreen={mobilAccess}
                open={props.open}
                aria-labelledby="customized-dialog-title" 
                PaperProps = { { 
                    style : {  borderRadius : 15  } 
                } } 
                keepMounted
                disableEscapeKeyDown={true}
            >
            <DialogTitle
            >
                <strong>Creá tu perfil</strong>
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
                <Button 
                    variant='outlined'
                    className='button__log__BW'
                    onClick={handleClickContinuar}
                >
                    Continuar
                </Button>
            </MuiDialogContent>
            </Dialog>                          
        </div>
    )
}

export default FormBienvenidos
