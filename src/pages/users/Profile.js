import React, { useEffect, useCallback, useState } from 'react'
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useLocation, useHistory } from "react-router-dom";
import { 
    doc,
    getDoc,
    getFirestore,
    } from "firebase/firestore";
import { useAuth } from '../../services/firebase';

const database = getFirestore();

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Profile() {
    let query = useQuery();
    const history = useHistory ();
    const {currentUser} = useAuth();
    
    const [name, setName] = useState(null); 
    
    const getUser = useCallback(async ()=>{
        const uid = query.get("show");
        const infoUser = doc(database, "users", uid);
        try{
            const docSnap = await getDoc(infoUser);
            if (docSnap.exists()) {
                if (currentUser.uid === uid){
                    console.log('Perfil del usuario logeado');
                }else{
                    console.log('Perfil de otro usuario');
                }
                setName(docSnap.data().name);
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
        getUser();
    }, [getUser]);

    return (
        <div>
            <Container maxWidth='lg'>
                <Box sx={{minHeight: '100vh'}}>
                <Typography 
                        variant='h4'
                        sx={{
                            pt: '50px',
                        }}
                    >
                        <strong>Perfil de {name}</strong>
                </Typography>
                </Box>
            </Container>
        </div>
    )
}

export default Profile