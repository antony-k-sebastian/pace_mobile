// app/(tabs)/actions/index.tsx
import React, { useCallback, useMemo, useState } from "react";
import { SectionList, View, StyleSheet, RefreshControl } from "react-native";
import { Button, Divider, Snackbar, Text } from "react-native-paper";
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ActionCard, { ActionItem } from "@/components/ActionCard";
import { fetchTop2ByCategory } from "@/services/activityService";

export default function ActionsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ completed?: string }>();
  const [sectionsData, setSectionsData] = useState<Record<string, ActionItem[]>>({});
  const [refreshing, setRefreshing] = useState(false);
  const [snack, setSnack] = useState<{ visible: boolean; text: string }>({ visible: false, text: "" });
  const [completedFlash, setCompletedFlash] = useState<string | null>(params.completed ?? null);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const grouped = await fetchTop2ByCategory();
      setSectionsData(grouped);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Auto-refresh when returning to this screen; if ?completed=CODE, show a brief 100% flash
  useFocusEffect(
    useCallback(() => {
      load();
      if (completedFlash) {
        setSnack({ visible: true, text: "✅ Activity completed!" });
        const t = setTimeout(() => {
          setCompletedFlash(null);
          router.replace("/actions"); // clear ?completed param
          load(); // then refresh so the next item replaces it
        }, 1100);
        return () => clearTimeout(t);
      }
    }, [load, completedFlash, router])
  );

  const sections = useMemo(
    () =>
      Object.entries(sectionsData).map(([title, data]) => ({
        title,
        data: data.map((it) => (completedFlash && it.id === completedFlash ? { ...it, progress: 1 } : it)),
      })),
    [sectionsData, completedFlash]
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <Stack.Screen
        options={{
          title: "Activities",
          headerRight: () => (
            <Button compact onPress={load} icon="refresh" mode="text">
              Refresh
            </Button>
          ),
        }}
      />

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
        renderSectionHeader={({ section }) => (
          <Text variant="titleMedium" style={styles.sectionTitle}>
            {section.title}
          </Text>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        SectionSeparatorComponent={() => <Divider style={{ marginTop: 8 }} />}
        renderItem={({ item }) => (
          <ActionCard item={item} onPress={(it) => router.push(`/actions/${it.id}`)} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={{ opacity: 0.7 }}>No activities to show.</Text>
            <Button onPress={load} icon="refresh" style={{ marginTop: 8 }}>
              Try Refresh
            </Button>
          </View>
        }
      />

      <Snackbar visible={snack.visible} onDismiss={() => setSnack({ visible: false, text: "" })} duration={1500}>
        {snack.text}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f5f5" },
  listContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32 },
  sectionTitle: { marginTop: 16, marginBottom: 6 },
  emptyWrap: { alignItems: "center", paddingVertical: 24 },
});
