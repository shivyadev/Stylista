// app/(auth)/_layout.tsx
import { Slot, Redirect } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

export default function AuthLayout() {
  const [loading, setLoading] = useState(true);
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      const hasSeen = await AsyncStorage.getItem("hasOnboarded");
      setShouldShowOnboarding(!hasSeen);
      setLoading(false);
    };

    checkOnboarding();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (shouldShowOnboarding) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  return <Slot screenOptions={{ headerShown: false }} />;
}
