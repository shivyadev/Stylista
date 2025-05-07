import { SplashScreen, Stack } from "expo-router";
import "./global.css";
import { useFonts } from "expo-font";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    AbrilRegular: require("../assets/fonts/AbrilFatface-Regular.ttf"),
    PlayfairRegular: require("../assets/fonts/PlayfairDisplay-Regular.ttf"),
    PlayfairBold: require("../assets/fonts/PlayfairDisplay-Bold.ttf"),
    PlayfairBoldItalic: require("../assets/fonts/PlayfairDisplay-BoldItalic.ttf"),
    PlayfairExtraBold: require("../assets/fonts/PlayfairDisplay-ExtraBold.ttf"),
    PlayfairItalic: require("../assets/fonts/PlayfairDisplay-Italic.ttf"),
    PlayfairMedium: require("../assets/fonts/PlayfairDisplay-Medium.ttf"),
    PlayfairMediumItalic: require("../assets/fonts/PlayfairDisplay-MediumItalic.ttf"),
    PlayfairSemiBold: require("../assets/fonts/PlayfairDisplay-SemiBold.ttf"),
    PlayfairSemiBoldItalic: require("../assets/fonts/PlayfairDisplay-SemiBoldItalic.ttf"),
    WindSongMedium: require("../assets/fonts/WindSong-Medium.ttf"),
    // PlasterRegular: require("../assets/fonts/Plaster-Regular.ttf"),
    // ModernStencil: require("../assets/fonts/Modern Stencil.ttf"),
    MegrimRegular: require("../assets/fonts/Megrim-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  return (
    <Stack
      screenOptions={{ animation: "slide_from_right", headerShown: false }}
    />
  );
}
