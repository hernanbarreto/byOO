import React, { useState, useEffect }from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import esLocale from 'date-fns/locale/es';

function InputAge(props) {
    const [valueFechaNacimiento, setValueFechaNacimiento] = useState(props.edad);
    const [stateErrorFecha, setStateErrorFecha] = useState(false);
    const [helperTextFecha, sethelperTextFecha ] = useState('');

    useEffect(() => {
        if(props.close){
            setValueFechaNacimiento(null);
            setStateErrorFecha(false);          
            sethelperTextFecha('');
        }

        if (props.verify){
            if (valueFechaNacimiento !== undefined){
                if (valueFechaNacimiento !== null){
                    var cumple = new Date(valueFechaNacimiento);
                    if ((Date.now()-cumple.getTime()) >= (1000*60*60*24*365*18)){
                        props.onGetValueAge(cumple.getTime());
                    }else{
                        setStateErrorFecha(true);
                        sethelperTextFecha('Debes ser mayor de 18 años para registrarte en byOO');
                        props.onGetValueAge('');
                    }  
                }else{
                    //debe ingresar una fecha de nacimiento
                    setStateErrorFecha(true);
                    sethelperTextFecha('Debes ingresar una fecha de nacimiento');
                    props.onGetValueAge('');
                }
            }else{
                //debe ingresar una fecha de nacimiento
                setStateErrorFecha(true);
                sethelperTextFecha('Debes ingresar una fecha de nacimiento');
                props.onGetValueAge('');
            }
            props.onSubmitValueAge(false);
        }
    },[props, valueFechaNacimiento]);

    const handleKey = (e) => {
        if (e.key === 'Enter') {
            e.target.blur();
            props.onGetEnter(true);
        }
    }   

    return (
        <div style={props.style}>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
                <DatePicker
                    label="Fecha de nacimiento"
                    value={valueFechaNacimiento}
                    onChange={(newValue) => {
                            if (String(newValue).includes('Invalid Date')){
                                setValueFechaNacimiento(null);
                            }else{
                                setValueFechaNacimiento(newValue);
                                setStateErrorFecha(false);          
                                sethelperTextFecha(''); 
                            }
                    }}
                    maxDate={Date.now()}
                    renderInput={(params) => 
                        <TextField 
                            {...params} 
                            error={stateErrorFecha}
                            helperText={helperTextFecha}                        
                            style={{
                                width: '100%',
                            }}
                            autoComplete="new-password"
                            onKeyDown={e => handleKey(e) }    
                        />
                    }
                />
            </LocalizationProvider>            
        </div>
    )
}

export default InputAge
