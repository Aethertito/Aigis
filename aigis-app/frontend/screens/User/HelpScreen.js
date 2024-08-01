import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import IP from '../../IP';

const HelpScreen = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [titulo, setTitulo] = useState('');
  const [problema, setProblema] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        try {
          const response = await axios.get(`http://${IP}:3000/usuario/${userId}`);
          const user = response.data;
          setNombre(user.nombre);
          setCorreo(user.correo);
          setTelefono(user.telefono);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleSend = async () => {
    try {
      const data = { correo, titulo, problema, telefono, usuario_id: await AsyncStorage.getItem('userId') };
      const response = await axios.post(`http://${IP}:3000/usuario/help`, data);
      if (response.status === 200) {
        Alert.alert('Success', 'Support request sent successfully');
        setTitulo('');
        setProblema('');
      }
    } catch (error) {
      console.error('Error sending support request:', error);
      Alert.alert('Error', 'Failed to send support request');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <Image source={require('../../assets/LOGO-Completo.png')} style={styles.logo} />
      <Text style={styles.title}>Tech Support</Text>
      <View style={styles.form}>
        <Text style={styles.label}>E-mail:</Text>
        <TextInput
          style={styles.input}
          value={correo}
          editable={false}
        />
        <Text style={styles.label}>Problem title:</Text>
        <TextInput
          style={styles.input}
          value={titulo}
          onChangeText={setTitulo}
        />
        <Text style={styles.label}>Problem description:</Text>
        <TextInput
          style={styles.textarea}
          placeholder="Describe your problem here"
          value={problema}
          onChangeText={setProblema}
          multiline={true}
        />
      </View>
      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Text style={styles.sendButtonText}>Send Email</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#424242',
    padding: 20,
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F4F6FC',
    marginBottom: 20,
  },
  form: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    color: '#F4F6FC',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    padding: 15,
    color: '#F4F6FC',
    borderColor: '#E53935',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#212121',
  },
  textarea: {
    width: '100%',
    height: 100,
    padding: 15,
    color: '#F4F6FC',
    borderColor: '#E53935',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#212121',
  },
  sendButton: {
    backgroundColor: '#E53935',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 5,
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 14,
    color: '#F4F6FC',
    marginBottom: 4,
  },
});

export default HelpScreen;
