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
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: '#ffffff',
            height: 70 + (insets.bottom || 0),
            paddingBottom: insets.bottom || 10,
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: '#f1f5f9',
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
          },
        }}
      >
      <Tab.Screen
        name="Beranda"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: focused ? '#ecfdf5' : 'transparent',
              paddingHorizontal: focused ? 16 : 0,
              paddingVertical: 10,
              borderRadius: 20,
              gap: 6,
            }}>
              <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={focused ? '#059669' : '#94a3b8'} />
              {focused && <Text style={{ color: '#059669', fontFamily: 'PlusJakartaSans_700Bold', fontSize: 13 }}>Beranda</Text>}
            </View>
          )
        }}
      />
      <Tab.Screen
        name="Riwayat"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: focused ? '#ecfdf5' : 'transparent',
              paddingHorizontal: focused ? 16 : 0,
              paddingVertical: 10,
              borderRadius: 20,
              gap: 6,
            }}>
              <Ionicons name={focused ? 'time' : 'time-outline'} size={24} color={focused ? '#059669' : '#94a3b8'} />
              {focused && <Text style={{ color: '#059669', fontFamily: 'PlusJakartaSans_700Bold', fontSize: 13 }}>Riwayat</Text>}
            </View>
          )
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: focused ? '#ecfdf5' : 'transparent',
              paddingHorizontal: focused ? 16 : 0,
              paddingVertical: 10,
              borderRadius: 20,
              gap: 6,
            }}>
              <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={focused ? '#059669' : '#94a3b8'} />
              {focused && <Text style={{ color: '#059669', fontFamily: 'PlusJakartaSans_700Bold', fontSize: 13 }}>Profil</Text>}
            </View>
          )
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
                headerTitleStyle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 18 },
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
