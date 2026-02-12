import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

export default function NewsScreen() {
  const newsPortals = [
    {
      id: 1,
      name: 'Žemės ūkio ministerija',
      description: 'Oficialios naujienos ir informacija ūkininkams',
      url: 'https://zum.lrv.lt/',
      icon: 'newspaper-outline',
    },
    {
      id: 2,
      name: 'Lietuvos žemės ūkio konsultavimo tarnyba',
      description: 'Konsultacijos, mokymai ir naujienos',
      url: 'https://www.lzukt.lt/',
      icon: 'school-outline',
    },
    {
      id: 3,
      name: 'Nacionalinė mokėjimo agentūra',
      description: 'Informacija apie paramą ir išmokas',
      url: 'https://www.nma.lt/',
      icon: 'cash-outline',
    },
    {
      id: 4,
      name: 'Agroakademija',
      description: 'Žemės ūkio naujienos ir straipsniai',
      url: 'https://www.agroakademija.lt/',
      icon: 'book-outline',
    },
    {
      id: 5,
      name: 'Agro Žinios',
      description: 'Ūkininkų naujienos ir rinkos informacija',
      url: 'https://www.agrozinios.lt/',
      icon: 'trending-up-outline',
    },
    {
      id: 6,
      name: 'Mano ūkis',
      description: 'Praktiniai patarimai ir naujienos ūkininkams',
      url: 'https://www.manokis.lt/',
      icon: 'leaf-outline',
    },
  ];

  const openURL = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log("Negalima atidaryti URL: " + url);
      }
    } catch (error) {
      console.error('Klaida atidarant URL:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#4CAF50" />
      <LinearGradient
        colors={['#4CAF50', '#81C784', '#f5f5f5']}
        style={styles.gradient}
        locations={[0, 0.2, 0.5]}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Naujienos ir informacija</Text>
            <Text style={styles.headerSubtitle}>Lietuviški ūkininkų portalai</Text>
          </View>

          {newsPortals.map(portal => (
            <TouchableOpacity 
              key={portal.id} 
              style={styles.card}
              onPress={() => openURL(portal.url)}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={portal.icon} size={32} color="#4CAF50" />
              </View>
              <View style={styles.contentContainer}>
                <Text style={styles.title}>{portal.name}</Text>
                <Text style={styles.description}>{portal.description}</Text>
                <View style={styles.linkContainer}>
                  <Ionicons name="open-outline" size={16} color="#4CAF50" />
                  <Text style={styles.linkText}>Atidaryti portalą</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 50,
  },
  header: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 25,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.95)',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    margin: 10,
    marginTop: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 5,
  },
});
