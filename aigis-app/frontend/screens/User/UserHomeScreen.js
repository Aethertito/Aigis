import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const UserHomeScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome to Your Dashboard</Text>
      <Text style={styles.subtitle}>Monitor your sensors and manage your profile</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Promote Your Business</Text>
        <Text style={styles.sectionText}>Discover how our solutions can help grow your business and manage your resources efficiently.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Explore Our Packages</Text>
        <Text style={styles.sectionText}>Check out the benefits of our packages:</Text>
        <Text style={styles.sectionText}>- Comprehensive sensor management</Text>
        <Text style={styles.sectionText}>- Customizable options</Text>
        <Text style={styles.sectionText}>- Competitive pricing</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Paquetes')}>
          <Text style={styles.buttonText}>View Packages</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  section: {
    width: '100%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default UserHomeScreen;
