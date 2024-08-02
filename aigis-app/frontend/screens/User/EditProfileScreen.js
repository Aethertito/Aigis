import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, ScrollView, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP from '../../IP';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

const EditProfileScreen = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [membresia, setMembresia] = useState(null);
  const [paquetes, setPaquetes] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');

  const fetchData = async () => {
    const userId = await AsyncStorage.getItem('userId');
    const url = `http://${IP}:3000/usuario/${userId}`;
    try {
      const response = await axios.get(url);
      const user = response.data;
      setNombre(user.nombre);
      setCorreo(user.correo);
      setContrasena(user.contrasena);
      setDireccion(user.direccion);
      setTelefono(user.telefono);
      setMembresia({
        cantidad: user.memCantidad,
        periodo: user.memPeriodo,
        descripcion: user.memDescripcion,
        fechaInicio: user.memFechaInicio,
        fechaFin: user.memFechaFin
      });
      console.log(user);
    } catch (error) {
      console.log('error en el fetch', error);
    }
  };

  const fetchPaquetes = async () => {
    const userId = await AsyncStorage.getItem('userId');
    const url = `http://${IP}:3000/paqueteComprado/usuario/${userId}`;
    try {
      const response = await axios.get(url);
      setPaquetes(response.data.paquetesComprados);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchPaquetes();
  }, [refresh]);

  const handleSave = async (field, value) => {
    const userId = await AsyncStorage.getItem('userId');
    
    let data = { nombre, correo, contrasena, direccion, telefono };
    if (field && value) {
      data[field] = value;
    }
  
    const url = `http://${IP}:3000/usuario/${userId}`;
  
    try {
      console.log("Enviando datos para actualizar:", data);
  
      const response = await axios.put(url, data);
      if (response.status === 200) {
        Alert.alert('Edit profile', 'Changes saved');
        setRefresh(!refresh);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Could not update profile');
    }
  };

  const calculateDaysLeft = (fechaFin) => {
    const endDate = new Date(fechaFin);
    const currentDate = new Date();
    const diffTime = endDate - currentDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const groupedPackages = paquetes.reduce((acc, paquete) => {
    const found = acc.find(p => p.paquete === paquete.paquete);
    if (found) {
      found.cantidad += 1;
    } else {
      acc.push({ paquete: paquete.paquete, cantidad: 1 });
    }
    return acc;
  }, []);

  const handleEdit = (field, value) => {
    setEditField(field);
    setEditValue(value);
    setModalVisible(true);
  };

  const saveEdit = () => {
    switch (editField) {
      case 'correo':
        setCorreo(editValue);
        break;
      case 'contrasena':
        setContrasena(editValue);
        break;
      case 'telefono':
        setTelefono(editValue);
        break;
      default:
        break;
    }
    setModalVisible(false);
    handleSave(editField, editValue);
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>General Information</Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Company:</Text>
            <Text style={styles.tableCellValue}>{nombre}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Email:</Text>
            <View style={styles.tableCellEditable}>
              <Text style={styles.tableCellValue}>{correo}</Text>
              <Pressable onPress={() => handleEdit('correo', correo)}>
                <Icon name="edit" size={24} color="#E53935" />
              </Pressable>
            </View>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Password:</Text>
            <View style={styles.tableCellEditable}>
              <Text style={styles.tableCellValue}>******</Text>
              <Pressable onPress={() => handleEdit('contrasena', contrasena)}>
                <Icon name="edit" size={24} color="#E53935" />
              </Pressable>
            </View>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Address:</Text>
            <Text style={styles.tableCellValue}>{direccion}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Phone:</Text>
            <View style={styles.tableCellEditable}>
              <Text style={styles.tableCellValue}>{telefono}</Text>
              <Pressable onPress={() => handleEdit('telefono', telefono)}>
                <Icon name="edit" size={24} color="#E53935" />
              </Pressable>
            </View>
          </View>
        </View>

        <Text style={styles.title2}>Membership Information</Text>
        {membresia && (
          <View style={styles.infoContainer}>
            <Text style={styles.sectionContent}>{membresia.descripcion}</Text>
            <Text style={styles.sectionContent}>Start Date: <Text style={styles.redText}>{new Date(membresia.fechaInicio).toLocaleDateString()}</Text></Text>
            <Text style={styles.sectionContent}>End Date: <Text style={styles.redText}>{new Date(membresia.fechaFin).toLocaleDateString()}</Text></Text>
            <Text style={styles.sectionContent}>Days Left: <Text style={styles.redText}>{calculateDaysLeft(membresia.fechaFin)}</Text></Text>
          </View>
        )}

        <Text style={styles.title2}>Packages Information</Text>
        {groupedPackages.length > 0 && (
          <View style={styles.infoContainer}>
            {groupedPackages.map((paquete, index) => (
              <Text key={index} style={styles.sectionContent}>{paquete.paquete} x{paquete.cantidad}</Text>
            ))}
          </View>
        )}
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit {editField}</Text>
            <TextInput
              style={styles.modalInput}
              value={editValue}
              onChangeText={setEditValue}
            />
            <Pressable style={styles.modalButton} onPress={saveEdit}>
              <Text style={styles.modalButtonText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: '#424242',
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F4F6FC',
    marginBottom: 20,
  },
  title2: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F4F6FC',
    marginVertical: 10,
  },
  table: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#212121',
    padding: 20,
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#424242',
  },
  tableCellLabel: {
    color: '#F4F6FC',
    fontSize: 16,
    flex: 1,
  },
  tableCellValue: {
    color: '#F4F6FC',
    fontSize: 16,
    flex: 2,
  },
  tableCellEditable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
  },
  infoContainer: {
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    backgroundColor: '#212121',
  },
  sectionContent: {
    color: '#F4F6FC',
    fontSize: 16,
    marginBottom: 10,
  },
  redText: {
    color: '#E53935',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#212121',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F4F6FC',
    marginBottom: 20,
  },
  modalInput: {
    borderColor: '#E53935',
    borderWidth: 2,
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
    color: '#F4F6FC',
    backgroundColor: '#424242',
  },
  modalButton: {
    backgroundColor: '#E53935',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#F4F6FC',
    fontSize: 16,
  },
});

export default EditProfileScreen;
