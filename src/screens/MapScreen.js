import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, SafeAreaView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';

export default function MapScreen() {
  const [region, setRegion] = useState({
    latitude: 55.1694, // Lietuvos centras
    longitude: 23.8813,
    latitudeDelta: 2.5,
    longitudeDelta: 2.5,
  });
  const [userLocation, setUserLocation] = useState(null);

  const locations = [
    { 
      id: 1, 
      name: 'Ūkininko kooperatyvas', 
      type: 'Kooperatyvas',
      latitude: 54.8985,
      longitude: 23.9036,
      description: 'Kauno regiono kooperatyvas'
    },
    { 
      id: 2, 
      name: 'Technikos servisas', 
      type: 'Servisas',
      latitude: 54.6872,
      longitude: 25.2797,
      description: 'Vilniaus technikos remontas'
    },
    { 
      id: 3, 
      name: 'Grūdų supirkimas', 
      type: 'Supirkimas',
      latitude: 55.9349,
      longitude: 23.3144,
      description: 'Šiaulių grūdų supirkimo punktas'
    },
    { 
      id: 4, 
      name: 'Veterinarijos klinika', 
      type: 'Veterinarija',
      latitude: 55.7033,
      longitude: 21.1443,
      description: 'Klaipėdos veterinarijos centras'
    },
  ];

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Vietos leidimas nesuteiktas');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      });
    } catch (error) {
      console.log('Klaida gaunant vietą:', error);
    }
  };

  const getMarkerColor = (type) => {
    switch(type) {
      case 'Kooperatyvas': return '#4CAF50';
      case 'Servisas': return '#2196F3';
      case 'Supirkimas': return '#FF9800';
      case 'Veterinarija': return '#F44336';
      default: return '#4CAF50';
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Žemės spindulys km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance.toFixed(1);
  };

  return (
    <View style={styles.outerContainer}>
      <StatusBar style="light" backgroundColor="#4CAF50" />
      <LinearGradient
        colors={['#4CAF50', '#81C784', '#f5f5f5']}
        style={styles.container}
        locations={[0, 0.1, 0.3]}
      >
        <SafeAreaView style={styles.safeArea}>
          <MapView
            style={styles.map}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            region={region}
            onRegionChangeComplete={setRegion}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {locations.map(location => (
              <Marker
                key={location.id}
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title={location.name}
                description={location.description}
                pinColor={getMarkerColor(location.type)}
              />
            ))}
          </MapView>

          <TouchableOpacity 
            style={styles.myLocationButton}
            onPress={getUserLocation}
          >
            <Ionicons name="locate" size={24} color="#4CAF50" />
          </TouchableOpacity>
          
          <View style={styles.locationsList}>
            <Text style={styles.listTitle}>Artimiausi objektai:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {locations.map(location => {
                const distance = userLocation 
                  ? calculateDistance(
                      userLocation.latitude, 
                      userLocation.longitude,
                      location.latitude,
                      location.longitude
                    )
                  : '—';
                
                return (
                  <View key={location.id} style={styles.locationCard}>
                    <View style={[styles.typeIndicator, { backgroundColor: getMarkerColor(location.type) }]} />
                    <Text style={styles.locationName}>{location.name}</Text>
                    <Text style={styles.locationType}>{location.type}</Text>
                    <View style={styles.distanceContainer}>
                      <Ionicons name="navigate" size={14} color="#4CAF50" />
                      <Text style={styles.distance}>{distance} km</Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  myLocationButton: {
    position: 'absolute',
    bottom: 200,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  locationsList: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: 180,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 5,
    color: '#333',
  },
  locationCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    marginRight: 10,
    width: 160,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  typeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: 12,
    right: 12,
  },
  locationName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  locationType: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginLeft: 4,
  },
});
