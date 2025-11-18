import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/utils/auth/useAuth";
import useUser from "@/utils/auth/useUser";
import {
  User,
  Settings,
  LogOut,
  Edit,
  Phone,
  MapPin,
} from "lucide-react-native";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { auth, isReady, signOut } = useAuth();
  const { data: user, loading: userLoading } = useUser();

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
        <Text style={{ fontSize: 18, color: "#64748B", textAlign: "center" }}>
          Please sign in to view your profile
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
          Profile
        </Text>
        <Text style={{ fontSize: 16, color: "#64748B" }}>
          Manage your account and preferences
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* User Info Card */}
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
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: "#3B82F6",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 16,
                }}
              >
                <User size={28} color="white" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 18, fontWeight: "600", color: "#1E293B" }}
                >
                  {user?.name || "Your Name"}
                </Text>
                <Text style={{ fontSize: 14, color: "#64748B", marginTop: 2 }}>
                  {user?.email || "your.email@example.com"}
                </Text>
                {user?.user_type && (
                  <View
                    style={{
                      alignSelf: "flex-start",
                      backgroundColor:
                        user.user_type === "owner" ? "#DBEAFE" : "#DCFCE7",
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 6,
                      marginTop: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "500",
                        color:
                          user.user_type === "owner" ? "#1D4ED8" : "#15803D",
                      }}
                    >
                      {user.user_type === "owner" ? "Dog Owner" : "Dog Walker"}
                    </Text>
                  </View>
                )}
              </View>
              <TouchableOpacity style={{ padding: 8 }}>
                <Edit size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {user?.phone_number && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Phone size={16} color="#64748B" />
                <Text style={{ fontSize: 14, color: "#64748B", marginLeft: 8 }}>
                  {user.phone_number}
                </Text>
              </View>
            )}

            {user?.address && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MapPin size={16} color="#64748B" />
                <Text style={{ fontSize: 14, color: "#64748B", marginLeft: 8 }}>
                  {user.address}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Menu Options */}
        <View style={{ padding: 20 }}>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: "#F1F5F9",
              }}
            >
              <Settings size={20} color="#64748B" />
              <Text
                style={{
                  fontSize: 16,
                  color: "#1E293B",
                  marginLeft: 12,
                  flex: 1,
                }}
              >
                Settings
              </Text>
            </TouchableOpacity>

            {user?.user_type === "owner" && (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: "#F1F5F9",
                }}
              >
                <User size={20} color="#64748B" />
                <Text
                  style={{
                    fontSize: 16,
                    color: "#1E293B",
                    marginLeft: 12,
                    flex: 1,
                  }}
                >
                  My Pets
                </Text>
              </TouchableOpacity>
            )}

            {user?.user_type === "walker" && (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: "#F1F5F9",
                }}
              >
                <User size={20} color="#64748B" />
                <Text
                  style={{
                    fontSize: 16,
                    color: "#1E293B",
                    marginLeft: 12,
                    flex: 1,
                  }}
                >
                  Walker Profile
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 16,
              }}
              onPress={() => signOut()}
            >
              <LogOut size={20} color="#EF4444" />
              <Text
                style={{
                  fontSize: 16,
                  color: "#EF4444",
                  marginLeft: 12,
                  flex: 1,
                }}
              >
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
