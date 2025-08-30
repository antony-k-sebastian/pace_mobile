// app/rewards.tsx
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, ActivityIndicator } from "react-native";
import { Card, Text, List, Divider, Button, Chip, Snackbar } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getRecentRedemptions, type Redemption } from "@/services/redemptionsService";

export default function RewardsScreen() {
  const router = useRouter();

  const totalPoints = 820; // TODO: replace with real total points from DB
  const referralCode = "PACE-ANTONY-42";
  const referralLink = `https://example.com/invite/${referralCode}`;

  const [snack, setSnack] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState<Redemption[]>([]);
  const [err, setErr] = useState<string | null>(null);

  // NEW: fetch top 3 redemptions for preview
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const rows = await getRecentRedemptions(3);
        setRecent(rows);
      } catch (e: any) {
        setErr(e?.message ?? "Failed to load redemptions");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(referralLink);
    setSnack("Referral link copied!");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
        {/* Header / Points */}
        <Card style={styles.card}>
          <Card.Title
            title="Rewards & Redemption"
            subtitle={`Total Points: ${totalPoints}`}
            left={(props) => <MaterialCommunityIcons {...props} name="gift-outline" size={28} />}
          />
          <Card.Content>
            <Text style={styles.muted}>Redeem your points for perks and experiences.</Text>
          </Card.Content>
        </Card>

        {/* Redeem Button */}
        <Button mode="outlined" style={{ marginVertical: 8 }} onPress={() => router.push("/actions")}>
          Redeem Points
        </Button>

        {/* Redemption History (preview) */}
        <Card style={styles.card}>
          <Card.Title
            title="Redemption History"
            right={() => (
              <Button compact onPress={() => router.push("(modals)/redemption")}>
                See all
              </Button>
            )}
          />
          <Divider />
          {loading ? (
            <View style={{ padding: 16 }}>
              <ActivityIndicator />
            </View>
          ) : recent.length === 0 ? (
            <Text style={[styles.muted, { padding: 16 }]}>
              No redemptions yet. Start redeeming your points!
            </Text>
          ) : (
            recent.map((r, i) => (
              <View key={r.id}>
                <List.Item
                  title={`Coupon ${r.coupon_code.slice(0, 8).toUpperCase()}`}
                  description={new Date(r.created_at).toLocaleDateString()}
                  left={(p) => <MaterialCommunityIcons {...p} name="check-decagram-outline" size={22} />}
                  right={() => <Chip compact>{r.points_spent} pts</Chip>}
                />
                {i < recent.length - 1 && <Divider />}
              </View>
            ))
          )}
        </Card>

        {/* Referral Bonuses */}
        <Card style={styles.card}>
          <Card.Title
            title="Referral Bonus"
            subtitle="Invite colleagues, earn points"
            left={(props) => (
              <MaterialCommunityIcons {...props} name="account-multiple-plus-outline" size={28} />
            )}
          />
          <Card.Content>
            <Text style={{ marginBottom: 8 }}>
              Share your link. You’ll earn bonus points when they join and take action.
            </Text>
            <View style={styles.refRow}>
              <Text style={styles.refLink} numberOfLines={1}>
                {referralLink}
              </Text>
              <Button mode="outlined" onPress={handleCopy} style={{ marginLeft: 8 }}>
                Copy
              </Button>
            </View>
            <Text style={styles.muted}>Bonus: +50 pts per verified referral</Text>
          </Card.Content>
        </Card>

        <Snackbar visible={!!snack} onDismiss={() => setSnack(null)} duration={1800}>
          {snack}
        </Snackbar>
        <Snackbar visible={!!err} onDismiss={() => setErr(null)} duration={2400}>
          {err}
        </Snackbar>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  card: { marginBottom: 16, borderRadius: 12, overflow: "hidden", backgroundColor: "#ffffff" },
  muted: { color: "#666" },
  refRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  refLink: {
    flex: 1,
    color: "#1f2937",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ddd",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
});
