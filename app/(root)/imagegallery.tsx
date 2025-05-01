import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Animated,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  AntDesign,
  Feather,
} from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const COLORS = {
  primary: "#6200ee", // Deep purple
  secondary: "#bb86fc", // Light purple
  darkPurple: "#3700b3", // Darker purple
  lightPurple: "#e0d0ff", // Very light purple
  white: "#ffffff",
  black: "#121212",
  lightGrey: "#f5f5f5",
  darkGray: "#757575",
  danger: "#CF6679",
  success: "#4CAF50",
  background: "#fcfcfc",
  text: "#333333",
};

interface ClothingItem {
  id: string;
  type: string;
  image: any;
  brand?: string;
  price?: string;
  url?: string;
  color?: string;
}

interface Combination {
  id: string;
  name: string;
  items: ClothingItem[];
}

const RecommendationScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];
  const [savedCombinations, setSavedCombinations] = useState<string[]>([]);

  // Mock user upload data
  const userUpload = {
    id: "user-1",
    type: "Shirt",
    image: {
      uri: "https://www.vellure.in/cdn/shop/files/111Untitled-1.jpg?v=1745577051",
    },
  };

  // Updated color combinations featuring purple, white, and black
  const recommendedCombinations: Combination[] = [
    {
      id: "1",
      name: "Purple Elegance",
      items: [
        {
          id: "1",
          type: "Blazer",
          brand: "H&M",
          price: "$89.99",
          color: "Deep Purple",
          image: {
            uri: "http://assets.myntassets.com/v1/images/style/properties/ce35dbfe74af74ea9c9a25b0c3d5995b_images.jpg",
          },
        },
        {
          id: "2",
          type: "Pants",
          brand: "Zara",
          price: "$59.99",
          color: "Black",
          image: {
            uri: "http://assets.myntassets.com/v1/images/style/properties/9eb119d3dd0976d16ecc5f15f81d9cd7_images.jpg",
          },
        },
        {
          id: "3",
          type: "Shoes",
          brand: "Aldo",
          price: "$120.00",
          color: "Black",
          image: {
            uri: "http://assets.myntassets.com/v1/images/style/properties/5d9d4df1f52b537f7ecdb693f8b311e4_images.jpg",
          },
        },
        {
          id: "4",
          type: "Watch",
          brand: "Fossil",
          price: "$150.00",
          color: "Silver",
          image: {
            uri: "http://assets.myntassets.com/v1/images/style/properties/25de793ebfeae19ad56eb89d39a482da_images.jpg",
          },
        },
      ],
    },
    {
      id: "2",
      name: "Lavender Dreams",
      items: [
        {
          id: "5",
          type: "Shirt",
          brand: "Calvin Klein",
          price: "$65.99",
          color: "Lavender",
          image: {
            uri: "http://assets.myntassets.com/v1/images/style/properties/96b5e5dcd2dc90c7e3b64bd74701e3da_images.jpg",
          },
        },
        {
          id: "6",
          type: "Jeans",
          brand: "Levis",
          price: "$79.99",
          color: "White",
          image: {
            uri: "http://assets.myntassets.com/v1/images/style/properties/a8dac4f5cff7f296b9bbf870c6b9d473_images.jpg",
          },
        },
        {
          id: "7",
          type: "Sneakers",
          brand: "Nike",
          price: "$129.99",
          color: "White",
          image: {
            uri: "http://assets.myntassets.com/v1/images/style/properties/Nike-Men-White-Casual-Shoes_fd9872ff8fff33008161e7ea789a72bb_images.jpg",
          },
        },
        {
          id: "8",
          type: "Watch",
          brand: "Casio",
          price: "$80.00",
          color: "Silver",
          image: {
            uri: "http://assets.myntassets.com/v1/images/style/properties/91e77edbb1c2ab6d8d6ab6da746dfdac_images.jpg",
          },
        },
      ],
    },
    {
      id: "3",
      name: "Monochrome Magic",
      items: [
        {
          id: "9",
          type: "Suit",
          brand: "Calvin Klein",
          price: "$299.99",
          color: "Black",
          image: {
            uri: "http://assets.myntassets.com/v1/images/style/properties/96b5e5dcd2dc90c7e3b64bd74701e3da_images.jpg",
          },
        },
        {
          id: "10",
          type: "Dress Shirt",
          brand: "Van Heusen",
          price: "$59.99",
          color: "White",
          image: {
            uri: "http://assets.myntassets.com/v1/images/style/properties/2a5d2ac24bfac96fc86ac7c3a7668f94_images.jpg",
          },
        },
        {
          id: "11",
          type: "Dress Shoes",
          brand: "Clarks",
          price: "$159.99",
          color: "Black",
          image: {
            uri: "http://assets.myntassets.com/v1/images/style/properties/5d9d4df1f52b537f7ecdb693f8b311e4_images.jpg",
          },
        },
        {
          id: "12",
          type: "Tie",
          brand: "Hugo Boss",
          price: "$65.00",
          color: "Deep Purple",
          image: {
            uri: "http://assets.myntassets.com/v1/images/style/properties/2a5d2ac24bfac96fc86ac7c3a7668f94_images.jpg",
          },
        },
      ],
    },
  ];

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
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
    }, 1500);
  }, []);

  const handleItemPress = (item: ClothingItem) => {
    // Haptics feedback would be implemented here in a real app
    // Show item details in a modal or navigate to product page
    console.log(`View details for ${item.type}`);
  };

  const toggleSaveCombination = (combinationId: string) => {
    setSavedCombinations((prev) => {
      if (prev.includes(combinationId)) {
        return prev.filter((id) => id !== combinationId);
      } else {
        return [...prev, combinationId];
      }
    });
  };

  const renderCombination = ({ item }: { item: Combination }) => {
    const isSaved = savedCombinations.includes(item.id);

    return (
      <Animated.View
        style={[
          styles.combinationContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={styles.combinationHeader}>
          <View style={styles.combinationTitleContainer}>
            <Text style={styles.combinationTitle}>{item.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => toggleSaveCombination(item.id)}
          >
            {isSaved ? (
              <Ionicons name="bookmark" size={24} color={COLORS.primary} />
            ) : (
              <Ionicons
                name="bookmark-outline"
                size={24}
                color={COLORS.darkGray}
              />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollContainer}
        >
          {item.items.map((clothingItem) => (
            <TouchableOpacity
              key={clothingItem.id}
              style={styles.clothingItem}
              onPress={() => handleItemPress(clothingItem)}
              activeOpacity={0.7}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={
                    typeof clothingItem.image === "string"
                      ? { uri: clothingItem.image }
                      : clothingItem.image
                  }
                  style={styles.clothingImage}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.itemDetails}>
                <Text style={styles.clothingType}>{clothingItem.type}</Text>
                <TouchableOpacity
                  style={styles.getLinkButton}
                  onPress={() => console.log(`Link for ${clothingItem.type}`)}
                >
                  <Text style={styles.getLinkText}>Shop Now</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    );
  };

  const renderUserUpload = () => (
    <Animated.View
      style={[
        styles.uploadedItemWrapper,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <Text style={styles.title}>Your Item</Text>
      <View style={styles.uploadedItem}>
        <Image source={userUpload.image} style={styles.uploadedImage} />
        <View style={styles.uploadedDetails}>
          <Text style={styles.uploadedType}>{userUpload.type}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => console.log("Edit item details")}
          >
            <Feather name="edit-2" size={12} color={COLORS.primary} />
            <Text style={styles.editButtonText}>Edit Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>
            Finding perfect combinations...
          </Text>
        </View>
      );
    }

    return (
      <>
        {renderUserUpload()}
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitle}>Recommended for You</Text>
            {savedCombinations.length > 0 && (
              <TouchableOpacity
                style={styles.savedButton}
                onPress={() => console.log("View saved combinations")}
              >
                <Text style={styles.savedButtonText}>
                  Saved ({savedCombinations.length})
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            data={recommendedCombinations}
            renderItem={renderCombination}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.recommendationsList}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Style Recommendations</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.black} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>

      <TouchableOpacity style={styles.fabButton}>
        <Ionicons name="camera-outline" size={24} color={COLORS.white} />
        <Text style={styles.fabText}>Upload New</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RecommendationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.black,
  },
  backButton: {
    padding: 8,
  },
  menuButton: {
    padding: 8,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.darkGray,
    fontSize: 14,
  },
  uploadedItemWrapper: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: COLORS.black,
  },
  uploadedItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 16,
  },
  uploadedDetails: {
    flex: 1,
  },
  uploadedType: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  uploadedBrand: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 6,
  },
  uploadedColorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  colorCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
    borderWidth: 0.5,
    borderColor: "#ddd",
  },
  uploadedColor: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  editButtonText: {
    marginLeft: 4,
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "500",
  },
  subtitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
  },
  savedButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  savedButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "500",
  },
  recommendationsList: {
    paddingHorizontal: 16,
  },
  combinationContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  combinationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  combinationTitleContainer: {
    flex: 1,
  },
  combinationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: COLORS.black,
  },
  saveButton: {
    padding: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 13,
    color: COLORS.darkGray,
    marginLeft: 4,
  },
  horizontalScrollContainer: {
    paddingRight: 16,
  },
  clothingItem: {
    width: 160,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: COLORS.lightGrey,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
  },
  clothingImage: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  itemDetails: {
    padding: 12,
  },
  clothingType: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 6,
    color: COLORS.black,
  },
  colorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  colorText: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
  getLinkButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  getLinkText: {
    color: COLORS.white,
    fontWeight: "500",
    fontSize: 12,
  },
  fabButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 30,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  fabText: {
    color: COLORS.white,
    fontWeight: "600",
    marginLeft: 8,
  },
});
