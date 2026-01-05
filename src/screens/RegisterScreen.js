import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { registerUser } from '../database/firebaseDb';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !name || !phone) {
      Alert.alert('Klaida', 'Užpildykite visus laukus');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Klaida', 'Slaptažodžiai nesutampa');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Klaida', 'Slaptažodis turi būti bent 6 simbolių');
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        email: email.toLowerCase(),
        password,
        name,
        phone
      });
      
      Alert.alert('Sėkmė', 'Paskyra sukurta! Dabar galite prisijungti.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        Alert.alert('Klaida', 'Toks el. paštas jau užregistruotas');
      } else {
        Alert.alert('Klaida', 'Registracijos klaida');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Registracija</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Vardas Pavardė"
          value={name}
          onChangeText={setName}
        />
        
        <TextInput
          style={styles.input}
          placeholder="El. paštas"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Telefonas"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Slaptažodis (min. 6 simboliai)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TextInput
          style={styles.input}
          placeholder="Pakartokite slaptažodį"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Registruotis</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.linkText}>Jau turite paskyrą? Prisijunkite</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    marginTop: 20,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#4CAF50',
    fontSize: 16,
  },
});