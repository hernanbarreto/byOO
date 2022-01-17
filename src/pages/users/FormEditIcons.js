import React, { useEffect, useState, useCallback } from 'react';
import '../login/Login.css';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { withStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@mui/material/TextField';
import CustomizedSwitch from  '../custom/CustomSwitch';
import {  Divider } from '@material-ui/core';
import { useAuth } from '../../services/firebase';
import { 
    doc,
    getDoc,
    updateDoc,
    getFirestore,
    } from "firebase/firestore";
import Skeleton from '@mui/material/Skeleton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';    

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const database = getFirestore();

const facebookAccountStart = 'https://www.facebook.com/';

function FormEditIcons(props) {
    const [ openMsg, setOpenMsg] = useState(false);
    const [severityInfo, setSeverityInfo] = useState('success');
    const [msg, setMsg] = useState('');
    const handleCloseMsg = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpenMsg(false);
    };

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

    const {currentUser} = useAuth();
    const [loadedPage, setLoadedPage] = useState(false);
    const [loadingPreferences, setLoadingPreferences] = useState(false);

    /*Facebook Profile*/
    const [stateErrorFacebookProfile, setStateErrorFacebookProfile] = useState(false);
    const [valueInputFacebookProfile, setValueInputFacebookProfile] = useState('');
    const [facebookProfile, setFacebookProfile] = useState(false);
    const [helperTextFacebook, setHelperTextFacebook] = useState('');

    const handleChangeFacebookProfile = (e) => {
        setStateErrorFacebookProfile(false);
        setHelperTextFacebook('');
        setValueInputFacebookProfile(e.target.value);
    }

    const handleKeyFacebookProfile = (e) => {
        if (e.key === 'Enter') {
            e.target.blur();
            handleVincularFacebookProfile();
        }
    } 

    const handleVincularFacebookProfile = async() => {
        console.log('vinculando');
        if (valueInputFacebookProfile !== ''){
            if (valueInputFacebookProfile.startsWith(facebookAccountStart)){
                const infoUser = doc(database, "users", currentUser.uid);
                try{                                  
                    await updateDoc(infoUser, {
                        'profileIcons.facebook.show': true,
                        'profileIcons.facebook.url': valueInputFacebookProfile,
                    })
                    .then(()=>{
                        setFacebookProfile(true);                                            
                    })
                    .catch(()=>{
                        setMsg('Ha ocurrido un error al intentar actualizar tu información');
                        setSeverityInfo('error');
                        setOpenMsg(true); 
                    });
                }catch{
                    setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
                    setSeverityInfo('error');
                    setOpenMsg(true);
                }       
            }else{
                setStateErrorFacebookProfile(true);
                setHelperTextFacebook('La URL de tu usuario de facebook debe comenzar con ' + facebookAccountStart);    
            }
        }else{
            setStateErrorFacebookProfile(true);
            setHelperTextFacebook('Debés ingresar una URL')
        }
    }

    const handleDesvincularFacebookProfile = async() => {
        const infoUser = doc(database, "users", currentUser.uid);
        try{                                  
            await updateDoc(infoUser, {
                'profileIcons.facebook.show': false,
            })
            .then(()=>{
                setFacebookProfile(false);                                            
            })
            .catch(()=>{
                setMsg('Ha ocurrido un error al intentar actualizar tu información');
                setSeverityInfo('error');
                setOpenMsg(true); 
            });
        }catch{
            setMsg('Ha ocurrido un error al intentar acceder a los datos de tu cuenta');
            setSeverityInfo('error');
            setOpenMsg(true);
        } 
    }
    /*Fin Facebook Profile*/

    const getPreferences = useCallback(async() => {
        setLoadingPreferences(true);
        const infoUser = doc(database, "users", currentUser.uid);
        const docSnap = await getDoc(infoUser);
        setFacebookProfile(docSnap.data().profileIcons.facebook.show);
        setValueInputFacebookProfile(docSnap.data().profileIcons.facebook.url);
        setLoadingPreferences(false);
    },[]);

    useEffect(() => {
        if (!loadedPage){
            getPreferences();
            setLoadedPage(true);
        }
    }, [getPreferences]);


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
                <strong>Edita tus preferencias</strong>
            </DialogTitle>
            <MuiDialogContent dividers>
            {!loadingPreferences ?
                <>
                <CustomizedSwitch
                    label='Perfil de Facebook'
                    strong={true}
                    checked={facebookProfile}
                    onGetChange={e=>{
                        if(e){
                            handleVincularFacebookProfile();
                        }else{
                            handleDesvincularFacebookProfile();
                        }
                    }}
                />
                <Typography 
                    fontSize={{
                        lg: 15,
                        md: 15,
                        sm: 12,
                        xs: 12,
                    }}                                                                                
                    display="block"
                    gutterBottom
                    style={{
                        width: '100%',
                        marginTop: 10,
                    }}
                >
                   Ingresa la URL de tu perfil de Facebook si querés que la comunidad byOO pueda verlo.
                </Typography>
                <TextField
                    disabled={props.disabled} 
                    error={stateErrorFacebookProfile}
                    helperText={helperTextFacebook}
                    value={valueInputFacebookProfile}
                    onChange={handleChangeFacebookProfile} 
                    label="URL de tu perfil de Facebook" 
                    variant="outlined" 
                    style={{
                        width: '100%',
                        marginTop: '10px',
                        marginBottom: '20px',
                    }}
                    autoComplete="new-password"
                    onKeyDown={e => handleKeyFacebookProfile(e) }
                />
                </>
                :
                <>
                    <Skeleton variant="text" width="100%"/>
                    <Skeleton variant="text" width="100%"/>
                    <Skeleton variant="text" width="100%"/>
                </>
                }
                <Divider/>               
            </MuiDialogContent>
            </Dialog> 
            <Snackbar open={openMsg} autoHideDuration={6000} onClose={handleCloseMsg} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{width: '100%'}}>
                <Alert onClose={handleCloseMsg} severity={severityInfo}>{msg}</Alert>
            </Snackbar>            
        </div>
    )
}

export default FormEditIcons
