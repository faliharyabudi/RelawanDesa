import React from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ActivityDetailScreen from '../screens/ActivityDetailScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddActivityScreen from '../screens/AddActivityScreen';
import NotificationScreen from '../screens/NotificationScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#064e3b',
          tabBarInactiveTintColor: '#94a3b8',
          tabBarStyle: {
            backgroundColor: '#ffffff',
            height: 70 + (insets.bottom || 0),
            paddingBottom: insets.bottom || 12,
            paddingTop: 12,
            borderTopWidth: 0,
            elevation: 20,
            shadowColor: '#064e3b',
            shadowOffset: { width: 0, height: -6 },
            shadowOpacity: 0.1,
            shadowRadius: 15,
          },
          tabBarLabelStyle: {
            fontFamily: 'PlusJakartaSans_800ExtraBold',
            fontSize: 11,
            marginTop: 6,
          }
        }}
      >
      <Tab.Screen
        name="Beranda"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
        }}
      />
      <Tab.Screen
        name="Riwayat"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'time' : 'time-outline'} size={24} color={color} />
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
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
                headerShown: false,
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
                headerTitleStyle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 18 },
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Notification"
              component={NotificationScreen}
              options={{
                headerShown: true,
                title: 'Notifikasi',
                headerStyle: { backgroundColor: '#059669' },
                headerTintColor: '#ffffff',
                headerTitleStyle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 18 },
                headerShadowVisible: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
