import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Animated,
} from "react-native";

interface FloatingTextFieldProps {
  fieldName: string;
  fieldValue: string | number;
  editable?: boolean
}

const FloatingTextField = ({ fieldName, fieldValue, editable = true}: FloatingTextFieldProps) => {
  const [value, setValue] = useState(fieldValue);
  const moveText = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (value !== "") {
        moveTextTop();
    } else if (value === "") {
        moveTextBottom();
    }
  }, [value])

  const onChangeText = (text: string) => {
    setValue(text);
  };

  const onFocusHandler = () => {
    if (value !== "") {
      moveTextTop();
    }
  };

  const onBlurHandler = () => {
    if (value === "") {
      moveTextBottom();
    }
  };

  const moveTextTop = () => {
    Animated.timing(moveText, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const moveTextBottom = () => {
    Animated.timing(moveText, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const yVal = moveText.interpolate({
    inputRange: [0, 1],
    outputRange: [4, -20],
  });

  const animStyle = {
    transform: [
      {
        translateY: yVal,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.animatedStyle, animStyle]}>
        <Text style={styles.label}>{fieldName}</Text>
      </Animated.View>
      <TextInput
        autoCapitalize={"none"}
        style={styles.input}
        value={value}
        onChangeText={(text: string) => onChangeText(text)}
        editable={editable}
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
        blurOnSubmit
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginTop: 20,
    backgroundColor: "#fff",
    paddingTop: 5,
    paddingHorizontal: 10,
    // borderWidth: 1,
    // borderRadius: 2,
    borderBottomWidth: 1,
    borderColor: "#bdbdbd",
    width: "100%",
    alignSelf: "center",
  },
  icon: {
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    fontSize: 18,
    height: 40,
    color: "#000",
  },
  label: {
    color: "grey",
    fontSize: 10,
  },
  animatedStyle: {
    top: 15,
    left: 15,
    position: 'absolute',
    borderRadius: 90,
    zIndex: 10000,
  },
});

export default FloatingTextField;