import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MembershipScreen = () => {
    const [checked, setChecked] = useState(0);
    const navigation = useNavigation();

const handleConfirmar = () => {
    console.log('Membresía seleccionada:', checked);
    navigation.navigate('Paquetes');
};

const membresias = [
    {
        id: 1,
        title: '3',
        month: 'Meses',
        description: 'Membresía por 3 meses',
    },
    {
        id: 2,
        title: '6',
        month: 'Meses',
        description: 'Membresía por 6 meses',
    },
    {
        id: 3,
        title: '12',
        month: 'Meses',
        description: 'Membresía por 12 meses',
    },
];

return (
    <ScrollView style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.tituloMem}>Seleccione la duración de la membresía</Text>
        </View>

    {membresias.map((membresia) => (
        <TouchableOpacity
            key={membresia.id}
            style={[styles.cardContainer, checked === membresia.id && styles.selectedCard]}
            onPress={() => setChecked(membresia.id)}
        >
            <View>
                <Text style={styles.title}>{membresia.title}</Text>
                <Text style={styles.months}>{membresia.month}</Text>
            </View>
        </TouchableOpacity>
    ))}

    <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmar}>
        <Text style={styles.confirmButtonText}>CONFIRMAR</Text>
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
    justifyContent: 'center',
    marginTop: 68,
    marginBottom: 60,
},
tituloMem: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
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
    fontSize: 48,
    fontWeight: 'bold',
    color: '#212121',
    textAlign: 'center',
    color: '#F4F6FC'
},
months: {
    fontSize: 33,
    fontWeight: 'bold',
    color: '#212121',
    textAlign: 'center',
    color: '#F4F6FC'
},
confirmButton: {
    backgroundColor: '#E53935',
    paddingVertical: 12,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
    width: '38%',
},
confirmButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
},
});

export default MembershipScreen;