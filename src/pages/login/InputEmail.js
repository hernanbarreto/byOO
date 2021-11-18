import React, { useState, useEffect }from 'react';
import TextField from '@mui/material/TextField';

function InputEmail(props) {
    const [stateErrorEmail, setStateErrorEmail] = useState(false);
    const [helperTextEmail, sethelperTextEmail] = useState('');
    const [valueInputEmail, setValueInputEmail] = useState(props.email);
    
    const handleEmail = () => {
        setStateErrorEmail(false);
        sethelperTextEmail('');  
    }  

    const handleKey = (e) => {
        if (e.key === 'Enter') {
            e.target.blur();
            props.onGetEnter(true);
        }
    }

    useEffect(() => {
        if(props.close){
            setValueInputEmail('');
            setStateErrorEmail(false);          
            sethelperTextEmail('');
        }
        if (props.verify){
            if (valueInputEmail !== undefined){ 
                const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
                if (emailRegex.test(valueInputEmail)) {
                    setStateErrorEmail(false);          
                    props.onGetValueEmail(valueInputEmail.toLowerCase());
                } else {
                    if (String(valueInputEmail).length === 0){
                        sethelperTextEmail('Debes ingresar un correo electrónico');
                    }else{
                        sethelperTextEmail('El formato de email ingresado es incorrecto');
                    }
                    setStateErrorEmail(true);
                    props.onGetValueEmail('');
                }
            }else{
                sethelperTextEmail('Debes ingresar un correo electrónico');
                setStateErrorEmail(true);
                props.onGetValueEmail('');
            }
            props.onSubmitValueEmail(false);
        }
    },[props, valueInputEmail]);
    
    return (
        <div style={props.style}>
            <TextField 
                error={stateErrorEmail}
                helperText={helperTextEmail}
                onInput={e => setValueInputEmail(e.target.value)}
                onChange={handleEmail} 
                value={valueInputEmail}
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
