// app/index.tsx
import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] =
    useState<string>("/(auth)/onboarding");

  useEffect(() => {
    const checkAuthAndOnboarding = async () => {
      try {
        // Check if user has completed onboarding
        const hasOnboarded = await AsyncStorage.getItem("hasOnboarded");

        // Check if user is authenticated
        const userToken = await AsyncStorage.getItem("userToken");

        if (hasOnboarded === "true") {
          if (userToken) {
            // User is authenticated, go to main app
            setInitialRoute("/(tabs)");
          } else {
            // User has seen onboarding but isn't logged in
            setInitialRoute("/(auth)/signin");
          }
        } else {
          // User hasn't seen onboarding
          setInitialRoute("/(auth)/onboarding");
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        // Default to onboarding on error
        setInitialRoute("/(auth)/onboarding");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndOnboarding();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return <Redirect href={initialRoute} />;
}
