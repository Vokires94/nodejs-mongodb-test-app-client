import AsyncStorage from "@react-native-async-storage/async-storage";

export const checkToken = async (navigation) => {
    const values = await AsyncStorage.multiGet(['token', 'email']);
    // console.log('Token:', values[0][1]); // token value
    // console.log('Email:', values[1][1]); // email value
    if (values[0][1] !== null) {
        navigation.navigate('StartPage', {
            email: values[1][1],
        });
    }
    return values
}