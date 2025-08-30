import React, { useEffect, useState, useCallback } from "react";
import { View, ScrollView, RefreshControl, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Appbar, Card, List, Divider, Text, Chip, ActivityIndicator, Snackbar } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { fetchActivities, subscribeToNewActivities, type ActivityLog } from "@/services/activityLogService";

const PAGE = 25;

export default function NotificationsScreen() {
  const router = useRouter();
  const [rows, setRows] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const load = useCallback(async (reset = false) => {
    try {
      if (reset) setRefreshing(true); else setLoading(true);
      const offset = reset ? 0 : rows.length;
      const batch = await fetchActivities(PAGE, offset);
      setRows(reset ? batch : [...rows, ...batch]);
      setHasMore(batch.length === PAGE);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load notifications");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [rows]);

  // initial load + realtime
  useEffect(() => {
    load(true);
    let unsub: undefined | (() => void);
    (async () => { unsub = await subscribeToNewActivities((r) => setRows((prev) => [r, ...prev])); })();
    return () => { unsub && unsub(); };
  }, []); // eslint-disable-line

  const onEndReached = () => { if (!loading && hasMore) load(false); };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Notifications" />
      </Appbar.Header>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
        onScroll={({ nativeEvent }) => {
          const pad = 120;
          const nearBottom = nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >= nativeEvent.contentSize.height - pad;
          if (nearBottom) onEndReached();
        }}
        scrollEventThrottle={240}
      >
        <Card style={styles.card}>
          <Card.Title
            title="Recent activity"
            left={(p) => <MaterialCommunityIcons {...p} name="bell-outline" size={24} />}
          />
          <Divider />
          {loading && rows.length === 0 ? (
            <View style={{ padding: 16, alignItems: "center" }}>
              <ActivityIndicator />
            </View>
          ) : rows.length === 0 ? (
            <Text style={{ padding: 16, color: "#666" }}>No notifications yet.</Text>
          ) : (
            rows.map((r, i) => (
              <View key={r.log_id}>
                <List.Item
                  title={formatTitle(r)}
                  description={`${new Date(r.created_at).toLocaleString()} • ${r.status}`}
                  left={(p) => (
                    <MaterialCommunityIcons
                      {...p}
                      name={iconFor(r)}
                      size={22}
                    />
                  )}
                  right={() =>
                    r.reward != null ? <Chip compact>{Number(r.reward)} pts</Chip> : null
                  }
                />
                {i < rows.length - 1 && <Divider />}
              </View>
            ))
          )}

          {!loading && hasMore && (
            <View style={{ padding: 12, alignItems: "center" }}>
              <ActivityIndicator />
            </View>
          )}
        </Card>
      </ScrollView>

      <Snackbar visible={!!err} onDismiss={() => setErr(null)} duration={2400}>
        {err}
      </Snackbar>
    </SafeAreaView>
  );
}

function formatTitle(r: ActivityLog) {
  // Example: "Completed: textbook-exchange" or generic fallback
  const action = r.action?.trim() || "Activity";
  const status = r.status?.trim() || "updated";
  return `${capitalize(status)}: ${action}`;
}

function iconFor(r: ActivityLog) {
  const s = (r.status || "").toLowerCase();
  if (s.includes("completed") || s.includes("done")) return "check-circle-outline";
  if (s.includes("scanned")) return "qrcode-scan";
  if (s.includes("pending")) return "progress-clock";
  return "bell-outline";
}

function capitalize(s: string) {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  card: { borderRadius: 12, overflow: "hidden", backgroundColor: "#fff" },
});
