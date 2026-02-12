import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ navigation }) {
  return (
    <LinearGradient
      colors={['#4CAF50', '#81C784', '#f5f5f5']}
      style={styles.container}
      locations={[0, 0.3, 1]}
    >
      <Text style={styles.title}>Agrolink</Text>
      <Text style={styles.subtitle}>Ūkininkų platforma</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Turgus')}
      >
        <Text style={styles.buttonText}>Technikos turgus</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Paslaugos')}
      >
        <Text style={styles.buttonText}>Ūkininkų paslaugos</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Naujienos')}
      >
        <Text style={styles.buttonText}>Naujienlaiškis</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Kalendorius')}
      >
        <Text style={styles.buttonText}>Kalendorius</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
