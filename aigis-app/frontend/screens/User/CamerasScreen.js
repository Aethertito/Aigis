import React from 'react';
import { View, Text, StyleSheet, FlatList, Platform } from 'react-native';
// import { WebView } from 'react-native-webview';

const cameras = [
  { id: '1', location: 'Entrance', status: 'Active' },
  { id: '2', location: 'Parking Lot', status: 'Inactive' },
];

const CamerasScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.name}>Location: {item.location}</Text>
      <Text style={styles.details}>Status: {item.status}</Text>
      {/* {item.status === 'Active' && (
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
      )} */}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>View Cameras</Text>
      <FlatList
        data={cameras}
        // renderItem={renderItem}
        keyExtractor={item => item.id}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F4F6FC',
    marginBottom: 20,
    alignSelf: 'center',
  },
  item: {
    backgroundColor: '#212121',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderColor: '#E53935',
    borderWidth: 1,
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
  webview: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    borderColor: '#E53935',
    borderWidth: 1,
  },
});

export default CamerasScreen;
