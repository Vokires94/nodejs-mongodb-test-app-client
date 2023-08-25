import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";
import { ActivityIndicator } from "@react-native-material/core";

export default function SignUpButton({ isLoading, onSubmit, btnText, isDisabled }) {

    return (
        <TouchableOpacity style={[styles.loginBtn, (isLoading || isDisabled) && styles.loginBtnDisabled]} onPress={onSubmit} disabled={isLoading || isDisabled}>
            {isLoading ? <ActivityIndicator size="large" color="#61dafb" /> : <Text style={styles.loginText}>{btnText}</Text>}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    loginBtn: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        marginBottom: 20,
        backgroundColor: "#61dafb",
    },
    loginBtnDisabled: {
        backgroundColor: '#AAA',
    },
    loginText: {
        color: 'white',
        fontWeight: 700,
        textTransform: 'uppercase',
    },
});
