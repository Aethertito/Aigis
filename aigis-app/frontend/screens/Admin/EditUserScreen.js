import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import IP from '../../IP';  // Asegúrate de que IP esté configurado correctamente
import Icon from 'react-native-vector-icons/MaterialIcons';

const EditUserScreen = ({ route, navigation }) => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [rol, setRol] = useState('');
  const [giro, setGiro] = useState('');
  const [sensores, setSensores] = useState('');
  const [memActiva, setMemActiva] = useState('');
  const [loading, setLoading] = useState(false);
  const userId = route.params?.userId; // Obtener el ID del usuario desde los parámetros de la ruta

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const url = `http://${IP}:3000/usuario/${userId}`;
        const response = await axios.get(url);
        const user = response.data;
        setNombre(user.nombre || '');
        setCorreo(user.correo || '');
        setContrasena(user.contrasena || '');
        setDireccion(user.direccion || '');
        setTelefono(user.telefono || '');
        setRol(user.rol || '');
        setGiro(user.giro || '');
        setSensores(user.sensores || '');
        setMemActiva(user.memActiva || '');
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar la información del usuario');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const data = { correo, telefono };
      const url = `http://${IP}:3000/usuario/${userId}`;
      const response = await axios.put(url, data);
      if (response.status === 200) {
        Alert.alert('Éxito', 'Información actualizada correctamente');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la información del usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('ManageUser')} style={styles.iconContainer}>
                    <Icon name='arrow-back-ios' type='MaterialIcons' color='#E53935' size={24} />
                    <Text style={styles.iconText}>Back</Text>
                </TouchableOpacity>
    <Text style={styles.title}>Editar Usuario</Text>
    <Text style={styles.nameField}>Enterprise: </Text>
    <TextInput
        style={styles.input}
        placeholder="Enterprise"
        value={nombre}
        editable={false}
    />
    <Text style={styles.nameField}>Email: </Text>
    <TextInput
        style={styles.input}
        placeholder="Email"
        value={correo}
        onChangeText={setCorreo}
    />
    <Text style={styles.nameField}>Password: </Text>
    <TextInput
        style={styles.input}
        placeholder="Password"
        value={contrasena}
        editable={false}
    />
    <Text style={styles.nameField}>Role: </Text>
    <TextInput
        style={styles.input}
        placeholder="Role"
        value={rol}
        editable={false}
    />
    <Text style={styles.nameField}>Address: </Text>
    <TextInput
        style={styles.input}
        placeholder="Address"
        value={direccion}
    />
    <Text style={styles.nameField}>Phone Number: </Text>
    <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={telefono}
        keyboardType="numeric"
        onChangeText={setTelefono}
    />
    <Button
        title={loading ? "Saving" : "Save"}
        onPress={handleSave}
        disabled={loading}
        color="#E53935"
    />
    </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#424242',
        padding: 16,
    },
    nameField:{
        color: '#F4F6FC',
        left: '3%',
        alignSelf: 'flex-start',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        left: 10,
        top: 45,
    },
    iconText: {
        color: '#E53935',
        fontSize: 16,
        marginLeft: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#F4F6FC',
        textAlign: 'center',
    },
    input: {
        width: '100%',
        padding: 12,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#E53935',
        borderRadius: 5,
        backgroundColor: '#212121',
        color: '#F4F6FC',
    },
    });

export default EditUserScreen;
