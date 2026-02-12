import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ServiceDetailScreen({ route }) {
  const { service } = route.params;

  const getPriceUnitLabel = (unit) => {
    const units = {
      'ha': 'už hektarą',
      'val': 'už valandą',
      't': 'už toną',
      'darba': 'už darbą',
      'diena': 'už dieną',
      'km': 'už kilometrą',
      'vnt': 'už vienetą',
      'kita': '',
    };
    return units[unit] || '';
  };

  const handleCall = () => {
    const phoneNumber = service.providerPhone.replace(/\s/g, '');
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleMessage = () => {
    const phoneNumber = service.providerPhone.replace(/\s/g, '');
    Linking.openURL(`sms:${phoneNumber}`);
  };

  return (
    <ScrollView style={styles.container}>
      {service.imageUrl ? (
        <Image source={{ uri: service.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.placeholderImage}>
          <Ionicons name="construct" size={80} color="#4CAF50" />
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{service.serviceName}</Text>
        
        <View style={styles.toolTypeContainer}>
          <Ionicons name="build" size={20} color="#4CAF50" />
          <Text style={styles.toolType}>{service.toolType}</Text>
        </View>

        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>Kaina</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>€{service.price || service.pricePerHectare}</Text>
            <Text style={styles.priceUnit}> {getPriceUnitLabel(service.priceUnit || 'ha')}</Text>
          </View>
        </View>

        {service.description ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Aprašymas</Text>
            <Text style={styles.description}>{service.description}</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paslaugos teikėjas</Text>
          <View style={styles.providerCard}>
            <View style={styles.providerInfo}>
              <Ionicons name="person-circle" size={50} color="#4CAF50" />
              <View style={styles.providerDetails}>
                <Text style={styles.providerName}>{service.providerName}</Text>
                <Text style={styles.providerPhone}>{service.providerPhone}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.contactButtons}>
          <TouchableOpacity style={styles.callButton} onPress={handleCall}>
            <Ionicons name="call" size={24} color="white" />
            <Text style={styles.buttonText}>Skambinti</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
            <Ionicons name="chatbubble" size={24} color="white" />
            <Text style={styles.buttonText}>Žinutė</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
  },
  placeholderImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  toolTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 8,
  },
  toolType: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 10,
  },
  priceCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  priceUnit: {
    fontSize: 18,
    color: '#666',
    marginLeft: 5,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  providerCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerDetails: {
    marginLeft: 15,
    flex: 1,
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  providerPhone: {
    fontSize: 16,
    color: '#666',
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    marginBottom: 30,
  },
  callButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  messageButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
