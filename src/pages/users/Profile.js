import React, { useEffect, useCallback, useState } from 'react'
import './Profile.css';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useLocation, useHistory } from "react-router-dom";
import { 
    doc,
    getDoc,
    updateDoc,
    getFirestore,
    } from "firebase/firestore";
import { useAuth } from '../../services/firebase';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import Badge from '@mui/material/Badge';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import MessageIcon from '@mui/icons-material/Message';
import ShareIcon from '@mui/icons-material/Share';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useInitPage } from '../useInitPage';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import Link from '@mui/material/Link';

const database = getFirestore();
const sizeAvatarNotPressed = '150px';
const sizeAvatarPressed = '146px';
const borderAvatarNotPressed = '4px solid white';
const borderAvatarPressed = '8px solid white';
const marginBadgeNotPressed = '-79px';
const marginBadgePressed = '-81px';
const marginDotNotPressed = '-10px';
const marginDotPressed = '-14px';

let regExpress=/[^a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]/g;

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Profile() {
    const {state} = useInitPage();

    useEffect(() => {     
        if (state !== null){
            if (state){
            }
        }             
    }, [state]);

    let query = useQuery();
    const history = useHistory ();
    const {currentUser} = useAuth();
    
    const [name, setName] = useState(null);
    const [description, setDescription] = useState(null); 
    const [photoURL, setPhotoURL] = useState(null);
    const [loadingAvatar, setLoadingAvatar] = useState(false);
    const [loadedPage, setLoadedPage] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [sizeAvatar, setSizeAvatar] = useState(sizeAvatarNotPressed);
    const [borderAvatar, setBorderAvatar] = useState(borderAvatarNotPressed);
    const [marginBadge, setMarginBadge] = useState(marginBadgeNotPressed);
    const [marginDot, setMarginDot] = useState(marginDotNotPressed);
    const [editDescription, setEditDescription] = useState(false);
    
    const getUser = useCallback(async ()=>{
        console.log('pase');
        const uid = query.get("show");
        const infoUser = doc(database, "users", uid);
        try{
            const docSnap = await getDoc(infoUser);
            if (docSnap.exists()) {
                setLoadingAvatar(true);
                if (currentUser.uid === uid){
                    console.log('Perfil del usuario logeado');
                    setCanEdit(true);
                }else{
                    console.log('Perfil de otro usuario');
                    setCanEdit(false);
                }
                setName(docSnap.data().name + ' ' + docSnap.data().lastName);
                setPhotoURL(docSnap.data().profilePhoto);
                setDescription(docSnap.data().description);
            }else{
                history.push('/404');          
            }
        }catch(error){
            if (error.code === 'permission-denied'){
                console.log('se debe logear');
                console.log('que mostramos aca');
            }else{
                console.log(error.code);
                history.push('/');          
            }
        }
    },[query]); 

    useEffect(() => {
        if (!loadedPage){
            getUser();
            setLoadedPage(true);
        }
    }, [getUser]);

    const avatarLoaded = () => {
        console.log('avatar cargado');
        setLoadingAvatar(false);
    }


    const [width, setWidth]=useState(()=>{
        if (window.innerWidth >= 900){
            return (window.innerWidth - 900)/2;
        } 
        else{
            console.log(window.innerWidth);
            return window.innerWidth;
        } 
    });
    const updateDimensions = () => {
        setWidth((window.innerWidth - 900)/2);
    }

    useEffect(() => {
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    const BoxStyled = styled('div')(({ theme }) => ({
          [theme.breakpoints.down('md')]: {
            height: '200px',
            background: 'linear-gradient(0deg, black, rgb(240, 242, 245))',
            },
          [theme.breakpoints.up('md')]: {
                height: '300px',
                borderBottomRightRadius: '20px',
                borderBottomLeftRadius: '20px',
                background: 'linear-gradient(0deg, black, rgb(240, 242, 245))',
                marginLeft: width,
                maxWidth: '900px',
            },
    }));

    const handleEditDescription = () => {
        setEditDescription(true);
    }

    const handleCancelDescription = async() => {
        const infoUser = doc(database, "users", currentUser.uid);
        const docSnap = await getDoc(infoUser);
        setDescription(docSnap.data().description);
        setEditDescription(false);
    }

    const handleSaveDescription = async() => {
        const infoUser = doc(database, "users", currentUser.uid);
        if (/^\s*$/.test(description)){ 
            setDescription(null);
            await updateDoc(infoUser, {
                description: null,
            })
            .then(()=>{
            })
            .catch(()=>{
            });
        }else{
            await updateDoc(infoUser, {
                description: description,
            })
            .then(()=>{
            })
            .catch(()=>{
            });
        }
        setEditDescription(false);
    }

    const handleAgregarPresentacion = () => {
        setDescription('');
        setEditDescription(true);
    }

    return (
        <div>
            <Stack
                direction='column'
            >
            <BoxStyled
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                    }}
            
            >
                {canEdit && (
                <IconButton aria-label="load-image"
                    onClick={() => {console.log('click');}}
                    style={{
                        marginRight: '10px',
                        marginBottom: '10px',
                        border: '1px solid gray',
                        backgroundColor: '#F0F2F5',
                    }}
                >
                    <CameraAltIcon 
                        fontSize='medium'
                        sx={{
                            color: 'black',
                        }}
                    />
                </IconButton>
                )}
            </BoxStyled>
            <Container maxWidth='md'>
                <Box>
                    <Badge
                        invisible={!canEdit} 
                        overlap="circular"
                        anchorOrigin={{ 
                            vertical: "bottom", 
                            horizontal: "right" 
                        }}
                        badgeContent={
                                <Avatar 
                                    onMouseDown={() => {
                                        if (canEdit){
                                            setSizeAvatar(sizeAvatarPressed);
                                            setBorderAvatar(borderAvatarPressed);
                                            setMarginBadge(marginBadgePressed);
                                            setMarginDot(marginDotPressed);
                                        }
                                    }}
                                    onMouseUp={() => {
                                        if (canEdit){
                                            setSizeAvatar(sizeAvatarNotPressed);
                                            setBorderAvatar(borderAvatarNotPressed);
                                            setMarginBadge(marginBadgeNotPressed);
                                            setMarginDot(marginDotNotPressed);
                                        }
                                    }}
                                    onMouseLeave={() => {
                                        if (canEdit){
                                            setSizeAvatar(sizeAvatarNotPressed);
                                            setBorderAvatar(borderAvatarNotPressed);
                                            setMarginBadge(marginBadgeNotPressed);
                                            setMarginDot(marginDotNotPressed);
                                        }
                                    }}
                                    onClick={() => {
                                        if (canEdit){
                                            console.log('click');
                                        }
                                    }}

                                    sx={{
                                        bgcolor: '#E4E6EB', 
                                        color: '#E4E6EB',
                                        width: 40, 
                                        height: 40,
                                        marginLeft: marginDot,
                                        marginTop: marginDot,
                                        ...(canEdit && {
                                            '&:hover': {
                                                cursor: 'pointer',
                                            },                                                                                    
                                        })
                                    }}
                                >
                                    <CameraAltIcon 
                                        fontSize='medium'
                                        sx={{
                                            color: 'black',
                                        }}
                                    />
                                </Avatar>
                        }
                        sx={{
                            position: 'absolute',
                            left: '50vw',
                            marginLeft: marginBadge,
                            marginTop: marginBadge,
                        }}
                    > 
                        <Avatar
                            src={photoURL}
                            onLoad={avatarLoaded}
                            onMouseDown={() => {
                                if (canEdit){
                                    setSizeAvatar(sizeAvatarPressed);
                                    setBorderAvatar(borderAvatarPressed);
                                    setMarginBadge(marginBadgePressed);
                                    setMarginDot(marginDotPressed);
                                }
                            }}
                            onMouseUp={() => {
                                if (canEdit){
                                    setSizeAvatar(sizeAvatarNotPressed);
                                    setBorderAvatar(borderAvatarNotPressed);
                                    setMarginBadge(marginBadgeNotPressed);
                                    setMarginDot(marginDotNotPressed);
                                }
                            }}
                            onMouseLeave={() => {
                                if (canEdit){
                                    setSizeAvatar(sizeAvatarNotPressed);
                                    setBorderAvatar(borderAvatarNotPressed);
                                    setMarginBadge(marginBadgeNotPressed);
                                    setMarginDot(marginDotNotPressed);
                                }
                            }}
                            onClick={() => {
                                if (canEdit){
                                    console.log('click');
                                }
                            }}
                            sx={{ 
                                width: sizeAvatar, 
                                height: sizeAvatar,
                                border: borderAvatar,                        
                                ...(canEdit && {
                                    '&:hover': {
                                        cursor: 'pointer',
                                    },                                                                                    
                                })
                            }}
                        /> 
                    </Badge>
                    <Typography
                        align='center'
                        fontSize={{
                            lg: 30,
                            md: 30,
                            sm: 20,
                            xs: 20,
                        }}                                                                                
                        sx={{
                            position: 'relative',
                            top: '90px',
                            overflowWrap: 'anywhere',
                        }}
                    >
                        <strong>{name}</strong>
                    </Typography>
                    <Stack
                        direction='row'
                        spacing={1}
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                            position: 'relative',
                            top: '100px',
                        }}
                    >
                            <FacebookIcon
                                sx={{
                                    width: {
                                        sm: 30,
                                        md: 35,
                                    }, 
                                    height: {
                                        xs: 30,
                                        md: 35,
                                    },
                                    '&:hover': {
                                        cursor: 'pointer',
                                    },                                                                                                                        
                                }}                            
                            />
                        <InstagramIcon
                                sx={{
                                    width: {
                                        sm: 30,
                                        md: 35,
                                    }, 
                                    height: {
                                        xs: 30,
                                        md: 35,
                                    },
                                    '&:hover': {
                                        cursor: 'pointer',
                                    },                                                                                                                        
                                }}                            
                        />
                        <TwitterIcon
                                sx={{
                                    width: {
                                        sm: 30,
                                        md: 35,
                                    }, 
                                    height: {
                                        xs: 30,
                                        md: 35,
                                    },
                                    '&:hover': {
                                        cursor: 'pointer',
                                    },                                                                                                                        
                                }}                            
                        />
                        <LinkedInIcon
                                sx={{
                                    width: {
                                        sm: 30,
                                        md: 35,
                                    }, 
                                    height: {
                                        xs: 30,
                                        md: 35,
                                    },
                                    '&:hover': {
                                        cursor: 'pointer',
                                    },                                                                                                                        
                                }}                            
                        />
                        <WhatsAppIcon 
                                sx={{
                                    width: {
                                        sm: 30,
                                        md: 35,
                                    }, 
                                    height: {
                                        xs: 30,
                                        md: 35,
                                    },
                                    '&:hover': {
                                        cursor: 'pointer',
                                    },                                                                                                                        
                                }}                            
                        />
                        <EmailIcon 
                                sx={{
                                    width: {
                                        sm: 30,
                                        md: 35,
                                    }, 
                                    height: {
                                        xs: 30,
                                        md: 35,
                                    },
                                    '&:hover': {
                                        cursor: 'pointer',
                                    },                                                                                    
                                }}                            
                        />
                        <MessageIcon 
                                sx={{
                                    width: {
                                        sm: 30,
                                        md: 35,
                                    }, 
                                    height: {
                                        xs: 30,
                                        md: 35,
                                    },
                                    '&:hover': {
                                        cursor: 'pointer',
                                    },                                                                                    
                                }}                            
                        />
                        <ShareIcon 
                                sx={{
                                    width: {
                                        sm: 30,
                                        md: 35,
                                    }, 
                                    height: {
                                        xs: 30,
                                        md: 35,
                                    },
                                    '&:hover': {
                                        cursor: 'pointer',
                                    },                                                                                    
                                }}                            
                        />
                        {canEdit && (
                        <IconButton aria-label="load-image"
                            onClick={() => {console.log('click');}}
                            style={{
                                border: '1px solid gray',
                                backgroundColor: '#F0F2F5',
                            }}
                        >
                            <EditIcon 
                                fontSize='medium'
                                sx={{
                                    color: 'black',
                                }}
                            />
                        </IconButton>
                        )}
                    </Stack>
                    {description !== null ?
                        <>
                        <Typography
                            display="block"
                            gutterBottom
                            fontSize={{
                                lg: 25,
                                md: 25,
                                sm: 20,
                                xs: 20,
                            }}                                                                                
                            sx={{
                                position: 'relative',
                                top: '120px',
                                overflowWrap: 'anywhere',
                            }}
                        >
                            <strong>Información:</strong>
                        </Typography>
                        {!editDescription ? (
                        <Typography
                            display="block"
                            gutterBottom
                            fontSize={{
                                lg: 20,
                                md: 20,
                                sm: 15,
                                xs: 15,
                            }}                                                                                
                            sx={{
                                position: 'relative',
                                top: '120px',
                                overflowWrap: 'anywhere',
                            }}
                        >
                            {description}
                            {(canEdit) && (
                                <>
                                <br/>
                                <Button
                                    onClick={handleEditDescription}
                                    variant='outlined'
                                    align= 'center'
                                    startIcon={<EditIcon/>}
                                    disableElevation
                                    style={{
                                        marginTop: '10px',
                                        width: '200px',
                                        height: '50px',
                                        textTransform: 'inherit',
                                        borderRadius: '10px',
                                        backgroundColor: 'rgb(0, 0, 0, 1)',
                                        color: 'white',
                                    }}
                                    sx={{
                                        '&:hover': {
                                            borderColor: 'gray',
                                        },                               
                                    }}
                                >
                                    Editar Información
                                </Button>
                            </>
                        )}
                        </Typography>
                        )
                        :
                            <>
                                <OutlinedInput
                                    display="block"
                                    fullWidth 
                                    placeholder="Contanos acerca de vos." 
                                    multiline
                                    rows={5}
                                    value={description}
                                    onChange={(e)=>{
                                        setDescription(e.target.value);
                                    }}
                                    sx={{
                                        position: 'relative',
                                        top: '120px',
                                        overflowWrap: 'anywhere',
                                        fontSize: {
                                            lg: 20,
                                            md: 20,
                                            sm: 15,
                                            xs: 15,
                                        }                                                                                
                                    }}
                                />
                                <Stack
                                    direction={'row'}
                                    justifyContent="space-between"
                                    alignItems="flex-end"
                                    style={{
                                        marginTop: '120px',
                                    }}
                                >
                                    <Button
                                        onClick={handleSaveDescription}
                                        variant='outlined'
                                        startIcon={<SaveIcon/>}
                                        disableElevation
                                        style={{
                                            marginTop: '10px',
                                            width: '200px',
                                            height: '50px',
                                            textTransform: 'inherit',
                                            borderRadius: '10px',
                                            backgroundColor: 'rgb(0, 0, 0, 1)',
                                            color: 'white',                                
                                        }}
                                        sx={{
                                            '&:hover': {
                                                borderColor: 'gray',
                                            },                               
                                        }}
                                    >
                                        Guardar
                                    </Button>
                                    <Button
                                        onClick={handleCancelDescription}
                                        variant='outlined'
                                        startIcon={<CancelIcon/>}
                                        disableElevation
                                        style={{
                                            marginTop: '10px',
                                            width: '200px',
                                            height: '50px',
                                            textTransform: 'inherit',
                                            borderRadius: '10px',
                                            backgroundColor: 'rgb(0, 0, 0, 1)',
                                            color: 'white',                                
                                        }}
                                        sx={{
                                            '&:hover': {
                                                borderColor: 'gray',
                                            },                               
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                </Stack>
                            </>
                        }
                        </>
                    :
                        <>
                        {canEdit ?
                                <Link
                                    align='center'
                                    component="button"
                                    top= '120px'
                                    onClick={handleAgregarPresentacion}
                                    sx={{
                                        color: '#5472AD !important',
                                        fontSize: '16px',
                                    }} 
                                >
                                    <strong>Agregar presentación</strong>
                                </Link>
                            :
                            null 
                        }
                        </>
                    }
                </Box>
                <Box sx={{mt: '140px', height: '800px', backgroundColor: '#F0F2F5'}}>
                    <Divider/>
                </Box>
            </Container>
            </Stack>
        </div>
    )
}

export default Profile