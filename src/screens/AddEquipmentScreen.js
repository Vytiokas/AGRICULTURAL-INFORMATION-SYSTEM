import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { addEquipment } from '../database/firebaseDb';
import { uploadImage } from '../config/cloudinary';

export default function AddEquipmentScreen({ navigation, user }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [sellerName, setSellerName] = useState(user?.name || '');
  const [sellerPhone, setSellerPhone] = useState(user?.phone || '');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Klaida', 'Reikalingas leidimas pasiekti nuotraukas');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets.map(asset => asset.uri)]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Klaida', 'Reikalingas leidimas naudoti kamerą');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title || !price || !sellerName || !sellerPhone) {
      Alert.alert('Klaida', 'Užpildykite visus privalomus laukus');
      return;
    }

    setLoading(true);

    try {
      // Upload images to Cloudinary
      const uploadedUrls = [];
      for (const imageUri of images) {
        const url = await uploadImage(imageUri);
        if (url) uploadedUrls.push(url);
      }

      // Save to database
      await addEquipment({
        title,
        description,
        price: parseFloat(price),
        sellerName,
        sellerPhone,
        imageUrl: uploadedUrls[0] || null, // Main image
        images: uploadedUrls, // All images
        userId: user.id, // Prisijungusio vartotojo ID
      });

      Alert.alert('Sėkmė', 'Skelbimas pridėtas!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Klaida', 'Nepavyko pridėti skelbimo');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Pridėti skelbimą</Text>

      <Text style={styles.label}>Pavadinimas *</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Pvz: Traktorius John Deere"
      />

      <Text style={styles.label}>Aprašymas</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Detalus aprašymas..."
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Kaina (€) *</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="0.00"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Jūsų vardas *</Text>
      <TextInput
        style={styles.input}
        value={sellerName}
        onChangeText={setSellerName}
        placeholder="Vardas Pavardė"
      />

      <Text style={styles.label}>Telefonas *</Text>
      <TextInput
        style={styles.input}
        value={sellerPhone}
        onChangeText={setSellerPhone}
        placeholder="+370 600 00000"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Nuotraukos</Text>
      <View style={styles.imageButtons}>
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Text style={styles.imageButtonText}>📁 Galerija</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
          <Text style={styles.imageButtonText}>📷 Kamera</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal style={styles.imagePreview}>
        {images.map((uri, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeImage(index)}
            >
              <Text style={styles.removeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.submitButtonText}>Pridėti skelbimą</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  imageButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  imageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  imagePreview: {
    marginTop: 15,
  },
  imageContainer: {
    marginRight: 10,
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
