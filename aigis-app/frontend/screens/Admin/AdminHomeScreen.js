import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AdminHomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Home</Text>
      <Text style={styles.subtitle}>Bienvenido, Admin. Aquí puedes gestionar tu empresa IoT.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AdminHomeScreen;
