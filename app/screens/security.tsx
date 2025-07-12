import { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';

export default function SecurityScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const handleUpdatePassword = async () => {
    if (!email || !password || !repeatPassword) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }

    if (password !== repeatPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    try {
      const res = await fetch('http://192.168.0.104:3000/api/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert('Error', data.error || 'Something went wrong');
        return;
      }

      Alert.alert('Success', 'Password updated successfully!');
      setEmail('');
      setPassword('');
      setRepeatPassword('');
    } catch (err) {
      Alert.alert('Network Error', err.message);
    }
  };

  return (
    <View style={styles.mainView}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.secondaryView}>
          <Text style={styles.heading}>Security Settings</Text>

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

          <TouchableOpacity style={styles.button} onPress={handleUpdatePassword}>
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
