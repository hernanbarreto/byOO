import React, { useState, useEffect }from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';


function InputPassword(props) {

    const condicionPassw = 'La contraseña debe contener al menos 8 caracteres, un número y una mayúscula'
    const [stateErrorPassword, setStateErrorPassword] = useState(false);
    const [helperTextPassword, sethelperTextPassword] = useState('');
    const [valuePassword, setValuePassword] = useState(props.password);
    const [showPassword, setShowPassword] = useState(false);
    
    const handlerChangePassword = () => {
        setStateErrorPassword(false);
        sethelperTextPassword('');  
    }
    
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    
    useEffect(() => {
        if(props.close){
            setValuePassword('');
            setStateErrorPassword(false);          
            sethelperTextPassword('');
        }
        if (props.verify){
            if (valuePassword !== undefined){
                if ((valuePassword.length >= 8) && (valuePassword.replace(/[^ 0-9]/g, '')!== '') && (valuePassword.replace(/[^ A-Z]/g, '')!== '')){
                    setStateErrorPassword(false);          
                    props.onGetValuePassword(valuePassword);
                } else {
                    if (String(valuePassword).length === 0){
                        sethelperTextPassword('Debes ingresar una contraseña');
                    }else{
                        sethelperTextPassword(condicionPassw);
                    }
                    setStateErrorPassword(true);
                    props.onGetValuePassword('');
                }
            }else{
                sethelperTextPassword('Debes ingresar una contraseña');
                setStateErrorPassword(true);
                props.onGetValuePassword('');
            }
            props.onSubmitValuePassword(false);
        }         
    },[props, valuePassword]);  

    const handleKey = (e) => {
        if (e.key === 'Enter') {
            e.target.blur();
            props.onGetEnter(true);
        }
    }  

    return (
        <div style={props.style}>
            <TextField 
                error={stateErrorPassword}
                helperText={helperTextPassword}
                onChange={handlerChangePassword} 
                type={showPassword ? 'text' : 'password'}
                onInput={e => setValuePassword(e.target.value)}
                value={valuePassword}
                required={true} 
                label="Contraseña" 
                variant="outlined"
                InputProps={{
                    endAdornment:
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>,
                }}                                
                style={{
                    width: '100%',
                }}
                autoComplete="new-password"
                onKeyDown={e => handleKey(e) }    
            />            
        </div>
    )
}

export default InputPassword
