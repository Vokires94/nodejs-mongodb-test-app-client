import 'react-native-gesture-handler';
import MainStack from './services/navigation';
import { IconComponentProvider } from '@react-native-material/core';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { PaperProvider } from 'react-native-paper';

export default function App() {
  return (
    <IconComponentProvider IconComponent={MaterialCommunityIcons}>
      <PaperProvider>
        <MainStack />
      </PaperProvider>
    </IconComponentProvider>
  );
}