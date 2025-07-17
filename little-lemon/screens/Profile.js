// screens/Profile.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  StyleSheet, 
  TouchableOpacity,
  Image,
  ScrollView,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaskedTextInput } from 'react-native-mask-text';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ navigation, route }) => {
  // State for user data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // State for notifications
  const [orderStatuses, setOrderStatuses] = useState(false);
  const [passwordChanges, setPasswordChanges] = useState(false);
  const [specialOffers, setSpecialOffers] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  
  // State for avatar
  const [avatar, setAvatar] = useState(null);
  
  // Phone validation state
  const [isPhoneValid, setIsPhoneValid] = useState(true);

  // Load onboarding data when component mounts
  useEffect(() => {
    const loadOnboardingData = async () => {
      // Get data from onboarding
      if (route.params) {
        setFirstName(route.params.firstName || '');
        setEmail(route.params.email || '');
      }
      
      // Load saved profile data
      try {
        const savedProfile = await AsyncStorage.getItem('@profile');
        if (savedProfile) {
          const profileData = JSON.parse(savedProfile);
          setFirstName(profileData.firstName);
          setLastName(profileData.lastName);
          setEmail(profileData.email);
          setPhone(profileData.phone);
          setAvatar(profileData.avatar);
          setOrderStatuses(profileData.orderStatuses);
          setPasswordChanges(profileData.passwordChanges);
          setSpecialOffers(profileData.specialOffers);
          setNewsletter(profileData.newsletter);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    
    loadOnboardingData();
  }, [route.params]);

  // Validate phone number (10 digits after stripping non-digits)
  const validatePhone = (number) => {
    const digits = number.replace(/\D/g, '');
    setIsPhoneValid(digits.length === 10);
    return digits.length === 10;
  };

  // Handle image selection
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to select an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  // Save profile to storage
  const saveProfile = async () => {
    if (!validatePhone(phone)) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit US phone number');
      return;
    }

    const profileData = {
      firstName,
      lastName,
      email,
      phone,
      avatar,
      orderStatuses,
      passwordChanges,
      specialOffers,
      newsletter,
    };

    try {
      await AsyncStorage.setItem('@profile', JSON.stringify(profileData));
      Alert.alert('Success', 'Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['@onboarding_completed', '@profile']);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Onboarding' }],
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Generate initials for placeholder
  const getInitials = () => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Personal Information</Text>
      </View>
      
      {/* Avatar Section */}
      <View style={styles.avatarContainer}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitials}>{getInitials()}</Text>
          </View>
        )}
        <TouchableOpacity onPress={pickImage}>
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>
      </View>
      
      {/* User Information Form */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="First Name"
          autoCapitalize="words"
        />
        
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Last Name"
          autoCapitalize="words"
        />
        
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <Text style={styles.label}>Phone Number</Text>
        <MaskedTextInput
          mask="(999) 999-9999"
          style={[styles.input, !isPhoneValid && styles.errorInput]}
          value={phone}
          onChangeText={(text, rawText) => {
            setPhone(text);
            validatePhone(rawText);
          }}
          placeholder="(000) 000-0000"
          keyboardType="phone-pad"
        />
        {!isPhoneValid && (
          <Text style={styles.errorText}>Please enter a valid 10-digit US phone number</Text>
        )}
      </View>
      
      {/* Email Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Email Notifications</Text>
        
        <View style={styles.checkboxContainer}>
          <TouchableOpacity 
            style={styles.checkbox} 
            onPress={() => setOrderStatuses(!orderStatuses)}
          >
            <View style={[styles.checkboxBox, orderStatuses && styles.checkedBox]}>
              {orderStatuses && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Order statuses</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.checkbox} 
            onPress={() => setPasswordChanges(!passwordChanges)}
          >
            <View style={[styles.checkboxBox, passwordChanges && styles.checkedBox]}>
              {passwordChanges && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Password changes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.checkbox} 
            onPress={() => setSpecialOffers(!specialOffers)}
          >
            <View style={[styles.checkboxBox, specialOffers && styles.checkedBox]}>
              {specialOffers && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Special offers</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.checkbox} 
            onPress={() => setNewsletter(!newsletter)}
          >
            <View style={[styles.checkboxBox, newsletter && styles.checkedBox]}>
              {newsletter && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Newsletter</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Action Buttons */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity 
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Log out</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.saveButton]}
          onPress={saveProfile}
        >
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 48,
  },
  header: {
    marginBottom: 32,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#495E57',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarInitials: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  changePhotoText: {
    color: '#495E57',
    fontWeight: 'bold',
    fontSize: 16,
  },
  formContainer: {
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    height: 48,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: -8,
    marginBottom: 16,
    fontSize: 14,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  checkboxContainer: {
    marginLeft: 8,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkedBox: {
    backgroundColor: '#495E57',
    borderColor: '#495E57',
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#f1f1f1',
    marginRight: 12,
  },
  saveButton: {
    backgroundColor: '#495E57',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;