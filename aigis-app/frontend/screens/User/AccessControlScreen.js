import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import IP from '../../IP.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccessControlScreen = ({ route }) => {
  const { packageId } = route.params;
  const [allowedEmployees, setAllowedEmployees] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [showAllEmployees, setShowAllEmployees] = useState(false);

  useEffect(() => {
    fetchAllowedEmployees();
    fetchAllEmployees();
  }, []);

  const fetchAllowedEmployees = async () => {
    try {
      const response = await axios.get(`http://${IP}:3000/paqueteComprado/${packageId}/empleadosConAcceso`);
      setAllowedEmployees(response.data);
    } catch (error) {
      console.error('Error fetching allowed employees:', error);
    }
  };

  const fetchAllEmployees = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await axios.get(`http://${IP}:3000/paqueteComprado/${userId}/${packageId}/empleadosSinAcceso`);
      setAllEmployees(response.data);
    } catch (error) {
      console.error('Error fetching all employees:', error);
    }
  };

  const toggleAccess = async (employeeId, currentAccess) => {
    try {
      if (currentAccess) {
        await axios.post(`http://${IP}:3000/paqueteComprado/quitar-acceso`, { employeeId, packageId });
        setAllowedEmployees(prev => prev.filter(emp => emp._id !== employeeId));
        const movedEmployee = allowedEmployees.find(emp => emp._id === employeeId);
        setAllEmployees(prev => [...prev, movedEmployee]);
      } else {
        await axios.post(`http://${IP}:3000/paqueteComprado/dar-acceso`, { employeeId, packageId });
        setAllEmployees(prev => prev.filter(emp => emp._id !== employeeId));
        const movedEmployee = allEmployees.find(emp => emp._id === employeeId);
        setAllowedEmployees(prev => [...prev, movedEmployee]);
      }
    } catch (error) {
      console.error('Error toggling access:', error);
    }
  };

  const renderEmployee = ({ item, hasAccess }) => (
    <View style={styles.employeeCard}>
      <Text style={styles.employeeName}>{item.nombre}</Text>
      <Text style={styles.employeeEmail}>{item.email}</Text>
      <Text style={styles.employeePhone}>{item.telefono}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => toggleAccess(item._id, hasAccess)}
      >
        <Text style={styles.buttonText}>{hasAccess ? 'Quitar Acceso' : 'Dar Acceso'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Control de Acceso</Text>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setShowAllEmployees(!showAllEmployees)}
      >
        <Text style={styles.toggleButtonText}>
          {showAllEmployees ? 'Ver Empleados con Acceso' : 'Ver Empleados Sin Acceso'}
        </Text>
      </TouchableOpacity>
      <FlatList
        data={showAllEmployees ? allEmployees : allowedEmployees}
        renderItem={({ item }) => renderEmployee({ item, hasAccess: !showAllEmployees })}
        keyExtractor={item => item._id}
        ListEmptyComponent={<Text style={styles.emptyText}>No se encontraron empleados</Text>}
      />
    </View>
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
  toggleButton: {
    backgroundColor: '#E53935',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
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
  button: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#E53935',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});

export default AccessControlScreen;
