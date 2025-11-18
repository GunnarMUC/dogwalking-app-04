import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useAuth } from "@/utils/auth/useAuth";
import useUser from "@/utils/auth/useUser";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  MapPin,
  Star,
  Clock,
  Dog,
  Plus,
  ArrowRight,
} from "lucide-react-native";
import { router } from "expo-router";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { auth, isReady, signIn } = useAuth();
  const { data: user, loading: userLoading } = useUser();
  const [userType, setUserType] = useState(null);

  // Fetch pets for dog owners
  const { data: petsData } = useQuery({
    queryKey: ["pets"],
    queryFn: async () => {
      const response = await fetch("/api/pets");
      if (!response.ok) {
        throw new Error("Failed to fetch pets");
      }
      return response.json();
    },
    enabled: !!user && user.user_type === "owner",
  });

  useEffect(() => {
    if (user?.user_type) {
      setUserType(user.user_type);
    }
  }, [user]);

  if (!isReady || userLoading) {
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
        <Text style={{ fontSize: 16, color: "#64748B" }}>Loading...</Text>
      </View>
    );
  }

  if (!auth) {
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
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#1E293B",
            marginBottom: 8,
          }}
        >
          Welcome to DogWalking
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: "#64748B",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Connect with trusted dog walkers in your area
        </Text>
        <TouchableOpacity
          onPress={() => signIn()}
          style={{
            backgroundColor: "#3B82F6",
            paddingHorizontal: 32,
            paddingVertical: 12,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Dog Owner Home Screen
  if (userType === "owner") {
    const pets = petsData?.pets || [];

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
            Good morning, {user?.name || "Dog Owner"}!
          </Text>
          <Text style={{ fontSize: 16, color: "#64748B" }}>
            Find the perfect walker for your furry friend
          </Text>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View style={{ padding: 20 }}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "white",
                borderRadius: 12,
                padding: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Search size={20} color="#64748B" />
              <Text style={{ marginLeft: 12, fontSize: 16, color: "#64748B" }}>
                Search for walkers near you...
              </Text>
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <View style={{ padding: 20 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#1E293B",
                marginBottom: 16,
              }}
            >
              Quick Actions
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                onPress={() => router.push("/walkers/search")}
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  borderRadius: 12,
                  padding: 20,
                  alignItems: "center",
                  marginRight: 10,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Search size={24} color="#3B82F6" />
                <Text
                  style={{
                    marginTop: 8,
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#1E293B",
                  }}
                >
                  Find Walker
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/walkers/search")}
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  borderRadius: 12,
                  padding: 20,
                  alignItems: "center",
                  marginLeft: 10,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Clock size={24} color="#10B981" />
                <Text
                  style={{
                    marginTop: 8,
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#1E293B",
                  }}
                >
                  Book Walk
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Your Pets Section */}
          <View style={{ padding: 20 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "600", color: "#1E293B" }}
              >
                Your Pets ({pets.length})
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/pets")}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: "#3B82F6",
                    fontWeight: "500",
                    marginRight: 4,
                  }}
                >
                  View All
                </Text>
                <ArrowRight size={16} color="#3B82F6" />
              </TouchableOpacity>
            </View>

            {pets.length === 0 ? (
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 12,
                  padding: 20,
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Dog size={32} color="#CBD5E1" />
                <Text
                  style={{
                    fontSize: 16,
                    color: "#64748B",
                    textAlign: "center",
                    marginTop: 8,
                    marginBottom: 12,
                  }}
                >
                  No pets registered yet
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/pets/add")}
                  style={{
                    backgroundColor: "#3B82F6",
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 6,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Plus size={16} color="white" />
                  <Text
                    style={{
                      color: "white",
                      fontSize: 14,
                      fontWeight: "500",
                      marginLeft: 6,
                    }}
                  >
                    Add Your First Pet
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                {pets.slice(0, 2).map((pet) => (
                  <TouchableOpacity
                    key={pet.id}
                    onPress={() => router.push("/pets")}
                    style={{
                      backgroundColor: "white",
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 12,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        backgroundColor: "#F1F5F9",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                    >
                      {pet.photo_url ? (
                        <Image
                          source={{ uri: pet.photo_url }}
                          style={{ width: 50, height: 50 }}
                          contentFit="cover"
                          transition={200}
                        />
                      ) : (
                        <Dog size={20} color="#64748B" />
                      )}
                    </View>

                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: "#1E293B",
                        }}
                      >
                        {pet.name}
                      </Text>
                      {pet.breed && (
                        <Text
                          style={{
                            fontSize: 14,
                            color: "#64748B",
                            marginTop: 2,
                          }}
                        >
                          {pet.breed}
                        </Text>
                      )}
                    </View>

                    <ArrowRight size={16} color="#CBD5E1" />
                  </TouchableOpacity>
                ))}

                {pets.length > 2 && (
                  <TouchableOpacity
                    onPress={() => router.push("/pets")}
                    style={{
                      backgroundColor: "#F8FAFC",
                      borderRadius: 12,
                      padding: 16,
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{ fontSize: 14, color: "#64748B", marginRight: 8 }}
                    >
                      View {pets.length - 2} more pets
                    </Text>
                    <ArrowRight size={16} color="#64748B" />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }

  // Dog Walker Home Screen
  if (userType === "walker") {
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
            Welcome back, {user?.name || "Walker"}!
          </Text>
          <Text style={{ fontSize: 16, color: "#64748B" }}>
            Ready to walk some happy dogs?
          </Text>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {/* Status Card */}
          <View style={{ padding: 20 }}>
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
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 16, fontWeight: "600", color: "#1E293B" }}
                >
                  Status: Available
                </Text>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: "#10B981",
                  }}
                />
              </View>
              <Text style={{ fontSize: 14, color: "#64748B", marginTop: 8 }}>
                You're ready to accept new bookings
              </Text>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={{ padding: 20 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#1E293B",
                marginBottom: 16,
              }}
            >
              Today's Overview
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  borderRadius: 12,
                  padding: 16,
                  alignItems: "center",
                  marginRight: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Text
                  style={{ fontSize: 24, fontWeight: "bold", color: "#3B82F6" }}
                >
                  0
                </Text>
                <Text style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>
                  Scheduled Walks
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  borderRadius: 12,
                  padding: 16,
                  alignItems: "center",
                  marginHorizontal: 4,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Text
                  style={{ fontSize: 24, fontWeight: "bold", color: "#10B981" }}
                >
                  0
                </Text>
                <Text style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>
                  Completed
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  borderRadius: 12,
                  padding: 16,
                  alignItems: "center",
                  marginLeft: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Text
                  style={{ fontSize: 24, fontWeight: "bold", color: "#F59E0B" }}
                >
                  $0
                </Text>
                <Text style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>
                  Earnings
                </Text>
              </View>
            </View>
          </View>

          {/* Profile Setup/Management */}
          <View style={{ padding: 20 }}>
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 12,
                padding: 20,
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
                  fontSize: 16,
                  color: "#64748B",
                  textAlign: "center",
                  marginBottom: 12,
                }}
              >
                Complete your walker profile to start receiving bookings
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/walker-setup")}
                style={{
                  backgroundColor: "#3B82F6",
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 14, fontWeight: "600" }}
                >
                  Setup Profile
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Default/Unknown user type
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
        Please complete your profile setup to get started
      </Text>
    </View>
  );
}
