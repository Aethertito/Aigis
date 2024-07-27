import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import IP from '../../IP';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MoreInformationScreen = ({ route, navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = route.params?.userId;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const url = `http://${IP}:3000/usuario/${userId}`;
        const response = await axios.get(url);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E53935" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Error loading user data</Text>
      </View>
    );
  }

  // Agrupar paquetes por nombre y sumar cantidades
  const paquetesAgrupados = userData.paqSelect.reduce((acc, paquete) => {
    const found = acc.find(item => item.paquete === paquete.paquete);
    if (found) {
      found.cantidad += paquete.cantidad;
    } else {
      acc.push({ paquete: paquete.paquete, cantidad: paquete.cantidad });
    }
    return acc;
  }, []);

  // Agrupar sensores por tipo y sumar cantidades
  const sensoresAgrupados = userData.sensores.reduce((acc, sensor) => {
    const found = acc.find(item => item.tipo === sensor.tipo);
    if (found) {
      found.cantidad += 1;
    } else {
      acc.push({ tipo: sensor.tipo, cantidad: 1 });
    }
    return acc;
  }, []);

  const hasMembership = userData.memActiva && userData.memActiva !== '';
  const hasPackages = paquetesAgrupados.length > 0;
  const hasSensors = sensoresAgrupados.length > 0;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
        <Icon name='arrow-back-ios' type='MaterialIcons' color='#E53935' size={24} />
        <Text style={styles.iconText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Company Information</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Company Data</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Name: <Text style={styles.value}>{userData.nombre}</Text></Text>
            <Text style={styles.label}>Email: <Text style={styles.value}>{userData.correo}</Text></Text>
            <Text style={styles.label}>Password: <Text style={styles.value}>{userData.contrasena}</Text></Text>
            <Text style={styles.label}>Role: <Text style={styles.value}>{userData.rol}</Text></Text>
            <Text style={styles.label}>Address: <Text style={styles.value}>{userData.direccion}</Text></Text>
            <Text style={styles.label}>Phone: <Text style={styles.value}>{userData.telefono}</Text></Text>
            <Text style={styles.label}>Business Type: <Text style={styles.value}>{userData.giro}</Text></Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Membership Info</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Membership Status: <Text style={styles.value}>{userData.memActiva ? 'Active' : 'Inactive'}</Text></Text>
            {hasMembership && (
              <>
                <Text style={styles.label}>Start Date: <Text style={styles.value}>{new Date(userData.memFechaInicio).toLocaleDateString()}</Text></Text>
                <Text style={styles.label}>End Date: <Text style={styles.value}>{new Date(userData.memFechaFin).toLocaleDateString()}</Text></Text>
                <Text style={styles.label}>Time Frame: <Text style={styles.value}>{userData.memCantidad} {userData.memPeriodo}</Text></Text>
                <Text style={styles.label}>Description: <Text style={styles.value}>{userData.memDescripcion}</Text></Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Company Packages</Text>
          <View style={styles.infoContainer}>
            {hasPackages ? (
              paquetesAgrupados.map((paquete, index) => (
                <View key={index} style={styles.packageContainer}>
                  <Text style={styles.packageLabel}>{paquete.paquete}: <Text style={styles.packageValue}>x{paquete.cantidad}</Text></Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No packages purchased</Text>
            )}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Sensors</Text>
          <View style={styles.infoContainer}>
            {hasSensors ? (
              sensoresAgrupados.map((sensor, index) => (
                <View key={index} style={styles.sensorContainer}>
                  <Text style={styles.sensorLabel}>{sensor.tipo}: <Text style={styles.sensorValue}>x{sensor.cantidad}</Text></Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No sensors purchased</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#424242',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#424242',
  },
  errorText: {
    color: '#F4F6FC',
    fontSize: 18,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    top: 25,
  },
  iconText: {
    color: '#E53935',
    fontSize: 16,
    marginLeft: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F4F6FC',
    marginBottom: 16,
    alignSelf: 'center',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F4F6FC',
    marginBottom: 10,
  },
  infoContainer: {
    backgroundColor: '#212121',
    padding: 16,
    borderRadius: 8,
    borderColor: '#E53935',
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
    color: '#F4F6FC',
    marginBottom: 10,
  },
  value: {
    fontWeight: 'bold',
    color: '#E53935',
  },
  packageContainer: {
    marginBottom: 10,
  },
  packageLabel: {
    fontSize: 16,
    color: '#F4F6FC',
  },
  packageValue: {
    fontWeight: 'bold',
    color: '#E53935',
  },
  sensorContainer: {
    marginBottom: 10,
  },
  sensorLabel: {
    fontSize: 16,
    color: '#F4F6FC',
  },
  sensorValue: {
    fontWeight: 'bold',
    color: '#E53935',
  },
  noDataText: {
    fontSize: 16,
    color: '#F4F6FC',
    fontStyle: 'italic',
  },
});

export default MoreInformationScreen;
