import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, TouchableOpacity, Linking, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function EquipmentDetailScreen({ route }) {
  const { item } = route.params;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const images = item.images && item.images.length > 0 ? item.images : (item.imageUrl ? [item.imageUrl] : []);

  const handleCall = () => {
    Linking.openURL(`tel:${item.sellerPhone}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {images.length > 0 && (
          <View>
            <ScrollView 
              horizontal 
              pagingEnabled 
              showsHorizontalScrollIndicator={false}
              onScroll={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / width);
                setActiveImageIndex(index);
              }}
              scrollEventThrottle={16}
            >
              {images.map((imageUrl, index) => (
                <Image key={index} source={{ uri: imageUrl }} style={styles.image} />
              ))}
            </ScrollView>
            {images.length > 1 && (
              <View style={styles.pagination}>
                {images.map((_, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.paginationDot,
                      index === activeImageIndex && styles.paginationDotActive
                    ]} 
                  />
                ))}
              </View>
            )}
          </View>
        )}
        
        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>
          
          <Text style={styles.price}>€{item.price}</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Aprašymas</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pardavėjas</Text>
            <Text style={styles.sellerName}>{item.sellerName}</Text>
            <Text style={styles.sellerPhone}>{item.sellerPhone}</Text>
          </View>

          <TouchableOpacity style={styles.callButton} onPress={handleCall}>
            <Text style={styles.callButtonText}>Skambinti</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: width,
    height: 300,
    resizeMode: 'cover',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: 'white',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  sellerName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  sellerPhone: {
    fontSize: 16,
    color: '#666',
  },
  callButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  callButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
