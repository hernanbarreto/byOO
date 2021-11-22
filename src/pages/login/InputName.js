import React, { useState, useEffect }from 'react';
import TextField from '@mui/material/TextField';

//var regExpress=/[^a-zA-Z ]/g;
let regExpress=/[^a-zA-ZñÑáéíóúÁÉÍÓÚ\s]/g;
function InputName(props) {
    const [valueInputName, setValueInputName] = useState(props.name.replace(regExpress, ''));
    const [stateErrorName, setStateErrorName] = useState(false);
    const [valueInputLastName, setValueInputLastName] = useState(props.lastName.replace(regExpress, ''));
    const [stateErrorLastName, setStateErrorLastName] = useState(false);
    const [helperTextLastName, sethelperTextLastName] = useState('');

    const handleName = () => {
        setStateErrorName(false);
        setStateErrorLastName(false);
        sethelperTextLastName('');  
    }  

    const handleLastName = () => {
        setStateErrorName(false);
        setStateErrorLastName(false);
        sethelperTextLastName('');  
    }  

    useEffect(() => {
        if(props.close){
            setValueInputName('');
            setStateErrorName(false);          
            setValueInputLastName('');
            setStateErrorLastName(false);          
            sethelperTextLastName('');
        }
        if (props.verify){
            if (valueInputName !== undefined){
                if (valueInputLastName !== undefined){
                    if (valueInputName.length === 0){
                        if (valueInputLastName.length === 0){
                            setStateErrorName(true);
                            setStateErrorLastName(true);
                            sethelperTextLastName('Debés ingresar un nombre y apellido.') 
                            props.onGetValueName('');
                        }else{
                            setStateErrorName(true);
                            setStateErrorLastName(true);
                            sethelperTextLastName('Debés ingresar un nombre.') 
                            props.onGetValueName('');
                        }
                    }else{
                        setStateErrorName(false);
                        if (valueInputLastName.length ===0){
                            setStateErrorName(true);
                            setStateErrorLastName(true);
                            sethelperTextLastName('Debés ingresar un apellido.') 
                            props.onGetValueName('');
                        }else{
                            setStateErrorName(false);
                            setStateErrorLastName(false);
                            sethelperTextLastName('')
                            props.onGetValueName(String(valueInputName) + '/' + String(valueInputLastName));
                        }
                    }
                }else{
                    setStateErrorName(false);
                    setStateErrorLastName(true);
                    sethelperTextLastName('Debés ingresar un apellido.') 
                    props.onGetValueName('');
                }
            }else{
                if (valueInputLastName !== undefined){
                    setStateErrorName(true);
                    setStateErrorLastName(false);
                    sethelperTextLastName('Debés ingresar un nombre.') 
                    props.onGetValueName('');
                }else{
                    setStateErrorName(true);
                    setStateErrorLastName(true);
                    sethelperTextLastName('Debés ingresar un nombre y apellido.') 
                    props.onGetValueName('');
                }
            }
            props.onSubmitValueName(false);
        }          
    },[props, valueInputName, valueInputLastName]);

    const handleKey = (e) => {
        if (e.key === 'Enter') {
            e.target.blur();
            props.onGetEnter(true);
        }
    }   

    return (
        <div style={props.style}>
            <TextField 
                error={stateErrorName}
                onInput={e => setValueInputName(e.target.value.replace(regExpress, ''))}
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
                error={stateErrorLastName}
                helperText={helperTextLastName}
                onInput={e => setValueInputLastName(e.target.value.replace(regExpress, ''))}
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
