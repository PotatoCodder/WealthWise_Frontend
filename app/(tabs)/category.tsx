import { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Using Material icons

export default function CategoryTab() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const buttons = [
    { label: 'Food', icon: 'food' },
    { label: 'Transport', icon: 'bus' },
    { label: 'Medicine', icon: 'pill' },
    { label: 'Groceries', icon: 'cart' },
    { label: 'Rent', icon: 'home-city' },
    { label: 'Gift', icon: 'gift' },
    { label: 'Savings', icon: 'bank' },
    { label: 'Entertainment', icon: 'gamepad' },
    { label: 'More', icon: 'dots-horizontal' },
  ];

  return (
    <View style={styles.mainView}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.balanceText}>Total Balance:</Text>
        <Text style={styles.expenseText}>Total Expense:</Text>

        <View style={styles.secondaryView}>
          <View style={styles.grid}>
            {buttons.map((btn, index) => (
              <View key={index} style={styles.gridItem}>
                <TouchableOpacity style={styles.gridButton}>
                  <Icon name={btn.icon} size={32} color="#4E008E" />
                </TouchableOpacity>
                <Text style={styles.buttonLabel}>{btn.label}</Text>
              </View>
            ))}
          </View>
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
  },
  balanceText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 40,
    marginLeft: 24,
  },
  expenseText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    marginLeft: 24,
  },
  secondaryView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    paddingVertical: 50,
    paddingHorizontal: 30,
    marginTop: 180, // tighter top margin
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 28, // space between rows
  },
  gridButton: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F3E8FF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  buttonLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#4E008E',
    textAlign: 'center',
  },
});
