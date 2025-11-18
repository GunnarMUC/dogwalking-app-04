import { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { ArrowLeft, Camera, Dog } from "lucide-react-native";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import useUpload from "@/utils/useUpload";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";

export default function AddPetScreen() {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { uploadImage } = useUpload();

  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [petData, setPetData] = useState({
    name: "",
    breed: "",
    age: "",
    weight: "",
    special_instructions: "",
    photo_url: "",
  });

  const focusedPadding = 12;
  const paddingAnimation = useRef(
    new Animated.Value(insets.bottom + focusedPadding),
  ).current;

  const animateTo = (value) => {
    Animated.timing(paddingAnimation, {
      toValue: value,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleInputFocus = () => {
    if (Platform.OS === "web") {
      return;
    }
    animateTo(focusedPadding);
  };

  const handleInputBlur = () => {
    if (Platform.OS === "web") {
      return;
    }
    animateTo(insets.bottom + focusedPadding);
  };

  const handleUploadPhoto = async () => {
    try {
      setUploadingPhoto(true);
      const result = await uploadImage({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result?.url) {
        setPetData((prev) => ({ ...prev, photo_url: result.url }));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload photo. Please try again.");
      console.error("Photo upload error:", error);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async () => {
    if (!petData.name.trim()) {
      Alert.alert("Error", "Please enter your pet's name");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: petData.name.trim(),
          breed: petData.breed.trim() || null,
          age: petData.age ? parseInt(petData.age) : null,
          weight: petData.weight ? parseFloat(petData.weight) : null,
          special_instructions: petData.special_instructions.trim() || null,
          photo_url: petData.photo_url || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add pet");
      }

      // Invalidate pets query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["pets"] });

      Alert.alert("Success", "Your pet has been added successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Failed to add pet. Please try again.",
      );
      console.error("Add pet error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingAnimatedView style={{ flex: 1 }} behavior="padding">
      <View
        style={{ flex: 1, backgroundColor: "#F8FAFC", paddingTop: insets.top }}
      >
        <StatusBar style="dark" />

        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 20,
            backgroundColor: "white",
            borderBottomWidth: 1,
            borderBottomColor: "#E2E8F0",
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ padding: 8, marginLeft: -8 }}
          >
            <ArrowLeft size={24} color="#1E293B" />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#1E293B",
            }}
          >
            Add New Pet
          </Text>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading || !petData.name.trim()}
            style={{
              backgroundColor: !petData.name.trim() ? "#CBD5E1" : "#3B82F6",
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 14,
                fontWeight: "600",
              }}
            >
              {loading ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
        </View>

        <Animated.View
          style={{
            flex: 1,
            paddingBottom: paddingAnimation,
          }}
        >
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ padding: 20 }}>
              {/* Photo Upload */}
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 12,
                  padding: 20,
                  marginBottom: 20,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#1E293B",
                    marginBottom: 16,
                  }}
                >
                  Pet Photo
                </Text>

                <TouchableOpacity
                  onPress={handleUploadPhoto}
                  disabled={uploadingPhoto}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    backgroundColor: "#F1F5F9",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    marginBottom: 12,
                  }}
                >
                  {petData.photo_url ? (
                    <Image
                      source={{ uri: petData.photo_url }}
                      style={{ width: 120, height: 120 }}
                      contentFit="cover"
                      transition={200}
                    />
                  ) : (
                    <Dog size={32} color="#64748B" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleUploadPhoto}
                  disabled={uploadingPhoto}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#3B82F6",
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 6,
                  }}
                >
                  <Camera size={16} color="white" />
                  <Text
                    style={{
                      color: "white",
                      fontSize: 14,
                      fontWeight: "500",
                      marginLeft: 8,
                    }}
                  >
                    {uploadingPhoto
                      ? "Uploading..."
                      : petData.photo_url
                        ? "Change Photo"
                        : "Add Photo"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Basic Info */}
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 12,
                  padding: 20,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#1E293B",
                    marginBottom: 16,
                  }}
                >
                  Basic Information
                </Text>

                {/* Pet Name */}
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: 8,
                    }}
                  >
                    Pet Name *
                  </Text>
                  <TextInput
                    value={petData.name}
                    onChangeText={(text) =>
                      setPetData((prev) => ({ ...prev, name: text }))
                    }
                    placeholder="Enter your pet's name"
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    style={{
                      backgroundColor: "#F8FAFC",
                      borderRadius: 8,
                      padding: 12,
                      fontSize: 16,
                      color: "#1E293B",
                      borderWidth: 1,
                      borderColor: "#E2E8F0",
                    }}
                  />
                </View>

                {/* Breed */}
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: 8,
                    }}
                  >
                    Breed
                  </Text>
                  <TextInput
                    value={petData.breed}
                    onChangeText={(text) =>
                      setPetData((prev) => ({ ...prev, breed: text }))
                    }
                    placeholder="e.g. Golden Retriever, Mixed, etc."
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    style={{
                      backgroundColor: "#F8FAFC",
                      borderRadius: 8,
                      padding: 12,
                      fontSize: 16,
                      color: "#1E293B",
                      borderWidth: 1,
                      borderColor: "#E2E8F0",
                    }}
                  />
                </View>

                {/* Age and Weight Row */}
                <View style={{ flexDirection: "row", marginBottom: 16 }}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        color: "#374151",
                        marginBottom: 8,
                      }}
                    >
                      Age (years)
                    </Text>
                    <TextInput
                      value={petData.age}
                      onChangeText={(text) =>
                        setPetData((prev) => ({ ...prev, age: text }))
                      }
                      placeholder="e.g. 3"
                      keyboardType="numeric"
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      style={{
                        backgroundColor: "#F8FAFC",
                        borderRadius: 8,
                        padding: 12,
                        fontSize: 16,
                        color: "#1E293B",
                        borderWidth: 1,
                        borderColor: "#E2E8F0",
                      }}
                    />
                  </View>

                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        color: "#374151",
                        marginBottom: 8,
                      }}
                    >
                      Weight (lbs)
                    </Text>
                    <TextInput
                      value={petData.weight}
                      onChangeText={(text) =>
                        setPetData((prev) => ({ ...prev, weight: text }))
                      }
                      placeholder="e.g. 45"
                      keyboardType="numeric"
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      style={{
                        backgroundColor: "#F8FAFC",
                        borderRadius: 8,
                        padding: 12,
                        fontSize: 16,
                        color: "#1E293B",
                        borderWidth: 1,
                        borderColor: "#E2E8F0",
                      }}
                    />
                  </View>
                </View>

                {/* Special Instructions */}
                <View style={{ marginBottom: 8 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: 8,
                    }}
                  >
                    Special Instructions
                  </Text>
                  <TextInput
                    value={petData.special_instructions}
                    onChangeText={(text) =>
                      setPetData((prev) => ({
                        ...prev,
                        special_instructions: text,
                      }))
                    }
                    placeholder="Any special care instructions, medical needs, behavioral notes, etc."
                    multiline
                    numberOfLines={4}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    style={{
                      backgroundColor: "#F8FAFC",
                      borderRadius: 8,
                      padding: 12,
                      fontSize: 16,
                      color: "#1E293B",
                      borderWidth: 1,
                      borderColor: "#E2E8F0",
                      height: 80,
                      textAlignVertical: "top",
                    }}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}
