import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import useUser from "@/utils/auth/useUser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Dog,
  User,
  Clock,
  Calendar,
  DollarSign,
  MapPin,
  MessageSquare,
  CheckCircle,
  XCircle,
  Play,
  Phone,
  Mail,
} from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";

export default function BookingDetailScreen() {
  const insets = useSafeAreaInsets();
  const { data: user } = useUser();
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();

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

  // Update booking status mutation
  const updateBookingMutation = useMutation({
    mutationFn: async ({ status, walk_notes, photo_urls }) => {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, walk_notes, photo_urls }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update booking");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking-detail", id] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  const handleStatusUpdate = async (newStatus, confirmMessage) => {
    Alert.alert("Confirm Action", confirmMessage, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        onPress: () => updateBookingMutation.mutate({ status: newStatus }),
      },
    ]);
  };

  const startWalk = () => {
    // Navigate to walk session screen
    router.push(`/walk/${id}`);
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
          Loading booking details...
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
  const isOwner = user?.id === booking.owner_id;
  const isWalker = user?.id === booking.walker_id;

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={16} color="#F59E0B" />;
      case "confirmed":
        return <CheckCircle size={16} color="#3B82F6" />;
      case "completed":
        return <CheckCircle size={16} color="#10B981" />;
      case "cancelled":
        return <XCircle size={16} color="#EF4444" />;
      default:
        return <Clock size={16} color="#64748B" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#F59E0B";
      case "confirmed":
        return "#3B82F6";
      case "completed":
        return "#10B981";
      case "cancelled":
        return "#EF4444";
      default:
        return "#64748B";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
          Booking Details
        </Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#1E293B" }}>
              Walk Status
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {getStatusIcon(booking.status)}
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: getStatusColor(booking.status),
                  marginLeft: 6,
                  textTransform: "capitalize",
                }}
              >
                {booking.status}
              </Text>
            </View>
          </View>

          <Text style={{ fontSize: 14, color: "#64748B" }}>
            Booking ID: #{booking.id}
          </Text>
        </View>

        {/* Pet & Walk Details */}
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
              fontSize: 18,
              fontWeight: "600",
              color: "#1E293B",
              marginBottom: 16,
            }}
          >
            Walk Details
          </Text>

          {/* Pet Info */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Dog size={16} color="#64748B" />
            <Text
              style={{
                fontSize: 16,
                color: "#1E293B",
                marginLeft: 8,
                fontWeight: "500",
              }}
            >
              {booking.pet_name}
            </Text>
            {booking.pet_breed && (
              <Text style={{ fontSize: 14, color: "#64748B", marginLeft: 8 }}>
                ({booking.pet_breed})
              </Text>
            )}
          </View>

          {/* Date & Time */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              marginBottom: 12,
            }}
          >
            <Calendar size={16} color="#64748B" style={{ marginTop: 2 }} />
            <Text
              style={{
                fontSize: 14,
                color: "#64748B",
                marginLeft: 8,
                flex: 1,
                lineHeight: 20,
              }}
            >
              {formatDate(booking.scheduled_date)}
            </Text>
          </View>

          {/* Duration & Price */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Clock size={16} color="#64748B" />
              <Text style={{ fontSize: 14, color: "#64748B", marginLeft: 8 }}>
                {booking.duration_minutes} minutes
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <DollarSign size={16} color="#10B981" />
              <Text
                style={{
                  fontSize: 16,
                  color: "#10B981",
                  fontWeight: "600",
                  marginLeft: 4,
                }}
              >
                ${booking.price}
              </Text>
            </View>
          </View>

          {/* Special Requests */}
          {booking.special_requests && (
            <View
              style={{
                marginTop: 12,
                padding: 12,
                backgroundColor: "#FEF3C7",
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#92400E",
                  fontWeight: "500",
                  marginBottom: 4,
                }}
              >
                Special Requests:
              </Text>
              <Text style={{ fontSize: 14, color: "#92400E" }}>
                {booking.special_requests}
              </Text>
            </View>
          )}

          {/* Pet Instructions (for walkers) */}
          {booking.pet_instructions && isWalker && (
            <View
              style={{
                marginTop: 12,
                padding: 12,
                backgroundColor: "#DBEAFE",
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#1E40AF",
                  fontWeight: "500",
                  marginBottom: 4,
                }}
              >
                Pet Care Instructions:
              </Text>
              <Text style={{ fontSize: 14, color: "#1E40AF" }}>
                {booking.pet_instructions}
              </Text>
            </View>
          )}
        </View>

        {/* Contact Information */}
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
              fontSize: 18,
              fontWeight: "600",
              color: "#1E293B",
              marginBottom: 16,
            }}
          >
            {isOwner ? "Walker Contact" : "Owner Contact"}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <User size={16} color="#64748B" />
            <Text
              style={{
                fontSize: 16,
                color: "#1E293B",
                marginLeft: 8,
                fontWeight: "500",
              }}
            >
              {isOwner ? booking.walker_name : booking.owner_name}
            </Text>
          </View>

          {(isOwner ? booking.walker_email : booking.owner_email) && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Mail size={14} color="#64748B" />
              <Text style={{ fontSize: 14, color: "#64748B", marginLeft: 8 }}>
                {isOwner ? booking.walker_email : booking.owner_email}
              </Text>
            </View>
          )}

          {(isOwner ? booking.walker_phone : booking.owner_phone) && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Phone size={14} color="#64748B" />
              <Text style={{ fontSize: 14, color: "#64748B", marginLeft: 8 }}>
                {isOwner ? booking.walker_phone : booking.owner_phone}
              </Text>
            </View>
          )}

          {booking.owner_address && isWalker && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginTop: 8,
              }}
            >
              <MapPin size={14} color="#64748B" style={{ marginTop: 2 }} />
              <Text
                style={{
                  fontSize: 14,
                  color: "#64748B",
                  marginLeft: 8,
                  flex: 1,
                }}
              >
                {booking.owner_address}
              </Text>
            </View>
          )}
        </View>

        {/* Walk Notes (if completed) */}
        {booking.walk_notes && (
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
                fontSize: 18,
                fontWeight: "600",
                color: "#1E293B",
                marginBottom: 12,
              }}
            >
              Walk Notes
            </Text>
            <Text style={{ fontSize: 14, color: "#64748B", lineHeight: 20 }}>
              {booking.walk_notes}
            </Text>
          </View>
        )}

        {/* Walk Photos (if any) */}
        {booking.photo_urls && booking.photo_urls.length > 0 && (
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
                fontSize: 18,
                fontWeight: "600",
                color: "#1E293B",
                marginBottom: 12,
              }}
            >
              Walk Photos
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {booking.photo_urls.map((photoUrl, index) => (
                <View
                  key={index}
                  style={{ width: "48%", marginRight: "2%", marginBottom: 8 }}
                >
                  <Image
                    source={{ uri: photoUrl }}
                    style={{ width: "100%", height: 120, borderRadius: 8 }}
                    contentFit="cover"
                    transition={200}
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Action Buttons */}
      <View
        style={{
          backgroundColor: "white",
          padding: 20,
          paddingBottom: insets.bottom + 20,
          borderTopWidth: 1,
          borderTopColor: "#E2E8F0",
        }}
      >
        {isWalker && booking.status === "pending" && (
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity
              onPress={() =>
                handleStatusUpdate(
                  "cancelled",
                  "Are you sure you want to decline this booking?",
                )
              }
              disabled={updateBookingMutation.isPending}
              style={{
                backgroundColor: "#FEF2F2",
                borderColor: "#EF4444",
                borderWidth: 1,
                borderRadius: 8,
                paddingVertical: 12,
                flex: 1,
                marginRight: 8,
              }}
            >
              <Text
                style={{
                  color: "#EF4444",
                  fontSize: 14,
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                Decline
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                handleStatusUpdate("confirmed", "Accept this walk booking?")
              }
              disabled={updateBookingMutation.isPending}
              style={{
                backgroundColor: "#3B82F6",
                borderRadius: 8,
                paddingVertical: 12,
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
                Accept
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {isWalker && booking.status === "confirmed" && (
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

        {isOwner && booking.status === "pending" && (
          <TouchableOpacity
            onPress={() =>
              handleStatusUpdate(
                "cancelled",
                "Are you sure you want to cancel this booking?",
              )
            }
            disabled={updateBookingMutation.isPending}
            style={{
              backgroundColor: "#FEF2F2",
              borderColor: "#EF4444",
              borderWidth: 1,
              borderRadius: 8,
              paddingVertical: 12,
            }}
          >
            <Text
              style={{
                color: "#EF4444",
                fontSize: 14,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              Cancel Booking
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
