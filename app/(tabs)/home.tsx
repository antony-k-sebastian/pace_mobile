import React from "react";
import { ScrollView, StyleSheet, View, Pressable } from "react-native";
import { Card, Text, Button, ProgressBar } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { getDailyPoints, getWeeklyPoints } from "@/services/pointsService";
import { supabase } from "@/lib/supabase";
import { StatusBar } from "expo-status-bar";

export default function HomeScreen() {
  const [name, setName] = useState<string>("");
  const [dailyPoints, setDailyPoints] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [nextMilestone, setNextMilestone] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      if (!user) return;

      const { data: profile } = await supabase
        .from("users")
        .select("name")
        .eq("id", user.id)
        .single();
      setName(profile?.name ?? "Guest");

      const daily = await getDailyPoints(user.id);
      const weekly = await getWeeklyPoints(user.id);

      setDailyPoints(daily);
      setWeeklyProgress(Math.min(weekly / 100, 1));
      setNextMilestone("Earn 100 points to unlock a reward");
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: 16 }}
      >
        {/* Personalized Greeting */}
        <Text variant="titleLarge" style={{ marginBottom: 4, color: "#000000" }}>
          Welcome back, {name} !
        </Text>
        <Text variant="bodyMedium" style={{ marginBottom: 16, color: "#666666" }}>
          Keep up the great work towards your goals.
        </Text>

        {/* Quick Stats */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Today's Points: {dailyPoints}</Text>
            <Text variant="bodySmall" style={{ color: "#666666" }}>
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
          mode="outlined"
          style={{ marginVertical: 8,  }}
          labelStyle={{ color: "#000000" }}
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
              View your impact and contributions.
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="outlined"
              labelStyle={{ color: "#000000" }}
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
              Complete an action in Donate and Buy to unlock 50 points!
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="outlined"
              labelStyle={{ color: "#000000" }}
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
      <MaterialCommunityIcons name={icon} size={28} color="#000000" />
      <Text style={styles.quickLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 2 },
  card: { marginBottom: 16, borderRadius: 12, overflow: "hidden", backgroundColor: "#ffffff" },
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
  quickLabel: { marginTop: 4, fontSize: 12, color: "#666666" },
  recentActionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 6,
  },
});
