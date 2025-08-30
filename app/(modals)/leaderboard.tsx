import React, { useEffect, useState, useCallback } from "react";
import { View, ScrollView, RefreshControl, StyleSheet } from "react-native";
import { Card, List, Divider, Text, Chip, ActivityIndicator, Appbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { getTopLeaderboard, getSelfWithRank, type LeaderboardRow } from "@/services/leaderboardService";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function LeaderboardScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [me, setMe] = useState<{ rank: number | null } & LeaderboardRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [top, mine] = await Promise.all([getTopLeaderboard(20), getSelfWithRank()]);
      setRows(top);
      setMe(mine);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Leaderboard" />
      </Appbar.Header>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
      >
        {/* My position */}
        {me && (
          <Card style={[styles.card, { marginBottom: 16 }]}>
            <Card.Title
              title={me.users?.full_name || me.users?.email || "You"}
              subtitle={me.rank ? `Your rank: #${me.rank}` : "Unranked"}
              left={(p) => <MaterialCommunityIcons {...p} name="account-star-outline" size={26} />}
              right={() => <Chip compact>{me.balance} pts</Chip>}
            />
          </Card>
        )}

        {/* Top board */}
        <Card style={styles.card}>
          <Card.Title title="Top Players" left={(p) => <MaterialCommunityIcons {...p} name="trophy-outline" size={24} />} />
          <Divider />
          {loading ? (
            <View style={{ padding: 16, alignItems: "center" }}>
              <ActivityIndicator />
            </View>
          ) : rows.length === 0 ? (
            <Text style={{ padding: 16, color: "#666" }}>No data yet.</Text>
          ) : (
            rows.map((r, i) => (
              <View key={r.user_id}>
                <List.Item
                  title={r.users?.full_name || r.users?.email || `User ${r.user_id.slice(0, 6)}`}
                  description={`Earned ${r.earned_total} • Spent ${r.spent_total}`}
                  left={(p) => (
                    <View style={{ justifyContent: "center", alignItems: "center", width: 36 }}>
                      <Text style={{ fontWeight: "bold" }}>#{i + 1}</Text>
                    </View>
                  )}
                  right={() => <Chip compact>{r.balance} pts</Chip>}
                />
                {i < rows.length - 1 && <Divider />}
              </View>
            ))
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  card: { borderRadius: 12, overflow: "hidden", backgroundColor: "#fff" },
});
