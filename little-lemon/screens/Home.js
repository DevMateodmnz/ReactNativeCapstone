import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { initDatabase, saveMenuItems, getMenuItems, getCategories } from '../database/db';
import Header from './Header';
import HeroBanner from '../components/HeroBanner';
import CategoryList from '../components/CategoryList';
import MenuItem from '../components/MenuItem';

const Home = () => {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Initialize database
  useEffect(() => {
    initDatabase();
    fetchMenuData();
  }, []);

  // Fetch menu data from API or DB
  const fetchMenuData = async () => {
    try {
      // First check if we have data in DB
      getMenuItems({}, (dbItems) => {
        if (dbItems.length > 0) {
          setMenu(dbItems);
          extractCategories(dbItems);
          setLoading(false);
        } else {
          fetchRemoteData();
        }
      });
    } catch (error) {
      console.error('DB check error:', error);
      fetchRemoteData();
    }
  };

  // Fetch from remote API
  const fetchRemoteData = async () => {
    try {
      const response = await fetch('https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/menu.json');
      const { menu: remoteMenu } = await response.json();
      
      // Add categories to menu items (this would come from API in real app)
      const categorizedMenu = remoteMenu.map(item => ({
        ...item,
        category: getCategoryForItem(item.name)
      }));
      
      saveMenuItems(categorizedMenu);
      setMenu(categorizedMenu);
      extractCategories(categorizedMenu);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique categories
  const extractCategories = (items) => {
    const uniqueCategories = [...new Set(items.map(item => item.category))];
    setCategories(uniqueCategories);
  };

  // Search debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchText]);

  // Filter menu items based on selections
  useEffect(() => {
    getMenuItems(
      {
        categories: selectedCategories,
        searchText: debouncedSearch
      },
      (filteredItems) => setMenu(filteredItems)
    );
  }, [selectedCategories, debouncedSearch]);

  // Toggle category selection
  const handleToggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const handleSearchChange = (text) => {
    setSearchText(text);
  };

  // Render menu item
  const renderMenuItem = ({ item }) => (
    <MenuItem 
      name={item.name}
      price={item.price}
      description={item.description}
      imageUrl={`https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#495E57" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <HeroBanner 
        searchText={searchText}
        onSearchChange={handleSearchChange}
      />
      <CategoryList
        categories={categories}
        selectedCategories={selectedCategories}
        onToggleCategory={handleToggleCategory}
      />
      <FlatList
        data={menu}
        renderItem={renderMenuItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

// Helper function to categorize items (simplified)
const getCategoryForItem = (name) => {
  if (name.includes('Salad')) return 'Salads';
  if (name.includes('Dessert')) return 'Desserts';
  if (name.includes('Pasta')) return 'Mains';
  return 'Starters';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEFEE',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default Home;