// React
import React, { useRef } from 'react';

// React-Native
import {
StyleSheet,
View,
Text,
TouchableOpacity,
Alert,
} from 'react-native';
import { formatTime } from '../../reusable/formatTime';

interface TimerProps {
  isRecording: boolean;
  setIsRecording: () => void;
  timer: number;
  setTimer: (time: number) => void
}

const Timer = ({isRecording, setIsRecording, timer = 0, setTimer} : TimerProps) => {
  const countRef = useRef(null);

  const recordActivity = () => {
    if(!isRecording) {
      setIsRecording();
      // Start Timer
      countRef.current = setInterval(() => {
        setTimer((time) => time + 1);
      }, 1000);
    } else {
      // Alert the user for confirmation to stop and save workout
      Alert.alert(
        "Are you sure you want to end your workout?",
        "",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "End",
            onPress: () => {
              setIsRecording()
              // Stop Timer
              clearInterval(countRef.current);
            }
          }
        ]
      )
    }
  }

  return (
    <View style={styles.view}>
      <Text style={styles.timer}>{formatTime(timer)}</Text>
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
  },
  timer: {
    fontSize: 32,
    padding: 16,
  },
  recordButton: {
    width: 75,
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: '#ADD8E6',
  },
});

export default Timer;
 