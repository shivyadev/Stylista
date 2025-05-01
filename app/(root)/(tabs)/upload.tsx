import React, { useState } from "react";
import {
  View,
  Image,
  Alert,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import {
  Camera,
  ImagePlus,
  User2,
  Briefcase,
  Dumbbell,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";

const ImagePickerExample: React.FC = () => {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [occasion, setOccasion] = useState<
    "formal" | "casual" | "sports" | null
  >(null);

  const requestPermission = async (
    permissionRequest: () => Promise<ImagePicker.PermissionResponse>,
    type: string
  ) => {
    const { status } = await permissionRequest();
    if (status !== "granted") {
      Alert.alert("Permission needed", `We need ${type} permissions.`);
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermission(
      ImagePicker.requestMediaLibraryPermissionsAsync,
      "media library"
    );
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      selectionLimit: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermission(
      ImagePicker.requestCameraPermissionsAsync,
      "camera"
    );
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!imageUri || !gender || !occasion) {
      Alert.alert("Missing Info", "Please select image, gender, and occasion.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg",
        name: "photo.jpg",
      } as any);
      formData.append("gender", gender);
      formData.append("occasion", occasion);

      const response = await fetch("https://your-api-url.com/upload", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (response.ok) {
        Alert.alert("Success", "Upload complete!", [
          {
            text: "OK",
            onPress: () => {
              setImageUri(null);
              setGender(null);
              setOccasion(null);
            },
          },
        ]);
      } else {
        const errText = await response.text();
        Alert.alert("Failed", errText || "Upload failed.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while uploading.");
    } finally {
      setUploading(false);
    }
  };

  const SelectionButton = ({
    selected,
    label,
    onPress,
    icon,
  }: {
    selected: boolean;
    label: string;
    onPress: () => void;
    icon?: React.ReactNode;
  }) => (
    <TouchableOpacity
      className={`px-4 py-3 rounded-xl flex-row items-center space-x-3 ${
        selected ? "bg-[rgb(99,91,162)]" : "bg-purple-100"
      }`}
      onPress={onPress}
    >
      {icon}
      <Text className={`font-medium ${selected ? "text-white" : "text-black"}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-purple-50">
      <View className="flex-1 px-6 py-8">
        <Text className="text-2xl font-abril font-bold text-center mb-6 text-black">
          Upload Your Outfit
        </Text>

        <TouchableOpacity
          className="w-full aspect-square bg-purple-50 rounded-3xl overflow-hidden mb-4 items-center justify-center border-2 border-dashed border-purple-200"
          onPress={() => setModalVisible(true)}
        >
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="items-center justify-center">
              <Image
                source={images.uploadicon}
                className="w-64 h-64"
                resizeMode="cover"
              />
              <Text className="text-black mt-4 text-center">
                Tap to select an image
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <View className="mb-6">
          <Text className="text-base font-semibold mb-3">Select Gender</Text>
          <View className="flex-row space-x-6 gap-3">
            <SelectionButton
              selected={gender === "male"}
              label="Male"
              icon={
                <User2
                  size={18}
                  color={gender === "male" ? "white" : "black"}
                />
              }
              onPress={() => setGender("male")}
            />
            <SelectionButton
              selected={gender === "female"}
              label="Female"
              icon={
                <User2
                  size={18}
                  color={gender === "female" ? "white" : "black"}
                />
              }
              onPress={() => setGender("female")}
            />
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-base font-semibold mb-3">Select Occasion</Text>
          <View className="flex-row flex-wrap gap-3">
            <SelectionButton
              selected={occasion === "formal"}
              label="Formal"
              icon={
                <Briefcase
                  size={18}
                  color={occasion === "formal" ? "white" : "black"}
                />
              }
              onPress={() => setOccasion("formal")}
            />
            <SelectionButton
              selected={occasion === "casual"}
              label="Casual"
              icon={
                <ImagePlus
                  size={18}
                  color={occasion === "casual" ? "white" : "black"}
                />
              }
              onPress={() => setOccasion("casual")}
            />
            <SelectionButton
              selected={occasion === "sports"}
              label="Sports"
              icon={
                <Dumbbell
                  size={18}
                  color={occasion === "sports" ? "white" : "black"}
                />
              }
              onPress={() => setOccasion("sports")}
            />
          </View>
        </View>

        <TouchableOpacity
          className="w-full bg-purple-900 py-4 rounded-xl mb-4 items-center"
          onPress={() => router.push("/(root)/imagegallery")}
        >
          <Text className="text-white font-semibold text-lg">Upload</Text>
        </TouchableOpacity>

        {uploading && (
          <View className="absolute inset-0 items-center justify-center bg-purple-900/50">
            <ActivityIndicator size="large" color="#ffffff" />
            <Text className="text-white mt-4">Uploading image...</Text>
          </View>
        )}
      </View>

      <Modal
        transparent
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/60 items-center justify-center"
          onPress={() => setModalVisible(false)}
        >
          <View className="bg-white rounded-3xl p-6 w-4/5 max-w-sm">
            <Text className="text-xl font-bold text-center mb-6 text-purple-800">
              Select Image Source
            </Text>

            <TouchableOpacity
              className="bg-purple-600 py-4 rounded-xl mb-3 flex-row items-center justify-center space-x-3"
              onPress={() => {
                setModalVisible(false);
                takePhoto();
              }}
            >
              <Camera size={20} color="white" />
              <Text className="text-white font-semibold">Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-purple-600 py-4 rounded-xl mb-6 flex-row items-center justify-center space-x-3"
              onPress={() => {
                setModalVisible(false);
                pickImage();
              }}
            >
              <ImagePlus size={20} color="white" />
              <Text className="text-white font-semibold">
                Choose from Gallery
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-gray-500 font-medium">Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default ImagePickerExample;
