import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';

const Stack = createNativeStackNavigator();

// Define linking config
const linking = {
  prefixes: ['zadaloginapp://'],
  config: {
    screens: {
      Home: 'verification-complete', // Show HomeScreen when deep link hit
      Login: 'login',                // If verification fail 
    },
  },
};

export default function App() {
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    const getInitialUrl = async () => {
      const url = await Linking.getInitialURL();
      if (url && url.includes('verification-complete')) {
        setInitialRoute('Home');
      } else {
        setInitialRoute('Login');
      }
    };

    getInitialUrl();
  }, []);

  return (
    <NavigationContainer linking={linking} fallback={<LoginScreen />}>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
