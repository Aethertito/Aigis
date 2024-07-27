import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import axios from 'axios';
import IP from '../../IP';
import Icon from 'react-native-vector-icons/MaterialIcons';

const EditUserScreen = ({ route, navigation }) => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [rol, setRol] = useState('');
  const [loading, setLoading] = useState(false);
  const userId = route.params?.userId;
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const url = `http://${IP}:3000/usuario/${userId}`;
        const response = await axios.get(url);
        const user = response.data;
        setNombre(user.nombre || '');
        setCorreo(user.correo || '');
        setDireccion(user.direccion || '');
        setTelefono(user.telefono || '');
        setRol(user.rol || '');
      } catch (error) {
        Alert.alert('Error', 'User information could not be loaded');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSave = async () => {
    if (!correo || !telefono) {
      Alert.alert('Error', 'Email and telephone fields are required.');
      return;
    }

    setLoading(true);
    try {
      const data = { correo, telefono, direccion };
      const url = `http://${IP}:3000/usuario/${userId}`;
      const response = await axios.put(url, data);
      if (response.status === 200) {
        Alert.alert('Success', 'Information correctly updated');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', 'Could not update user information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
        <Icon name='arrow-back-ios' type='MaterialIcons' color='#E53935' size={24} />
        <Text style={styles.iconText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Edit Company</Text>
      <Text style={styles.nameField}>Enterprise: </Text>
      <TextInput
        style={styles.input}
        placeholder="Enterprise"
        value={nombre}
      />
      <Text style={styles.nameField}>Email: </Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
      />
      <Text style={styles.nameField}>Role: </Text>
      <TextInput
        style={styles.input}
        placeholder="Role"
        value={rol}
      />
      <Text style={styles.nameField}>Address: </Text>
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={direccion}
        onChangeText={setDireccion}
      />
      <Text style={styles.nameField}>Phone Number: </Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={telefono}
        keyboardType="phone-pad"
        onChangeText={setTelefono}
      />
      <Button
        title={loading ? "Saving..." : "Save"}
        onPress={handleSave}
        disabled={loading}
        color="#E53935"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#424242',
    padding: 16,
  },
  nameField: {
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E53935',
    borderRadius: 5,
    backgroundColor: '#212121',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    color: '#F4F6FC',
    backgroundColor: 'transparent',
  },
  eyeIconContainer: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditUserScreen;
