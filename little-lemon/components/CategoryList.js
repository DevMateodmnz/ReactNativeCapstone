import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

const CategoryList = ({ categories, selectedCategories, onToggleCategory }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryButton,
            selectedCategories.includes(category) && styles.selectedCategory
          ]}
          onPress={() => onToggleCategory(category)}
        >
          <Text style={[
            styles.categoryText,
            selectedCategories.includes(category) && styles.selectedText
          ]}>
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: '#EDEFEE',
  },
  categoryButton: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#D9D9D9',
  },
  selectedCategory: {
    backgroundColor: '#495E57',
  },
  categoryText: {
    color: '#333333',
    fontWeight: '500',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default CategoryList;