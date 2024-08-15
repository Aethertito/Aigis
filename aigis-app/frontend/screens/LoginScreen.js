import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, Pressable, Image } from 'react-native';
import axios from 'axios';
import IP from '../IP';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

        // Guardar el id del usuario en asyncStorage
        await AsyncStorage.setItem('userId', user._id);
        await AsyncStorage.setItem('userName', user.nombre);
        await AsyncStorage.setItem('userEmail', user.correo);

        // Obtener el id y mandarlo por consola
        const userId = await AsyncStorage.getItem('userId');
        console.log('ESTE ES UNA PRUBEA DE ASYNCSTORAGE: ', userId);

        Alert.alert('Welcome', `${user.nombre}`);

        // Redirect based on user role
        if (userRole === 'administrator') {
          navigation.navigate('AdminStack');
        } else if (userRole === 'user' && user.memActiva) {
          navigation.navigate('UserStack');
        } else {
          navigation.navigate('Options');
        }
      } else {
        console.log('Error in login');
        setErrorMessage('Error in login');
        Alert.alert('Login Failed', 'Incorrect email or password');
      }
    } catch (error) {
      // Handle errors
      console.log('Error logging in:', error);
      const message = error.response?.data?.message || 'Error logging in';
      setErrorMessage(message);
      Alert.alert('Login Failed', message);
    }
  };

  const handleEmailChange = (text) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (text.length <= 50 && emailPattern.test(text)) {
      setEmail(text);
    } else if (text.length <= 50) {
      setEmail(text);
    }
  };

  const handlePasswordChange = (text) => {
    if (text.length <= 25) {
      setPassword(text);
    }
  };

  return (
    <View style={styles.overlay}>
        <Image 
          source={require('../assets/LOGO-AIGISV2.png')} 
          style={styles.image}
        />
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.nameField}>Email</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#F4F6FC"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={handleEmailChange}
        maxLength={50}
      />
      <Text style={styles.nameField}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholderTextColor="#F4F6FC"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={handlePasswordChange}
          maxLength={40}
        />
        <Pressable 
          style={styles.eyeIconContainer} 
          onPress={() => setShowPassword(!showPassword)}
        >
          <Icon 
            name={showPassword ? "visibility" : "visibility-off"} 
            size={24} 
            color="#E53935"
          />
        </Pressable>
      </View>
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
    fontWeight: 'bold',
    marginBottom: 2
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
  image: {
    top: 10,
    width: 220,
    height: 220,
    right: 14
  },
  input: {
    width: '100%',
    padding: 15,
    color: '#F4F6FC',
    borderColor: '#E53935',
    borderWidth: 1,
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
    fontWeight: 'bold'
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
    fontWeight: 'bold'
  },
  errorText: {
    color: '#F4F6FC',
    backgroundColor: '#B71C1C',
    marginTop: 10,
    padding: 4,
    borderRadius: 4
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    borderColor: '#E53935',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#212121',
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    color: '#F4F6FC',
    backgroundColor: 'transparent',
  },
  eyeIconContainer: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen;
