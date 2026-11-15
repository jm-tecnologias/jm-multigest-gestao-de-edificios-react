import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ApartmentsScreen from './src/pages/ApartmentsScreen';
import ClientsScreen from './src/pages/ClientsScreen';
import DashboardScreen from './src/pages/DashboardScreen';
import SecurityScreen from './src/pages/SecurityScreen';
import LoginScreen from './src/pages/LoginScreen';
import ResidentialParkingScreen from './src/pages/ResidentialParkingScreen';
import CommercialParkingScreen from './src/pages/CommercialParkingScreen';



const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false, // Oculta o cabeçalho padrão nativo, pois já criamos o nosso próprio TopNavbar personalizado nas telas
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Apartamentos" component={ApartmentsScreen} />
        <Stack.Screen name="Clientes" component={ClientsScreen} />
        <Stack.Screen name="Segurança" component={SecurityScreen} />
        <Stack.Screen name="Parque Residencial" component={ResidentialParkingScreen} />
        <Stack.Screen name="Parque Comercial" component={CommercialParkingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
