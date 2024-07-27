import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Switch, ScrollView } from 'react-native';
import axios from 'axios';
import IP from '../../IP.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccessControlScreen = ({ route }) => {
  const { packageId } = route.params;
  const [allowedEmployees, setAllowedEmployees] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);

  useEffect(() => {
    fetchAllowedEmployees();
    fetchAllEmployees();
  }, []);

  const fetchAllowedEmployees = async () => {
    try {
      const response = await axios.get(`http://${IP}:3000/paqueteComprado/${packageId}/empleados`);
      setAllowedEmployees(response.data.empleados || []);
    } catch (error) {
      console.error('Error fetching allowed employees:', error);
    }
  };

  const fetchAllEmployees = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await axios.get(`http://${IP}:3000/paqueteComprado/getAllEmpleados/${userId}`);
      setAllEmployees(response.data || []);
    } catch (error) {
      console.error('Error fetching all employees:', error);
    }
  };

  const toggleAccess = async (employeeId, currentAccess) => {
    try {
      if (currentAccess) {
        await axios.post(`http://${IP}:3000/paqueteComprado/quitar-acceso`, { employeeId, packageId });
      } else {
        await axios.post(`http://${IP}:3000/paqueteComprado/dar-acceso`, { employeeId, packageId });
      }
      fetchAllowedEmployees();
    } catch (error) {
      console.error('Error toggling access:', error);
    }
  };

  const renderEmployee = ({ item, hasAccess }) => (
    <View style={styles.employeeCard}>
      <Text style={styles.employeeName}>{item.nombre}</Text>
      <Text style={styles.employeeEmail}>{item.email}</Text>
      <Text style={styles.employeePhone}>{item.telefono}</Text>
      <Switch
        value={hasAccess}
        onValueChange={() => toggleAccess(item._id, hasAccess)}
        trackColor={{ false: '#767577', true: '#E53935' }}
        thumbColor={hasAccess ? '#E53935' : '#f4f3f4'}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Control de Acceso</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Empleados con Acceso</Text>
        <FlatList
          data={allowedEmployees}
          renderItem={({ item }) => renderEmployee({ item, hasAccess: true })}
          keyExtractor={item => item._id}
          ListEmptyComponent={<Text style={styles.emptyText}>No se encontraron empleados con acceso</Text>}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Todos los Empleados</Text>
        <FlatList
          data={allEmployees.filter(emp => !allowedEmployees.some(e => e._id === emp._id))}
          renderItem={({ item }) => renderEmployee({ item, hasAccess: false })}
          keyExtractor={item => item._id}
          ListEmptyComponent={<Text style={styles.emptyText}>No se encontraron empleados</Text>}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#2C2C2C',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#fff',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#E53935',
  },
  employeeCard: {
    backgroundColor: '#424242',
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    elevation: 3,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  employeeEmail: {
    fontSize: 14,
    color: '#aaa',
  },
  employeePhone: {
    fontSize: 14,
    color: '#aaa',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});

export default AccessControlScreen;
