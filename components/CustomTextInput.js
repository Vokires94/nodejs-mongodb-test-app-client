import { useRef, useState } from "react";
import { TextInput, StyleSheet, View, Text, TouchableOpacity, Animated, Easing } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function CustomTextInput(props) {
    const [focus, setFocus] = useState(false);
    const [hidePass, setHidePass] = useState(false);
    const [animationBorder, setAnimationBorder] = useState(new Animated.Value(0));
    const [animationLabel, setAnimationLabel] = useState(new Animated.Value(0));

    const titleActiveSize = 14;
    const titleInActiveSize = 16;

    const returnAnimatedTitleStyles = {
        transform: [
            {
                translateY: animationLabel.interpolate({
                    inputRange: [0, 1],
                    outputRange: [22, -4],
                    extrapolate: 'clamp',
                }),
            },
        ],
        fontSize: animationLabel.interpolate({
            inputRange: [0, 1],
            outputRange: [titleInActiveSize, titleActiveSize],
            extrapolate: 'clamp',
        }),
    };

    const bgStyleShow = {
        width: animationBorder.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '70%'],
        }),
    };

    const onFocus = () => {
        setFocus(true);
        Animated.timing(animationBorder, {
            toValue: 1,
            duration: 250,
            useNativeDriver: false,
        }).start();
        Animated.timing(animationLabel, {
            toValue: 1,
            duration: 250,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            useNativeDriver: false,
        }).start();
    };

    const onBlur = () => {
        setFocus(false);
        Animated.timing(animationBorder, {
            toValue: 0,
            duration: 250,
            useNativeDriver: false,
        }).start();
        if (!props.text) {
            Animated.timing(animationLabel, {
                toValue: 0,
                duration: 250,
                easing: Easing.bezier(0.4, 0.0, 0.2, 1),
                useNativeDriver: false,
            }).start();
        }
    };

    const handleTextChange = (value) => {
        props.setField(value);
    };

    const handleHidePasswordText = () => {
        setHidePass(!hidePass);
    };

    // показывать лейбл красным - если ошибка, иначе если в фокусе - жёлтым, иначе - серым
    const labelColor = props.validationMessage ? {color: 'red'} : {color: focus ? '#61dafb' : '#c2c2c2'};

    return (
        <View style={styles.container}>
            <Animated.Text style={[returnAnimatedTitleStyles, styles.label, labelColor]}>{props.label}</Animated.Text>
            <TextInput
                secureTextEntry={props.secure && hidePass}
                style={[styles.input, props.validationMessage && styles.borderInputError, props.secure && { paddingRight: 28 }]}
                onFocus={onFocus}
                onBlur={onBlur}
                onChangeText={handleTextChange}
                value={props.text}
                {...props}
            />
            <Animated.View
                style={[styles.line, bgStyleShow]}
            />
            {props.secure && <TouchableOpacity style={styles.iconPassword} onPress={handleHidePasswordText}>
                <Icon name={hidePass ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                />
            </TouchableOpacity>}
            <Text style={styles.msg}>{props.validationMessage}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 30,
    },
    msg: {
        width: "70%",
        color: "red",
        marginBottom: 4,
    },
    input: {
        width: "70%",
        height: 45,
        borderBottomWidth: 1,
    },
    borderInputError: {
        borderColor: 'red',
    },
    iconPassword: {
        color: 'grey',
        position: 'absolute',
        right: '15%',
        top: 16,
        marginRight: 4,
    },
    line: {
        position: 'absolute',
        backgroundColor: '#61dafb',
        width: '0%',
        left: '15%',
        top: 44,
        height: 2,
    },
    label: {
        position: 'absolute',
        bottom: 60,
        left: '15%',
    },
});