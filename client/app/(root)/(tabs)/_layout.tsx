import { Tabs } from "expo-router";
import { Home, Upload, Bookmark, LogOut } from "lucide-react-native";
import { BlurView } from "expo-blur";
import {
  View,
  Platform,
  Text,
  Alert,
  Pressable,
  Dimensions,
  Image,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { axiosInstance } from "@/utils/axiosInstance";

const { width } = Dimensions.get("window");

export default function TabLayout() {
  const router = useRouter();

  const logout = async () => {
    try {
      const refresh = await AsyncStorage.getItem("refresh_token");

      try {
        const response = await axiosInstance.post("/api/logout/", {
          refresh: refresh,
        });
      } catch (apiError) {
        // Handle API call errors specifically
        console.log("API logout error:", apiError);
        // Continue with client-side logout regardless of server response
      }

      await AsyncStorage.removeItem("access_token");
      await AsyncStorage.removeItem("refresh_token");
      await AsyncStorage.setItem("hasOnboarded", "false");
      console.log("User logged out and tokens cleared");
      router.push("/(auth)/onboarding");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logout();
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header Wave + Logo */}
      <View
        style={{
          width: "100%",
          height: 80,
          position: "relative",
          justifyContent: "center",
        }}
      >
        {/* Wave Background */}
        <Image
          source={require("../../../assets/images/Vector 5.png")}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 80,
          }}
          resizeMode="stretch"
        />

        {/* Foreground Row */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            height: "100%",
            marginTop: -10, // push content slightly upward
          }}
        >
          {/* Left: App Icon */}
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "#fff",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <Image
              source={require("../../../assets/images/icon.png")}
              style={{ width: 34, height: 34 }}
              resizeMode="contain"
            />
          </View>

          {/* Center: Logo Text */}
          <Image
            source={require("../../../assets/icons/Stylista.png")}
            resizeMode="stretch"
            className="w-28 h-12 mr-3"
          />

          {/* Right: Logout */}
          <Pressable onPress={handleLogout} style={{ marginTop: -10 }}>
            <View className="flex mx-auto bg-pink-50 rounded-full p-1">
              <Image
                source={require("../../../assets/icons/power.png")}
                style={{ width: 20, height: 20 }}
              />
            </View>
          </Pressable>
        </View>
      </View>
      {/* Tabs */}
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#5E35B1",
          tabBarInactiveTintColor: "#B39DDB",
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
            marginTop: -4,
          },
          tabBarItemStyle: {
            paddingVertical: 10,
            height: "100%",
          },
          tabBarStyle: {
            position: "absolute",
            height: 75,
            left: 16,
            right: 16,
            bottom: Platform.OS === "android" ? 16 : 32,
            borderRadius: 20,
            elevation: 5,
            backgroundColor: "rgba(249, 245, 255, 0.9)",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            borderTopWidth: 0,
          },
          headerShown: false,
          tabBarBackground: () => (
            <View className="absolute inset-0 overflow-hidden rounded-t-2xl">
              <BlurView intensity={30} tint="light" className="flex-1" />
            </View>
          ),
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <Home color={color} size={size} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="upload"
          options={{
            tabBarLabel: "Upload",
            tabBarIcon: ({ color, size }) => (
              <Upload color={color} size={size} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="saved"
          options={{
            tabBarLabel: "Saved",
            tabBarIcon: ({ color, size }) => (
              <Bookmark color={color} size={size} strokeWidth={2} />
            ),
          }}
        />
        {/* Removed the Profile tab completely */}
      </Tabs>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}
