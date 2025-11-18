import { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Alert, TextInput } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import useUser from "@/utils/auth/useUser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Play,
  Pause,
  Square,
  Camera,
  MapPin,
  Clock,
  Send,
} from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

export default function WalkTrackingScreen() {
  const insets = useSafeAreaInsets();
  const { data: user } = useUser();
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();

  const [walkState, setWalkState] = useState("not-started"); // not-started, active, paused, completed
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [walkPhotos, setWalkPhotos] = useState([]);
  const [walkNotes, setWalkNotes] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);

  const intervalRef = useRef(null);

  // Fetch booking details
  const { data: bookingData, isLoading } = useQuery({
    queryKey: ["booking-detail", id],
    queryFn: async () => {
      const response = await fetch(`/api/bookings/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch booking details");
      }
      return response.json();
    },
    enabled: !!id && !!user,
  });

  // Complete walk mutation
  const completeWalkMutation = useMutation({
    mutationFn: async ({ walk_notes, photo_urls }) => {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "completed",
          walk_notes,
          photo_urls,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to complete walk");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking-detail", id] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      Alert.alert("Walk Completed!", "The walk has been marked as complete.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    },
  });

  // Request location permissions and get current location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Location access is needed for walk tracking.",
        );
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location);
      } catch (error) {
        console.warn("Error getting location:", error);
      }
    })();
  }, []);

  // Timer effect
  useEffect(() => {
    if (walkState === "active" && startTime) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [walkState, startTime]);

  const formatElapsedTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const startWalk = () => {
    setWalkState("active");
    setStartTime(Date.now());
    setElapsedTime(0);
  };

  const pauseWalk = () => {
    setWalkState("paused");
  };

  const resumeWalk = () => {
    setWalkState("active");
    setStartTime(Date.now() - elapsedTime);
  };

  const takePhoto = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission required",
          "Camera access is needed to take photos during the walk.",
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        setWalkPhotos((prev) => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  const completeWalk = () => {
    Alert.alert(
      "Complete Walk",
      "Are you sure you want to complete this walk?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Complete",
          onPress: () => {
            setWalkState("completed");
            completeWalkMutation.mutate({
              walk_notes: walkNotes.trim() || null,
              photo_urls: walkPhotos,
            });
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#F8FAFC",
          paddingTop: insets.top,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <StatusBar style="dark" />
        <Text style={{ fontSize: 16, color: "#64748B" }}>
          Loading walk details...
        </Text>
      </View>
    );
  }

  if (!bookingData?.booking) {
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
        <Text style={{ fontSize: 18, color: "#64748B", textAlign: "center" }}>
          Booking not found
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            backgroundColor: "#3B82F6",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 8,
            marginTop: 16,
          }}
        >
          <Text style={{ color: "white", fontSize: 14, fontWeight: "600" }}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const booking = bookingData.booking;
  const isWalker = user?.id === booking.walker_id;

  if (!isWalker) {
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
          Only the assigned walker can track this walk
        </Text>
      </View>
    );
  }

  return (
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
          Walk Tracker
        </Text>

        <View style={{ width: 40 }} />
      </View>

      {/* Pet Info Card */}
      <View
        style={{
          backgroundColor: "white",
          margin: 20,
          padding: 20,
          borderRadius: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: "#1E293B",
            marginBottom: 8,
          }}
        >
          Walking: {booking.pet_name}
        </Text>
        <Text style={{ fontSize: 14, color: "#64748B" }}>
          Scheduled duration: {booking.duration_minutes} minutes
        </Text>
        {booking.special_requests && (
          <View
            style={{
              marginTop: 8,
              padding: 8,
              backgroundColor: "#FEF3C7",
              borderRadius: 6,
            }}
          >
            <Text style={{ fontSize: 12, color: "#92400E", fontWeight: "500" }}>
              Special requests: {booking.special_requests}
            </Text>
          </View>
        )}
      </View>

      {/* Timer Display */}
      <View
        style={{
          backgroundColor: "white",
          marginHorizontal: 20,
          marginBottom: 20,
          padding: 30,
          borderRadius: 12,
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Text
          style={{
            fontSize: 48,
            fontWeight: "bold",
            color: "#1E293B",
            marginBottom: 8,
          }}
        >
          {formatElapsedTime(elapsedTime)}
        </Text>
        <Text style={{ fontSize: 16, color: "#64748B" }}>
          {walkState === "not-started" && "Ready to start"}
          {walkState === "active" && "Walking in progress"}
          {walkState === "paused" && "Walk paused"}
          {walkState === "completed" && "Walk completed"}
        </Text>
      </View>

      {/* Control Buttons */}
      <View
        style={{
          marginHorizontal: 20,
          marginBottom: 20,
        }}
      >
        {walkState === "not-started" && (
          <TouchableOpacity
            onPress={startWalk}
            style={{
              backgroundColor: "#10B981",
              borderRadius: 12,
              paddingVertical: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Play size={20} color="white" />
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "600",
                marginLeft: 8,
              }}
            >
              Start Walk
            </Text>
          </TouchableOpacity>
        )}

        {walkState === "active" && (
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity
              onPress={pauseWalk}
              style={{
                backgroundColor: "#F59E0B",
                borderRadius: 12,
                paddingVertical: 16,
                flex: 1,
                marginRight: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Pause size={18} color="white" />
              <Text
                style={{
                  color: "white",
                  fontSize: 14,
                  fontWeight: "600",
                  marginLeft: 6,
                }}
              >
                Pause
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={takePhoto}
              style={{
                backgroundColor: "#3B82F6",
                borderRadius: 12,
                paddingVertical: 16,
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Camera size={18} color="white" />
              <Text
                style={{
                  color: "white",
                  fontSize: 14,
                  fontWeight: "600",
                  marginLeft: 6,
                }}
              >
                Photo
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {walkState === "paused" && (
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity
              onPress={resumeWalk}
              style={{
                backgroundColor: "#10B981",
                borderRadius: 12,
                paddingVertical: 16,
                flex: 1,
                marginRight: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Play size={18} color="white" />
              <Text
                style={{
                  color: "white",
                  fontSize: 14,
                  fontWeight: "600",
                  marginLeft: 6,
                }}
              >
                Resume
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={takePhoto}
              style={{
                backgroundColor: "#3B82F6",
                borderRadius: 12,
                paddingVertical: 16,
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Camera size={18} color="white" />
              <Text
                style={{
                  color: "white",
                  fontSize: 14,
                  fontWeight: "600",
                  marginLeft: 6,
                }}
              >
                Photo
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Photos Taken */}
      {walkPhotos.length > 0 && (
        <View
          style={{
            backgroundColor: "white",
            marginHorizontal: 20,
            marginBottom: 20,
            padding: 20,
            borderRadius: 12,
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
              marginBottom: 12,
            }}
          >
            Photos Taken ({walkPhotos.length})
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {walkPhotos.map((photoUri, index) => (
              <View
                key={index}
                style={{ width: "31%", marginRight: "2%", marginBottom: 8 }}
              >
                <Image
                  source={{ uri: photoUri }}
                  style={{ width: "100%", height: 80, borderRadius: 8 }}
                  contentFit="cover"
                  transition={200}
                />
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Walk Notes */}
      {(walkState === "active" || walkState === "paused") && (
        <View
          style={{
            backgroundColor: "white",
            marginHorizontal: 20,
            marginBottom: 20,
            padding: 20,
            borderRadius: 12,
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
              marginBottom: 12,
            }}
          >
            Walk Notes (Optional)
          </Text>
          <TextInput
            value={walkNotes}
            onChangeText={setWalkNotes}
            placeholder="Add any notes about the walk..."
            multiline
            numberOfLines={3}
            style={{
              backgroundColor: "#F8FAFC",
              borderRadius: 8,
              padding: 12,
              fontSize: 14,
              color: "#1E293B",
              borderWidth: 1,
              borderColor: "#E2E8F0",
              height: 80,
              textAlignVertical: "top",
            }}
          />
        </View>
      )}

      {/* Complete Walk Button */}
      {(walkState === "active" || walkState === "paused") &&
        elapsedTime > 0 && (
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              paddingBottom: insets.bottom + 20,
              borderTopWidth: 1,
              borderTopColor: "#E2E8F0",
            }}
          >
            <TouchableOpacity
              onPress={completeWalk}
              disabled={completeWalkMutation.isPending}
              style={{
                backgroundColor: "#10B981",
                borderRadius: 12,
                paddingVertical: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                opacity: completeWalkMutation.isPending ? 0.7 : 1,
              }}
            >
              <Square size={20} color="white" />
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "600",
                  marginLeft: 8,
                }}
              >
                {completeWalkMutation.isPending
                  ? "Completing..."
                  : "Complete Walk"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
    </View>
  );
}
