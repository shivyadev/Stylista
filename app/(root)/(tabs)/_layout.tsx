import { Tabs } from "expo-router";
import { Home, User, Upload, Bookmark } from "lucide-react-native";
import { BlurView } from "expo-blur";
import { StyleSheet, View, Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#5E35B1", // Deep lavender
        tabBarInactiveTintColor: "#B39DDB", // Light lavender
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
        tabBarBackground: () => (
          <View style={styles.blurContainer}>
            <BlurView
              intensity={30}
              tint="light"
              style={StyleSheet.absoluteFill}
            />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Home color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          tabBarLabel: "Upload",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Upload color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          tabBarLabel: "Saved",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Bookmark color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <User color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tabBar: {
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
  tabBarItem: {
    paddingVertical: 10,
    height: "100%",
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: -4,
  },
});
