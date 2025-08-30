import React, { useMemo, useState } from "react";
import { SectionList, View, StyleSheet } from "react-native";
import { Chip, Text, Divider } from "react-native-paper";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ActionCard, { ActionItem } from "@/components/ActionCard";
import ACTIONS from "@/data/actions"; 


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

      {/* <SectionFilter active={sdgFilter} onChange={(v) => setSdgFilter(v)} /> */}

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
