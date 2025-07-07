import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';

export default function CategoryFetch() {
  const { category } = useLocalSearchParams();
  const [userId, setUserId] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [formType, setFormType] = useState('Expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryItems, setCategoryItems] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountItems, setAccountItems] = useState([
    { label: '💵 Cash', value: 'Cash' },
    { label: '💳 Card', value: 'Card' },
    { label: '🏦 Savings', value: 'Savings' },
  ]);
  const [fromAccount, setFromAccount] = useState(null);
  const [fromOpen, setFromOpen] = useState(false);
  const [toAccount, setToAccount] = useState(null);
  const [toOpen, setToOpen] = useState(false);

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

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const user = JSON.parse(userData || '{}');
        const id = user?.email;
        setUserId(id);
        if (!id) throw new Error('User not found in AsyncStorage');

        const res = await fetch(
          `http://192.168.0.104:3000/api/get-expenses-by-category?userId=${id}&category=${category}`
        );
        const data = await res.json();

        if (res.ok) {
          setExpenses(data.expenses || []);
        } else {
          console.error('Error:', data.error);
        }
      } catch (err) {
        console.error('Failed to fetch expenses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, [category]);

  useEffect(() => {
    setCategoryItems(formType === 'Income' ? incomeCategories : expenseCategories);
  }, [formType]);

  const handleAdd = async () => {
    if (!userId) return;

    const base = {
      amount: parseFloat(amount),
      notes,
      date,
      userId,
    };

    let endpoint = '';
    let payload = {};

    if (formType === 'Expense') {
      if (!title || !selectedCategory || !selectedAccount) return alert('Missing fields');
      endpoint = 'add-expense';
      payload = { ...base, title, category: selectedCategory, account: selectedAccount };
    } else if (formType === 'Income') {
      if (!title || !selectedCategory || !selectedAccount) return alert('Missing fields');
      endpoint = 'add-income';
      payload = { ...base, title, category: selectedCategory, account: selectedAccount };
    } else if (formType === 'Transfer') {
      if (!fromAccount || !toAccount || fromAccount === toAccount) return alert('Invalid transfer');
      endpoint = 'transfer';
      payload = { ...base, fromAccount, toAccount };
    }

    await fetch(`http://192.168.0.104:3000/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expenses for {category}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4E008E" />
      ) : expenses.length === 0 ? (
        <Text style={styles.noData}>No expenses found.</Text>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.expenseItem}>
              <Text style={styles.expenseTitle}>{item.title}</Text>
              <Text style={styles.expenseDetails}>₱{item.amount} - {item.date}</Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add {formType}</Text>
            <View style={styles.switchButtons}>
              {['Expense', 'Income', 'Transfer'].map((type) => (
                <TouchableOpacity key={type} onPress={() => setFormType(type)}>
                  <Text style={formType === type ? styles.activeText : styles.inactiveText}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {formType !== 'Transfer' && (
              <DropDownPicker
                open={categoryOpen}
                value={selectedCategory}
                items={categoryItems}
                setOpen={setCategoryOpen}
                setValue={setSelectedCategory}
                setItems={setCategoryItems}
                placeholder="Select Category"
              />
            )}
            {(formType === 'Expense' || formType === 'Income') && (
              <DropDownPicker
                open={accountOpen}
                value={selectedAccount}
                items={accountItems}
                setOpen={setAccountOpen}
                setValue={setSelectedAccount}
                setItems={setAccountItems}
                placeholder="Select Account"
              />
            )}
            {formType !== 'Transfer' && (
              <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
            )}
            <TextInput style={styles.input} placeholder="Amount" keyboardType="numeric" value={amount} onChangeText={setAmount} />
            <TextInput style={styles.input} placeholder="Notes" value={notes} onChangeText={setNotes} />
            <TextInput style={styles.input} placeholder="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} />
            {formType === 'Transfer' && (
              <>
                <DropDownPicker
                  open={fromOpen}
                  value={fromAccount}
                  items={accountItems}
                  setOpen={setFromOpen}
                  setValue={setFromAccount}
                  setItems={setAccountItems}
                  placeholder="From Account"
                />
                <DropDownPicker
                  open={toOpen}
                  value={toAccount}
                  items={accountItems}
                  setOpen={setToOpen}
                  setValue={setToAccount}
                  setItems={setAccountItems}
                  placeholder="To Account"
                />
              </>
            )}
            <TouchableOpacity onPress={handleAdd} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.modalButton, { backgroundColor: '#aaa' }]}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4E008E',
    marginBottom: 20,
  },
  noData: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  expenseItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  expenseDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  addButton: {
    marginTop: 20,
    backgroundColor: '#4E008E',
    padding: 12,
    borderRadius: 10,
  },
  addButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4E008E',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
  },
  modalButton: {
    backgroundColor: '#4E008E',
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  switchButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  activeText: {
    fontWeight: 'bold',
    color: '#4E008E',
  },
  inactiveText: {
    color: '#888',
  },
});
