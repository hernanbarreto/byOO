import React, { useState, useEffect }from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const options = ['Mujer', 'Hombre', 'Otra'];

function InputSex(props) {
    const [isMounted, setIsMounted] = useState(true);

    useEffect(() => {
        setIsMounted(true);
        return () => {setIsMounted(false)}
    }, []);
  
  
    const handleKey = (e) => {
        if (e.key === 'Enter') {
            e.target.blur();
            props.onGetEnter(true);
        }
    }

  const [value, setValue] = useState(()=>{
    if ((props.sex !== undefined) && (props.sex !== null)){
        return options.find(elements => elements === props.sex);
    }
    else
        return null;
});


const [stateError, setStateError] = useState(false);
const [helperText, sethelperText] = useState('');
const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if(props.close){
        if (isMounted){
        setInputValue('');
        setStateError(false);          
        sethelperText('');
        }
    }
    if (props.verify){
        if (inputValue !== ''){
            props.onGetValue(inputValue);
            sethelperText('');
            setStateError(false);
        }else{
            if (isMounted){
            sethelperText('Debes seleccionar un sexo');
            setStateError(true);
            }
            props.onGetValue('');
        }
        props.onSubmitValue(false);
    }        
},[props, inputValue, isMounted]);


  return (
    <div style={props.style}>
    {!props.close ?
      <Autocomplete
        disabled={props.disabled} 
        value={value}
        disableClearable={true}
        required={true}
        onKeyDown={e => handleKey(e) } 
        style={{ 
            width: '100%',
        }}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          sethelperText('');
          setStateError(false);
          setInputValue(newInputValue);
        }}
        id="controllable-sex"
        options={options}
        sx={{ width: 300 }}
        renderInput={(params) => 
            <TextField {...params}
                error={stateError}
                helperText={helperText}
                label="Sexo" 
            />
        }
      />
      :
      null
      }
    </div>
  );
}

export default InputSex