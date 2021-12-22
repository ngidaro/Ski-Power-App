// React
import React from 'react';

// React-Native
import {
StyleSheet,
TextInput,
} from 'react-native';

interface InputTextboxProps {
  value: string,
  placeholder: string,
  onChange: ((text: string) => void) | undefined,
}

const InputTextbox = ({ value, placeholder, onChange }: InputTextboxProps) => {
  return (
    <TextInput
        style={styles.input}
        onChangeText={onChange}
        value={value}
        placeholder={placeholder}/>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: 250,
    margin: 4,
    borderWidth: 0.5,
    padding: 8,
    borderRadius: 8,
  },
});

export default InputTextbox;
 