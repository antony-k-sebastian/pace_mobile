import React from "react";
import { ScrollView, StyleSheet, View, Pressable } from "react-native";
import { Card, Text, Button, ProgressBar } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const name = "Antony";
  const dailyPoints = 25;
  const weeklyProgress = 0.6;
  const nextMilestone = "Earn 100 points to unlock a reward";
  const recentActions = [
    { title: "Installed solar panels", sdg: "SDG 7", date: "2025-08-09" },
    { title: "Planted 10 trees", sdg: "SDG 13", date: "2025-08-08" },
    { title: "Organized health camp", sdg: "SDG 3", date: "2025-08-06" },
  ];
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: 16 }}
      >
        {/* Personalized Greeting */}
        <Text variant="titleLarge" style={{ marginBottom: 4 }}>
          Welcome back, {name}!
        </Text>
        <Text variant="bodyMedium" style={{ marginBottom: 16, color: "#555" }}>
          Keep up the great work towards your goals.
        </Text>

        {/* Quick Stats */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Today's Points: {dailyPoints}</Text>
            <Text variant="bodySmall" style={{ color: "#666" }}>
              Weekly Progress
            </Text>
            <ProgressBar
              progress={weeklyProgress}
              color="#6200ee"
              style={{ height: 8, borderRadius: 4, marginTop: 4 }}
            />
            <Text variant="bodySmall" style={{ marginTop: 4 }}>
              {Math.round(weeklyProgress * 100)}% - {nextMilestone}
            </Text>
          </Card.Content>
        </Card>

        {/* CTA: Start New Action */}
        <Button
          mode="contained"
          style={{ marginVertical: 16 }}
          onPress={() => console.log("Navigate to Actions")}
        >
          Start New Action
        </Button>

        {/* Dashboard: Quick Access Menu */}
        <View style={styles.quickAccessRow}>
          <QuickAccessButton
            icon="check-circle-outline"
            label="Actions"
            onPress={() => router.push("/(tabs)/Actions")}
          />
          <QuickAccessButton
            icon="podium"
            label="Leaderboard"
            onPress={() => router.push("/(modals)/leaderboard")}
          />
          <QuickAccessButton
            icon="gift-outline"
            label="Rewards"
            onPress={() => router.push("/(modals)/rewards")}
          />
          <QuickAccessButton
            icon="bell-outline"
            label="Notifications"
            onPress={() => router.push("/(modals)/notifications")}
          />
        </View>

        {/* Dashboard: Action Completion Tracker */}
        <Card style={styles.card}>
          <Card.Title
            title="Track Contributions"
            left={(props) => (
              <MaterialCommunityIcons {...props} name="chart-line" size={28} />
            )}
          />
          <Card.Content>
            <Text variant="bodyMedium">
              View your impact and contributions towards the UN Sustainable
              Development Goals.
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="contained"
              onPress={() => router.push("/progress")} // or your progress screen
            >
              View Progress
            </Button>
          </Card.Actions>
        </Card>

        {/* Dashboard: Pop-Up Challenge */}
        <Card style={styles.card}>
          <Card.Title
            title="Challenge"
            left={(props) => (
              <MaterialCommunityIcons
                {...props}
                name="lightbulb-on-outline"
                size={28}
              />
            )}
          />
          <Card.Content>
            <Text variant="bodyMedium">
              Complete an action in SDG 7 to unlock 50 points!
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="contained"
              onPress={() => console.log("Go to Actions")}
            >
              Take Action
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

// Quick Access Button Component
function QuickAccessButton({ icon, label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.quickButton}
      android_ripple={{ borderless: true }}
    >
      <MaterialCommunityIcons name={icon} size={28} color="#6200ee" />
      <Text style={styles.quickLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  card: { marginBottom: 16, borderRadius: 12, overflow: "hidden" },
  quickAccessRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  quickButton: {
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  quickLabel: { marginTop: 4, fontSize: 12 },
  recentActionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 6,
  },
});
