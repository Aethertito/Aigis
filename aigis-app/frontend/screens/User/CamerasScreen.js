import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native';

const cameras = [
  { id: '1', location: 'Development Area (First Floor)', status: 'Active', url: 'http://192.168.100.235:81/stream' },
  { id: '2', location: 'Development Area (Second Floor)',status: 'Active', url: 'http://192.168.100.235:81/stream'  },
];

const CamerasScreen = () => {
  const openURL = (url) => {
    Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.name}>Location: {item.location}</Text>
      <Text style={styles.details}>Status: {item.status}</Text>
      {item.status === 'Active' && (
        <TouchableOpacity onPress={() => openURL(item.url)} style={styles.button}>
          <Text style={styles.buttonText}>View Camera</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>View Cameras</Text>
      <Text style={styles.infoText}>Monitor your work areas.</Text>
      <FlatList
        data={cameras}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#424242',
    padding: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#F4F6FC',
    marginBottom: 8,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F4F6FC',
    marginBottom: 5,
    alignSelf: 'center',
  },
  item: {
    backgroundColor: '#212121',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderColor: '#E53935',
    borderWidth: 1,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F4F6FC',
    marginBottom: 4,
  },
  details: {
    fontSize: 16,
    color: '#F4F6FC',
    marginBottom: 8,
  },
  button: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#E53935',
    borderRadius: 8,
  },
  buttonText: {
    color: '#F4F6FC',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CamerasScreen;
