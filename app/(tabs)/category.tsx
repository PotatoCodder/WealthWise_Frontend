import { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function CategoryTab() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [formType, setFormType] = useState('Expense');

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [fromAccount, setFromAccount] = useState('Default Account');
  const [toAccount, setToAccount] = useState('');

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

  const handleCategoryPress = (label) => {
    setSelectedCategory(label);
    setModalVisible(true);
  };

  const renderForm = () => {
    if (formType === 'Expense' || formType === 'Income') {
      return (
        <>
          <TextInput placeholder="Title" style={styles.input} value={title} onChangeText={setTitle} />
          <TextInput placeholder="Notes" style={styles.input} value={notes} onChangeText={setNotes} />
          <TextInput placeholder="Amount" style={styles.input} value={amount} onChangeText={setAmount} keyboardType="numeric" />
          <TextInput placeholder="Date (YYYY-MM-DD)" style={styles.input} value={date} onChangeText={setDate} />
        </>
      );
    } else if (formType === 'Transfer') {
      return (
        <>
          <TextInput placeholder="From Account" style={styles.input} value={fromAccount} onChangeText={setFromAccount} />
          <TextInput placeholder="To Account" style={styles.input} value={toAccount} onChangeText={setToAccount} />
          <TextInput placeholder="Amount" style={styles.input} value={amount} onChangeText={setAmount} keyboardType="numeric" />
          <TextInput placeholder="Note" style={styles.input} value={notes} onChangeText={setNotes} />
          <TextInput placeholder="Date (YYYY-MM-DD)" style={styles.input} value={date} onChangeText={setDate} />
        </>
      );
    }
  };

  return (
    <View style={styles.mainView}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.balanceText}>Total Balance:</Text>
        <Text style={styles.expenseText}>Total Expense:</Text>

        <View style={styles.secondaryView}>
          <View style={styles.grid}>
            {buttons.map((btn, index) => (
              <View key={index} style={styles.gridItem}>
                <TouchableOpacity style={styles.gridButton} onPress={() => handleCategoryPress(btn.label)}>
                  <Icon name={btn.icon} size={32} color="#4E008E" />
                </TouchableOpacity>
                <Text style={styles.buttonLabel}>{btn.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add {formType} - {selectedCategory}</Text>

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

            {renderForm()}

            <TouchableOpacity style={styles.modalButton} onPress={() => alert(`${formType} Saved`)}>
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
    marginTop: 180,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 28,
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
  input: {
    borderWidth: 1,
    borderColor: '#4E008E',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
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
    fontWeight: '600',
  },
});
