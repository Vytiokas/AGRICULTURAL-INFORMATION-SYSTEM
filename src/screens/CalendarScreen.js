import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { getCalendarEvents, addCalendarEvent } from '../database/firebaseDb';

export default function CalendarScreen() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState({ 
    title: '', 
    description: '', 
    eventType: 'Darbai' 
  });

  const eventTypes = ['Darbai', 'Sėja', 'Derliaus nuėmimas', 'Tręšimas', 'Technika', 'Kita'];

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const data = await getCalendarEvents();
    setEvents(data);
  };

  const handleAddEvent = async () => {
    if (!newEvent.title.trim()) {
      Alert.alert('Klaida', 'Įveskite įvykio pavadinimą');
      return;
    }

    try {
      await addCalendarEvent({
        title: newEvent.title.trim(),
        description: newEvent.description.trim(),
        eventDate: selectedDate.getTime(),
        eventType: newEvent.eventType,
      });

      await loadEvents();
      setModalVisible(false);
      setNewEvent({ title: '', description: '', eventType: 'Darbai' });
      Alert.alert('Sėkmė', 'Įvykis sėkmingai pridėtas!');
    } catch (error) {
      Alert.alert('Klaida', 'Nepavyko pridėti įvykio');
      console.error(error);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(selectedDate);
    const days = [];
    const monthNames = ['Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Birželis', 
                        'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'];
    const dayNames = ['S', 'P', 'A', 'T', 'K', 'Pn', 'Š'];

    // Empty cells before first day
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
      const hasEvent = events.some(event => {
        const eventDate = new Date(event.eventDate);
        return eventDate.toDateString() === date.toDateString();
      });

      days.push(
        <TouchableOpacity 
          key={day} 
          style={[styles.dayCell, hasEvent && styles.dayWithEvent]}
          onPress={() => {
            setSelectedDate(date);
            setModalVisible(true);
          }}
        >
          <Text style={[styles.dayText, hasEvent && styles.dayTextWithEvent]}>{day}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.calendarContainer}>
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={() => changeMonth(-1)}>
            <Text style={styles.navButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </Text>
          <TouchableOpacity onPress={() => changeMonth(1)}>
            <Text style={styles.navButton}>→</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.dayNamesRow}>
          {dayNames.map(name => (
            <View key={name} style={styles.dayNameCell}>
              <Text style={styles.dayNameText}>{name}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.daysGrid}>{days}</View>
      </View>
    );
  };

  const changeMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  const renderEventsList = () => {
    const todayEvents = events.filter(event => {
      const eventDate = new Date(event.eventDate);
      return eventDate.toDateString() === selectedDate.toDateString();
    });

    return (
      <View style={styles.eventsSection}>
        <Text style={styles.eventsTitle}>
          Įvykiai {selectedDate.toLocaleDateString('lt-LT')}
        </Text>
        {todayEvents.length > 0 ? (
          todayEvents.map(event => (
            <View key={event.id} style={styles.eventCard}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventType}>{event.eventType}</Text>
              <Text style={styles.eventDescription}>{event.description}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noEvents}>Šią dieną įvykių nėra</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.outerContainer}>
      <StatusBar style="light" backgroundColor="#4CAF50" />
      <LinearGradient
        colors={['#4CAF50', '#81C784', '#f5f5f5']}
        style={styles.container}
        locations={[0, 0.15, 0.4]}
      >
        <ScrollView>
          {renderCalendar()}
          {renderEventsList()}
        </ScrollView>

        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Pridėti įvykį</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={28} color="#333" />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalDate}>
                Data: {selectedDate.toLocaleDateString('lt-LT')}
              </Text>

              <Text style={styles.label}>Pavadinimas *</Text>
              <TextInput
                style={styles.input}
                placeholder="Pvz: Laukų kultivavimas"
                value={newEvent.title}
                onChangeText={(text) => setNewEvent({...newEvent, title: text})}
              />

              <Text style={styles.label}>Tipas</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeSelector}>
                {eventTypes.map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      newEvent.eventType === type && styles.typeButtonSelected
                    ]}
                    onPress={() => setNewEvent({...newEvent, eventType: type})}
                  >
                    <Text style={[
                      styles.typeButtonText,
                      newEvent.eventType === type && styles.typeButtonTextSelected
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.label}>Aprašymas</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Papildoma informacija..."
                value={newEvent.description}
                onChangeText={(text) => setNewEvent({...newEvent, description: text})}
                multiline
                numberOfLines={4}
              />

              <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
                <Text style={styles.addButtonText}>Pridėti įvykį</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  calendarContainer: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  navButton: {
    fontSize: 24,
    color: '#4CAF50',
    paddingHorizontal: 15,
  },
  dayNamesRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dayNameCell: {
    flex: 1,
    alignItems: 'center',
  },
  dayNameText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  dayWithEvent: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
  },
  dayText: {
    fontSize: 14,
    color: '#333',
  },
  dayTextWithEvent: {
    color: 'white',
    fontWeight: 'bold',
  },
  eventsSection: {
    margin: 10,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  eventCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  eventType: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
  },
  noEvents: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  modalDate: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 10,
    color: '#555',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeSelector: {
    marginBottom: 10,
  },
  typeButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  typeButtonSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#666',
  },
  typeButtonTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
