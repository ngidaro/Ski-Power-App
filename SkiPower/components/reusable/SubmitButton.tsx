// React
import React from 'react';

// React-Native
import {
StyleSheet,
Text,
Pressable,
} from 'react-native';

interface SubmitButtonProps {
  text: string,
  buttonClicked: () => void,
}

const SubmitButton = ({ text, buttonClicked }: SubmitButtonProps) => {
  return (
    <Pressable 
      style={styles.buttonContainer}
      onPress={buttonClicked}>
      <Text style={styles.buttonText}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: 250,
    height: 40,
    padding: 8,
    margin: 4,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SubmitButton;
 