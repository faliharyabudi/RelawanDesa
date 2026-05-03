import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ActivityDetailScreen from '../screens/ActivityDetailScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddActivityScreen from '../screens/AddActivityScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#059669',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#d1fae5',
          borderTopWidth: 1.5,
          height: 68,
          paddingBottom: 10,
          paddingTop: 8,
          elevation: 16,
          shadowColor: '#059669',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.2,
        }
      }}
    >
      <Tab.Screen
        name="Beranda"
        component={HomeScreen}
        options={{ 
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={24} color={color} /> 
        }}
      />
      <Tab.Screen
        name="Riwayat"
        component={HistoryScreen}
        options={{ 
          tabBarIcon: ({ color, size }) => <Ionicons name="time" size={24} color={color} /> 
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{ 
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={24} color={color} /> 
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen
              name="ActivityDetail"
              component={ActivityDetailScreen}
              options={{
                headerShown: true,
                title: 'Detail Kegiatan',
                headerStyle: { backgroundColor: '#059669' },
                headerTintColor: '#ffffff',
                headerTitleStyle: { fontWeight: '800', fontSize: 18 },
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="AddActivity"
              component={AddActivityScreen}
              options={{
                headerShown: true,
                title: 'Tambah Kegiatan',
                headerStyle: { backgroundColor: '#059669' },
                headerTintColor: '#ffffff',
                headerTitleStyle: { fontWeight: '800', fontSize: 18 },
                headerShadowVisible: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
