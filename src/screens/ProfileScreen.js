import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getUserEquipment, deleteEquipment } from '../database/firebaseDb';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileScreen({ user, onLogout, navigation }) {
  const [userEquipment, setUserEquipment] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      loadUserEquipment();
    }, [])
  );

  const loadUserEquipment = async () => {
    const equipment = await getUserEquipment(user.id);
    setUserEquipment(equipment);
  };

  const handleDeleteEquipment = (item) => {
    Alert.alert(
      'Ištrinti skelbimą',
      `Ar tikrai norite ištrinti "${item.title}"?`,
      [
        { text: 'Atšaukti', style: 'cancel' },
        {
          text: 'Ištrinti',
          style: 'destructive',
          onPress: async () => {
            await deleteEquipment(item.id, user.id);
            loadUserEquipment();
          }
        }
      ]
    );
  };

  const renderEquipmentItem = ({ item }) => (
    <View style={styles.equipmentCard}>
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.equipmentImage} />
      )}
      <View style={styles.equipmentContent}>
        <Text style={styles.equipmentTitle}>{item.title}</Text>
        <Text style={styles.equipmentPrice}>€{item.price}</Text>
        <View style={styles.equipmentActions}>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => navigation.navigate('EquipmentDetail', { item })}
          >
            <Text style={styles.viewButtonText}>Peržiūrėti</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteEquipment(item)}
          >
            <Text style={styles.deleteButtonText}>Ištrinti</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#4CAF50', '#81C784', '#A5D6A7', '#f5f5f5']}
      style={styles.container}
      locations={[0, 0.15, 0.35, 0.6]}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Mano profilis</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutButtonText}>Atsijungti</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.userPhone}>{user.phone}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mano skelbimai ({userEquipment.length})</Text>
          <FlatList
            data={userEquipment}
            renderItem={renderEquipmentItem}
            keyExtractor={item => item.id.toString()}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Dar neturite skelbimų</Text>
            }
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  userInfo: {
    backgroundColor: 'transparent',
    padding: 20,
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#555',
    marginBottom: 3,
  },
  userPhone: {
    fontSize: 16,
    color: '#555',
  },
  section: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  equipmentCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  equipmentImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  equipmentContent: {
    padding: 15,
  },
  equipmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  equipmentPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  equipmentActions: {
    flexDirection: 'row',
    gap: 10,
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  viewButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 50,
  },
});