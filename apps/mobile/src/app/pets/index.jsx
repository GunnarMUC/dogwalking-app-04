import { useState, useCallback } from "react";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, ArrowLeft, Edit3, Trash2, Dog } from "lucide-react-native";
import { router } from "expo-router";

export default function PetsScreen() {
  const insets = useSafeAreaInsets();
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: petsData,
    isLoading,
    refetch,
  } = useQuery({
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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const deletePet = useCallback(
    async (petId) => {
      try {
        const response = await fetch(`/api/pets/${petId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          queryClient.invalidateQueries({ queryKey: ["pets"] });
        }
      } catch (error) {
        console.error("Failed to delete pet:", error);
      }
    },
    [queryClient],
  );

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
          My Pets
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/pets/add")}
          style={{
            backgroundColor: "#3B82F6",
            paddingHorizontal: 12,
            paddingVertical: 6,
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
              marginLeft: 4,
            }}
          >
            Add
          </Text>
        </TouchableOpacity>
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
              Loading pets...
            </Text>
          </View>
        ) : !petsData?.pets || petsData.pets.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 40,
              marginTop: 60,
            }}
          >
            <Dog size={48} color="#CBD5E1" />
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
              No pets registered yet
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#64748B",
                textAlign: "center",
                marginBottom: 24,
                lineHeight: 24,
              }}
            >
              Add your first pet to get started with booking walks
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/pets/add")}
              style={{
                backgroundColor: "#3B82F6",
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Plus size={20} color="white" />
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "600",
                  marginLeft: 8,
                }}
              >
                Add Your First Pet
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ padding: 20 }}>
            {petsData.pets.map((pet) => (
              <View
                key={pet.id}
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
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {/* Pet Photo */}
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
                    {pet.photo_url ? (
                      <Image
                        source={{ uri: pet.photo_url }}
                        style={{ width: 60, height: 60 }}
                        contentFit="cover"
                        transition={200}
                      />
                    ) : (
                      <Dog size={24} color="#64748B" />
                    )}
                  </View>

                  {/* Pet Info */}
                  <View style={{ flex: 1, marginLeft: 16 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#1E293B",
                        marginBottom: 4,
                      }}
                    >
                      {pet.name}
                    </Text>

                    <View style={{ flexDirection: "row", marginBottom: 4 }}>
                      {pet.breed && (
                        <Text style={{ fontSize: 14, color: "#64748B" }}>
                          {pet.breed}
                        </Text>
                      )}
                      {pet.breed && pet.age && (
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
                      {pet.age && (
                        <Text style={{ fontSize: 14, color: "#64748B" }}>
                          {pet.age} years old
                        </Text>
                      )}
                    </View>

                    {pet.weight && (
                      <Text style={{ fontSize: 14, color: "#64748B" }}>
                        Weight: {pet.weight} lbs
                      </Text>
                    )}
                  </View>

                  {/* Actions */}
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity
                      onPress={() => router.push(`/pets/edit/${pet.id}`)}
                      style={{ padding: 8, marginRight: 4 }}
                    >
                      <Edit3 size={18} color="#3B82F6" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => deletePet(pet.id)}
                      style={{ padding: 8 }}
                    >
                      <Trash2 size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Special Instructions */}
                {pet.special_instructions && (
                  <View
                    style={{
                      marginTop: 12,
                      padding: 12,
                      backgroundColor: "#F8FAFC",
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: "#475569",
                        marginBottom: 4,
                      }}
                    >
                      Special Instructions:
                    </Text>
                    <Text
                      style={{ fontSize: 14, color: "#64748B", lineHeight: 20 }}
                    >
                      {pet.special_instructions}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
