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
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { axiosInstance } from "@/utils/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SavedItemsScreen = ({ route }) => {
  const router = useRouter();

  // Get uploadId from route params or show all saved items
  const { uploadId } = route?.params || {};

  const [selectedUploadId, setSelectedUploadId] = useState(uploadId || "all");
  const [savedCombinations, setSavedCombinations] = useState([]);
  const [uniqueUploads, setUniqueUploads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    React.useCallback(() => {
      const checkToken = async () => {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) {
          router.push("/(auth)/signin"); // Prevents going back to protected page
        }
      };

      checkToken();
    }, [])
  );

  // Fetch saved outfits for specific upload or all uploads
  const fetchSavedOutfits = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get saved outfits for specific upload or all uploads
      const response = await axiosInstance.get(
        `/user/saved-outfits/${
          selectedUploadId === "all" ? "all" : selectedUploadId
        }/`
      );

      // Transform the data to match our frontend structure
      const transformedData = response.data.savedOutfits.map((outfit, idx) => ({
        uploadId: outfit.uploadId,
        combo: {
          id: outfit.clientOutfitId,
          name: outfit.outfitData.name || `Outfit ${idx + 1}`,
          style: outfit.uploadData.usage || "",
          items: outfit.outfitData || [],
          imageURL: outfit.outfitData[0].image_url,
          type: outfit.outfitData.category,
        },
        uploadInfo: outfit.uploadData,
      }));

      setSavedCombinations(transformedData);

      // Extract unique uploads from the saved outfits for filtering
      const uniqueUploadIds = new Set();
      const uploads = [];

      transformedData.forEach((item) => {
        if (!uniqueUploadIds.has(item.uploadId) && item.uploadInfo) {
          uniqueUploadIds.add(item.uploadId);
          uploads.push({
            unique_id: item.uploadId,
            type:
              item.uploadInfo.type || item.combo.items[0]?.type || "Unknown",
            imageURL:
              item.uploadInfo.imageURL || item.combo.items[0]?.imageURL || "",
          });
        }
      });

      setUniqueUploads(uploads);
    } catch (error) {
      console.error("Error fetching saved outfits:", error);
      setError("Failed to load saved combinations");
    } finally {
      setIsLoading(false);
    }
  };

  // Remove a saved combination
  const removeCombination = async (comboId, uploadId) => {
    try {
      await axiosInstance.post(`/user/unsave-outfit/`, {
        clientOutfitId: comboId,
        uploadId: uploadId,
      });

      // Update local state after successful deletion
      setSavedCombinations((prev) =>
        prev.filter(
          (item) => !(item.combo.id === comboId && item.uploadId === uploadId)
        )
      );

      Alert.alert("Success", "Outfit removed from saved items");

      // If we deleted the last outfit for an upload, refresh to update filters
      const remainingUploads = savedCombinations.filter(
        (item) => !(item.combo.id === comboId && item.uploadId === uploadId)
      );

      const uploadStillHasItems = remainingUploads.some(
        (item) => item.uploadId === uploadId
      );

      if (!uploadStillHasItems) {
        // Refresh uploads list
        fetchSavedOutfits();
      }
    } catch (error) {
      console.error("Error removing saved outfit:", error);
      Alert.alert("Error", "Failed to remove the saved outfit");
    }
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const getUser = async () => {
      const bool = await checkUser();

      if (!bool) {
        router.push("/(auth)/signin");
      }
    };
    // Initial data load
    fetchSavedOutfits();
  }, []);

  useEffect(() => {
    fetchSavedOutfits();
  }, [selectedUploadId]);

  // Group combinations by upload
  const groupedCombinations = React.useMemo(() => {
    // Group all combinations by upload ID
    return savedCombinations.reduce((acc, item) => {
      if (!acc[item.uploadId]) {
        acc[item.uploadId] = [];
      }
      acc[item.uploadId].push(item);
      return acc;
    }, {});
  }, [savedCombinations, selectedItem]);

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
    if (uniqueUploads.length <= 1) return null;

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="py-3 px-4"
      >
        <TouchableOpacity
          className={`flex flex-row justify-center items-center  rounded-full mr-2 ${
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

        {uniqueUploads.map((upload) => (
          <TouchableOpacity
            key={upload.unique_id}
            className={`flex flex-row items-center justify-center rounded-full mr-2 ${
              selectedUploadId === upload.unique_id
                ? "bg-indigo-900"
                : "bg-gray-100"
            }`}
            onPress={() => setSelectedUploadId(upload.unique_id)}
          >
            <Image
              source={{ uri: upload.imageURL }}
              className="w-5 h-5 rounded-full mr-2"
              resizeMode="cover"
            />
            <Text
              className={`text-sm font-medium ${
                selectedUploadId === upload.unique_id
                  ? "text-white"
                  : "text-gray-600"
              }`}
              numberOfLines={1}
              ellipsizeMode="tail"
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

    // Get upload details from the first combination's upload data
    const firstItem = combinations[0];
    const uploadInfo = firstItem.uploadInfo || {};
    const firstItemImage =
      firstItem.combo.items[0]?.imageURL ||
      firstItem.combo.items[0]?.image?.uri ||
      "";

    const uploadDetails = {
      imageURL: uploadInfo.imageURL || firstItemImage,
      type: uploadInfo.type || firstItem.combo.items[0]?.type || "Unknown Item",
    };

    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        <View className="flex-row items-center px-4 mt-4 mb-2">
          <Image
            source={{ uri: uploadDetails.imageURL }}
            className="w-8 h-8 rounded-md mr-2"
            resizeMode="cover"
          />
          <Text className="text-lg font-semibold text-gray-900">
            {uploadDetails.type} - {combinations.length} combination
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
          {combo.items.map((clothingItem, itemIndex) => (
            <TouchableOpacity
              onPress={() => setSelectedItem(clothingItem)}
              key={`${clothingItem.id || itemIndex}`}
              className="mr-3"
            >
              <View
                className="relative rounded-xl overflow-hidden bg-gray-100"
                style={{ width: 120, height: 150 }}
              >
                <View className="w-full h-36 p-1">
                  <Image
                    source={{
                      uri: clothingItem.image_url,
                    }}
                    className="w-full h-full rounded-xl"
                    resizeMode="stretch"
                  />
                </View>

                <View className="absolute bottom-0 left-0 right-0 bg-opacity-90 p-2">
                  <Text className="text-xs font-semibold text-gray-800 text-center">
                    {clothingItem.category}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          className="mt-3 flex-row items-center justify-center py-2 bg-gray-100 rounded-lg"
          onPress={() =>
            router.push({
              pathname: "/(root)/(tabs)/home",
              params: {
                uploadId: item.uploadId,
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
    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center py-12">
          <ActivityIndicator size="large" color="#312e81" />
          <Text className="text-sm text-gray-500 mt-4">
            Loading your saved combinations...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View className="flex-1 items-center justify-center py-12">
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={60}
            color="#ef4444"
          />
          <Text className="text-xl font-semibold text-gray-700 mt-6 mb-2">
            Something went wrong
          </Text>
          <Text className="text-sm text-gray-500 text-center mx-8 mb-6">
            {error}
          </Text>
          <TouchableOpacity
            className="bg-indigo-900 py-2 px-5 rounded-lg"
            onPress={() => fetchSavedOutfits()}
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (savedCombinations.length === 0) {
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

      <View className="flex-row justify-between items-center px-4 border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-900 mx-auto mb-4">
          Saved Combinations
        </Text>
      </View>

      {/* {renderUploadFilter()} */}

      <Modal visible={selectedItem !== null} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-60 px-4">
          <View className="bg-white rounded-2xl w-full max-w-md p-6">
            <Image
              source={{ uri: selectedItem?.image_url }}
              className="w-52 h-56 rounded-xl mb-4 mx-auto"
              resizeMode="stretch"
            />
            <Text className="text-lg font-bold text-gray-800 mb-2">
              {selectedItem?.name}
            </Text>
            <Text className="text-sm text-gray-500 mb-1">
              {selectedItem?.category}
            </Text>
            <Text className="text-sm text-gray-500 mb-4">
              Color: {selectedItem?.color}
            </Text>
            <TouchableOpacity
              onPress={() => openLink(selectedItem?.url || "")}
              className="bg-indigo-900 px-6 py-3 rounded-full mb-3"
            >
              <Text className="text-white font-semibold text-center">
                Get Link
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedItem(null)}
              className="mt-2"
            >
              <Text className="text-center text-gray-500 font-medium">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {savedCombinations.length > 0 ? (
        <FlatList
          data={Object.keys(groupedCombinations)}
          keyExtractor={(item) => item}
          renderItem={renderUploadSection}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      ) : (
        renderEmptyState()
      )}
    </SafeAreaView>
  );
};

export default SavedItemsScreen;
