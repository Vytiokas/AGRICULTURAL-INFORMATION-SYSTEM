import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { addService } from '../database/firebaseDb';

export default function AddServiceScreen({ navigation, route, user: propUser }) {
  const user = route.params?.user || propUser;
  const [serviceName, setServiceName] = useState('');
  const [toolType, setToolType] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [priceUnit, setPriceUnit] = useState('ha'); // Default: už hektarą
  const [providerName, setProviderName] = useState(user?.name || '');
  const [providerPhone, setProviderPhone] = useState(user?.phone || '');
  const [imageUrl, setImageUrl] = useState('');
  const [showUnitPicker, setShowUnitPicker] = useState(false);

  const priceUnits = [
    { value: 'ha', label: 'už hektarą (ha)' },
    { value: 'val', label: 'už valandą (val)' },
    { value: 't', label: 'už toną (t)' },
    { value: 'darba', label: 'už darbą' },
    { value: 'diena', label: 'už dieną' },
    { value: 'km', label: 'už kilometrą (km)' },
    { value: 'vnt', label: 'už vienetą (vnt)' },
    { value: 'kita', label: 'kita' },
  ];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Klaida', 'Reikalingas leidimas pasiekti nuotraukas');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    // Validacija - privalomi laukai
    if (!serviceName.trim()) {
      Alert.alert('Klaida', 'Įveskite paslaugos pavadinimą');
      return;
    }

    if (!toolType.trim()) {
      Alert.alert('Klaida', 'Įveskite įrankio tipą');
      return;
    }

    if (!providerName.trim()) {
      Alert.alert('Klaida', 'Įveskite vardą ir pavardę');
      return;
    }

    if (!providerPhone.trim()) {
      Alert.alert('Klaida', 'Įveskite telefono numerį');
      return;
    }

    if (!price || isNaN(price)) {
      Alert.alert('Klaida', 'Įveskite teisingą kainą');
      return;
    }

    try {
      await addService({
        serviceName: serviceName.trim(),
        toolType: toolType.trim(),
        description: description.trim(),
        price: parseFloat(price),
        priceUnit: priceUnit,
        providerName: providerName.trim(),
        providerPhone: providerPhone.trim(),
        imageUrl: imageUrl || null,
        userId: user?.id,
      });

      Alert.alert('Sėkmė', 'Paslauga sėkmingai pridėta!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Klaida', 'Nepavyko pridėti paslaugos');
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Paslaugos informacija</Text>

        <Text style={styles.label}>Paslaugos pavadinimas *</Text>
        <TextInput
          style={styles.input}
          placeholder="Pvz: Laukų kultivavimas, Sėja, Derliaus nuėmimas"
          value={serviceName}
          onChangeText={setServiceName}
        />

        <Text style={styles.label}>Įrankio tipas *</Text>
        <TextInput
          style={styles.input}
          placeholder="Pvz: Traktorius John Deere, Kombajnas, Kultivatorius"
          value={toolType}
          onChangeText={setToolType}
        />

        <Text style={styles.label}>Aprašymas</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Detalus paslaugos aprašymas..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Kaina (€) *</Text>
        <View style={styles.priceInputContainer}>
          <TextInput
            style={[styles.input, styles.priceInput]}
            placeholder="0.00"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
          />
          <TouchableOpacity 
            style={styles.unitSelector}
            onPress={() => setShowUnitPicker(!showUnitPicker)}
          >
            <Text style={styles.unitText}>
              {priceUnits.find(u => u.value === priceUnit)?.label || 'Pasirinkite'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {showUnitPicker && (
          <View style={styles.unitPicker}>
            {priceUnits.map(unit => (
              <TouchableOpacity
                key={unit.value}
                style={[
                  styles.unitOption,
                  priceUnit === unit.value && styles.unitOptionSelected
                ]}
                onPress={() => {
                  setPriceUnit(unit.value);
                  setShowUnitPicker(false);
                }}
              >
                <Text style={[
                  styles.unitOptionText,
                  priceUnit === unit.value && styles.unitOptionTextSelected
                ]}>
                  {unit.label}
                </Text>
                {priceUnit === unit.value && (
                  <Ionicons name="checkmark" size={20} color="#4CAF50" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.sectionTitle}>Kontaktinė informacija</Text>

        <Text style={styles.label}>Vardas ir pavardė *</Text>
        <TextInput
          style={styles.input}
          placeholder="Jūsų vardas ir pavardė"
          value={providerName}
          onChangeText={setProviderName}
        />

        <Text style={styles.label}>Telefono numeris *</Text>
        <TextInput
          style={styles.input}
          placeholder="+370 XXX XXXXX"
          value={providerPhone}
          onChangeText={setProviderPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.sectionTitle}>Nuotrauka (neprivaloma)</Text>

        {imageUrl ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <TouchableOpacity 
              style={styles.removeImageButton}
              onPress={() => setImageUrl('')}
            >
              <Ionicons name="close-circle" size={30} color="#F44336" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            <Ionicons name="camera" size={40} color="#4CAF50" />
            <Text style={styles.imagePickerText}>Pridėti nuotrauką</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Paskelbti paslaugą</Text>
        </TouchableOpacity>

        <Text style={styles.requiredNote}>* Privalomi laukai</Text>
      </View>
    </ScrollView>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
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
  priceInputContainer: {
    marginBottom: 15,
  },
  priceInput: {
    marginBottom: 10,
  },
  unitSelector: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unitText: {
    fontSize: 16,
    color: '#333',
  },
  unitPicker: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  unitOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unitOptionSelected: {
    backgroundColor: '#e8f5e9',
  },
  unitOptionText: {
    fontSize: 16,
    color: '#333',
  },
  unitOptionTextSelected: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePicker: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  imagePickerText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 15,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  requiredNote: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginBottom: 30,
  },
});
