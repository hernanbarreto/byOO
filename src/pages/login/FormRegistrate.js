import React, { useState, useEffect }from 'react';
import InputAge from './InputAge';
import InputName from './InputName';
import InputPassword from './InputPassword';
import './Login.css';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import { withStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { makeStyles } from '@material-ui/core/styles';
import LoadingPage from './LoadingPage';
import Link from '@mui/material/Link';

function FormRegistrate(props) {
    const mobilAccess = !useMediaQuery('(min-width:769px)', { noSsr: true });
    const [loadingDialog, setLoadingDialog] = useState(false);
    const [checked, setChecked] = useState(false);

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
                    <ArrowBackIosIcon />
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
                    <ArrowBackIosIcon />
                </IconButton>
            </MuiDialogTitle>
        );
    });

    const useStyles = makeStyles({
        fontSizeLabel: {
            "& span:last-child": {
                fontSize: 11
            }
        }        
      });    

    const classes = useStyles();

    const handleCloseDialogREG = () => {
        props.onGetReturn(true);
        setLoadingDialog(false);
    }


    /*variables del componente InputPassword del form Registrate*/
    const styleInputPasswordFormRegistrate = { marginTop: "20px" };
    const [valueInputPasswordFormRegistrate, setValueInputPasswordFormRegistrate] = useState('');
    const [submitPasswordFormRegistrate, setSubmitInputPasswordFormRegistrate] = useState(false);
    const [variableEstadoCargadoNewValuePasswordFormRegistrate, setVariableEstadoCargadoNewValuePasswordFormRegistrate] = useState(false);
    const submitValuePasswordFormRegistrate = (value) => {
        setSubmitInputPasswordFormRegistrate(value);
    }
    const getValuePasswordFormRegistrate = (password) => {
        setValueInputPasswordFormRegistrate(password);
        setVariableEstadoCargadoNewValuePasswordFormRegistrate(true);
    }
    /*fin variables de componente InputPassword del form Registrate*/

    /*variables del componente InputName Form Registrate*/
    const styleInputNameFormRegistrate = { marginTop: "0px" };
    const [valueInputNameFormRegistrate, setValueInputNameFormRegistrate] = useState('');
    const [submitNameFormRegistrate, setSubmitNameFormRegistrate] = useState(false);
    const [variableEstadoCargadoNewValueNameFormRegistrate, setVariableEstadoCargadoNewValueNameFormRegistrate] = useState(false);
    const submitValueNameFormRegistrate = (value) => {
        setSubmitNameFormRegistrate(value);
    }
    const getValueNameFormRegistrate = (email) => {
        setValueInputNameFormRegistrate(email);
        setVariableEstadoCargadoNewValueNameFormRegistrate(true);
    }
    /*fin variables del componente InputName Form Registrate*/

    /*variables del componente InputAge Form Registrate*/
    const styleInputAgeFormRegistrate = { marginTop: "20px" };
    const [valueInputAgeFormRegistrate, setValueInputAgeFormRegistrate] = useState('');
    const [submitAgeFormRegistrate, setSubmitAgeFormRegistrate] = useState(false);
    const [variableEstadoCargadoNewValueAgeFormRegistrate, setVariableEstadoCargadoNewValueAgeFormRegistrate] = useState(false);
    const submitValueAgeFormRegistrate = (value) => {
        setSubmitAgeFormRegistrate(value);
    }
    const getValueAgeFormRegistrate = (email) => {
        setValueInputAgeFormRegistrate(email);
        setVariableEstadoCargadoNewValueAgeFormRegistrate(true);
    }
    /*fin variables del componente InputName Form Registrate*/

    const handleRegButton = async () => {
        setSubmitAgeFormRegistrate(true);
        setSubmitInputPasswordFormRegistrate(true);
        setSubmitNameFormRegistrate(true);
    } 

    const handleEnter = async () => {
        setSubmitAgeFormRegistrate(true);
        setSubmitInputPasswordFormRegistrate(true);
        setSubmitNameFormRegistrate(true);
    }

    /*atencion del valor ingresado del componente InputPassword del form Registrate*/
    useEffect(() => {
        if (variableEstadoCargadoNewValuePasswordFormRegistrate){        
            setVariableEstadoCargadoNewValuePasswordFormRegistrate(false);       
        } 

        if (variableEstadoCargadoNewValueAgeFormRegistrate){        
            setVariableEstadoCargadoNewValueAgeFormRegistrate(false);       
        } 

        if (variableEstadoCargadoNewValueNameFormRegistrate){
            if (valueInputNameFormRegistrate !== ''){ 
                if (valueInputPasswordFormRegistrate !== '') {
                    if (valueInputAgeFormRegistrate !== ''){
                        setLoadingDialog(true);
                        props.onGetPassword(valueInputPasswordFormRegistrate);
                        props.onGetName(valueInputNameFormRegistrate);
                        props.onGetAge(valueInputAgeFormRegistrate); 
                        props.onGetClose(true);
                        props.onGetPromotions(!checked);
                        setLoadingDialog(false);
                    }
                }
            }
            setVariableEstadoCargadoNewValueNameFormRegistrate(false);       
        } 
    },[props, checked, valueInputPasswordFormRegistrate, variableEstadoCargadoNewValuePasswordFormRegistrate, variableEstadoCargadoNewValueAgeFormRegistrate, valueInputNameFormRegistrate, variableEstadoCargadoNewValueNameFormRegistrate, valueInputAgeFormRegistrate]);
    /*fin atencion del valor ingresado del componente InputPassword del form Registrate*/   

    const handleTerminosDeSerivicio = () => {

    }

    const handlePoliticaDePrivacidad = () => {
        
    }

    const handlePoliticaContraDiscriminacion = () => {

    }

    const handleChangeChecked = (event) => {
        setChecked(event.target.checked);
    }

    return (
        <div>
            <Dialog 
                fullScreen={mobilAccess}
                open={props.open}
                onClose = {handleCloseDialogREG}
                aria-labelledby="customized-dialog-title" 
                PaperProps = { { 
                    style : {  borderRadius : 15  } 
                } } 
                keepMounted
                disableEscapeKeyDown={true}
            >
            <LoadingPage 
                open={loadingDialog}
            />
            <DialogTitle 
                onClose={handleCloseDialogREG}>
                <strong>Registrate</strong>
            </DialogTitle>
            <MuiDialogContent dividers style={{align: 'center'}}>
                <InputName 
                    style={styleInputNameFormRegistrate}
                    onGetValueName={getValueNameFormRegistrate} 
                    verify={submitNameFormRegistrate} 
                    onSubmitValueName={submitValueNameFormRegistrate} 
                    close={!props.open}
                    onGetEnter={handleEnter}
                    name={''}
                    lastName={''}
                />
                <Typography 
                    variant="caption"
                    display="block"
                    gutterBottom
                    style={{
                        width: '100%',
                        marginTop: 0,
                        color: 'gray'
                    }}
                    >
                    Asegurate de que coincida con el nombre que figura en tu identificación oficial.
                </Typography>
                <InputAge
                    onGetValueAge={getValueAgeFormRegistrate} 
                    onSubmitValueAge={submitValueAgeFormRegistrate} 
                    onGetEnter={handleEnter}
                    verify={submitAgeFormRegistrate} 
                    style={styleInputAgeFormRegistrate}
                    close={!props.open}
                    edad={null}
                />
                <Typography 
                    variant="caption"
                    display="block"
                    gutterBottom
                    style={{
                        width: '100%',
                        marginTop: 0,
                        color: 'gray'
                    }}
                    >
                    Debés tener al menos 18 años para registrarte. No vamos a compartir tu fecha de nacimiento con ningún usuario en byOO.
                </Typography>
                {props.email ? 
                    <TextField 
                        value={props.email}
                        disabled={true}
                        label="Correo electrónico" 
                        variant="outlined" 
                        style={{
                            width: '100%',
                            marginTop: 10,
                        }}
                    />
                :null}
                <Typography 
                    variant="caption"
                    display="block"
                    gutterBottom
                    style={{
                        width: '100%',
                        marginTop: 0,
                        color: 'gray'
                    }}
                    >
                    Te vamos a enviar las confirmaciones de servicios por correo electrónico.
                </Typography>
                <InputPassword 
                    onGetValuePassword={getValuePasswordFormRegistrate} 
                    onSubmitValuePassword={submitValuePasswordFormRegistrate} 
                    onGetEnter={handleEnter}
                    password=''
                    verify={submitPasswordFormRegistrate} 
                    style={styleInputPasswordFormRegistrate}
                    close={!props.open}
                />
                <Typography 
                    variant="caption"
                    display="block"
                    gutterBottom
                    style={{
                        width: '100%',
                        marginTop: 10,
                        color: 'gray'
                    }}
                    >
                    Al seleccionar&nbsp;<strong>Aceptar y continuar</strong>&nbsp;a continuación, acepto los&nbsp;
                    <Link
                        component="button"
                        onClick={handleTerminosDeSerivicio}
                        sx={{
                            textDecoration: "underline #5472AD",
                            color: '#5472AD !important',
                            fontSize: '12px',
                        }} 
                    >
                        <strong>Términos de servicio</strong>
                    </Link>
                    &nbsp;la&nbsp;
                    <Link
                        component="button"
                        onClick={handlePoliticaDePrivacidad}
                        sx={{
                            textDecoration: "underline #5472AD",
                            color: '#5472AD !important',
                            fontSize: '12px',
                        }} 
                    >
                        <strong>Política de privacidad</strong>
                    </Link>
                    &nbsp;y la&nbsp;
                    <Link
                        component="button"
                        onClick={handlePoliticaContraDiscriminacion}
                        sx={{
                            textDecoration: "underline #5472AD",
                            color: '#5472AD !important',
                            fontSize: '12px',
                        }} 
                    >
                        <strong>Política contra la discriminación</strong>
                    </Link>
                    &nbsp;de byOO.
                </Typography>
                <Divider style={{width: '100%', marginTop:'20px', marginBottom:'5px'}}/>
                <Button 
                    variant='outlined'
                    className='button__log__continuar'
                    onClick={handleRegButton}
                    disableElevation
                >
                    Aceptar y continuar
                </Button>
                <Typography 
                    variant="caption"
                    display="block"
                    gutterBottom
                    style={{
                        width: '100%',
                        marginTop: 10,
                        color: 'gray'
                    }}
                    >
                    byOO te va a enviar correos electrónicos comerciales y notificaciones push. Podés optar por dejar de recibirlos en la configuración de tu cuenta o directamente desde la notificación correspondiente.
                </Typography>
                <FormControlLabel
                    className={classes.fontSizeLabel} 
                    control={
                        <Checkbox
                            color='default' 
                            checked={checked}
                            onChange={handleChangeChecked}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    } 
                    label="No quiero recibir mensajes promocionales de byOO" 
                    style={{
                        color: 'gray',
                    }}
                />
            </MuiDialogContent>
            </Dialog>            
        </div>
    )
}

export default FormRegistrate
