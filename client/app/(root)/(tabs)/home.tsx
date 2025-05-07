import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  FlatList,
  Image,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Linking,
  Modal,
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import products from "../../../assets/styles.json";
import { axiosInstance } from "@/utils/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";

// Types
type Product = {
  cloth_id: number;
  gender: string;
  type: string;
  color: string;
  season: string;
  usage: string;
  name: string;
  url: string;
};

type FilterType = "gender" | "season" | "baseColour";

type FilterOption = {
  type: FilterType;
  value: string;
};

const MAX_ITEMS = 100;
const INITIAL_COUNT = 12;
const LOAD_MORE_COUNT = 12;

const HomePage: React.FC = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterOption | null>(null);
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [loading, setLoading] = useState<Boolean>(false);
  const router = useRouter();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Available filters
  const filters = {
    gender: [...new Set(products.map((p: Product) => p.gender))],
  };

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

  useEffect(() => {
    setLoading(true);
    loadData();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (activeFilter) {
      const filtered = allProducts.filter(
        (item) => item[activeFilter.type] === activeFilter.value
      );
      setDisplayProducts(filtered.slice(0, MAX_ITEMS));
    } else {
      setDisplayProducts(allProducts.slice(0, MAX_ITEMS));
    }
    setVisibleCount(INITIAL_COUNT);
  }, [activeFilter, allProducts, selectedItem]);

  const fetchData = async () => {
    const response = await axiosInstance.get("/items/get-items");
    return response?.data?.items;
  };

  const loadData = () => {
    setIsLoading(true);
    setTimeout(async () => {
      const shuffled = await fetchData();
      setAllProducts(shuffled);
      setDisplayProducts(shuffled.slice(0, MAX_ITEMS));
      setVisibleCount(INITIAL_COUNT);
      setIsLoading(false);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, 800);
  };

  const shuffleArray = (arr: Product[]): Product[] =>
    [...arr].sort(() => Math.random() - 0.5);

  const loadMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + LOAD_MORE_COUNT, displayProducts.length)
    );
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setLoading(true);
    setActiveFilter(null);
    loadData();
    setTimeout(() => setRefreshing(false), 2000);
    setLoading(false);
  }, []);

  const applyFilter = (type: FilterType, value: string) => {
    if (activeFilter?.type === type && activeFilter?.value === value) {
      setActiveFilter(null);
    } else {
      setActiveFilter({ type, value });
    }
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open link", err)
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#6200ee" />
        <Text className="mt-3 text-sm text-gray-600 font-medium">
          Fetching clothes for you...
        </Text>
      </View>
    );
  }

  const FilterChips: React.FC = () => (
    <View className="px-4 py-3 bg-white">
      <Text className="text-xs text-gray-500 mb-1">Gender</Text>
      <View className="flex-row flex-wrap">
        {filters.gender.map((gender) => (
          <TouchableOpacity
            key={gender}
            onPress={() => applyFilter("gender", gender)}
            className={`mr-2 mb-2 px-3 py-1 rounded-full ${
              activeFilter?.type === "gender" && activeFilter?.value === gender
                ? "bg-indigo-900"
                : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-xs font-medium ${
                activeFilter?.type === "gender" &&
                activeFilter?.value === gender
                  ? "text-white"
                  : "text-gray-700"
              }`}
            >
              {gender}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const ProductCard: React.FC<{ item: Product }> = ({ item }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
        width: "46%",
        margin: 8,
      }}
    >
      <TouchableOpacity
        className="bg-white rounded-2xl overflow-hidden shadow-md"
        activeOpacity={0.9}
        style={{
          shadowColor: "#4c1d95",
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}
        onPress={() => {
          setSelectedItem(item);
          Haptics.selectionAsync();
        }}
      >
        <View className="relative">
          <Image
            source={{ uri: item?.url }}
            className="w-full h-48"
            resizeMode="cover"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.5)", "transparent"]}
            className="absolute top-0 left-0 right-0 h-12 opacity-40"
          />
          <View className="absolute bottom-0 left-0 bg-indigo-900 px-3 py-1 rounded-tr-lg">
            <Text className="text-xs text-white font-medium">
              {item.gender}
            </Text>
          </View>
        </View>

        <View className="p-3">
          <Text numberOfLines={1} className="text-sm font-bold text-gray-800">
            {item?.name}
          </Text>
          <View className="flex-row justify-between items-center mt-1">
            <Text className="text-xs text-gray-600">{item?.type}</Text>
            <View className="bg-purple-100 px-2 py-1 rounded-full">
              <Text className="text-xs text-purple-700">{item?.season}</Text>
            </View>
          </View>
          <View className="flex-row items-center mt-2">
            <View
              className="w-3 h-3 mr-1 rounded-full"
              style={{ backgroundColor: item?.color?.toLowerCase() }}
            />
            <Text className="text-xs text-gray-500">{item?.color}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const FilterInfo: React.FC = () => {
    if (!activeFilter) return null;
    return (
      <View className="flex-row justify-between items-center px-4 py-3 bg-white border-t border-b border-purple-100">
        <View className="flex-row items-center">
          <View className="w-2 h-8 bg-indigo-900 rounded-full mr-3" />
          <Text className="text-sm">
            Showing {activeFilter.type}:
            <Text className="font-bold text-indigo-900">
              {" "}
              {activeFilter.value}
            </Text>
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setActiveFilter(null)}
          className="bg-purple-100 px-3 py-1 rounded-full"
        >
          <Text className="text-sm text-indigo-900 font-medium">Clear</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList<Product>
        data={displayProducts.slice(0, visibleCount)}
        renderItem={({ item }) => <ProductCard item={item} />}
        keyExtractor={(item) => item.cloth_id.toString()}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: tabBarHeight + 20 }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        ListHeaderComponent={
          <>
            <FilterChips />
            <FilterInfo />
          </>
        }
        ListEmptyComponent={
          <View className="p-8 items-center justify-center h-64">
            <View className="bg-purple-50 p-4 rounded-full mb-4">
              <Ionicons name="search-outline" size={40} color="#4c1d95" />
            </View>
            <Text className="text-xl font-bold mt-2 text-indigo-900">
              No products found
            </Text>
            <Text className="text-gray-500 text-center mt-2">
              Try changing your filter settings or refreshing
            </Text>
            <TouchableOpacity
              onPress={onRefresh}
              className="mt-6 bg-indigo-900 px-6 py-3 rounded-full"
            >
              <Text className="text-white font-medium">Refresh Collection</Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={
          visibleCount < displayProducts.length ? (
            <TouchableOpacity
              onPress={loadMore}
              className="bg-indigo-900 p-4 rounded-full self-center my-6 px-8 flex-row items-center"
            >
              <Text className="text-white font-medium mr-2">Load More</Text>
              <Ionicons name="arrow-down" size={16} color="white" />
            </TouchableOpacity>
          ) : displayProducts.length > 0 ? (
            <View className="items-center py-8">
              <View className="w-16 h-1 bg-purple-200 rounded-full mb-3" />
              <Text className="text-center text-indigo-900 font-medium">
                You've reached the end!
              </Text>
              <Text className="text-center text-gray-500 text-xs mt-1">
                Pull down to refresh
              </Text>
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4c1d95"]}
            tintColor="#4c1d95"
          />
        }
      />

      {/* Modal Popup for Product Details */}
      <Modal visible={selectedItem !== null} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-60 px-4">
          <View className="bg-white rounded-2xl w-full max-w-md p-6">
            <Image
              source={{ uri: selectedItem?.url }}
              className="w-52 h-56 rounded-xl mb-4 mx-auto"
              resizeMode="stretch"
            />
            <Text className="text-lg font-bold text-gray-800 mb-2">
              {selectedItem?.name}
            </Text>
            <Text className="text-sm text-gray-500 mb-1">
              {selectedItem?.type} · {selectedItem?.season}
            </Text>
            <Text className="text-sm text-gray-500 mb-4">
              Color: {selectedItem?.color} | Gender: {selectedItem?.gender}
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
    </View>
  );
};

export default HomePage;
