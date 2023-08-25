import React from "react";
import {
    StyleSheet,
    Image,
    View,
} from "react-native";

export default function Logo({ imgUrl }) {

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={imgUrl} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '50%',
        marginBottom: 40,
        marginTop: 40,
        height: 80,
    },
    image: {
        resizeMode: 'contain',
        flex:1 ,
        width: undefined,
        height: undefined,
    },
});
