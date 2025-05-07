import React, { useState, useEffect, useRef, useMemo } from "react";
import { useFocusEffect } from "expo-router";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Animated,
  Alert,
  Dimensions,
  Share,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { useCombinationStore } from "../../store/useCombinationStore";
import { generateCombinations } from "../../assets/data/combinationData";
import { axiosInstance } from "@/utils/axiosInstance";
const { width } = Dimensions.get("window");
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ClothingItem {
  id: string;
  type: string;
  url: any;
  color?: string;
}

interface Combination {
  id: string;
  name: string;
  items: ClothingItem[];
  style?: string;
  uploadId: string;
}

const Badge = ({ text, color = "bg-indigo-500" }) => (
  <View className={`px-2 py-0.5 rounded mr-1.5 mb-1 ${color}`}>
    <Text className="text-white text-xs font-medium">{text}</Text>
  </View>
);

const AnimatedButton = ({ onPress, icon, text, color = "bg-indigo-900" }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
    >
      <Animated.View
        className={`flex-row items-center ${color} py-2 px-4 rounded-lg`}
        style={{ transform: [{ scale: scaleAnim }] }}
      >
        <Ionicons
          name={icon}
          size={16}
          color="#ffffff"
          style={{ marginRight: 6 }}
        />
        <Text className="text-white font-medium text-sm">{text}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const RecommendationScreen = ({ route }) => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Get current uploaded item from route params or use default
  const uploadedItem = route?.params?.uploadedItem || {
    id: "user-1",
    type: "SHIRT",
    name: "Blue Formal Shirt",
    image: {
      uri: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSFy8SFrURsjHVXzXMBeuuMf56Di3Kqhlrzos7oKtQNlHglvxJqNAKcbtgorhiFY4EKPVcdrn_awPWelrQopghoKvTl1lFbeT_9jTAs8h1IKtb7Z1eWoovotoz-cNUnVN0b02tSIJg&usqp=CAc",
    },
    color: "Royal Blue",
  };

  // Add or update user upload in store
  // const userUpload = useMemo(() => {
  //   return addUserUpload(uploadedItem);
  // }, [uploadedItem?.id]);

  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [expandedCombination, setExpandedCombination] = useState<string | null>(
    null
  );
  const scrollY = useRef(new Animated.Value(0)).current;

  // Generate dynamic recommendations based on user upload

  // Generate recommendations when user upload changes
  // ...existing code...
  const [recommendedCombinations, setRecommendedCombinations] = useState<
    Combination[]
  >([]);
  const [userUpload, setUserUpload] = useState<{
    id: string;
    type: string;
    name: string;
    image: {
      uri: string;
    };
    color: string;
  } | null>({
    id: "user-1",
    type: "SHIRT",
    name: "Blue Formal Shirt",
    image: {
      uri: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSFy8SFrURsjHVXzXMBeuuMf56Di3Kqhlrzos7oKtQNlHglvxJqNAKcbtgorhiFY4EKPVcdrn_awPWelrQopghoKvTl1lFbeT_9jTAs8h1IKtb7Z1eWoovotoz-cNUnVN0b02tSIJg&usqp=CAc",
    },
    color: "Royal Blue",
  });

  // Use this state to track saved combinations from the backend
  const [savedCombinationIds, setSavedCombinationIds] = useState<string[]>([]);

  // Get saved combinations for this specific upload
  const savedCombinationsCount = useMemo(() => {
    return savedCombinationIds.length;
  }, [savedCombinationIds]);

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

  // Modified getOutfit function to handle combinations from the backend
  useEffect(() => {
    setIsLoading(true);

    const getOutfitDetails = async () => {
      try {
        // Use the new endpoint that returns both outfit data and saved status
        const response = await axiosInstance.get(
          `/user/get-outfit-details/${id}`
        );

        if (response.data) {
          // Set user upload data
          const uploadData = {
            id: response.data.unique_id,
            type: response.data.type,
            name: `${response.data.color} ${response.data.type}`,
            image: {
              uri: response.data.imageURL,
            },
            color: response.data.color,
            gender: response.data.gender,
            usage: response.data.usage,
          };

          setUserUpload(uploadData);

          // Set recommended combinations
          if (response.data.outfits && Array.isArray(response.data.outfits)) {
            setRecommendedCombinations(response.data.outfits);
          }

          // Set saved combination IDs
          if (response.data.savedOutfitIds) {
            setSavedCombinationIds(response.data.savedOutfitIds);
          }
        }
      } catch (error) {
        console.error("Error fetching outfit details:", error);
      } finally {
        setIsLoading(false);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      }
    };

    getOutfitDetails();
  }, [id]);

  const saveCombinationToBackend = async (combo, uploadData) => {
    try {
      // Create a data structure that includes both the upload info and the outfit
      const saveData = {
        clientOutfitId: combo.id, // Store client-side ID for tracking
        userUpload: {
          uploadId: uploadData.id,
          type: uploadData.type,
          color: uploadData.color,
          imageURL: uploadData.image.uri,
          gender: uploadData.gender,
          usage: uploadData.usage,
        },
        outfit: combo.items.map((item) => ({
          cloth_id: item.id,
          category: item.type,
          image_url: item.url,
          color: item.color,
        })),
      };

      // Make API call to save the combination
      const response = await axiosInstance.post("/user/save-outfit/", saveData);

      if (response.status === 200) {
        // Update local state to reflect the save
        setSavedCombinationIds((prev) => [...prev, combo.id]);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error saving combination:", error);
      return false;
    }
  };

  const unsaveCombinationFromBackend = async (comboId, uploadId) => {
    try {
      const response = await axiosInstance.post("/user/unsave-outfit/", {
        clientOutfitId: comboId,
        uploadId: uploadId,
      });

      if (response.status === 200) {
        // Update local state to reflect the unsave
        setSavedCombinationIds((prev) => prev.filter((id) => id !== comboId));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error unsaving combination:", error);
      return false;
    }
  };

  const handleItemPress = (item: ClothingItem) => {
    setSelectedItem(item);
  };

  // Update the handleSave and handleUnsave functions
  const handleSave = async (combo) => {
    const success = await saveCombinationToBackend(combo, userUpload);
    if (!success) {
      // Handle error - maybe show a toast notification
      Alert.alert("Error", "Failed to save outfit. Please try again.");
    }
  };

  const handleUnsave = async (comboId) => {
    const success = await unsaveCombinationFromBackend(comboId, userUpload.id);
    if (!success) {
      // Handle error
      Alert.alert("Error", "Failed to remove saved outfit. Please try again.");
    }
  };

  // Function to check if a combination is saved
  const isCombinationSaved = (comboId) => {
    return savedCombinationIds.includes(comboId);
  };

  // Update the filtered combinations function
  const filteredCombinations = () => {
    let combinations = recommendedCombinations;

    if (showSaved) {
      // Filter to only show saved combinations
      combinations = combinations.filter((combo) =>
        savedCombinationIds.includes(combo.id)
      );
    }

    return combinations;
  };

  const toggleExpandCombination = (id: string) => {
    setExpandedCombination((prev) => (prev === id ? null : id));
  };

  const renderCombination = ({ item }: { item: Combination }) => {
    const isSaved = isCombinationSaved(item.id);
    const isExpanded = expandedCombination === item.id;

    const toggleSaveCombination = (combo) => {
      if (isSaved) {
        handleUnsave(combo.id);
      } else {
        handleSave(combo);
      }
    };

    return (
      <Animated.View
        className="bg-gray-50 rounded-xl p-4 mx-4 my-2 shadow"
        style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
      >
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-900">
              {item.name}
            </Text>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity
              className="p-1 mr-2"
              onPress={() => toggleSaveCombination(item)}
            >
              <Ionicons
                name={isSaved ? "bookmark" : "bookmark-outline"}
                size={24}
                color={isSaved ? "#312e81" : "#757575"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-1"
              onPress={() => toggleExpandCombination(item.id)}
            >
              <Ionicons
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={22}
                color="#757575"
              />
            </TouchableOpacity>
          </View>
        </View>

        {isExpanded && (
          <View className="bg-gray-100 rounded-lg p-2 mb-3">
            <Text className="text-xs text-gray-600 leading-relaxed">
              This {item.style} outfit will make you stand out for any occasion.
            </Text>
          </View>
        )}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="pr-4"
        >
          {item.items.map((clothingItem) => (
            <View key={clothingItem.id} className="mr-3">
              <TouchableOpacity
                onPress={() => handleItemPress(clothingItem)}
                activeOpacity={0.7}
                className="relative rounded-xl overflow-hidden bg-gray-100"
                style={{ width: 132, height: 170 }}
              >
                {/* Enhanced Card with better image handling */}
                <View className="w-full h-40">
                  <Image
                    source={{ uri: clothingItem.url }}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                </View>

                {/* Enhanced item details */}
                <View className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2">
                  <Text className="text-sm font-semibold text-gray-800">
                    {clothingItem.type}
                  </Text>
                  {clothingItem.color && (
                    <Text className="text-xs text-gray-600">
                      {clothingItem.color}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    );
  };

  const renderFilterSection = () => (
    <Animated.View className="my-3 px-4" style={{ opacity: fadeAnim }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="py-1 pr-4"
      >
        <TouchableOpacity
          className={`flex-row items-center py-1.5 px-3 rounded-full mr-2 ${
            !showSaved ? "bg-indigo-900" : "bg-gray-100"
          }`}
          onPress={() => setShowSaved(false)}
        >
          <Text
            className={`text-xs font-medium ${
              !showSaved ? "text-white" : "text-gray-600"
            }`}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-row items-center py-1.5 px-3 rounded-full mr-2 ${
            showSaved ? "bg-indigo-900" : "bg-gray-100"
          }`}
          onPress={() => setShowSaved(true)}
        >
          <Text
            className={`text-xs font-medium ${
              showSaved ? "text-white" : "text-gray-600"
            }`}
          >
            Saved ({savedCombinationsCount})
          </Text>
        </TouchableOpacity>

        {savedCombinationsCount > 0 && (
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() =>
              router.push({
                pathname: "/saved",
                params: { uploadId: userUpload.id },
              })
            }
          >
            <Text className="text-xs text-indigo-900 mr-0.5">
              View All Saved
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#312e81" />
          </TouchableOpacity>
        )}
      </ScrollView>
    </Animated.View>
  );

  const renderUserUpload = () => {
    const headerHeight = scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [140, 80],
      extrapolate: "clamp",
    });

    const imageOpacity = scrollY.interpolate({
      inputRange: [0, 60, 90],
      outputRange: [1, 0.8, 0],
      extrapolate: "clamp",
    });

    const headerPadding = scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [16, 8],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        className="bg-indigo-100 rounded-2xl mx-4 mt-2 overflow-hidden"
        style={{
          height: headerHeight,
          paddingVertical: headerPadding,
        }}
      >
        <View className="flex-row items-center h-full">
          <Animated.View
            style={{ opacity: imageOpacity }}
            className="w-28 h-44 flex justify-center"
          >
            <Image
              source={userUpload?.image}
              className="w-28 h-full rounded-r-2xl"
              resizeMode="stretch"
            />
          </Animated.View>
          <View className="ml-4 flex-1">
            <Text className="text-lg font-bold text-indigo-900 mb-1">
              {userUpload.type}
            </Text>
            <Text className="text-base font-medium text-gray-700 mb-1">
              {userUpload.name}
            </Text>

            <Animated.View
              style={{ opacity: imageOpacity }}
              className="flex-row flex-wrap items-center mt-1"
            >
              <Text className="text-xs text-gray-600">{userUpload.color}</Text>
            </Animated.View>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderItemDetailCard = () => {
    if (!selectedItem) return null;

    return (
      <View className="absolute inset-0 justify-center items-center z-50">
        <BlurView
          intensity={80}
          tint="dark"
          className="absolute inset-0 justify-center items-center"
        >
          <View className="bg-white rounded-3xl w-10/12 max-h-4/5 overflow-hidden shadow-lg">
            <TouchableOpacity
              className="absolute top-3 right-3 z-10 bg-white bg-opacity-80 rounded-full"
              onPress={() => setSelectedItem(null)}
            >
              <Ionicons name="close-circle" size={28} color="#4338ca" />
            </TouchableOpacity>

            <View className="w-full h-64 bg-gray-100">
              <Image
                source={{
                  uri:
                    selectedItem.url ||
                    "https://via.placeholder.com/150?text=No+Image",
                }}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>

            <View className="p-4">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-xl font-bold text-gray-900">
                  {selectedItem.type}
                </Text>
              </View>

              {/* Enhanced item details */}
              <View className="mb-4">
                {selectedItem.color && (
                  <View className="flex-row mb-1">
                    <Text className="text-sm font-medium text-gray-700">
                      Color: {selectedItem.color}
                    </Text>
                  </View>
                )}
                {selectedItem.brand && (
                  <View className="flex-row mb-1">
                    <Text className="text-sm font-medium text-gray-700">
                      Brand:{" "}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {selectedItem.brand}
                    </Text>
                  </View>
                )}
              </View>

              <View className="flex-row justify-between mt-2">
                <AnimatedButton
                  onPress={() => handleShare(selectedItem)}
                  icon="share-social-outline"
                  text="Share"
                  color="bg-indigo-900"
                />
              </View>
            </View>
          </View>
        </BlurView>
      </View>
    );
  };

  const renderEmptyState = () => {
    const filtered = filteredCombinations();
    if (filtered.length === 0) {
      return (
        <View className="items-center justify-center py-8">
          <MaterialCommunityIcons name="hanger" size={64} color="#9e9e9e" />
          <Text className="text-lg font-semibold text-gray-700 mt-4 mb-2">
            No combinations found
          </Text>
          <Text className="text-sm text-gray-500 text-center mx-8 mb-4">
            {showSaved
              ? "You haven't saved any combinations yet for this item."
              : "No combinations match your current filters."}
          </Text>
          <TouchableOpacity
            className="bg-indigo-900 py-2 px-4 rounded-lg"
            onPress={() => {
              setShowSaved(false);
            }}
          >
            <Text className="text-white font-medium">
              View All Combinations
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6200ee" />
          <Text className="mt-3 text-sm text-gray-600 font-medium">
            Finding perfect combinations for your {userUpload.type}...
          </Text>
        </View>
      );
    }

    const filtered = filteredCombinations();

    return (
      <>
        <StatusBar style="dark" />

        <Animated.FlatList
          data={filtered}
          renderItem={renderCombination}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListHeaderComponent={
            <>
              {renderUserUpload()}
              {renderFilterSection()}
              <Animated.View
                className="flex-row justify-between items-center px-4 mb-2 mt-1"
                style={{ opacity: fadeAnim }}
              >
                <Text className="text-lg font-semibold text-gray-900">
                  {showSaved
                    ? "Saved Combinations"
                    : "Recommended Combinations"}
                </Text>
                {savedCombinationsCount > 0 && !showSaved && (
                  <TouchableOpacity
                    className="flex-row items-center"
                    onPress={() => setShowSaved(true)}
                  >
                    <Text className="text-xs text-indigo-900 mr-0.5">
                      Saved ({savedCombinationsCount})
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color="#312e81"
                    />
                  </TouchableOpacity>
                )}
              </Animated.View>
            </>
          }
          ListEmptyComponent={renderEmptyState}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        />

        {renderItemDetailCard()}
      </>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      {renderContent()}
    </SafeAreaView>
  );
};

export default RecommendationScreen;
