import React from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../assets/system.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.content}>
        <Image 
          source={require('../assets/LOGO-Completo.png')} 
          style={styles.image}
        />
        <Text style={styles.title}>Welcome!</Text>
        <View style={styles.buttonContainer}>
          <Pressable 
            style={({ pressed }) => [
              styles.button,
              styles.loginButton,
              pressed ? styles.buttonPressed : null
            ]} 
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </Pressable>
          <Pressable 
            style={({ pressed }) => [
              styles.button,
              styles.signupButton,
              pressed ? styles.buttonPressed : null
            ]} 
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    marginTop: '-30%', 
  },
  image: {
    top: 2,
    width: 350,
    height: 350,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F4F6FC',
    marginBottom: '5%', 
    fontFamily: 'Roboto',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20, 
  },
  button: {
    backgroundColor: '#E53935',
    borderRadius: 5,
    width: '45%', 
    alignItems: 'center',
    paddingVertical: 15,
  },
  buttonText: {
    color: '#F4F6FC',
    fontSize: 18,
    fontWeight: 'bold'
  },
  loginButton: {
    marginBottom: 10,
  },
  signupButton: {
    marginBottom: 10,
  },
  buttonPressed: {
    backgroundColor: '#C62828',
  },
});

export default WelcomeScreen;
