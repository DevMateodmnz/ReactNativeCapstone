import { useNavigation } from '@react-navigation/native';

const Header = () => {
  const navigation = useNavigation();
  
  return (
    <View style={headerStyles.container}>
      <Image 
        source={require('../assets/Logo.png')} 
        style={headerStyles.logo} 
      />
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Image 
          source={require('../assets/avatar.png')} 
          style={headerStyles.avatar} 
        />
      </TouchableOpacity>
    </View>
  );
};

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#F4CE14',
  },
  logo: {
    height: 50,
    width: 150,
    resizeMode: 'contain',
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
});

// Add <Header /> at top of Home component