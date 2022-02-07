// React
import React from 'react';

// React-Native
import {
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import { Text } from 'react-native-elements';

// Components
import {
  LineChart,
} from "react-native-chart-kit";

// Models
import { Activity } from '../../models/Activity';

// Hooks
import { useActivityDetails } from './useActivityDetail.hooks';

export interface GraphProps {
  activity: Activity;
  route?: any;
  navigation?: any;
  data: any;
  isFetching: boolean;
  dataType: "LOADCELL" | "PHONEGPS" | "IMU";
  title: string;
  yAxisSuffix: string;
}

const LineGraph = (props: GraphProps) => {

  const {dataArray, xLabel} = useActivityDetails(props)
  
  return (
    <View>
      { dataArray.length > 0 ?
        <View style={styles.view}>
          <Text style={styles.textName}>{props.title}</Text>
          <LineChart
            data={{
              labels: xLabel,
              datasets: [
                {
                  data: dataArray
                }
              ]
            }}
            width={Dimensions.get('window').width * 0.87} // from react-native
            height={220}
            yAxisSuffix={props.yAxisSuffix}
            yAxisInterval={1} // optional, defaults to 1
            withVerticalLines={false}
            chartConfig={{
              backgroundColor: "#FFFFFF",
              backgroundGradientFrom: "#FFFFFF",
              backgroundGradientTo: "#FFFFFF",
              decimalPlaces: 1, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(0, 110, 199, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "3",
              }
            }}
            bezier
            style={{
              padding: 8,
              borderWidth: 1,
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        </View>
      : null}
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
  },
  titleView: {
    position: 'absolute',
    top: 16,
    left: 16, 
  },
  textName: {
    fontSize: 24,
    fontFamily: 'Arial Rounded MT Bold',
    marginTop: 16,
  },
});

export default LineGraph;
 