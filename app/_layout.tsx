import { SplashScreen, Stack } from "expo-router";
import "./global.css";
import { useFonts } from "expo-font";
import { useEffect } from "react";

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "Outfit-Bold": require("../assets/fonts/static/Outfit-Bold.ttf"),
    "Outfit-Regular": require("../assets/fonts/static/Outfit-Regular.ttf"),
    "Outfit-Light": require("../assets/fonts/static/Outfit-Light.ttf"),
    "Outfit-ExtraBold": require("../assets/fonts/static/Outfit-ExtraBold.ttf"),
    "Outfit-SemiBold": require("../assets/fonts/static/Outfit-SemiBold.ttf"),
    "Outfit-Medium": require("../assets/fonts/static/Outfit-Medium.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Home" }} />
    </Stack>
  );
}
