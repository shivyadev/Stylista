import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Animated,
  Alert,
  Share,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCombinationStore } from "../../../store/useCombinationStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SavedItemsScreen = ({ route }) => {
  const router = useRouter();
  const { savedCombinations, userUploads, removeCombination } =
    useCombinationStore();

  // Get uploadId from route params or show all saved items
  const { uploadId } = route?.params || {};

  const [selectedUploadId, setSelectedUploadId] = useState(uploadId || "all");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Group combinations by upload
  const groupedCombinations = React.useMemo(() => {
    if (selectedUploadId && selectedUploadId !== "all") {
      // Filter combinations for specific upload
      return {
        [selectedUploadId]: savedCombinations.filter(
          (item) => item.uploadId === selectedUploadId
        ),
      };
    } else {
      // Group all combinations by upload ID
      return savedCombinations.reduce((acc, item) => {
        if (!acc[item.uploadId]) {
          acc[item.uploadId] = [];
        }
        acc[item.uploadId].push(item);
        return acc;
      }, {});
    }
  }, [savedCombinations, selectedUploadId]);

  const handleShare = async (item) => {
    try {
      const combo = item.combo;
      let message = `Check out this amazing outfit combination: ${combo.name}!\n`;
      combo.items.forEach((piece) => {
        message += `\n- ${piece.type}`;
      });

      await Share.share({
        message,
        title: "Style Recommendation",
      });
    } catch (error) {
      Alert.alert("Error", "Could not share this item");
    }
  };

  const handleDelete = (comboId, uploadId) => {
    Alert.alert(
      "Remove Combination",
      "Are you sure you want to remove this saved combination?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeCombination(comboId, uploadId),
        },
      ]
    );
  };

  const renderUploadFilter = () => {
    if (userUploads.length <= 1) return null;

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="py-3 px-4"
      >
        <TouchableOpacity
          className={`flex-row items-center py-1.5 px-3 rounded-full mr-2 ${
            selectedUploadId === "all" ? "bg-indigo-900" : "bg-gray-100"
          }`}
          onPress={() => setSelectedUploadId("all")}
        >
          <Text
            className={`text-xs font-medium ${
              selectedUploadId === "all" ? "text-white" : "text-gray-600"
            }`}
          >
            All Items
          </Text>
        </TouchableOpacity>

        {userUploads.map((upload) => (
          <TouchableOpacity
            key={upload.id}
            className={`flex-row items-center py-1.5 px-3 rounded-full mr-2 ${
              selectedUploadId === upload.id ? "bg-indigo-900" : "bg-gray-100"
            }`}
            onPress={() => setSelectedUploadId(upload.id)}
          >
            <Image
              source={upload.image}
              className="w-4 h-4 rounded-full mr-1"
              resizeMode="cover"
            />
            <Text
              className={`text-xs font-medium ${
                selectedUploadId === upload.id ? "text-white" : "text-gray-600"
              }`}
            >
              {upload.type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderUploadSection = ({ item: uploadId }) => {
    const combinations = groupedCombinations[uploadId] || [];
    if (combinations.length === 0) return null;

    const upload = userUploads.find((u) => u.id === uploadId);
    if (!upload) return null;

    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        <View className="flex-row items-center px-4 mt-4 mb-2">
          <Image
            source={upload.image}
            className="w-8 h-8 rounded-md mr-2"
            resizeMode="cover"
          />
          <Text className="text-lg font-semibold text-gray-900">
            {upload.type} - {combinations.length} combination
            {combinations.length !== 1 ? "s" : ""}
          </Text>
        </View>

        {combinations.map((item, index) => renderCombinationCard(item, index))}
      </Animated.View>
    );
  };

  const renderCombinationCard = (item, index) => {
    const combo = item.combo;

    return (
      <Animated.View
        key={`${item.uploadId}-${combo.id}-${index}`}
        className="bg-white rounded-xl mx-4 my-2 p-4 shadow"
        style={{ opacity: fadeAnim }}
      >
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-900">
              {combo.name}
            </Text>
            {combo.style && (
              <Text className="text-xs text-gray-600">{combo.style} Style</Text>
            )}
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity
              className="p-1 mr-2"
              onPress={() => handleShare(item)}
            >
              <Ionicons name="share-outline" size={22} color="#757575" />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-1"
              onPress={() => handleDelete(combo.id, item.uploadId)}
            >
              <Ionicons name="trash-outline" size={22} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="pr-4"
        >
          {combo.items.map((clothingItem) => (
            <View key={clothingItem.id} className="mr-3">
              <View
                className="relative rounded-xl overflow-hidden bg-gray-100"
                style={{ width: 120, height: 150 }}
              >
                <View className="w-full h-36">
                  <Image
                    source={{ uri: clothingItem.image.uri }}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                </View>

                <View className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2">
                  <Text className="text-xs font-semibold text-gray-800">
                    {clothingItem.type}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity
          className="mt-3 flex-row items-center justify-center py-2 bg-gray-100 rounded-lg"
          onPress={() =>
            router.push({
              pathname: "/(root)/(tabs)/home",
              params: {
                uploadedItem: userUploads.find((u) => u.id === item.uploadId),
              },
            })
          }
        >
          <Text className="text-sm text-indigo-900 font-medium">
            View More Like This
          </Text>
          <Ionicons
            name="arrow-forward"
            size={16}
            color="#312e81"
            className="ml-1"
          />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderEmptyState = () => {
    if (Object.keys(groupedCombinations).length === 0) {
      return (
        <View className="flex-1 items-center justify-center py-12">
          <MaterialCommunityIcons name="hanger" size={80} color="#9e9e9e" />
          <Text className="text-xl font-semibold text-gray-700 mt-6 mb-2">
            No saved combinations
          </Text>
          <Text className="text-sm text-gray-500 text-center mx-8 mb-6">
            Start exploring and save combinations you like for later
          </Text>
          <TouchableOpacity
            className="bg-indigo-900 py-2 px-5 rounded-lg"
            onPress={() => router.push("/upload")}
          >
            <Text className="text-white font-semibold">Upload New Item</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#312e81" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">
          Saved Combinations
        </Text>
        <View style={{ width: 28 }} />
      </View>

      {renderUploadFilter()}

      <FlatList
        data={Object.keys(groupedCombinations)}
        keyExtractor={(item) => item}
        renderItem={renderUploadSection}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};

export default SavedItemsScreen;
