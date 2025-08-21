import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Card,
  Text,
  List,
  Divider,
  Button,
  Chip,
  Snackbar,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RewardsScreen() {
  const router = useRouter();

  // TODO: replace with real user points & data from Supabase
  const totalPoints = 820;
  const referralCode = "PACE-ANTONY-42";
  const referralLink = `https://example.com/invite/${referralCode}`;

  const [snack, setSnack] = useState<string | null>(null);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(referralLink);
    setSnack("Referral link copied!");
  };

  const handleShare = async () => {
    // Hook up to Share API later if you like
    await Clipboard.setStringAsync(referralLink);
    setSnack("Link ready to share (copied)!");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      {/* Header / Points */}
      <Card style={styles.card}>
        <Card.Title
          title="Rewards & Redemption"
          subtitle={`Total Points: ${totalPoints}`}
          left={(props) => (
            <MaterialCommunityIcons {...props} name="gift-outline" size={28} />
          )}
        />
        <Card.Content>
          <Text style={styles.muted}>
            Redeem your points for perks and experiences.
          </Text>
        </Card.Content>
      </Card>

      {/* Reward Tiers */}
      <Card style={styles.card}>
        <Card.Title title="Reward Tiers" />
        <Divider />
        <TierRow
          label="Small (100–200)"
          items={[
            "Digital badges",
            "Coffee voucher",
            "Extra break time",
          ]}
          icon="coffee-outline"
        />
        <Divider />
        <TierRow
          label="Medium (300–500)"
          items={[
            "Gift cards",
            "Team lunch",
            "Eco-friendly gadget",
          ]}
          icon="gift-outline"
        />
        <Divider />
        <TierRow
          label="Large (600–1000)"
          items={[
            "Extra time off",
            "Wellness package",
            "Charity donation (SDG-aligned)",
          ]}
          icon="briefcase-outline"
        />
        <Divider />
        <TierRow
          label="Top (1000+)"
          items={[
            "Eco-travel experience",
            "Premium training workshop",
          ]}
          icon="trophy-outline"
        />
        <Card.Actions style={{ justifyContent: "flex-end" }}>
          <Button mode="contained" onPress={() => router.push("/(modals)/redeem")}>
            Redeem Points
          </Button>
        </Card.Actions>
      </Card>

      {/* Point Conversion Guide */}
      <Card style={styles.card}>
        <Card.Title title="Point Conversion" />
        <Card.Content>
          <List.Section>
            <List.Item
              title="100 pts"
              description="Small reward tier"
              left={(p) => <MaterialCommunityIcons {...p} name="numeric-1-circle-outline" size={22} />}
              right={() => <Chip compact>Small</Chip>}
            />
            <List.Item
              title="300 pts"
              description="Medium reward tier"
              left={(p) => <MaterialCommunityIcons {...p} name="numeric-3-circle-outline" size={22} />}
              right={() => <Chip compact>Medium</Chip>}
            />
            <List.Item
              title="600 pts"
              description="Large reward tier"
              left={(p) => <MaterialCommunityIcons {...p} name="numeric-6-circle-outline" size={22} />}
              right={() => <Chip compact>Large</Chip>}
            />
            <List.Item
              title="1000 pts"
              description="Top performer rewards"
              left={(p) => <MaterialCommunityIcons {...p} name="numeric-1-circle-outline" size={22} />}
              right={() => <Chip compact>Top</Chip>}
            />
          </List.Section>
          <Text style={styles.muted}>
            Example: 500 pts can redeem any Medium tier reward.
          </Text>
        </Card.Content>
      </Card>

      {/* Redemption History */}
      <Card style={styles.card}>
        <Card.Title title="Redemption History" />
        <Divider />
        {historyData.length === 0 ? (
          <Text style={[styles.muted, { padding: 16 }]}>
            No redemptions yet. Start redeeming your points!
          </Text>
        ) : (
          historyData.map((h, i) => (
            <View key={i}>
              <List.Item
                title={h.item}
                description={`${h.tier} • ${h.date}`}
                left={(p) => (
                  <MaterialCommunityIcons
                    {...p}
                    name="check-decagram-outline"
                    size={22}
                  />
                )}
                right={() => <Chip compact>{h.points} pts</Chip>}
              />
              {i < historyData.length - 1 && <Divider />}
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
            <Button mode="contained" onPress={handleShare} style={{ marginLeft: 8 }}>
              Share
            </Button>
          </View>
          <Text style={styles.muted}>Bonus: +50 pts per verified referral</Text>
        </Card.Content>
      </Card>

      <Snackbar
        visible={!!snack}
        onDismiss={() => setSnack(null)}
        duration={1800}
      >
        {snack}
      </Snackbar>
    </ScrollView>
    </SafeAreaView>
  );
}

/** --- Components & Sample Data --- */

function TierRow({
  label,
  items,
  icon,
}: {
  label: string;
  items: string[];
  icon: string;
}) {
  return (
    <List.Section style={{ paddingVertical: 4 }}>
      <List.Subheader>{label}</List.Subheader>
      {items.map((t, idx) => (
        <List.Item
          key={idx}
          title={t}
          left={(p) => <MaterialCommunityIcons {...p} name={icon} size={22} />}
        />
      ))}
    </List.Section>
  );
}

const historyData = [
  { item: "Coffee voucher", tier: "Small", points: 150, date: "2025-07-28" },
  { item: "Team lunch", tier: "Medium", points: 400, date: "2025-06-14" },
  { item: "Charity donation", tier: "Large", points: 650, date: "2025-05-03" },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  card: { marginBottom: 16, borderRadius: 12, overflow: "hidden" },
  muted: { color: "#666" },
  refRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
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
