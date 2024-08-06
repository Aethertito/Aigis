import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const SmokeGrafica = ({ weeklySmokeData }) => {
return (
    <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Weekly Max Smoke Concentration</Text>
        <PieChart
            data={weeklySmokeData}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={{
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            accessor="maxSmoke"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
        />
    </View>
    );
};

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: '#212121',
    borderRadius: 16,
    padding: 6,
    marginBottom: 20,
    overflow: 'hidden',
  },
  chartTitle: {
    color: '#E53935',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default SmokeGrafica;
