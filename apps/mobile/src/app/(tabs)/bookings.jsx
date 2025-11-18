import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import useUser from "@/utils/auth/useUser";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Clock,
  User,
  Dog,
  MapPin,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react-native";
import { router } from "expo-router";

export default function BookingsScreen() {
  const insets = useSafeAreaInsets();
  const { data: user } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all"); // all, pending, confirmed, completed, cancelled

  // Fetch bookings
  const {
    data: bookingsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["bookings", filter],
    queryFn: async () => {
      const url =
        filter === "all" ? "/api/bookings" : `/api/bookings?status=${filter}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      return response.json();
    },
    enabled: !!user,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <AlertCircle size={16} color="#F59E0B" />;
      case "confirmed":
        return <Clock size={16} color="#3B82F6" />;
      case "completed":
        return <CheckCircle size={16} color="#10B981" />;
      case "cancelled":
        return <XCircle size={16} color="#EF4444" />;
      default:
        return <AlertCircle size={16} color="#64748B" />;
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
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filterButtons = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "completed", label: "Completed" },
  ];

  return (
    <View
      style={{ flex: 1, backgroundColor: "#F8FAFC", paddingTop: insets.top }}
    >
      <StatusBar style="dark" />

      {/* Header */}
      <View
        style={{
          padding: 20,
          backgroundColor: "white",
          borderBottomWidth: 1,
          borderBottomColor: "#E2E8F0",
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#1E293B",
            marginBottom: 4,
          }}
        >
          Bookings
        </Text>
        <Text style={{ fontSize: 16, color: "#64748B" }}>
          Manage your walk bookings
        </Text>

        {/* Filter Buttons */}
        <View style={{ flexDirection: "row", marginTop: 16 }}>
          {filterButtons.map((button) => (
            <TouchableOpacity
              key={button.key}
              onPress={() => setFilter(button.key)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
                backgroundColor: filter === button.key ? "#3B82F6" : "#F1F5F9",
                marginRight: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "500",
                  color: filter === button.key ? "white" : "#64748B",
                }}
              >
                {button.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading ? (
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text style={{ fontSize: 16, color: "#64748B" }}>
              Loading bookings...
            </Text>
          </View>
        ) : !bookingsData?.bookings || bookingsData.bookings.length === 0 ? (
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 40,
              alignItems: "center",
              margin: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Calendar size={48} color="#CBD5E1" />
            <Text
              style={{
                fontSize: 18,
                color: "#64748B",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              {filter === "all" ? "No bookings yet" : `No ${filter} bookings`}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#94A3B8",
                textAlign: "center",
                marginTop: 8,
              }}
            >
              {user?.user_type === "owner"
                ? "Book a walk to get started"
                : "Bookings from pet owners will appear here"}
            </Text>
          </View>
        ) : (
          <View style={{ padding: 20 }}>
            {bookingsData.bookings.map((booking) => (
              <TouchableOpacity
                key={booking.id}
                onPress={() => router.push(`/booking/${booking.id}`)}
                style={{
                  backgroundColor: "white",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 16,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                {/* Header Row */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 12,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Dog size={16} color="#64748B" />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#1E293B",
                        marginLeft: 6,
                      }}
                    >
                      {booking.pet_name}
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {getStatusIcon(booking.status)}
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "500",
                        color: getStatusColor(booking.status),
                        marginLeft: 4,
                        textTransform: "capitalize",
                      }}
                    >
                      {booking.status}
                    </Text>
                  </View>
                </View>

                {/* Walk Details */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Clock size={14} color="#64748B" />
                  <Text
                    style={{ fontSize: 14, color: "#64748B", marginLeft: 6 }}
                  >
                    {formatDate(booking.scheduled_date)} •{" "}
                    {booking.duration_minutes} min
                  </Text>
                </View>

                {/* Walker/Owner Info */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <User size={14} color="#64748B" />
                  <Text
                    style={{ fontSize: 14, color: "#64748B", marginLeft: 6 }}
                  >
                    {user?.user_type === "owner"
                      ? `Walker: ${booking.walker_name}`
                      : `Owner: ${booking.owner_name}`}
                  </Text>
                </View>

                {/* Price */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <DollarSign size={14} color="#10B981" />
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#10B981",
                        fontWeight: "500",
                        marginLeft: 2,
                      }}
                    >
                      ${booking.price}
                    </Text>
                  </View>

                  {booking.special_requests && (
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#94A3B8",
                        fontStyle: "italic",
                      }}
                    >
                      Has special requests
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
