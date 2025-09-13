import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import {
  Card,
  Text,
  List,
  Switch,
  Button,
  Divider,
  Avatar,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/authContext";
import { supabase } from "@/lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();

  const name = "Antony";
  const rank = "Intermediate";
  const totalPoints = 1240;

  const [notifPush, setNotifPush] = useState(true);
  const [notifEmail, setNotifEmail] = useState(false);
  const [weeklyChallenges, setWeeklyChallenges] = useState(true);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace("/(auth)/authScreen");
    } catch (e) {
      console.warn("Logout error", e.message || e);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Profile info */}
        <Card style={styles.card}>
          <Card.Content style={styles.row}>
            <Avatar.Text size={56} label={name.slice(0, 1)} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text variant="titleMedium">{name}</Text>
              <Text variant="bodyMedium" style={styles.muted}>
                Rank: {rank}
              </Text>
              <Text variant="bodyMedium">Total Points: {totalPoints}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Preferences */}
        <Card style={styles.card}>
          <Card.Title title="Preferences" />
          <Divider />
          <List.Item
            title="Push notifications"
            description="Get reminders and updates"
            right={() => (
              <Switch value={notifPush} onValueChange={setNotifPush} />
            )}
          />
          <List.Item
            title="Email notifications"
            description="Receive summaries by email"
            right={() => (
              <Switch value={notifEmail} onValueChange={setNotifEmail} />
            )}
          />
          <List.Item
            title="Challenges"
            description="Opt into weekly challenges"
            right={() => (
              <Switch
                value={weeklyChallenges}
                onValueChange={setWeeklyChallenges}
              />
            )}
          />
        </Card>

        {/* Privacy */}
        <Card style={styles.card}>
          <Card.Title title="Privacy" />
          <Card.Content>
            <Text style={styles.muted}>
              Manage data sharing and visibility.
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="outlined"
              labelStyle={{ color: "#000000" }}
              onPress={() => router.push("/privacy")}
            >
              Privacy Settings
            </Button>
          </Card.Actions>
        </Card>

        {/* Logout */}
        <Button 
        mode="contained" 
        //labelStyle={{ color: "#000000" }}
        onPress={handleLogout} style={{ marginTop: 8 }}>
          Log out
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  card: { marginBottom: 16, borderRadius: 12, backgroundColor: "#ffffff" },
  row: { flexDirection: "row", alignItems: "center" },
  muted: { color: "#666" },
});
