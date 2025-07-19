import Home from '../screens/Home';

return (
  <Stack.Navigator>
    {state.isOnboardingCompleted ? (
      <>
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </>
    ) : (
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    )}
  </Stack.Navigator>
);