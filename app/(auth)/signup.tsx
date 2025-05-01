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
import React from "react";
import images from "@/constants/images";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const SignUp = () => {
  const router = useRouter();

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
              {["Name", "Email", "Password", "Confirm Password"].map(
                (placeholder, index) => (
                  <View
                    key={index}
                    className="bg-white/80 w-full p-4 rounded-xl mb-4 shadow-sm"
                  >
                    <TextInput
                      placeholder={placeholder}
                      placeholderTextColor="#444"
                      className="text-base text-black"
                      secureTextEntry={placeholder
                        .toLowerCase()
                        .includes("password")}
                      autoCapitalize={
                        placeholder === "Email" ? "none" : "sentences"
                      }
                      keyboardType={
                        placeholder === "Email" ? "email-address" : "default"
                      }
                    />
                  </View>
                )
              )}

              {/* Sign In Button */}
              <TouchableOpacity
                className="mt-4 bg-purple-700 py-4 rounded-full shadow-md"
                onPress={() => {
                  // Handle sign-in logic here
                  router.push("/onboarding");
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
