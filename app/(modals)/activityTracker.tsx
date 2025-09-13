import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { Card, Text, ProgressBar } from "react-native-paper";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const SDGS = [
  { id: 1,  title: "No Poverty"},
  { id: 2,  title: "Zero Hunger" },
  { id: 3,  title: "Good Health and Well-being" },
  { id: 4,  title: "Quality Education" },
  { id: 5,  title: "Gender Equality" },
  { id: 6,  title: "Clean Water and Sanitation" },
  { id: 7,  title: "Affordable and Clean Energy" },
  { id: 8,  title: "Decent Work and Economic Growth" },
  { id: 9,  title: "Industry, Innovation and Infrastructure" },
  { id: 10, title: "Reduced Inequalities" },
  { id: 11, title: "Sustainable Cities and Communities" },
  { id: 12, title: "Responsible Consumption and Production" },
  { id: 13, title: "Climate Action" },
  { id: 14, title: "Life Below Water" },
  { id: 15, title: "Life on Land" },
  { id: 16, title: "Peace, Justice and Strong Institutions" },
  { id: 17, title: "Partnerships for the Goals" },
];

export default function SDGTrackerScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }} >
    <FlatList
      style={styles.container}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      data={SDGS}
      keyExtractor={(i) => String(i.id)}
      ListHeaderComponent={
        <Text variant="titleLarge" style={{ marginBottom: 16 }}>
          SDG Progress
        </Text>
      }
      renderItem={({ item }) => {
        const progress = 0; 
        return (
          <Card
            style={styles.card}
            onPress={() => router.push(`/sdg/${item.id}`)}
            mode="elevated"
          >
            <Card.Title
              title={`SDG ${item.id}: ${item.title}`}
              titleVariant="titleMedium"
            />
            <Card.Content style={{ paddingTop: 0 }}>
              <ProgressBar
                progress={progress}
                color={progress >= 1 ? "green" : "#6200ee"}
                style={styles.progress}
              />
              <Text variant="bodySmall" style={{ marginTop: 6 }}>
                {Math.round(progress * 100)}% Complete
              </Text>
            </Card.Content>
          </Card>
        );
      }}
    />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  card: { marginBottom: 12, borderRadius: 12, overflow: "hidden" },
  progress: { height: 8, borderRadius: 4, marginTop: 8 },
});
