import AsyncStorage from "@react-native-async-storage/async-storage";

export const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        navigation.navigate('StartPage', {
            email,
        });
    }
    return token
}