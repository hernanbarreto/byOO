import React, { useEffect } from 'react'
import { useInitPage } from '../useInitPage';

function Privacity() {
    const {state} = useInitPage();

    useEffect(() => {
        if (state !== null){
            if (state){
            }
        }         
    }, [state]);

    return (
        <div>
            <h1>Política de privacidad</h1>
        </div>
    )
}

export default Privacity
