import { View, Text, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Heart } from "lucide-react-native";

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();

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
          Favorites
        </Text>
        <Text style={{ fontSize: 16, color: "#64748B" }}>
          Your favorite walkers and places
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 20 }}>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 40,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Heart size={48} color="#CBD5E1" />
            <Text
              style={{
                fontSize: 18,
                color: "#64748B",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              No favorites yet
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#94A3B8",
                textAlign: "center",
                marginTop: 8,
              }}
            >
              Mark walkers as favorites to see them here
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
