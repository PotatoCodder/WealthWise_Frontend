import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

export default function Settings() {
  const router = useRouter();

  const goToProfile = () => {
    router.push('../profile'); // ✅ proper navigation
  };

  return (
    <View style={styles.view}>
      <TouchableOpacity onPress={goToProfile}>
        <Text>Go to Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
