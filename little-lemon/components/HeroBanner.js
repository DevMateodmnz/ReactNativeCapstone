import React from 'react';
import { View, Text, TextInput, Image, StyleSheet } from 'react-native';

const HeroBanner = ({ searchText, onSearchChange }) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Little Lemon</Text>
        <Text style={styles.subtitle}>Chicago</Text>
        <Text style={styles.description}>
          We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
        </Text>
      </View>
      <Image
        source={require('../assets/hero-image.png')}
        style={styles.image}
        resizeMode="cover"
      />
      <TextInput
        style={styles.searchInput}
        placeholder="Search menu..."
        value={searchText}
        onChangeText={onSearchChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#495E57',
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  textContainer: {
    flex: 1,
    minWidth: 200,
  },
  title: {
    color: '#F4CE14',
    fontSize: 36,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#EDEFEE',
    fontSize: 28,
  },
  description: {
    color: '#EDEFEE',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 15,
  },
  image: {
    width: 120,
    height: 140,
    borderRadius: 12,
    marginTop: 10,
  },
  searchInput: {
    height: 40,
    backgroundColor: '#EDEFEE',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginTop: 15,
    width: '100%',
  },
});

export default HeroBanner;