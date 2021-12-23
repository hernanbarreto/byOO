import React, { useState, useEffect }from 'react';
import TextField from '@mui/material/TextField';

//var regExpress=/[^a-zA-Z ]/g;
let regExpress=/[^a-zA-ZñÑáéíóúÁÉÍÓÚ\s]/g;
function InputName(props) {
    const [isMounted, setIsMounted] = useState(true);
    const [valueInputName, setValueInputName] = useState(props.name.replace(regExpress, ''));
    const [stateErrorName, setStateErrorName] = useState(false);
    const [valueInputLastName, setValueInputLastName] = useState(props.lastName.replace(regExpress, ''));
    const [stateErrorLastName, setStateErrorLastName] = useState(false);
    const [helperTextLastName, sethelperTextLastName] = useState('');

    useEffect(() => {
        setIsMounted(true);
        return () => {setIsMounted(false)}
    }, []);

    const handleName = (e) => {
        if (isMounted){
        setValueInputName(e.target.value.replace(regExpress, ''));
        setStateErrorName(false);
        setStateErrorLastName(false);
        sethelperTextLastName('');  
        }
    }  

    const handleLastName = (e) => {
        if (isMounted){
        setValueInputLastName(e.target.value.replace(regExpress, ''));
        setStateErrorName(false);
        setStateErrorLastName(false);
        sethelperTextLastName('');  
        }
    }  

    useEffect(() => {
        if(props.close){
            if (isMounted){
            setValueInputName('');
            setStateErrorName(false);          
            setValueInputLastName('');
            setStateErrorLastName(false);          
            sethelperTextLastName('');
            }
        }
        if (props.verify){
            if (valueInputName !== undefined){
                if (valueInputLastName !== undefined){
                    if (valueInputName.length === 0){
                        if (valueInputLastName.length === 0){
                            if (isMounted){
                            setStateErrorName(true);
                            setStateErrorLastName(true);
                            sethelperTextLastName('Debés ingresar un nombre y apellido.') 
                            }
                            props.onGetValueName('');
                        }else{
                            if (isMounted){
                            setStateErrorName(true);
                            setStateErrorLastName(true);
                            sethelperTextLastName('Debés ingresar un nombre.') 
                            }
                            props.onGetValueName('');
                        }
                    }else{
                        if (isMounted)
                        setStateErrorName(false);
                        if (valueInputLastName.length ===0){
                            if (isMounted){
                            setStateErrorName(true);
                            setStateErrorLastName(true);
                            sethelperTextLastName('Debés ingresar un apellido.') 
                            }
                            props.onGetValueName('');
                        }else{
                            if (isMounted){
                            setStateErrorName(false);
                            setStateErrorLastName(false);
                            sethelperTextLastName('')
                            }
                            props.onGetValueName(String(valueInputName) + '/' + String(valueInputLastName));
                        }
                    }
                }else{
                    if (isMounted){
                    setStateErrorName(false);
                    setStateErrorLastName(true);
                    sethelperTextLastName('Debés ingresar un apellido.') 
                    }
                    props.onGetValueName('');
                }
            }else{
                if (valueInputLastName !== undefined){
                    if (isMounted){
                    setStateErrorName(true);
                    setStateErrorLastName(false);
                    sethelperTextLastName('Debés ingresar un nombre.') 
                    }
                    props.onGetValueName('');
                }else{
                    if (isMounted){
                    setStateErrorName(true);
                    setStateErrorLastName(true);
                    sethelperTextLastName('Debés ingresar un nombre y apellido.') 
                    }
                    props.onGetValueName('');
                }
            }
            props.onSubmitValueName(false);
        }          
    },[props, valueInputName, valueInputLastName, isMounted]);

    const handleKey = (e) => {
        if (e.key === 'Enter') {
            e.target.blur();
            props.onGetEnter(true);
        }
    }   

    return (
        <div style={props.style}>
            <TextField
                disabled={props.disabled} 
                error={stateErrorName}
                value={valueInputName}
                onChange={handleName} 
                required={true} 
                label="Nombre" 
                variant="outlined" 
                style={{
                    width: '100%',
                }}
                autoComplete="new-password"
                onKeyDown={e => handleKey(e) }
                inputProps={{ maxLength: 20 }}    
            />
            <TextField 
                disabled={props.disabled} 
                error={stateErrorLastName}
                helperText={helperTextLastName}
                value={valueInputLastName}
                onChange={handleLastName} 
                required={true} 
                label="Apellido" 
                variant="outlined" 
                style={{
                    width: '100%',
                    marginTop: 6,
                }}
                autoComplete="new-password"
                onKeyDown={e => handleKey(e) }    
                inputProps={{ maxLength: 20 }}    
            />            
        </div>
    )
}

export default InputName
