import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Login from '../components/Login';
import Register from '../components/Register';
import StartPage from '../components/StartPage';

const Stack = createNativeStackNavigator();

export default function MainStack() {
    return (
        <>
            <NavigationContainer>
                <Stack.Navigator initialRouteName='Login' screenOptions={{
                    headerStyle: {
                        backgroundColor: '#61dafb',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerBackVisible: false,
                }}>
                    <Stack.Screen name="Login" component={Login} options={{ title: 'Login' }} />
                    <Stack.Screen name="Register" component={Register} options={{
                        title: 'Register',
                    }}
                    />
                    <Stack.Screen name="StartPage" component={StartPage} options={{
                        title: 'StartPage',
                    }} />
                </Stack.Navigator>
            </NavigationContainer>
            <Toast />
        </>

    );
}