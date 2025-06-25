// 🔥 Updated SearchScreen.js with search + loading + API fetch

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

export default function SearchScreen() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [reportType, setReportType] = useState('Income');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setResults([]);

      const userData = await AsyncStorage.getItem('user');
      const user = JSON.parse(userData || '{}');

      const response = await fetch(
        `http://192.168.0.105:3000/api/search-report?userId=${user.email}&category=${category}&date=${date}&type=${reportType}`
      );

      const data = await response.json();
      if (response.ok) {
        setResults(data.entries || []);
      } else {
        console.error('❌ API Error:', data.error);
      }
    } catch (err) {
      console.error('🔥 Search Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainView}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/user.png')}
          style={styles.profileImage}
        />
        <Text style={styles.greetingText}>Search Report</Text>
        <TouchableOpacity onPress={() => router.push('/screens/analysis')}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.secondaryView}>
        <Text style={styles.label}>Category</Text>
        <TextInput
          placeholder="Food, Entertainment, Rent, etc."
          placeholderTextColor="#aaa"
          style={styles.input}
          value={category}
          onChangeText={setCategory}
        />

        <Text style={styles.label}>Date</Text>
        <TextInput
          placeholder="e.g. 2024-04"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={date}
          onChangeText={setDate}
        />

        <Text style={styles.label}>Report</Text>
        <View style={styles.radioGroup}>
          {['Income', 'Expense'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.radioButton, reportType === type && styles.radioActive]}
              onPress={() => setReportType(type)}
            >
              <Text style={[styles.radioText, reportType === type && styles.radioTextActive]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#4E008E" />}

        {/* 📃 Results Section */}
        {results.map((item, idx) => (
          <View key={idx} style={styles.resultCard}>
            <Text style={styles.resultTitle}>{item.title}</Text>
            <Text style={styles.resultDetails}>₱{item.amount} • {item.date}</Text>
            <Text style={styles.resultNotes}>{item.notes || 'No notes.'}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: { flex: 1, backgroundColor: '#4E008E' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 32,
    paddingTop: 60,
  },
  profileImage: { width: 45, height: 45, borderRadius: 20 },
  greetingText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  secondaryView: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 65,
    borderTopRightRadius: 65,
    padding: 30,
    marginTop: 40,
  },
  label: {
    fontSize: 16,
    color: '#4E008E',
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#4E008E',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  radioButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 25,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 10,
  },
  radioActive: {
    backgroundColor: '#4E008E',
    borderColor: '#4E008E',
  },
  radioText: {
    color: '#4E008E',
    fontWeight: '600',
  },
  radioTextActive: {
    color: '#fff',
  },
  searchButton: {
    backgroundColor: '#4E008E',
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 30,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultCard: {
    marginTop: 20,
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4E008E',
  },
  resultDetails: {
    marginTop: 4,
    color: '#555',
  },
  resultNotes: {
    fontStyle: 'italic',
    marginTop: 4,
    color: '#999',
  },
});
