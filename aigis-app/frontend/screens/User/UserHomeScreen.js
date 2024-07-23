import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Asegúrate de tener esta librería instalada

const UserHomeScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.date}>23°C</Text>
          <Text style={styles.date}>18 Jan 2018</Text>
        </View>
        <View style={styles.headerRight}>
          <Icon name="bell" size={24} color="#fff" />
          <Icon name="user-circle" size={30} color="#fff" style={styles.userIcon} />
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Electricity Usage</Text>
        <LineChart
          data={{
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [
              {
                data: [20, 45, 28, 80, 99, 43, 65, 55, 80, 77, 66, 90],
              },
            ],
          }}
          width={Dimensions.get('window').width - 40}
          height={220}
          yAxisLabel=""
          yAxisSuffix="kWh"
          chartConfig={{
            backgroundColor: '#1f212b',
            backgroundGradientFrom: '#1f212b',
            backgroundGradientTo: '#1f212b',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          style={styles.chart}
        />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Icon name="bolt" size={24} color="#fff" />
          <Text style={styles.statValue}>174 MW</Text>
          <Text style={styles.statLabel}>Electricity</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="tint" size={24} color="#fff" />
          <Text style={styles.statValue}>216 Units</Text>
          <Text style={styles.statLabel}>Water</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="wifi" size={24} color="#fff" />
          <Text style={styles.statValue}>5 Users</Text>
          <Text style={styles.statLabel}>WiFi</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="video" size={24} color="#fff" />
          <Text style={styles.statValue}>12 Active</Text>
          <Text style={styles.statLabel}>Cameras</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.packageButton} onPress={() => navigation.navigate('Paquetes')}>
        <Text style={styles.buttonText}>View Packages</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#1f212b',
    padding: 20,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    justifyContent: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  userIcon: {
    marginLeft: 15,
  },
  chartContainer: {
    backgroundColor: '#292b36',
    borderRadius: 16,
    padding: 10,
    marginBottom: 20,
  },
  chartTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  chart: {
    borderRadius: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#292b36',
    borderRadius: 16,
    width: '48%',
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    color: '#fff',
    fontSize: 24,
    marginVertical: 10,
  },
  statLabel: {
    color: '#fff',
    fontSize: 16,
  },
  packageButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default UserHomeScreen;
