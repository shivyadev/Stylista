import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Alert,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter, useFocusEffect } from "expo-router";
import {
  Camera,
  ImagePlus,
  User2,
  Briefcase,
  Dumbbell,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import { axiosInstance } from "@/utils/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ImagePickerExample: React.FC = () => {
  const router = useRouter();
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [gender, setGender] = useState<"Men" | "Women" | null>(null);
  const [occasion, setOccasion] = useState<
    "Formal" | "Casual" | "Sports" | null
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

  const pickImage = async () => {
    const hasPermission = await requestPermission(
      ImagePicker.requestMediaLibraryPermissionsAsync,
      "media library"
    );
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: undefined,
      quality: 0.8,
      selectionLimit: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const image = result.assets[0];
      setImage(image);
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
      aspect: undefined,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const image = result.assets[0];
      setImage(image);
    }
  };

  const uploadImage = async () => {
    if (!image || !gender || !occasion) {
      Alert.alert("Missing Info", "Please select image, gender, and occasion.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", {
        uri: image.uri,
        type: image.mimeType,
        name: image.fileName,
      } as any);
      formData.append("gender", gender);
      formData.append("usage", occasion);

      const response = await axiosInstance.post(
        "/models/provide_outfits/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        Alert.alert("Success", "Upload complete!", [
          {
            text: "OK",
            onPress: () => {
              setImage(null);
              setGender(null);
              setOccasion(null);
            },
          },
        ]);

        const id = response.data.id;
        const path = `/(root)/imagegallery?id=${id}` as const;
        router.push(path);
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <SafeAreaView edges={["top"]} className="flex-1 bg-purple-50">
        <ScrollView
          className="flex-1 px-6 pt-8"
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-2xl font-abril font-bold text-center mb-6 text-black">
            Upload Your Outfit
          </Text>

          <TouchableOpacity
            className="w-full aspect-square bg-purple-50 rounded-3xl overflow-hidden mb-4 items-center justify-center border-2 border-dashed border-purple-200"
            onPress={() => setModalVisible(true)}
          >
            {image ? (
              <Image
                source={{ uri: image.uri }}
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
                selected={gender === "Men"}
                label="Male"
                icon={
                  <User2
                    size={18}
                    color={gender === "Men" ? "white" : "black"}
                  />
                }
                onPress={() => setGender("Men")}
              />
              <SelectionButton
                selected={gender === "Women"}
                label="Female"
                icon={
                  <User2
                    size={18}
                    color={gender === "Women" ? "white" : "black"}
                  />
                }
                onPress={() => setGender("Women")}
              />
            </View>
          </View>

          <View className="mb-8">
            <Text className="text-base font-semibold mb-3">
              Select Occasion
            </Text>
            <View className="flex-row flex-wrap gap-3">
              <SelectionButton
                selected={occasion === "Formal"}
                label="Formal"
                icon={
                  <Briefcase
                    size={18}
                    color={occasion === "Formal" ? "white" : "black"}
                  />
                }
                onPress={() => setOccasion("Formal")}
              />
              <SelectionButton
                selected={occasion === "Casual"}
                label="Casual"
                icon={
                  <ImagePlus
                    size={18}
                    color={occasion === "Casual" ? "white" : "black"}
                  />
                }
                onPress={() => setOccasion("Casual")}
              />
              <SelectionButton
                selected={occasion === "Sports"}
                label="Sports"
                icon={
                  <Dumbbell
                    size={18}
                    color={occasion === "Sports" ? "white" : "black"}
                  />
                }
                onPress={() => setOccasion("Sports")}
              />
            </View>
          </View>

          <TouchableOpacity
            className="w-full bg-purple-900 py-4 rounded-xl mb-20 items-center"
            onPress={async () => {
              uploadImage();
            }}
          >
            <Text className="text-white font-semibold text-lg">Upload</Text>
          </TouchableOpacity>

          {uploading && (
            <View className="absolute inset-0 items-center justify-center bg-purple-900/50">
              <ActivityIndicator size="large" color="#ffffff" />
              <Text className="text-white mt-4">Uploading image...</Text>
            </View>
          )}
        </ScrollView>

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
    </KeyboardAvoidingView>
  );
};

export default ImagePickerExample;
