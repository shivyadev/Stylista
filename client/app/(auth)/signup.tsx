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
import axios from "axios";

const SignUp = () => {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [mail, setMail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const register = async (username, email, password, confirmPassword) => {
    try {
      if (password !== confirmPassword) {
        throw "Mismatch in password";
      }

      const response = await axiosInstance.post("/api/register/", {
        username: username,
        email: email,
        password: password,
      });

      if (response && response.data) {
        router.push("/(auth)/signin");
      } else {
        throw "Sign Up Failed";
      }
    } catch (error) {
      console.error("Registration failed:", error);
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
                Create an Account!
              </Text>

              {/* Input Fields */}
              <View className="bg-white/80 w-full p-4 rounded-xl mb-4 shadow-sm">
                <TextInput
                  placeholder={"Name"}
                  placeholderTextColor="#444"
                  className="text-base text-black"
                  secureTextEntry={"Name".toLowerCase().includes("password")}
                  autoCapitalize={"sentences"}
                  keyboardType={"default"}
                  value={name}
                  onChangeText={(text) => setName(text)}
                />
              </View>
              <View className="bg-white/80 w-full p-4 rounded-xl mb-4 shadow-sm">
                <TextInput
                  placeholder={"Email"}
                  placeholderTextColor="#444"
                  className="text-base text-black"
                  secureTextEntry={"Email".toLowerCase().includes("password")}
                  autoCapitalize={"none"}
                  keyboardType={"email-address"}
                  value={mail}
                  onChangeText={(text) => setMail(text)}
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
              <View className="bg-white/80 w-full p-4 rounded-xl mb-4 shadow-sm">
                <TextInput
                  placeholder={"Confirm Password"}
                  placeholderTextColor="#444"
                  className="text-base text-black"
                  secureTextEntry={"Confirm Password"
                    .toLowerCase()
                    .includes("password")}
                  autoCapitalize={"sentences"}
                  keyboardType={"default"}
                  value={confirmPassword}
                  onChangeText={(text) => setConfirmPassword(text)}
                />
              </View>

              {/* Sign In Button */}
              <TouchableOpacity
                className="mt-4 bg-purple-900 py-4 rounded-full shadow-md"
                onPress={() => {
                  // Handle sign-in logic here
                  register(name, mail, password, confirmPassword);
                }}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  Sign Up
                </Text>
              </TouchableOpacity>

              {/* Go to Sign Up */}
              <TouchableOpacity
                onPress={() => router.push("/signin")}
                className="mt-6"
              >
                <Text className="text-black text-center underline">
                  Already Have an Account? Sign In
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default SignUp;
