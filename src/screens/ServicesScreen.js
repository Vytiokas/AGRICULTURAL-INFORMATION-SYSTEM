import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getServices } from '../database/firebaseDb';

export default function ServicesScreen({ navigation, route }) {
  const [services, setServices] = useState([]);
  const user = route.params?.user;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadServices();
    });
    return unsubscribe;
  }, [navigation]);

  const loadServices = async () => {
    const data = await getServices();
    setServices(data);
  };

  const getPriceUnitLabel = (unit) => {
    const units = {
      'ha': '/ha',
      'val': '/val',
      't': '/t',
      'darba': '/darbą',
      'diena': '/dieną',
      'km': '/km',
      'vnt': '/vnt',
      'kita': '',
    };
    return units[unit] || '';
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('ServiceDetail', { service: item })}
    >
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.placeholderImage}>
          <Ionicons name="construct" size={50} color="#4CAF50" />
        </View>
      )}
      
      <View style={styles.content}>
        <Text style={styles.title}>{item.serviceName}</Text>
        <Text style={styles.toolType}>Įrankis: {item.toolType}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>€{item.price || item.pricePerHectare}</Text>
            <Text style={styles.priceUnit}>{getPriceUnitLabel(item.priceUnit || 'ha')}</Text>
          </View>
          <View style={styles.providerInfo}>
            <Ionicons name="person" size={14} color="#666" />
            <Text style={styles.provider}>{item.providerName}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#4CAF50', '#81C784', '#f5f5f5']}
      style={styles.container}
      locations={[0, 0.15, 0.4]}
    >
      <FlatList
        data={services}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={services.length === 0 ? { flex: 1 } : { paddingBottom: 80 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="construct-outline" size={80} color="#ccc" />
            <Text style={styles.empty}>Kol kas nėra paslaugų</Text>
            <Text style={styles.emptySubtext}>Būkite pirmas ir pridėkite savo paslaugą!</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('AddService', { user })}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  toolType: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  priceUnit: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  provider: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#999',
    fontWeight: '600',
  },
  emptySubtext: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
    color: '#ccc',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  floatingButtonText: {
    color: 'white',
    fontSize: 32,
    fontWeight: '300',
  },
});
