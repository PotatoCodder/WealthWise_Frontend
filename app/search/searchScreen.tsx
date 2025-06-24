import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';

const screenWidth = Dimensions.get('window').width;

export default function SearchScreen() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [reportType, setReportType] = useState('Income');

  return (
    <View style={styles.mainView}>
      {/* 🔷 Header */}
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

      {/* 🔘 Secondary View */}
      <View style={styles.secondaryView}>
        {/* 🔽 Category Dropdown Placeholder */}
        <Text style={styles.label}>Category</Text>
        <TextInput
          placeholder="Food, Entertainment, Rent, etc."
          placeholderTextColor="#aaa"
          style={styles.input}
          value={category}
          onChangeText={setCategory}
        />

        {/* 📅 Date Input */}
        <Text style={styles.label}>Date</Text>
        <TextInput
          placeholder="e.g. 2024-04"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={date}
          onChangeText={setDate}
        />

        {/* 📊 Report Type (Radio-style) */}
        <Text style={styles.label}>Report</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={[
              styles.radioButton,
              reportType === 'Income' && styles.radioActive,
            ]}
            onPress={() => setReportType('Income')}
          >
            <Text
              style={[
                styles.radioText,
                reportType === 'Income' && styles.radioTextActive,
              ]}
            >
              Income
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.radioButton,
              reportType === 'Expense' && styles.radioActive,
            ]}
            onPress={() => setReportType('Expense')}
          >
            <Text
              style={[
                styles.radioText,
                reportType === 'Expense' && styles.radioTextActive,
              ]}
            >
              Expense
            </Text>
          </TouchableOpacity>
        </View>

        {/* 🔍 Search Button */}
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => {
            // 🚀 Route to analysis or pass params
            router.push('/search/searchScreen');
          }}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
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
});
