import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import images from "@/constants/images";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { axiosInstance } from "@/utils/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignIn = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const login = async (username, password) => {
    try {
      const response = await axiosInstance.post("/api/login/", {
        username,
        password,
      });

      if (!response.data) throw "No Response";
      const { access, refresh } = response.data;

      // Store both access and refresh tokens securely
      await AsyncStorage.setItem("access_token", access);
      await AsyncStorage.setItem("refresh_token", refresh);
      await AsyncStorage.setItem("hasOnboarded", "true");

      if (response && response.data) {
        router.push("/(root)/(tabs)/home");
      } else {
        throw "Sign In Failed";
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ImageBackground
        source={images.signin}
        resizeMode="cover"
        className="flex-1"
      >
        <LinearGradient
          colors={["rgba(255,255,255,0.8)", "rgba(190,170,255,0.4)"]}
          className="flex-1 px-6 justify-center"
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
              keyboardShouldPersistTaps="handled"
            >
              <Text className="text-black text-3xl mb-8 text-center font-abril">
                Welcome Back!
              </Text>

              {/* Input Fields */}
              <View className="bg-white/80 w-full p-4 rounded-xl mb-4 shadow-sm">
                <TextInput
                  placeholder={"Username"}
                  placeholderTextColor="#444"
                  className="text-base text-black"
                  secureTextEntry={"Username"
                    .toLowerCase()
                    .includes("password")}
                  autoCapitalize={"none"}
                  keyboardType={"email-address"}
                  value={username}
                  onChangeText={(text) => setUsername(text)}
                />
              </View>
              <View className="bg-white/80 w-full p-4 rounded-xl mb-4 shadow-sm">
                <TextInput
                  placeholder={"Password"}
                  placeholderTextColor="#444"
                  className="text-base text-black"
                  secureTextEntry={"Password"
                    .toLowerCase()
                    .includes("password")}
                  autoCapitalize={"sentences"}
                  keyboardType={"default"}
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                />
              </View>

              {/* Sign In Button */}
              <TouchableOpacity
                className="mt-4 bg-purple-900 py-4 rounded-full shadow-md"
                onPress={() => login(username, password)}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  Sign In
                </Text>
              </TouchableOpacity>

              {/* Go to Sign Up */}
              <TouchableOpacity
                onPress={() => router.push("/signup")}
                className="mt-6"
              >
                <Text className="text-black text-center underline">
                  Don't have an account? Sign Up
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default SignIn;
