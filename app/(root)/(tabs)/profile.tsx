import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React from "react";

const Profile = () => {
  const handleLogout = async () => {};
  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 px-7"
      >
        <View>
          <Text className="text-xl font-playfairbold">PRofile</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
