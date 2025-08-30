// app/redemptions.tsx
import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { Card, List, Divider, Text, Chip, Snackbar, Appbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { getAllRedemptions, type Redemption } from "@/services/redemptionsService";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function RedemptionsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Redemption[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const all = await getAllRedemptions();
        setRows(all);
      } catch (e: any) {
        setErr(e?.message ?? "Failed to load redemptions");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="All Redemptions" />
      </Appbar.Header>

      <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
        <Card style={styles.card}>
          <Card.Title title="History" left={(p) => <MaterialCommunityIcons {...p} name="history" size={24} />} />
          <Divider />
          {loading ? (
            <View style={{ padding: 16 }}>
              <ActivityIndicator />
            </View>
          ) : rows.length === 0 ? (
            <Text style={{ padding: 16, color: "#666" }}>No redemptions yet.</Text>
          ) : (
            rows.map((r, i) => (
              <View key={r.id}>
                <List.Item
                  title={`Coupon ${r.coupon_code.slice(0, 8).toUpperCase()}`}
                  description={new Date(r.created_at).toLocaleString()}
                  left={(p) => <MaterialCommunityIcons {...p} name="ticket-confirmation-outline" size={22} />}
                  right={() => <Chip compact>{r.points_spent} pts</Chip>}
                />
                {i < rows.length - 1 && <Divider />}
              </View>
            ))
          )}
        </Card>
      </ScrollView>

      <Snackbar visible={!!err} onDismiss={() => setErr(null)} duration={2400}>
        {err}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  card: { marginBottom: 16, borderRadius: 12, overflow: "hidden", backgroundColor: "#ffffff" },
});
