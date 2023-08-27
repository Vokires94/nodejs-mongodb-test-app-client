import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function StartPage({ navigation, route }) {

    const { email } = route.params;

    const removeValues = async (keys) => {
        try {
            await AsyncStorage.multiRemove(keys)
        } catch (e) {
            // remove error
            console.log('Error:', error)
        }
        console.log('Done.')
    }

    const logout = async () => {
        await fetch(
            "https://nodejs-mongodb-auth-test-app-f4acf31e7430.herokuapp.com/logout", {
            method: 'PUT',
            body: JSON.stringify({ "email": email }),
            headers: {
                'Content-Type': 'application/json'
            },
        }
        ).then((response) => response.json())
            .then(
                (result) => {
                    console.log('result:', result);
                    removeValues(['token', 'email']);
                    setTimeout(() => navigation.navigate('Login'), 2000);
                },
                (error) => {
                    console.log('error:', error);
                })
            .finally(() => {
                console.log('Done');
            });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={logout}>
                <Text style={styles.logout}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
        alignItems: "center",
        justifyContent: "center",
    },
    register: {
        height: 30,
        fontSize: 16,
        color: "#61dafb",
    },
});
