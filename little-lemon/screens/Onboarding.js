// screens/Onboarding.js (updated)
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';

const Onboarding = ({ onComplete }) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  
  // Validation functions
  const isFirstNameValid = () => {
    return firstName.trim().length > 0 && /^[a-zA-Z]+$/.test(firstName.trim());
  };
  
  const isEmailValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };
  
  const isButtonDisabled = !isFirstNameValid() || !isEmailValid();

  const handleNext = () => {
    if (!isButtonDisabled) {
      onComplete();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Logo and Text */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Little Lemon</Text>
        <Image
          style={styles.logo}
          source={require('../assets/logo.png')}
          accessibilityLabel="Little Lemon Logo"
        />
      </View>

      {/* First Name Input */}
      <TextInput
        style={[styles.input, !isFirstNameValid() && firstName.length > 0 && styles.errorInput]}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="First Name"
        autoCapitalize="words"
      />
      {!isFirstNameValid() && firstName.length > 0 && (
        <Text style={styles.errorText}>Please enter a valid name</Text>
      )}

      {/* Email Input */}
      <TextInput
        style={[styles.input, !isEmailValid() && email.length > 0 && styles.errorInput]}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {!isEmailValid() && email.length > 0 && (
        <Text style={styles.errorText}>Please enter a valid email</Text>
      )}

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Next"
          onPress={handleNext}
          disabled={isButtonDisabled}
          color="#495E57"
        />
      </View>
    </View>
  );
};

// Add errorInput style
const styles = StyleSheet.create({
  // ... existing styles ...
  errorInput: {
    borderColor: 'red',
  },
  // ... keep the rest of the styles ...
});

// Update the handleNext function in Onboarding.js
const handleNext = () => {
  if (!isButtonDisabled) {
    onComplete();
    // Pass onboarding data to profile
    navigation.navigate('Profile', {
      firstName: firstName.trim(),
      email: email.trim(),
    });
  }
};

export default Onboarding;