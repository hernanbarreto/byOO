import React, { useState, useEffect }from 'react';
import TextField from '@mui/material/TextField';

function InputEmail(props) {
    const [isMounted, setIsMounted] = useState(true);
    const [stateErrorEmail, setStateErrorEmail] = useState(false);
    const [helperTextEmail, sethelperTextEmail] = useState('');
    const [valueInputEmail, setValueInputEmail] = useState(props.email);
    
    useEffect(() => {
        setIsMounted(true);
        return () => {setIsMounted(false)}
    }, []);

    const handleEmail = (e) => {
        if (isMounted){
        setValueInputEmail(e.target.value);
        setStateErrorEmail(false);
        sethelperTextEmail(''); 
        } 
    }  

    const handleKey = (e) => {
        if (e.key === 'Enter') {
            e.target.blur();
            props.onGetEnter(true);
        }
    }

    useEffect(() => {
        if(props.close){
            if (isMounted){
            setValueInputEmail('');
            setStateErrorEmail(false);          
            sethelperTextEmail('');
            }
        }
        if (props.verify){
            if (valueInputEmail !== undefined){ 
                const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
                if (emailRegex.test(valueInputEmail)) {
                    if (isMounted)
                    setStateErrorEmail(false);          
                    props.onGetValueEmail(valueInputEmail.toLowerCase());
                } else {
                    if (String(valueInputEmail).length === 0){
                        if (isMounted)
                        sethelperTextEmail('Debes ingresar un correo electrónico');
                    }else{
                        if (isMounted)
                        sethelperTextEmail('El formato de email ingresado es incorrecto');
                    }
                    if (isMounted)
                    setStateErrorEmail(true);
                    props.onGetValueEmail('');
                }
            }else{
                if (isMounted){
                sethelperTextEmail('Debes ingresar un correo electrónico');
                setStateErrorEmail(true);
                }
                props.onGetValueEmail('');
            }
            props.onSubmitValueEmail(false);
        }        
    },[props, valueInputEmail, isMounted]);
    
    return (
        <div style={props.style}>
            <TextField 
                disabled={props.disabled} 
                error={stateErrorEmail}
                helperText={helperTextEmail}
                value={valueInputEmail}
                onChange={handleEmail} 
                required={true} 
                label="Correo electrónico" 
                variant="outlined" 
                style={{
                    width: '100%',
                }}
                autoComplete="new-password"
                onKeyDown={e => handleKey(e) }
            />
        </div>
    )
}

export default InputEmail
