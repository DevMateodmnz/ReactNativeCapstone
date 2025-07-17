// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from './screens/Onboarding';
import Profile from './screens/Profile';
import SplashScreen from './screens/SplashScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

  // Check onboarding status on app launch
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('@onboarding_completed');
        setIsOnboardingCompleted(value === 'true');
      } catch (error) {
        console.error('Error reading onboarding status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  // Handle onboarding completion
  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem('@onboarding_completed', 'true');
      setIsOnboardingCompleted(true);
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  // Render splash screen while loading
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isOnboardingCompleted ? (
          <Stack.Screen name="Profile" component={Profile} />
        ) : (
          <Stack.Screen name="Onboarding">
            {(props) => (
              <Onboarding 
                {...props} 
                onComplete={handleOnboardingComplete} 
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
  // Update the App.js useEffect to load profile data
useEffect(() => {
  const checkOnboardingStatus = async () => {
    try {
      const onboardingCompleted = await AsyncStorage.getItem('@onboarding_completed');
      const savedProfile = await AsyncStorage.getItem('@profile');
      
      setIsOnboardingCompleted(onboardingCompleted === 'true');
      setIsLoading(false);
      
      // If profile exists, set initial state
      if (savedProfile) {
        // You might want to set profile data in context/store
      }
    } catch (error) {
      console.error('Error reading data:', error);
      setIsLoading(false);
    }
  };

  checkOnboardingStatus();
}, []);
}