import { Tabs } from "expo-router";
import { Home, User, Upload, Bookmark } from "lucide-react-native";
import { BlurView } from "expo-blur";
import {
  View,
  Platform,
  Text,
  Pressable,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function TabLayout() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Gradient Header */}
      <LinearGradient
        colors={["#312e81", "#4c1d95"]} // indigo-900 to purple-900
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className={`px-5 pb-3 flex-row justify-between items-center ${
          Platform.OS === "android" ? "pt-10" : "pt-0"
        }`}
      >
        <Text className="text-white text-2xl font-playfairextrabold">
          Stylista
        </Text>
      </LinearGradient>

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
          name="index"
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
        <Tabs.Screen
          name="profile"
          options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({ color, size }) => (
              <User color={color} size={size} strokeWidth={2} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
