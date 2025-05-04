import { Tabs } from "expo-router";
import { Home, Upload, Bookmark, LogOut } from "lucide-react-native";
import { BlurView } from "expo-blur";
import {
  View,
  Platform,
  Text,
  Alert,
  Pressable,
  SafeAreaView,
  Dimensions,
  Image,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function TabLayout() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          router.replace("/(auth)/onboarding");
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Gradient Header with Logout Button */}

      <Pressable onPress={handleLogout} className="absolute right-5 top-3">
        <LogOut color="#1A237E" size={24} />
      </Pressable>

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
    </SafeAreaView>
  );
}
