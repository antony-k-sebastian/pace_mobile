// app/(tabs)/actions/index.tsx
import React, { useMemo, useState } from "react";
import { SectionList, View, StyleSheet } from "react-native";
import { Chip, Text, Divider } from "react-native-paper";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ActionCard, { ActionItem } from "@/components/ActionCard";

const ACTIONS: ActionItem[] = [
  { id: "textbook-exchange", title: "Textbook Exchange Drop-off", sdgs: [4,12], estimatedMins: 5, points: 20, impact: "E", category: "Donate & Buy" },
  { id: "sustainable-snack", title: "Sustainable Snack Station", sdgs: [2,12], estimatedMins: 2, points: 10, impact: "S", category: "Donate & Buy" },
  { id: "campus-cleanup", title: "Campus Clean-Up Crew", sdgs: [11,15], estimatedMins: 45, points: 40, impact: "E", category: "Volunteering" },
  { id: "peer-tutoring", title: "Peer Tutoring Power Hour", sdgs: [4,10], estimatedMins: 30, points: 30, impact: "S", category: "Volunteering" },
  { id: "mindfulness-moment", title: "Campus Mindfulness Moment", sdgs: [3], estimatedMins: 10, points: 10, impact: "S", category: "Mind Body Spirit" },
  { id: "stair-challenge", title: "Stair Challenge Sprint", sdgs: [3,11], estimatedMins: 5, points: 10, impact: "E", category: "Mind Body Spirit" },
  { id: "litter-patrol", title: "Litter Patrol Power Hour", sdgs: [15,14], estimatedMins: 45, points: 40, impact: "E", category: "Protect Land/Sea/Wildlife" },
  { id: "water-whistle", title: "Water Saving Whistleblower", sdgs: [6,12], estimatedMins: 3, points: 10, impact: "E", category: "Protect Land/Sea/Wildlife" },
  { id: "reusable-cup", title: "Reusable Cup Champion", sdgs: [12,13], estimatedMins: 2, points: 10, impact: "E", category: "Reuse/Reduce/Recycle" },
  { id: "food-waste-fighter", title: "Food Waste Fighter", sdgs: [2,12], estimatedMins: 2, points: 10, impact: "E", category: "Reuse/Reduce/Recycle" },
  { id: "sdg-story", title: "SDG Story Share", sdgs: [17], estimatedMins: 5, points: 15, impact: "G", category: "Advocate & Empower" },
  { id: "sustainability-poll", title: "Campus Sustainability Poll", sdgs: [16,17], estimatedMins: 5, points: 10, impact: "G", category: "Advocate & Empower" },
];

const ALL_SDGS = Array.from({ length: 17 }, (_, i) => i + 1);

export default function ActionsScreen() {
  const router = useRouter();
  const [sdgFilter, setSdgFilter] = useState<number | "all">("all");

  const filtered = useMemo(() => {
    if (sdgFilter === "all") return ACTIONS;
    return ACTIONS.filter((a) => a.sdgs.includes(sdgFilter));
  }, [sdgFilter]);

  const sections = useMemo(() => {
    const map = new Map<string, ActionItem[]>();
    for (const a of filtered) {
      if (!map.has(a.category)) map.set(a.category, []);
      map.get(a.category)!.push(a);
    }
    return Array.from(map.entries()).map(([title, data]) => ({ title, data }));
  }, [filtered]);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <Text variant="titleLarge" style={styles.screenTitle}>Activities</Text>

      <SectionFilter active={sdgFilter} onChange={(v) => setSdgFilter(v)} />

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderSectionHeader={({ section }) => (
          <Text variant="titleMedium" style={styles.sectionTitle}>
            {section.title}
          </Text>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        SectionSeparatorComponent={() => <Divider style={{ marginTop: 8 }} />}
        renderItem={({ item }) => (
          <ActionCard
            item={item}
            onPress={(it) => router.push(`/actions/${it.id}`)}
          />
        )}
      />
    </SafeAreaView>
  );
}

function SectionFilter({
  active,
  onChange,
}: {
  active: number | "all";
  onChange: (v: number | "all") => void;
}) {
  return (
    <View style={styles.filterRow}>
      <Chip selected={active === "all"} onPress={() => onChange("all")} compact style={styles.chip}>
        All SDGs
      </Chip>
      {ALL_SDGS.map((n) => (
        <Chip
          key={n}
          compact
          selected={active === n}
          onPress={() => onChange(n)}
          style={styles.chip}
        >
          {n}
        </Chip>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f5f5" },
  screenTitle: { marginBottom: 8, paddingHorizontal: 16 },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  chip: {
    marginRight: 6,
    marginBottom: 6, 
  },
  listContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32 },
  sectionTitle: { marginTop: 16, marginBottom: 6 },
});
