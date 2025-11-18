import { useState, useRef, useEffect } from "react";
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
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  User,
} from "lucide-react-native";
import { router } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useUser from "@/utils/auth/useUser";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";

export default function WalkerSetupScreen() {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { data: user } = useUser();

  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: "",
    experience_years: "",
    hourly_rate: "",
    service_areas: [],
    availability: {},
  });
  const [newServiceArea, setNewServiceArea] = useState("");

  const focusedPadding = 12;
  const paddingAnimation = useRef(
    new Animated.Value(insets.bottom + focusedPadding),
  ).current;

  // Fetch existing walker profile
  const { data: profileResponse } = useQuery({
    queryKey: ["walker-profile"],
    queryFn: async () => {
      const response = await fetch("/api/walker-profiles");
      if (!response.ok) {
        if (response.status === 404) return null; // No profile exists yet
        throw new Error("Failed to fetch profile");
      }
      return response.json();
    },
    enabled: !!user && user.user_type === "walker",
  });

  useEffect(() => {
    if (profileResponse?.profiles && profileResponse.profiles.length > 0) {
      const profile = profileResponse.profiles[0];
      setProfileData({
        bio: profile.bio || "",
        experience_years: profile.experience_years
          ? profile.experience_years.toString()
          : "",
        hourly_rate: profile.hourly_rate ? profile.hourly_rate.toString() : "",
        service_areas: profile.service_areas || [],
        availability: profile.availability || {},
      });
    }
  }, [profileResponse]);

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

  const addServiceArea = () => {
    if (
      newServiceArea.trim() &&
      !profileData.service_areas.includes(newServiceArea.trim())
    ) {
      setProfileData((prev) => ({
        ...prev,
        service_areas: [...prev.service_areas, newServiceArea.trim()],
      }));
      setNewServiceArea("");
    }
  };

  const removeServiceArea = (area) => {
    setProfileData((prev) => ({
      ...prev,
      service_areas: prev.service_areas.filter((a) => a !== area),
    }));
  };

  const hasExistingProfile =
    profileResponse?.profiles && profileResponse.profiles.length > 0;

  const handleSubmit = async () => {
    if (!profileData.bio.trim()) {
      Alert.alert("Error", "Please enter a bio");
      return;
    }

    if (!profileData.hourly_rate.trim()) {
      Alert.alert("Error", "Please enter your hourly rate");
      return;
    }

    try {
      setLoading(true);

      const requestData = {
        bio: profileData.bio.trim(),
        experience_years: profileData.experience_years
          ? parseInt(profileData.experience_years)
          : null,
        hourly_rate: parseFloat(profileData.hourly_rate),
        service_areas: profileData.service_areas,
        availability: profileData.availability,
      };

      const response = await fetch("/api/walker-profiles", {
        method: hasExistingProfile ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save profile");
      }

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["walker-profile"] });

      Alert.alert(
        "Success",
        "Your walker profile has been saved successfully!",
        [
          {
            text: "OK",
            onPress: () => router.push("/(tabs)/home"),
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Failed to save profile. Please try again.",
      );
      console.error("Save walker profile error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.user_type !== "walker") {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#F8FAFC",
          paddingTop: insets.top,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <StatusBar style="dark" />
        <Text style={{ fontSize: 16, color: "#64748B", textAlign: "center" }}>
          This screen is only available for dog walkers
        </Text>
      </View>
    );
  }

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
            {hasExistingProfile ? "Edit Profile" : "Walker Profile Setup"}
          </Text>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={
              loading ||
              !profileData.bio.trim() ||
              !profileData.hourly_rate.trim()
            }
            style={{
              backgroundColor:
                !profileData.bio.trim() || !profileData.hourly_rate.trim()
                  ? "#CBD5E1"
                  : "#3B82F6",
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
              {/* About You Section */}
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
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <User size={20} color="#3B82F6" />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#1E293B",
                      marginLeft: 8,
                    }}
                  >
                    About You
                  </Text>
                </View>

                {/* Bio */}
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: 8,
                    }}
                  >
                    Bio / Introduction *
                  </Text>
                  <TextInput
                    value={profileData.bio}
                    onChangeText={(text) =>
                      setProfileData((prev) => ({ ...prev, bio: text }))
                    }
                    placeholder="Tell pet owners about yourself, your experience with dogs, and what makes you a great walker..."
                    multiline
                    numberOfLines={5}
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
                      height: 100,
                      textAlignVertical: "top",
                    }}
                  />
                </View>

                {/* Experience Years */}
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: 8,
                    }}
                  >
                    Years of Experience
                  </Text>
                  <TextInput
                    value={profileData.experience_years}
                    onChangeText={(text) =>
                      setProfileData((prev) => ({
                        ...prev,
                        experience_years: text,
                      }))
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
              </View>

              {/* Pricing Section */}
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
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <DollarSign size={20} color="#10B981" />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#1E293B",
                      marginLeft: 8,
                    }}
                  >
                    Pricing
                  </Text>
                </View>

                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: 8,
                    }}
                  >
                    Hourly Rate (USD) *
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{ fontSize: 16, color: "#64748B", marginRight: 8 }}
                    >
                      $
                    </Text>
                    <TextInput
                      value={profileData.hourly_rate}
                      onChangeText={(text) =>
                        setProfileData((prev) => ({
                          ...prev,
                          hourly_rate: text,
                        }))
                      }
                      placeholder="25.00"
                      keyboardType="numeric"
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      style={{
                        flex: 1,
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
              </View>

              {/* Service Areas Section */}
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
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <MapPin size={20} color="#F59E0B" />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#1E293B",
                      marginLeft: 8,
                    }}
                  >
                    Service Areas
                  </Text>
                </View>

                {/* Add Service Area Input */}
                <View style={{ flexDirection: "row", marginBottom: 16 }}>
                  <TextInput
                    value={newServiceArea}
                    onChangeText={setNewServiceArea}
                    placeholder="Enter neighborhood or area name"
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    onSubmitEditing={addServiceArea}
                    style={{
                      flex: 1,
                      backgroundColor: "#F8FAFC",
                      borderRadius: 8,
                      padding: 12,
                      fontSize: 16,
                      color: "#1E293B",
                      borderWidth: 1,
                      borderColor: "#E2E8F0",
                      marginRight: 8,
                    }}
                  />
                  <TouchableOpacity
                    onPress={addServiceArea}
                    disabled={!newServiceArea.trim()}
                    style={{
                      backgroundColor: newServiceArea.trim()
                        ? "#3B82F6"
                        : "#CBD5E1",
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      borderRadius: 8,
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 14,
                        fontWeight: "500",
                      }}
                    >
                      Add
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Service Areas List */}
                {profileData.service_areas.length > 0 && (
                  <View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        color: "#374151",
                        marginBottom: 12,
                      }}
                    >
                      Your Service Areas:
                    </Text>
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                      {profileData.service_areas.map((area, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => removeServiceArea(area)}
                          style={{
                            backgroundColor: "#F0F9FF",
                            borderColor: "#3B82F6",
                            borderWidth: 1,
                            borderRadius: 16,
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            marginRight: 8,
                            marginBottom: 8,
                          }}
                        >
                          <Text style={{ color: "#3B82F6", fontSize: 14 }}>
                            {area} ×
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                {profileData.service_areas.length === 0 && (
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#64748B",
                      fontStyle: "italic",
                      textAlign: "center",
                      marginTop: 8,
                    }}
                  >
                    Add neighborhoods or areas where you provide service
                  </Text>
                )}
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}
