import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text, ProgressBar, Chip } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActionItem } from "@/types";

export default function ActionCard({
  item,
  onPress,
}: {
  item: ActionItem;
  onPress?: (item: ActionItem) => void;
}) {
  const p = Math.max(0, Math.min(1, item.progress ?? 0));

  return (
    <Card style={styles.card} onPress={() => onPress?.(item)} mode="elevated">
      <Card.Title
        title={item.title}
        titleVariant="titleMedium"
        subtitle={`Estimated Time ${item.estimatedMins} mins • Reward ${item.points} pts`}
      />
      <Card.Content style={{ paddingTop: 0 }}>
        <View style={styles.row}>
          <Text variant="bodySmall" style={styles.progressLabel}>
            Progress
          </Text>
          <Text variant="bodySmall">{Math.round(p * 100)}%</Text>
        </View>
        <ProgressBar progress={p} style={styles.progress} />
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12, borderRadius: 14, overflow: "hidden", backgroundColor: "#ffffff" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  progress: { height: 8, borderRadius: 4 },
  impact: { alignSelf: "center" },
});
