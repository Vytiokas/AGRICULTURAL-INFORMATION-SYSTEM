import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { getEquipment } from '../database/firebaseDb';
import { useFocusEffect } from '@react-navigation/native';

export default function MarketplaceScreen({ navigation }) {
  const [equipment, setEquipment] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      loadEquipment();
    }, [])
  );

  const loadEquipment = async () => {
    const data = await getEquipment();
    setEquipment(data);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('EquipmentDetail', { item })}
    >
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      )}
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.price}>€{item.price}</Text>
        <Text style={styles.seller}>{item.sellerName} - {item.sellerPhone}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={equipment}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.empty}>Kol kas nėra skelbimų</Text>
          </View>
        }
        contentContainerStyle={equipment.length === 0 ? { flex: 1 } : { paddingBottom: 80 }}
        contentInsetAdjustmentBehavior="automatic"
      />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('AddEquipment')}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  seller: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    fontSize: 16,
    color: '#999',
  },
});
