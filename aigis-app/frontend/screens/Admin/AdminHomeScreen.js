import React from 'react';
import { Image, View, Text, StyleSheet, Pressable } from 'react-native';

const AdminHomeScreen = ({ navigation }) => {

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome!</Text>
        <Image style={styles.imageLogo} source={require('../../assets/LOGO-Completo.png')} />
      </View>
      <View style={styles.container2}>
        <View style={styles.buttonContainer}>
          <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
            <Image style={styles.buttonImage} />
            <Text>New User</Text>
          </Pressable>
          <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={() => navigation.navigate('AddNewSensor')}>
            <Image style={styles.buttonImage} />
            <Text>New Sensor</Text>
          </Pressable>
          <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
            <Image style={styles.buttonImage} />
            <Text>View Suscriptions</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#424242',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container2: {
    backgroundColor: '#FFF',
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
    height: 260,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFF',
  },
  imageLogo: {
    width: 280,
    height: 280,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    marginHorizontal: 0,
    marginTop: 50,
    backgroundColor: '#E53935',
    borderRadius: 10,
    width: 110,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: '#C62828',
  },
  buttonImage: {
    width: 50,
    height: 50,
  },
});

export default AdminHomeScreen;
