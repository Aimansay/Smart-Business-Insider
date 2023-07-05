import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomePage from './modules/HomePage';
import Analytics from './modules/Analytics';
import NaviagtionScreen from './modules/NavigationScreen';
import Inventory from './modules/Inventory';
import Billing from './modules/Billing';
import Signup from './modules/Signup';
import Login from './modules/Login';
import WelcomeScreen from './modules/WelcomeScreen';
import ChangePassword from './modules/Password';
import Settings from './modules/Settings';
import BillRecords from './modules/BillRecords';
import ForgetPassword from './modules/Forgetpassword';
import ProfilePopupScreen from './modules/Profile';
import Barcode from './modules/barcode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import User from './modules/User';

const Stack = createStackNavigator();

export default function App() {
  const [flag, setFlag] = useState(false);
  const [finger, setFinger] = useState(false);
  useEffect(() => {

    const initializeAsyncStorage = async () => {
      await AsyncStorage.setItem('ip', 'http://192.168.1.4');
      const check = await AsyncStorage.getItem("fingerprint");
      console.log(check);
      if (await AsyncStorage.getItem("fingerprint") === "true") {
        setFinger(true);
        User.fingerprint = true;
        console.log(flag ? (finger ? "Login" : "Homepage") : "WelcomeScreen")
      }
    };

    const checkTokenAndUserId = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');
        setFlag(token && userId);
      } catch (error) {
        console.log('Error retrieving data from AsyncStorage:', error);
      }
    };

    initializeAsyncStorage();
    checkTokenAndUserId();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator >
        {!flag && (
          <Stack.Screen
            name="WelcomeScreen"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
        )}
        {!finger && <Stack.Screen
          name="Homepage"
          component={HomePage}
          options={{ headerShown: false }}
        />}
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        {finger && <Stack.Screen
          name="Homepage"
          component={HomePage}
          options={{ headerShown: false }}
        />}
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfilePopupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Record"
          component={BillRecords}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Analytics"
          component={Analytics}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Inventory"
          component={Inventory}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="barcode"
          component={Barcode}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NavigationScreen"
          component={NaviagtionScreen}
        />
        <Stack.Screen
          name="Billing"
          component={Billing}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="forgetpassword"
          component={ForgetPassword}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
