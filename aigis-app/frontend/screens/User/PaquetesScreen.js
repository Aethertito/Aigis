import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import IP from '../../IP';

const PaquetesScreen = () => {
  const navigation = useNavigation();
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const fetchPackages = async () => {
    const url = `http://${IP}:3000/packages`;
    try {
      const response = await axios.get(url);
      console.log(response.data.paquetes);
      setPackages(response.data.paquetes);
    } catch (error) {
      console.error('Error getting packages:', error);
      Alert.alert('Error', 'Packages could not be loaded');
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleSeleccionarPaquete = (index) => {
    setSelectedPackage(index);
  };

  const handleConfirmarPaquete = () => {
    if (selectedPackage !== null) {
      console.log('Selected package:', packages[selectedPackage].paquete);
      navigation.navigate('Pay');
    } else {
      Alert.alert('Error', 'Please select a package');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Membership')} style={styles.iconContainer}>
          <Icon
            name='arrow-back-ios'
            type='MaterialIcons'
            color='#E53935'
            size={24}
          />
          <Text style={styles.iconText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.tituloMem}>Select a package</Text>
      </View>

      {packages.map((paquete, index) => (
        <TouchableOpacity
          key={paquete._id}
          style={[styles.cardContainer, selectedPackage === index && styles.selectedCard]}
          onPress={() => handleSeleccionarPaquete(index)}
        >
          <View>
            <Text style={styles.title}>{paquete.paquete}</Text>
            <Text style={styles.desc}>{paquete.descripcion}</Text>
            <Text style={styles.contText}>Contains:</Text>
            {typeof paquete.contenido === 'string' && paquete.contenido.trim() !== '' ? (
              paquete.contenido.split(',').map((item, idx) => (
                <Text key={idx} style={styles.infoItem}>
                  - {item.trim()}
                </Text>
              ))
            ) : (
              <Text style={styles.infoItem}>- Not specified</Text>
            )}
            <View style={styles.priceContainer}>
              <Text style={[styles.textPrice, selectedPackage === index && { color: '#F4F6FC' }]}>Cost:</Text>
              <Text style={[styles.price, selectedPackage === index && { color: '#F4F6FC' }]}>${paquete.precio}.00</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmarPaquete}>
        <Text style={styles.confirmButtonText}>CONFIRM PACKAGE</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#424242',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 28,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  tituloMem: {
    color: '#F4F6FC',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    marginTop: 60,
    right: 40,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 20,
  },
  iconText: {
    color: '#E53935',
    fontSize: 16,
    marginLeft: 1,
  },
  cardContainer: {
    backgroundColor: '#212121',
    borderColor: '#E53935',
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
  },
  selectedCard: {
    backgroundColor: '#E53935',
    color: '#FFF',
    borderColor: '#FFF',
    borderWidth: 1,
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F4F6FC',
    textAlign: 'center',
  },
  desc: {
    fontSize: 16,
    color: '#F4F6FC',
    marginTop: 5,
    textAlign: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center',
  },
  textPrice: {
    fontSize: 16,
    color: '#F4F6FC',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E53935',
    textAlign: 'right',
  },
  contText: {
    fontSize: 16,
    color: '#F4F6FC',
    marginTop: 10,
  },
  infoItem: {
    fontSize: 16,
    color: '#F4F6FC',
    marginLeft: 15,
  },
  confirmButton: {
    backgroundColor: '#E53935',
    paddingVertical: 12,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 40,
    width: '80%',
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PaquetesScreen;
