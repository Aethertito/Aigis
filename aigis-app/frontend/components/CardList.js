import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet, RefreshControl, ActivityIndicator } from "react-native";
import { ListItem, Avatar, Button, Icon } from "@rneui/base";
import IP from "../IP";

export default function CardList({ sensores, fetchSensores, loading }) {
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchSensores(); // Llama a la función para obtener los sensores
        setRefreshing(false);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {sensores.map((sensor) => {
                return (
                    <ListItem
                        key={sensor._id}
                        bottomDivider
                    >
                        <ListItem.Chevron />
                        <Avatar rounded source={{ uri: `http://${IP}:3000/sensor/imagen/${sensor.imagen}` }} />
                        <ListItem.Content>
                            <ListItem.Title>{sensor.tipo}</ListItem.Title>
                            <ListItem.Subtitle>{sensor.descripcion}</ListItem.Subtitle>
                            <ListItem.Subtitle>${sensor.precio}</ListItem.Subtitle>
                            <Button radius={"sm"} type="solid">
                                Add Cart
                                <Icon name="shopping-cart" color="white" />
                            </Button>
                        </ListItem.Content>
                    </ListItem>
                )
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
