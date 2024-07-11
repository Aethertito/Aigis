import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const OptionScreen = () => {
    const navigation = useNavigation();

    return (
        <ImageBackground source={require('../../assets/systemBorrosa.png')} style={styles.background}>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => navigation.navigate('Welcome')} style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Icon
                            name='arrow-back-ios'
                            type='MaterialIcons'
                            color='#E53935'
                            size={24}
                        />
                        <Text style={styles.iconText} onPress={() => navigation.navigate('Welcome')} >Activar más tarde</Text>
                    </View>
                </TouchableOpacity>
                <Text style={styles.title}>Activa tu suscripción para disfrutar de todos los beneficios de nuestro sistema de seguridad avanzado. Monitorea y protege tu hogar con las últimas tecnologías en seguridad.</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Membership')}>
                    <Text style={styles.buttonText}>Activar Suscripción</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    header: {
        position: 'absolute',
        top: 55,
        left: 16,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconText: {
        color: '#E53935',
        fontSize: 16,
        marginLeft: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F4F6FC',
        textAlign: 'center',
        marginBottom: 50,
        bottom: 35,
    },
    button: {
        backgroundColor: '#E53935',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginVertical: 10,
        width: 230,
        height: 55,
        alignItems: 'center',
    },
    buttonText: {
        color: '#F4F6FC',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default OptionScreen;
