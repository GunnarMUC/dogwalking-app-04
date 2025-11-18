import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import useUser from "@/utils/auth/useUser";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Search,
  MapPin,
  DollarSign,
  Star,
  User,
  Clock,
  Filter,
} from "lucide-react-native";
import { router } from "expo-router";

export default function WalkerSearchScreen() {
  const insets = useSafeAreaInsets();
  const { data: user } = useUser();

  const [searchFilters, setSearchFilters] = useState({
    area: "",
    minRate: "",
    maxRate: "",
    minExperience: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Build search params
  const searchParams = new URLSearchParams();
  Object.entries(searchFilters).forEach(([key, value]) => {
    if (value && value.trim()) {
      searchParams.append(key, value.trim());
    }
  });

  const {
    data: walkersData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["walkers-search", searchFilters],
    queryFn: async () => {
      const url = `/api/walkers/search?${searchParams.toString()}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch walkers");
      }
      return response.json();
    },
    enabled: !!user && user.user_type === "owner",
  });

  const handleSearch = () => {
    refetch();
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSearchFilters({
      area: "",
      minRate: "",
      maxRate: "",
      minExperience: "",
    });
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
          Find Walkers
        </Text>

        <TouchableOpacity
          onPress={() => setShowFilters(!showFilters)}
          style={{
            backgroundColor: showFilters ? "#3B82F6" : "#F1F5F9",
            padding: 8,
            borderRadius: 6,
          }}
        >
          <Filter size={20} color={showFilters ? "white" : "#64748B"} />
        </TouchableOpacity>
      </View>

      {/* Search Filters */}
      {showFilters && (
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: "#E2E8F0",
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
            Search Filters
          </Text>

          {/* Service Area */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: "#374151",
                marginBottom: 8,
              }}
            >
              Service Area
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MapPin size={16} color="#64748B" style={{ marginRight: 8 }} />
              <TextInput
                value={searchFilters.area}
                onChangeText={(text) =>
                  setSearchFilters((prev) => ({ ...prev, area: text }))
                }
                placeholder="Enter neighborhood or area"
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

          {/* Price Range */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: "#374151",
                marginBottom: 8,
              }}
            >
              Hourly Rate Range
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <DollarSign size={16} color="#64748B" />
              <TextInput
                value={searchFilters.minRate}
                onChangeText={(text) =>
                  setSearchFilters((prev) => ({ ...prev, minRate: text }))
                }
                placeholder="Min"
                keyboardType="numeric"
                style={{
                  flex: 1,
                  backgroundColor: "#F8FAFC",
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 16,
                  color: "#1E293B",
                  borderWidth: 1,
                  borderColor: "#E2E8F0",
                  marginHorizontal: 8,
                }}
              />
              <Text style={{ color: "#64748B" }}>to</Text>
              <TextInput
                value={searchFilters.maxRate}
                onChangeText={(text) =>
                  setSearchFilters((prev) => ({ ...prev, maxRate: text }))
                }
                placeholder="Max"
                keyboardType="numeric"
                style={{
                  flex: 1,
                  backgroundColor: "#F8FAFC",
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 16,
                  color: "#1E293B",
                  borderWidth: 1,
                  borderColor: "#E2E8F0",
                  marginLeft: 8,
                }}
              />
            </View>
          </View>

          {/* Minimum Experience */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: "#374151",
                marginBottom: 8,
              }}
            >
              Minimum Experience (years)
            </Text>
            <TextInput
              value={searchFilters.minExperience}
              onChangeText={(text) =>
                setSearchFilters((prev) => ({ ...prev, minExperience: text }))
              }
              placeholder="e.g. 2"
              keyboardType="numeric"
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

          {/* Filter Actions */}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity
              onPress={clearFilters}
              style={{
                backgroundColor: "#F8FAFC",
                paddingHorizontal: 20,
                paddingVertical: 10,
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
                Clear
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSearch}
              style={{
                backgroundColor: "#3B82F6",
                paddingHorizontal: 20,
                paddingVertical: 10,
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
                Search
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text style={{ fontSize: 16, color: "#64748B" }}>
              Searching for walkers...
            </Text>
          </View>
        ) : !walkersData?.walkers || walkersData.walkers.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 40,
              marginTop: 60,
            }}
          >
            <Search size={48} color="#CBD5E1" />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#1E293B",
                marginTop: 16,
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              No walkers found
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#64748B",
                textAlign: "center",
                lineHeight: 24,
              }}
            >
              Try adjusting your search filters or check back later
            </Text>
          </View>
        ) : (
          <View style={{ padding: 20 }}>
            <Text
              style={{
                fontSize: 16,
                color: "#64748B",
                marginBottom: 16,
              }}
            >
              Found {walkersData.walkers.length} walker
              {walkersData.walkers.length !== 1 ? "s" : ""}
            </Text>

            {walkersData.walkers.map((walker) => (
              <TouchableOpacity
                key={walker.id}
                onPress={() => router.push(`/walkers/${walker.id}`)}
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
                <View
                  style={{ flexDirection: "row", alignItems: "flex-start" }}
                >
                  {/* Walker Photo */}
                  <View
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      backgroundColor: "#F1F5F9",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    {walker.image ? (
                      <Image
                        source={{ uri: walker.image }}
                        style={{ width: 60, height: 60 }}
                        contentFit="cover"
                        transition={200}
                      />
                    ) : (
                      <User size={24} color="#64748B" />
                    )}
                  </View>

                  {/* Walker Info */}
                  <View style={{ flex: 1, marginLeft: 16 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          color: "#1E293B",
                          marginBottom: 4,
                        }}
                      >
                        {walker.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: "#10B981",
                        }}
                      >
                        ${walker.hourly_rate}/hr
                      </Text>
                    </View>

                    {/* Experience & Rating */}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      {walker.experience_years > 0 && (
                        <>
                          <Clock size={14} color="#64748B" />
                          <Text
                            style={{
                              fontSize: 14,
                              color: "#64748B",
                              marginLeft: 4,
                            }}
                          >
                            {walker.experience_years} years
                          </Text>
                        </>
                      )}

                      {walker.completed_walks > 0 && (
                        <>
                          {walker.experience_years > 0 && (
                            <Text
                              style={{
                                fontSize: 14,
                                color: "#CBD5E1",
                                marginHorizontal: 8,
                              }}
                            >
                              •
                            </Text>
                          )}
                          <Star size={14} color="#F59E0B" />
                          <Text
                            style={{
                              fontSize: 14,
                              color: "#64748B",
                              marginLeft: 4,
                            }}
                          >
                            {walker.completed_walks} walks
                          </Text>
                        </>
                      )}
                    </View>

                    {/* Bio Preview */}
                    {walker.bio && (
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#64748B",
                          marginBottom: 8,
                          lineHeight: 20,
                        }}
                        numberOfLines={2}
                      >
                        {walker.bio}
                      </Text>
                    )}

                    {/* Service Areas */}
                    {walker.service_areas &&
                      walker.service_areas.length > 0 && (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <MapPin size={14} color="#64748B" />
                          <Text
                            style={{
                              fontSize: 12,
                              color: "#64748B",
                              marginLeft: 4,
                              flex: 1,
                            }}
                          >
                            {walker.service_areas.slice(0, 3).join(", ")}
                            {walker.service_areas.length > 3 &&
                              ` +${walker.service_areas.length - 3} more`}
                          </Text>
                        </View>
                      )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
