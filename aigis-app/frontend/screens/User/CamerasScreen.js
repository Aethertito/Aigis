import React from 'react';
import { View, Text, StyleSheet, FlatList, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

const cameras = [
  { id: '1', location: 'Entrance', status: 'Active' },
  { id: '2', location: 'Parking Lot', status: 'Inactive' },
];

const CamerasScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.name}>Location: {item.location}</Text>
      <Text style={styles.details}>Status: {item.status}</Text>
      {item.status === 'Active' && (
        Platform.OS === 'web' ? (
          <iframe
            src="http://192.168.100.228:81/stream"
            style={styles.webview}
            allow="autoplay"
          />
        ) : (
          <WebView
            source={{ uri: 'http://192.168.100.228:81/stream' }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
          />
        )
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>View Cameras</Text>
      <FlatList
        data={cameras}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    padding: 16,
    marginVertical: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 16,
  },
  webview: {
    width: '100%',
    height: 300, // Ajusta el tamaño del WebView según sea necesario
  },
});

export default CamerasScreen;
