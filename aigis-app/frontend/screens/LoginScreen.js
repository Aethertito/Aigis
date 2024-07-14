import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import IP from '../IP';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      // URL for your login API
      const url = `http://${IP}:3000/usuario/login`;

      // User credentials data
      const data = {
        correo: email,
        contrasena: password
      };

      // Make POST request
      const response = await axios.post(url, data);
      console.log('Server response:', response.data);

      // Handle response
      if (response.status === 200) {
        console.log('Login successful');

        // Check user role
        const user = response.data.user;
        const userRole = user.rol;

        // Save user id in AsyncStorage
        await AsyncStorage.setItem('userId', user._id)

        // Get id and log it to console
        const userId = await AsyncStorage.getItem('userId')
        console.log('THIS IS A TEST OF ASYNCSTORAGE: ', userId)

        Alert.alert('Welcome', `${user.nombre}`);

        // Redirect based on user role
        if (userRole === 'administrador') {
          navigation.navigate('AdminStack');
        } else if (userRole === 'usuario' && !user.membresia) {
          navigation.navigate('Paquetes');
        } else {
          navigation.navigate('UserStack');
        }
      } else {
        console.log('Error in login');
        setErrorMessage('Error in login');
      }
    } catch (error) {
      // Handle errors
      console.log('Error logging in:', error);
      setErrorMessage(error.response?.data?.message || 'Error logging in');
    }
  };

  return (
    <View style={styles.overlay}>
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.nameField}>Email</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#F4F6FC"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <Text style={styles.nameField}>Password</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#F4F6FC"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <View style={styles.linksContainer}>
        <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.linkText}>Don't have an account? Sign Up now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Welcome')}>
          <Text style={styles.linkText}>Back to menu</Text>
        </TouchableOpacity>
      </View>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  nameField:{
    color: '#F4F6FC',
    left: '3%',
    alignSelf: 'flex-start',
  },
  overlay: {
    width: '100%',
    height: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#424242',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F4F6FC',
    marginBottom: 20,
    
  },
  input: {
    width: '100%',
    padding: 15,
    color: '#F4F6FC',
    borderColor: '#E53935',
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: '#212121',
  },
  loginButton: {
    backgroundColor: '#E53935',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#F4F6FC',
    fontSize: 16,
  },
  linksContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  link: {
    marginBottom: 10,
  },
  linkText: {
    color: '#E53935',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: '#F4F6FC',
    backgroundColor: '#B71C1C',
    marginTop: 10,
    padding: 4,
    borderRadius: 4
  },
});

export default LoginScreen;
