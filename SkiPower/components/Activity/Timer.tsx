// React
import React, { useRef, useState } from 'react';

// React-Native
import {
StyleSheet,
View,
Text,
TouchableOpacity,
} from 'react-native';

const Timer = () => {

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const countRef = useRef(null);

  const recordActivity = () => {
    if(!isRecording) {
      setIsRecording(true);
      // Start Timer
      countRef.current = setInterval(() => {
        setTimer((time) => time + 1);
      }, 1000);
    } else {
      setIsRecording(false)
      // Stop Timer
      clearInterval(countRef.current);
    }
  }

  const formatTime = () => {
    const getSeconds: string = `0${(timer % 60)}`.slice(-2)
    const minutes: number = Math.floor(timer / 60)
    const getMinutes: string = `0${minutes % 60}`.slice(-2)
    const getHours: string = `0${Math.floor(timer / 3600)}`.slice(-2)

    return `${getHours} : ${getMinutes} : ${getSeconds}`
  }

  return (
    <View style={styles.view}>
      <Text style={styles.timer}>{formatTime()}</Text>
      <TouchableOpacity
        onPress={() => recordActivity()}
        style={styles.recordButton}>
        <Text>{isRecording ? 'Stop' : 'Record'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  timer: {
    fontSize: 32,
  },
  recordButton: {
    width: 75,
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: 'orange',
    position: 'absolute',
    bottom: 32,
  },
});

export default Timer;
 