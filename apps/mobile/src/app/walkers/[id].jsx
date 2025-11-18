import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import useUser from "@/utils/auth/useUser";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, router } from "expo-router";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Star,
  User,
  Clock,
  Calendar,
  MessageSquare,
} from "lucide-react-native";

export default function WalkerDetailScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { data: user } = useUser();
  const queryClient = useQueryClient();

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    pet_id: "",
    scheduled_date: "",
    duration_minutes: "30",
    special_requests: "",
  });
  const [booking, setBooking] = useState(false);

  // Fetch walker details
  const { data: walkerData, isLoading: walkerLoading } = useQuery({
    queryKey: ["walker", id],
    queryFn: async () => {
      const response = await fetch(`/api/walkers/search?walkerId=${id}`);
      if (!response.ok) throw new Error("Failed to fetch walker");
      const data = await response.json();
      return data.walkers?.[0];
    },
    enabled: !!id,
  });

  // Fetch user's pets for booking
  const { data: petsData } = useQuery({
    queryKey: ["pets"],
    queryFn: async () => {
      const response = await fetch("/api/pets");
      if (!response.ok) throw new Error("Failed to fetch pets");
      return response.json();
    },
    enabled: !!user && user.user_type === "owner" && showBookingForm,
  });

  const handleBooking = async () => {
    if (!bookingData.pet_id || !bookingData.scheduled_date) {
      Alert.alert("Error", "Please select a pet and date");
      return;
    }

    try {
      setBooking(true);

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walker_id: parseInt(id),
          pet_id: parseInt(bookingData.pet_id),
          scheduled_date: bookingData.scheduled_date,
          duration_minutes: parseInt(bookingData.duration_minutes),
          special_requests: bookingData.special_requests.trim() || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create booking");
      }

      queryClient.invalidateQueries({ queryKey: ["bookings"] });

      Alert.alert("Success", "Booking request sent successfully!", [
        { text: "OK", onPress: () => router.push("/(tabs)/bookings") },
      ]);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setBooking(false);
    }
  };

  if (user?.user_type !== "owner") {
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
          This feature is only available for dog owners
        </Text>
      </View>
    );
  }

  if (walkerLoading) {
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
          Loading walker details...
        </Text>
      </View>
    );
  }

  if (!walkerData) {
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
          Walker not found
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

        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#1E293B" }}>
          Walker Details
        </Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Walker Profile */}
        <View
          style={{ backgroundColor: "white", padding: 20, marginBottom: 16 }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "#F1F5F9",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {walkerData.image ? (
                <Image
                  source={{ uri: walkerData.image }}
                  style={{ width: 80, height: 80 }}
                  contentFit="cover"
                  transition={200}
                />
              ) : (
                <User size={32} color="#64748B" />
              )}
            </View>

            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#1E293B",
                  marginBottom: 4,
                }}
              >
                {walkerData.name}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#10B981",
                  marginBottom: 8,
                }}
              >
                ${walkerData.hourly_rate}/hour
              </Text>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {walkerData.experience_years > 0 && (
                  <>
                    <Clock size={16} color="#64748B" />
                    <Text
                      style={{ fontSize: 14, color: "#64748B", marginLeft: 4 }}
                    >
                      {walkerData.experience_years} years experience
                    </Text>
                  </>
                )}
              </View>
            </View>
          </View>

          {/* Bio */}
          {walkerData.bio && (
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#1E293B",
                  marginBottom: 8,
                }}
              >
                About
              </Text>
              <Text style={{ fontSize: 16, color: "#64748B", lineHeight: 24 }}>
                {walkerData.bio}
              </Text>
            </View>
          )}

          {/* Service Areas */}
          {walkerData.service_areas && walkerData.service_areas.length > 0 && (
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#1E293B",
                  marginBottom: 8,
                }}
              >
                Service Areas
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {walkerData.service_areas.map((area, index) => (
                  <View
                    key={index}
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
                      {area}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Book Walk Button */}
        {!showBookingForm && (
          <View style={{ padding: 20 }}>
            <TouchableOpacity
              onPress={() => setShowBookingForm(true)}
              style={{
                backgroundColor: "#3B82F6",
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
                Book a Walk
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Booking Form */}
        {showBookingForm && (
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              marginBottom: 20,
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
                marginBottom: 16,
              }}
            >
              Book a Walk
            </Text>

            {/* Pet Selection */}
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: "#374151",
                marginBottom: 8,
              }}
            >
              Select Pet
            </Text>
            {petsData?.pets?.map((pet) => (
              <TouchableOpacity
                key={pet.id}
                onPress={() =>
                  setBookingData((prev) => ({
                    ...prev,
                    pet_id: pet.id.toString(),
                  }))
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 12,
                  marginBottom: 8,
                  backgroundColor:
                    bookingData.pet_id === pet.id.toString()
                      ? "#EBF8FF"
                      : "#F8FAFC",
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor:
                    bookingData.pet_id === pet.id.toString()
                      ? "#3B82F6"
                      : "#E2E8F0",
                }}
              >
                <Text style={{ fontSize: 16, color: "#1E293B" }}>
                  {pet.name}
                </Text>
                {pet.breed && (
                  <Text
                    style={{ fontSize: 14, color: "#64748B", marginLeft: 8 }}
                  >
                    ({pet.breed})
                  </Text>
                )}
              </TouchableOpacity>
            ))}

            {/* Date Input */}
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: "#374151",
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              Date & Time
            </Text>
            <TextInput
              value={bookingData.scheduled_date}
              onChangeText={(text) =>
                setBookingData((prev) => ({ ...prev, scheduled_date: text }))
              }
              placeholder="YYYY-MM-DD HH:MM (e.g. 2024-12-01 14:00)"
              style={{
                backgroundColor: "#F8FAFC",
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                color: "#1E293B",
                borderWidth: 1,
                borderColor: "#E2E8F0",
                marginBottom: 16,
              }}
            />

            {/* Duration */}
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: "#374151",
                marginBottom: 8,
              }}
            >
              Duration (minutes)
            </Text>
            <View style={{ flexDirection: "row", marginBottom: 16 }}>
              {[30, 60, 90].map((duration) => (
                <TouchableOpacity
                  key={duration}
                  onPress={() =>
                    setBookingData((prev) => ({
                      ...prev,
                      duration_minutes: duration.toString(),
                    }))
                  }
                  style={{
                    flex: 1,
                    padding: 12,
                    marginRight: 8,
                    borderRadius: 8,
                    backgroundColor:
                      bookingData.duration_minutes === duration.toString()
                        ? "#3B82F6"
                        : "#F8FAFC",
                    borderWidth: 1,
                    borderColor:
                      bookingData.duration_minutes === duration.toString()
                        ? "#3B82F6"
                        : "#E2E8F0",
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 14,
                      fontWeight: "500",
                      color:
                        bookingData.duration_minutes === duration.toString()
                          ? "white"
                          : "#64748B",
                    }}
                  >
                    {duration} min
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Special Requests */}
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: "#374151",
                marginBottom: 8,
              }}
            >
              Special Requests (Optional)
            </Text>
            <TextInput
              value={bookingData.special_requests}
              onChangeText={(text) =>
                setBookingData((prev) => ({ ...prev, special_requests: text }))
              }
              placeholder="Any special instructions for this walk..."
              multiline
              numberOfLines={3}
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
                marginBottom: 16,
              }}
            />

            {/* Price Calculation */}
            <View
              style={{
                padding: 12,
                backgroundColor: "#F0F9FF",
                borderRadius: 8,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: "#3B82F6",
              }}
            >
              <Text style={{ fontSize: 14, color: "#1E40AF" }}>
                Estimated cost: $
                {(
                  (parseInt(bookingData.duration_minutes) / 60) *
                  walkerData.hourly_rate
                ).toFixed(2)}
              </Text>
            </View>

            {/* Action Buttons */}
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                onPress={() => setShowBookingForm(false)}
                style={{
                  backgroundColor: "#F8FAFC",
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 8,
                  flex: 1,
                  marginRight: 8,
                }}
              >
                <Text
                  style={{
                    color: "#64748B",
                    fontSize: 14,
                    fontWeight: "500",
                    textAlign: "center",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleBooking}
                disabled={
                  booking || !bookingData.pet_id || !bookingData.scheduled_date
                }
                style={{
                  backgroundColor:
                    !bookingData.pet_id || !bookingData.scheduled_date
                      ? "#CBD5E1"
                      : "#3B82F6",
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 8,
                  flex: 1,
                  marginLeft: 8,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 14,
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  {booking ? "Booking..." : "Send Request"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
