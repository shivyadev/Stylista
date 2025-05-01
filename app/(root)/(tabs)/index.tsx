import {
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

// Sample static product list for testing
const sampleProducts = [
  {
    id: "1",
    name: "Blazer",
    image:
      "http://assets.myntassets.com/v1/images/style/properties/b84ff60e9a3642237a53b4bf92652fcd_images.jpg",
  },
  {
    id: "2",
    name: "Pants",
    image:
      "http://assets.myntassets.com/v1/images/style/properties/Basics-Men-Beige-New-Improved-Fit-Trousers_53052cb1d9386e318ee23454f9a4e3fd_images.jpg",
  },
  {
    id: "3",
    name: "Shoes",
    image:
      "http://assets.myntassets.com/v1/images/style/properties/f68b67a4d85b376e096423f7f68e2749_images.jpg",
  },
  {
    id: "4",
    name: "Watch",
    image:
      "http://assets.myntassets.com/v1/images/style/properties/25de793ebfeae19ad56eb89d39a482da_images.jpg",
  },
  {
    id: "5",
    name: "Belt",
    image:
      "http://assets.myntassets.com/v1/images/style/properties/1e902809cd7030b51344d4290b3d04a5_images.jpg",
  },
];

export default function Index() {
  const router = useRouter();
  const [products, setProducts] = useState(sampleProducts);

  // Uncomment this when backend is ready:
  /*
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://your-api.com/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);
  */

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Welcome!</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F5FF",
    paddingTop: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    paddingHorizontal: 16,
    marginBottom: 12,
    color: "#5E35B1",
  },
  list: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    width: "48%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#222",
  },
  price: {
    fontSize: 13,
    color: "#888",
  },
});
