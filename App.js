import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './src/screens/HomeScreen';
import MarketplaceScreen from './src/screens/MarketplaceScreen';
import AddEquipmentScreen from './src/screens/AddEquipmentScreen';
import EquipmentDetailScreen from './src/screens/EquipmentDetailScreen';
import ServicesScreen from './src/screens/ServicesScreen';
import AddServiceScreen from './src/screens/AddServiceScreen';
import ServiceDetailScreen from './src/screens/ServiceDetailScreen';
import NewsScreen from './src/screens/NewsScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import MapScreen from './src/screens/MapScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { resetDatabase } from './src/database/firebaseDb';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MarketplaceStack({ user }) {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MarketplaceList" 
        component={MarketplaceScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="AddEquipment"
        options={{ title: 'Pridėti skelbimą' }}
      >
        {(props) => <AddEquipmentScreen {...props} user={user} />}
      </Stack.Screen>
      <Stack.Screen 
        name="EquipmentDetail" 
        component={EquipmentDetailScreen}
        options={{ title: 'Skelbimo peržiūra' }}
      />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Kalendorius" 
        component={CalendarScreen}
        options={{ 
          title: 'Kalendorius',
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

function ServicesStack({ user }) {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ServicesList"
        options={{ headerShown: false }}
      >
        {(props) => <ServicesScreen {...props} user={user} />}
      </Stack.Screen>
      <Stack.Screen 
        name="AddService"
        options={{ title: 'Pridėti paslaugą' }}
      >
        {(props) => <AddServiceScreen {...props} user={user} />}
      </Stack.Screen>
      <Stack.Screen 
        name="ServiceDetail" 
        component={ServiceDetailScreen}
        options={{ title: 'Paslaugos peržiūra' }}
      />
    </Stack.Navigator>
  );
}

function AuthStack({ onLogin }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} onLogin={onLogin} />}
      </Stack.Screen>
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function MainTabs({ user, onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Pradžia') iconName = 'home';
          else if (route.name === 'Turgus') iconName = 'cart';
          else if (route.name === 'Paslaugos') iconName = 'construct';
          else if (route.name === 'Naujienos') iconName = 'newspaper';
          else if (route.name === 'Žemėlapis') iconName = 'map';
          else if (route.name === 'Profilis') iconName = 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Pradžia" 
        component={HomeStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Turgus" 
        options={{ headerShown: false }}
      >
        {(props) => <MarketplaceStack {...props} user={user} />}
      </Tab.Screen>
      <Tab.Screen 
        name="Paslaugos"
        options={{ headerShown: false }}
      >
        {(props) => <ServicesStack {...props} user={user} />}
      </Tab.Screen>
      <Tab.Screen 
        name="Naujienos" 
        component={NewsScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Žemėlapis" 
        component={MapScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Profilis"
        options={{ headerShown: false }}
      >
        {(props) => <ProfileScreen {...props} user={user} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (userData) => {
    setUser(userData);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  if (loading) {
    return null; // Arba loading screen
  }

  return (
    <NavigationContainer>
      {user ? (
        <MainTabs user={user} onLogout={handleLogout} />
      ) : (
        <AuthStack onLogin={handleLogin} />
      )}
    </NavigationContainer>
  );
}
