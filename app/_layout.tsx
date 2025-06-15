import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (Platform.OS === 'android') {
      // Make status bar and nav bar blend in
      SystemUI.setBackgroundColorAsync('transparent');
    }
  }, []);

  if (!loaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="ALunch" options={{ headerShown: false }} /> {/* Main splash screen */}
        <Stack.Screen name="BLunch" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="profile"
          options={{
            headerShown: true,
            headerTransparent: true, // Makes it transparent
            headerTitle: 'Profile', // Removes the title
            headerTintColor: '#fff', // Makes the back arrow white (or any color you want)
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>

      <StatusBar hidden={true} translucent />
    </ThemeProvider>
  );
}
