import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React from "react";
import images from "@/constants/images";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const Onboarding = () => {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1">
      <ImageBackground
        source={images.onboard}
        className="flex-1"
        resizeMode="cover"
      >
        {/* Optional: Overlay gradient on background image for better contrast */}
        <LinearGradient
          colors={["rgba(0,0,0,0.1)", "rgba(192,182,255,0.4)"]}
          className="absolute inset-0"
        />

        {/* Bottom curved section */}
        <View className="bg-color3 w-full h-[55%] absolute bottom-0 rounded-tl-[80px] rounded-tr-[80px] px-8 py-10 justify-center items-center">
          <Text className="text-5xl text-black font-abril mb-2">Capture</Text>
          <Text className="text-5xl text-black font-abril mb-2">Discover</Text>
          <Text className="text-5xl text-black font-abril mb-2">And Shop</Text>

          <Text className="text-lg text-black font-playfairmediumitalic text-center mt-4 opacity-80">
            Snap your style. Find the look. Own your vibe.
          </Text>

          {/* Optional: CTA Button */}
          <TouchableOpacity
            className="mt-6 bg-black px-6 py-3 rounded-[48px]"
            onPress={() => router.push("/signup")}
          >
            <Text className="text-white text-base font-semibold pr-5 pl-5">
              Get Started
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center justify-center mt-4">
            <Text className="text-base text-black opacity-80">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/signin")}>
              <Text className="text-base text-black font-semibold underline">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Onboarding;
