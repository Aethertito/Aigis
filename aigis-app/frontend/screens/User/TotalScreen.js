import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const TotalScreen = ({ route }) => {
  const navigation = useNavigation();
  const { selectedPackageData, membershipData } = route.params;

  useEffect(() => {
    // console.log('Datos recibidos en TotalScreen:', route.params);
  }, []);

  if (!selectedPackageData || !membershipData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: Datos no encontrados</Text>
      </View>
    );
  }

  const totalCost = selectedPackageData.costo + membershipData.costo;

  const handleConfirm = () => {
    navigation.navigate('Pay', {
      totalCost: totalCost,
      selectedPackageData: selectedPackageData,
      membershipData: membershipData,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
        <Icon
          name='arrow-back-ios'
          type='MaterialIcons'
          color='#E53935'
          size={24}
        />
        <Text style={styles.iconText}>Volver</Text>
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Paquete:</Text>
          <Text style={styles.value}>{selectedPackageData.paquete}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Costo del Paquete:</Text>
          <Text style={styles.value}>${selectedPackageData.costo}.00</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Costo de Membresía:</Text>
          <Text style={styles.value}>${membershipData.costo}.00</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.labelTotal}>Monto Total:</Text>
          <Text style={styles.valueTotal}>${totalCost}.00</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.buttonContainer} onPress={handleConfirm}>
        <Text style={styles.button}>Confirmar y Pagar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#424242',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 45,
    left: 20,
  },
  iconText: {
    color: '#E53935',
    fontSize: 18,
  },
  infoContainer: {
    borderWidth: 2,
    borderColor: '#E53935',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#F4F6FC',
    width: '90%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  label: {
    fontSize: 18,
    color: '#424242',
  },
  value: {
    fontSize: 18,
    color: '#424242',
  },
  labelTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#424242',
  },
  valueTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E53935',
  },
  buttonContainer: {
    marginTop: 20,
    backgroundColor: '#E53935',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  button: {
    color: '#F4F6FC',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default TotalScreen;
