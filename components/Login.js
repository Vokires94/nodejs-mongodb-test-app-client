import React, { useState, useEffect } from "react";
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Keyboard,
} from "react-native";
import CustomTextInput from "./CustomTextInput";
import SignUpButton from "./SignUpButton";
import Logo from "./Logo";
import { emailRule, passwordRule } from "../services/validationRules";
import { StackActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkToken } from "../services/token";

export default function Login({ navigation }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [disabledButton, setDisabledButton] = useState(false);

    useEffect(() => {

        checkToken();

        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    const registerNavigate = () => {
        navigation.navigate('Register');
    }

    const setPasswordField = (value) => {
        setPassword(value);
    }

    const setEmailField = (value) => {
        setEmail(value);
    }

    const validateEmail = (rule) => {
        const isValid = rule ? rule.test(email) : true;
        if (email === '') {
            setEmailErrorMessage('Empty Email');
            return false;
        }
        else if (!isValid) {
            setEmailErrorMessage('Invalid email');
            return false;
        } else {
            setEmailErrorMessage('');
            return true;
        }
    };

    const validatePassword = (rule) => {
        const isValid = rule ? rule.test(password) : true;
        if (password === '') {
            setPasswordErrorMessage('Empty Password');
            return false;
        }
        else if (!isValid) {
            setPasswordErrorMessage('Password should be at least 6 symbols');
            return false;
        } else {
            setPasswordErrorMessage('');
            return true;
        }
    };

    const preparedData = () => {
        return {
            email, password
        }
    }

    const login = async () => {
        await fetch(
            "https://nodejs-mongodb-auth-test-app-f4acf31e7430.herokuapp.com/login", {
            method: 'POST',
            body: JSON.stringify({ "email": email, "password": password }),
            headers: {
                'Content-Type': 'application/json'
            },
        }
        ).then((response) => response.json())
            .then(
                (result) => {
                    if (result.token) {
                        Toast.show({
                            type: 'success',
                            text1: result.message,
                            visibilityTime: 3000,
                        });
                        AsyncStorage.setItem('token', result.token);
                        setTimeout(() => navigation.navigate('StartPage', {
                            email,
                        }), 3000);
                    } else {
                        Toast.show({
                            type: 'error',
                            text1: result.message,
                            visibilityTime: 3000,
                        });
                    }
                },
                (error) => {
                    console.log(error);
                })
            .finally(() => {
                console.log('Done');
            });
    };

    const onSubmit = () => {
        const isValidEmail = validateEmail(emailRule);
        const isValidpPassword = validatePassword(passwordRule);
        if (isValidEmail && isValidpPassword) {
            login();
        } else {
            Toast.show({
                type: 'error',
                text1: 'Check your credentials',
                visibilityTime: 3000,
            });
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                <Logo imgUrl={require("../assets/logo.png")} />
                <CustomTextInput
                    label="Email"
                    validationMessage={emailErrorMessage}
                    name='email'
                    text={email}
                    setField={setEmailField}
                />
                <CustomTextInput
                    label="Password"
                    validationMessage={passwordErrorMessage}
                    name='password'
                    text={password}
                    setField={setPasswordField}
                    secure
                />
                <TouchableOpacity onPress={registerNavigate}>
                    <Text style={styles.register}>Register</Text>
                </TouchableOpacity>
                <SignUpButton onSubmit={onSubmit} isDisabled={disabledButton} isLoading={isLoading} btnText="Login" />
            </ScrollView>
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
    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
    },
    register: {
        height: 30,
        fontSize: 16,
        color: "#61dafb",
    },
    content: {
        width: '100%',
    },
});
