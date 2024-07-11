import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const PaquetesScreen = () => {
  const navigation = useNavigation();
  const [selectedPackage, setSelectedPackage] = useState(null);

  const paquetes = [
    {
      title: 'Paquete Básico',
      description: 'Incluye funcionalidades esenciales como tarjetas de acceso y monitoreo de la temperatura y humedad.',
      price: '$50.00',
      info: ['RFID', 'Temperatura y Humedad'],
    },
    {
      title: 'Paquete Intermedio',
      description: 'Un paquete con más seguridad, añade detección de humo.',
      price: '$75.00',
      info: ['RFID', 'Temperatura y Humedad', 'Humo'],
    },
    {
      title: 'Paquete Avanzado',
      description: 'Ofrece nuevo sistema de seguridad con el paquete nuevo de cámara y detector de presencia. Ademas de las funcionaldiades de los anteriores paquetes.',
      price: '$100.00',
      info: ['RFID', 'Temperatura y Humedad', 'Humo', 'Presencia', 'Cámara'],
    },
  ];

  const handleSeleccionarPaquete = (index) => {
    setSelectedPackage(index);
  };

  const handleConfirmarPaquete = () => {
    if (selectedPackage !== null) {
      console.log('Paquete seleccionado:', paquetes[selectedPackage].title);
      navigation.navigate('Pay');
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
          <Text style={styles.iconText}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.tituloMem}>Selecciona un paquete</Text>
      </View>

      {paquetes.map((paquete, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.cardContainer, selectedPackage === index && styles.selectedCard]}
          onPress={() => handleSeleccionarPaquete(index)}
        >
          <View>
            <Text style={styles.title}>{paquete.title}</Text>
            <Text style={styles.desc}>{paquete.description}</Text>
            <Text style={styles.contText}>Contiene:</Text>
            {paquete.info.map((item, idx) => (
              <Text key={idx} style={styles.infoItem}>
                - {item}
              </Text>
            ))}
            <View style={styles.priceContainer}>
              <Text style={[styles.textPrice, selectedPackage === index && { color: '#F4F6FC' }]}>Costo:</Text>
              <Text style={[styles.price, selectedPackage === index && { color: '#F4F6FC' }]}>{paquete.price}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmarPaquete}>
        <Text style={styles.confirmButtonText}>CONFIRMAR PAQUETE</Text>
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
    right: 40
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 20
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
