import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';

export default function ProfileScreen() {
  return (
    <View style={styles.mainView}>

      {/* 🔷 Scrollable Entries Section */}
      <View style={styles.contentWrapper}>
        <View style={styles.secondaryView}>
          a
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: '#4E008E',
  },
  contentWrapper: {
    flex: 1,
    position: 'relative',
  },

  secondaryView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 65,
    borderTopRightRadius: 65,
    padding: 20,
    top: 140
  },

  entryText: {
    color: '#4E008E',
    fontSize: 16,
    marginBottom: 6,
    left: 40,
  },

});
