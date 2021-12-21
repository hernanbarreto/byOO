import React, { useEffect } from 'react';
import { useInitPage } from '../useInitPage';
import Container from '@mui/material/Container';
import './Home.css';
//import ImageHome from '../../images/svg/undraw_team_work_k-80-m.svg';
import ImageHome from '../../images/svg/undraw_new_ideas_jdea.svg';
//import ImageHome from '../../images/svg/undraw_best_place_r685.svg';
//import ImageHome from '../../images/svg/undraw_community_re_cyrm.svg';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';

function Home() {
    const {state} = useInitPage();

    const Img = styled('img')({
        margin: 'auto',
        display: 'block',
        width: '100%',
        maxHeight: '800px'
    });     

    useEffect(() => {     
        if (state !== null){
            if (state){
            }
        }             
    }, [state]);

    return (
        <div className='home'>
            <Container maxWidth='xl'>
                <Box sx={{ bgcolor: 'black'}}>
                    <Stack spacing={'50px'}>
                        <Paper elevation={0}/>
                        {/*<Paper elevation={0} sx={{borderRadius: '20px', bgcolor: '#3f3d56'}}>*/}
                        <Paper elevation={0} sx={{borderRadius: '20px', bgcolor: 'white'}}>
                            <Img src={ImageHome} />
                        </Paper>
                        <Paper elevation={0}/>
                    </Stack>
                </Box>
            </Container>      
        </div>
    )
}

export default Home
