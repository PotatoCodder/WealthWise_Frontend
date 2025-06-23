import { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  
} from 'react-native';

export default function AnalysisScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  return (
    <View style={styles.mainView}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          
        </View>
        <View style={styles.secondaryView}>
          <Text style={styles.heading}>Security Settings</Text>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email <Text style={styles.arrow}>&gt;</Text></Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
            />
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password <Text style={styles.arrow}>&gt;</Text></Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              placeholder="Enter new password"
              placeholderTextColor="#aaa"
              secureTextEntry
            />
          </View>

          {/* Repeat Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Repeat Password <Text style={styles.arrow}>&gt;</Text></Text>
            <TextInput
              value={repeatPassword}
              onChangeText={setRepeatPassword}
              style={styles.input}
              placeholder="Confirm new password"
              placeholderTextColor="#aaa"
              secureTextEntry
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Update Security Info</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: '#4E008E',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
    header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 32,
    paddingTop: 60,
  },
  secondaryView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 65,
    borderTopRightRadius: 65,
    padding: 24,
    marginTop: 120,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4E008E',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4E008E',
    marginBottom: 6,
    flexDirection: 'row',
  },
  arrow: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4E008E',
  },
  input: {
    borderWidth: 1,
    borderColor: '#4E008E',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#4E008E',
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 20,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
