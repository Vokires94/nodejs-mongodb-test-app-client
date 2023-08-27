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

export default function Register({ navigation }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('');
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [disabledButton, setDisabledButton] = useState(false);

    useEffect(() => {

        checkToken(navigation);

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
        navigation.navigate('Login');
    }

    const setPasswordField = (value) => {
        setPassword(value);
    }

    const setConfirmPasswordField = (value) => {
        setConfirmPassword(value);
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
        }
        else if (confirmPassword && confirmPassword !== password) {
            setPasswordErrorMessage('Confirm password not equal password');
            return false;
        } else {
            setPasswordErrorMessage('');
            return true;
        }
    };

    const validateConfirmPassword = (rule) => {
        const isValid = rule ? rule.test(confirmPassword) : true;
        if (confirmPassword === '') {
            setConfirmPasswordErrorMessage('Empty Password');
            return false;
        }
        else if (!isValid) {
            setConfirmPasswordErrorMessage('Password should be at least 6 symbols');
            return false;
        }
        else if (password && confirmPassword !== password) {
            setConfirmPasswordErrorMessage('Confirm password not equal password');
            return false;
        } else {
            setConfirmPasswordErrorMessage('');
            return true;
        }
    };

    const preparedData = () => {
        return {
            email, password, confirmPassword
        }
    }

    const register = async () => {
        await fetch(
            "https://nodejs-mongodb-auth-test-app-f4acf31e7430.herokuapp.com/register", {
            method: 'POST',
            body: JSON.stringify({ "email": email, "password": password }),
            headers: {
                'Content-Type': 'application/json'
            },
        }
        ).then((response) => response.json())
            .then(
                (data) => {
                    if (data.result) {
                        Toast.show({
                            type: 'success',
                            text1: data.message,
                            visibilityTime: 3000,
                        });
                        AsyncStorage.setItem('token', data.result.token);
                        AsyncStorage.setItem('email', data.result.email);
                        setTimeout(() =>
                            navigation.dispatch(StackActions.replace('StartPage', { email })), 3000);
                    } else {
                        Toast.show({
                            type: 'error',
                            text1: data.message,
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
        const isValidPassword = validatePassword(passwordRule);
        const isValidConfirmPassword = validateConfirmPassword(passwordRule);
        if (isValidEmail && isValidPassword && isValidConfirmPassword) {
            register();
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
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'center' }}
            >
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
                <CustomTextInput
                    label="Confirm password"
                    validationMessage={confirmPasswordErrorMessage}
                    name='confirmPassword'
                    text={confirmPassword}
                    setField={setConfirmPasswordField}
                    secure
                />
                <TouchableOpacity onPress={registerNavigate}>
                    <Text style={styles.register}>Login</Text>
                </TouchableOpacity>
                <SignUpButton onSubmit={onSubmit} isDisabled={disabledButton} isLoading={isLoading} btnText="Register" />
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
        marginTop: 30,
        fontSize: 16,
        color: "#61dafb",
    },
    content: {
        width: '100%',
    },
});
