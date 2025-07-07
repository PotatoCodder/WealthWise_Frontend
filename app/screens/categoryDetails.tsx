import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function CategoryDetails() {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formType, setFormType] = useState('Expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryItems, setCategoryItems] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountItems, setAccountItems] = useState([]);
  const [fromAccount, setFromAccount] = useState(null);
  const [fromOpen, setFromOpen] = useState(false);
  const [toAccount, setToAccount] = useState(null);
  const [toOpen, setToOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const expenseCategories = [
    { label: '🍔 Food', value: 'Food' },
    { label: '💊 Pill', value: 'Pill' },
    { label: '🚌 Transport', value: 'Transport' },
    { label: '🧪 Medicine', value: 'Medicine' },
    { label: '🛒 Groceries', value: 'Groceries' },
    { label: '🏠 Rent', value: 'Rent' },
    { label: '🎁 Gift', value: 'Gift' },
    { label: '💰 Savings', value: 'Savings' },
    { label: '🎉 Entertainment', value: 'Entertainment' },
  ];

  const incomeCategories = [
    { label: '🏘️ Rental', value: 'Rental' },
    { label: '💼 Salary', value: 'Salary' },
    { label: '🎲 Lottery', value: 'Lottery' },
    { label: '🏅 Awards', value: 'Awards' },
    { label: '🎓 Grants', value: 'Grants' },
    { label: '💸 Refunds', value: 'Refunds' },
  ];

  const accountTypes = [
    { label: '💵 Cash', value: 'Cash' },
    { label: '💳 Card', value: 'Card' },
    { label: '🏦 Savings', value: 'Savings' },
  ];

  useEffect(() => {
    const fetchUserAndExpenses = async () => {
      const userData = await AsyncStorage.getItem('user');
      const parsedUser = JSON.parse(userData || '{}');
      setUser(parsedUser);
      if (parsedUser.email) {
        fetchAllExpenses(parsedUser.email);
      }
    };
    fetchUserAndExpenses();
  }, []);

  useEffect(() => {
    if (formType === 'Expense') {
      setCategoryItems(expenseCategories);
    } else if (formType === 'Income') {
      setCategoryItems(incomeCategories);
    } else {
      setCategoryItems([]);
    }
    setAccountItems(accountTypes);
  }, [formType]);

  const fetchAllExpenses = async (userId) => {
    try {
      const res = await fetch(`http://192.168.0.104:3000/api/get-expenses?userId=${userId}`);
      const data = await res.json();
      if (res.ok) {
        setExpenses(data.expenses || []);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async () => {
    if (!user?.email) return;

    const commonFields = {
      amount: parseFloat(amount),
      notes,
      date,
      userId: user.email,
    };

    if (formType === 'Transfer') {
      if (!fromAccount || !toAccount || !amount || !date || fromAccount === toAccount) {
        alert('Fill all transfer fields properly');
        return;
      }
      const transferData = {
        ...commonFields,
        fromAccount,
        toAccount,
      };
      await fetch('http://192.168.0.101:3000/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transferData),
      });
      alert('Transfer saved!');
    } else if (formType === 'Income') {
      if (!title || !selectedCategory || !selectedAccount || !amount || !date) {
        alert('Fill all income fields');
        return;
      }
      const incomeData = {
        ...commonFields,
        title,
        category: selectedCategory,
        account: selectedAccount,
      };
      await fetch('http://192.168.0.101:3000/api/add-income', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incomeData),
      });
      alert('Income saved!');
    } else {
      if (!title || !selectedCategory || !selectedAccount || !amount || !date) {
        alert('Fill all expense fields');
        return;
      }
      const expenseData = {
        ...commonFields,
        title,
        category: selectedCategory,
        account: selectedAccount,
      };
      await fetch('http://192.168.0.101:3000/api/add-expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData),
      });
      alert('Expense saved!');
    }

    setTitle('');
    setAmount('');
    setNotes('');
    setDate('');
    setSelectedCategory(null);
    setSelectedAccount(null);
    setFromAccount(null);
    setToAccount(null);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#4E008E" />
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 10 }}>
              <Text>{item.title} - ₱{item.amount}</Text>
              <Text>{item.category} - {item.date}</Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{ marginTop: 20, backgroundColor: '#4E008E', padding: 12, borderRadius: 10 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Add</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add {formType}</Text>

            <View style={styles.switchButtons}>
              {['Expense', 'Income', 'Transfer'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.switchButton, formType === type && styles.activeSwitch]}
                  onPress={() => setFormType(type)}>
                  <Text style={formType === type ? styles.activeText : styles.inactiveText}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

          {formType !== 'Transfer' && (
            <>
              <Text style={styles.label}>Category</Text>
              <View style={styles.inputWrapper}>
                <DropDownPicker
                  open={categoryOpen}
                  value={selectedCategory}
                  items={categoryItems}
                  setOpen={setCategoryOpen}
                  setValue={setSelectedCategory}
                  setItems={setCategoryItems}
                  placeholder="Select Category"
                  zIndex={3000}
                  zIndexInverse={1000}
                />
              </View>
            </>
          )}

          {(formType === 'Expense' || formType === 'Income') && (
            <>
              <Text style={styles.label}>Account</Text>
              <View style={styles.inputWrapper}>
                <DropDownPicker
                  open={accountOpen}
                  value={selectedAccount}
                  items={accountItems}
                  setOpen={setAccountOpen}
                  setValue={setSelectedAccount}
                  setItems={setAccountItems}
                  placeholder="Select Account"
                  zIndex={2000}
                  zIndexInverse={2000}
                />
              </View>
            </>
          )}

          {formType !== 'Transfer' && (
            <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
          )}
          <TextInput style={styles.input} placeholder="Amount" keyboardType="numeric" value={amount} onChangeText={setAmount} />
          <TextInput style={styles.input} placeholder="Notes" value={notes} onChangeText={setNotes} />
          <TextInput style={styles.input} placeholder="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} />

          {formType === 'Transfer' && (
            <>
              <Text style={styles.label}>From Account</Text>
              <View style={styles.inputWrapper}>
                <DropDownPicker
                  open={fromOpen}
                  value={fromAccount}
                  items={accountItems}
                  setOpen={setFromOpen}
                  setValue={setFromAccount}
                  setItems={setAccountItems}
                  placeholder="Select From"
                  zIndex={3000}
                  zIndexInverse={1000}
                />
              </View>

              <Text style={styles.label}>To Account</Text>
              <View style={styles.inputWrapper}>
                <DropDownPicker
                  open={toOpen}
                  value={toAccount}
                  items={accountItems}
                  setOpen={setToOpen}
                  setValue={setToAccount}
                  setItems={setAccountItems}
                  placeholder="Select To"
                  zIndex={2000}
                  zIndexInverse={2000}
                />
              </View>
            </>
          )}
            <TouchableOpacity style={styles.modalButton} onPress={handleAddExpense}>
              <Text style={styles.modalButtonText}>Save {formType}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#aaa', marginTop: 10 }]} 
              onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4E008E',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputWrapper: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#4E008E',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15, // already good
  },
  modalButton: {
    backgroundColor: '#4E008E',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  switchButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  switchButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  activeSwitch: {
    backgroundColor: '#4E008E',
  },
  activeText: {
    color: '#fff',
    fontWeight: '600',
  },
  inactiveText: {
    color: '#4E008E',
    fontWeight: '600'
  },
  label: {
    fontWeight: '600',
    marginVertical: 6,
    color: '#4E008E',
  },
});
