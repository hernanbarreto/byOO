import React, { useEffect } from 'react';
import './Home.css';
import Banner from './banner/Banner';
import { useInitPage } from '../useInitPage';

function Home() {
    const {state} = useInitPage();

    useEffect(() => {     
        if (state !== null){
            if (state){
            }
        }             
    }, [state]);

    return (
        <div className='home'>
           < Banner />            
        </div>
    )
}

export default Home
