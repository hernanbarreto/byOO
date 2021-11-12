import React, { useEffect } from 'react';
import './Home.css';
import Banner from './banner/Banner';

function Home() {
    useEffect(() => {
        window.scrollTo(0,0);
    }, []);


    return (
        <div className='home'>
           < Banner />            
        </div>
    )
}

export default Home
