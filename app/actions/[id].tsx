import React, { useMemo, useRef, useState } from "react";
import { View, StyleSheet, Animated, Easing, Platform } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Button, Text, Card, Divider, Snackbar, Chip, List, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import ACTIONS from "@/data/actions";
import FALLBACKS from "@/data/fallbacks";
import type { ActionItem } from "@/components/ActionCard";

export default function ActionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();

  const item: ActionItem | undefined = ACTIONS.find((a) => a.id === id);
  const meta = useMemo(() => FALLBACKS[id!] ?? { description: "Details coming soon.", steps: [], kpi: "" }, [id]);

  const [done, setDone] = useState(false);
  const [snack, setSnack] = useState<{ visible: boolean; text: string }>({ visible: false, text: "" });

  // QR state (expo-camera)
  const [scannerOpen, setScannerOpen] = useState(false);
  const [permissions, requestPermission] = useCameraPermissions();
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [hasScanned, setHasScanned] = useState(false); // throttle multiple fires

  // celebration
  const burst = useRef(new Animated.Value(0)).current;
  const runBurst = () => {
    burst.setValue(0);
    Animated.timing(burst, { toValue: 1, duration: 800, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  };

  const handleScanPress = async () => {
    if (!permissions?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        setSnack({ visible: true, text: "Camera permission is required to scan QR codes." });
        return;
      }
    }
    setHasScanned(false);
    setScannerOpen(true);
  };

  const onBarcodeScanned = ({ data }: { data: string }) => {
    if (hasScanned) return; // prevent double trigger
    setHasScanned(true);
    setQrValue(data);          // <— scanned string stored here
    setScannerOpen(false);
    setDone(true);
    runBurst();
    setSnack({ visible: true, text: `🎉 Logged via QR! +${item?.points ?? 10} points` });
  };

  const scale = burst.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] });
  const opacity = burst.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.container}>
        <Stack.Screen options={{ title: item ? item.title : "Activity" }} />

        {/* Title card (now white with black text) */}
        <View style={styles.hero}>
          <Text variant="headlineSmall" style={styles.heroTitle}>
            {item ? item.title : "Activity"}
          </Text>
          <View style={styles.chipsRow}>
            <Chip mode="outlined" compact icon="target" textStyle={{ color: "#000" }}>
              {item?.points ?? 10} pts
            </Chip>
            <Chip mode="outlined" compact icon="clock-outline" textStyle={{ color: "#000" }}>
              {item?.estimatedMins ?? 5} mins
            </Chip>
            <Chip mode="outlined" compact icon="earth" textStyle={{ color: "#000" }}>
              SDG {item?.sdgs?.join(", ") || "—"}
            </Chip>
          </View>
        </View>

        {/* Content */}
        <Card mode="elevated" style={styles.card}>
          <Card.Content>
            <Text style={styles.description}>{meta.description}</Text>

            <Divider style={styles.divider} />
            <Text variant="titleSmall" style={styles.sectionTitle}>Steps</Text>

            <View style={{ marginBottom: 8 }}>
              {meta.steps.map((s, i) => (
                <List.Item
                  key={i}
                  title={s}
                  titleStyle={{ color: "#000" }}
                  left={(p) => <List.Icon {...p} color="#000" icon="check-circle-outline" />}
                  style={{ paddingVertical: 2 }}
                />
              ))}
              {meta.steps.length === 0 && <Text style={{ color: "#000", opacity: 0.6 }}>No steps listed for this activity (yet).</Text>}
            </View>

            {qrValue && (
              <>
                <Divider style={styles.divider} />
                <Text variant="labelLarge" style={[styles.sectionTitle, { marginBottom: 2 }]}>Scanned value</Text>
                <Text selectable style={styles.qrValue}>{qrValue}</Text>
              </>
            )}
          </Card.Content>
        </Card>

        <View style={{ height: 12 }} />

        {/* Primary CTA */}
        <Button
          mode="contained"
          onPress={done ? () => router.back() : handleScanPress}
          icon={done ? "check" : "qrcode-scan"}
          style={styles.cta}
          contentStyle={{ paddingVertical: 6 }}
        >
          {done ? "Done" : "Click to Scan QR"}
        </Button>

        {/* Celebration */}
        {done && (
          <Animated.View style={[styles.burst, { transform: [{ scale }], opacity }]}>
            <Text style={{ fontSize: 42 }}>🎊</Text>
            <Text style={{ fontSize: 42, marginLeft: 8 }}>🎉</Text>
            <Text style={{ fontSize: 42, marginLeft: 8 }}>✨</Text>
          </Animated.View>
        )}

        {/* Snackbar */}
        <Snackbar visible={snack.visible} onDismiss={() => setSnack({ visible: false, text: "" })} duration={2200}>
          {snack.text}
        </Snackbar>

        {/* Scanner Overlay */}
        {scannerOpen && (
          <View style={styles.scannerOverlay}>
            <View style={styles.scannerHeader}>
              <Text variant="titleMedium" style={{ color: "white" }}>Scan the QR code</Text>
              <Button mode="text" onPress={() => setScannerOpen(false)} textColor="#fff" icon="close">Close</Button>
            </View>

            <View style={styles.scannerFrame}>
              <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                onBarcodeScanned={({ data }) => onBarcodeScanned({ data })}
              />
              {/* corner guides */}
              <View style={[styles.corner, styles.tl]} />
              <View style={[styles.corner, styles.tr]} />
              <View style={[styles.corner, styles.bl]} />
              <View style={[styles.corner, styles.br]} />
            </View>

            <Text style={styles.scannerHint}>
              Align the QR inside the frame.{Platform.OS === "ios" ? " It may auto-focus." : ""}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const RADIUS = 18;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },

  // Title card now white
  hero: {
    backgroundColor: "#fff",
    borderRadius: RADIUS,
    paddingVertical: 16,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  heroTitle: { color: "#000", marginBottom: 8, fontWeight: "600" },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },

  card: { borderRadius: RADIUS, backgroundColor: "#fff" },

  // All main text is black now
  description: { marginBottom: 8, lineHeight: 20, color: "#000" },
  divider: { marginVertical: 10, opacity: 0.12 },
  sectionTitle: { marginTop: 4, marginBottom: 4, color: "#000" },
  qrValue: { marginTop: 4, color: "#000", fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }) },

  cta: { borderRadius: 12 },

  burst: { position: "absolute", top: 140, alignSelf: "center", flexDirection: "row" },

  // Scanner overlay (unchanged)
  scannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.9)", justifyContent: "flex-start", paddingTop: 16, paddingHorizontal: 12, paddingBottom: 24 },
  scannerHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  scannerFrame: { alignSelf: "center", width: "88%", aspectRatio: 1, borderRadius: 16, overflow: "hidden", backgroundColor: "black" },
  scannerHint: { textAlign: "center", color: "white", marginTop: 12, opacity: 0.8 },
  corner: { position: "absolute", width: 28, height: 28, borderColor: "#6ee7ff" },
  tl: { top: 10, left: 10, borderLeftWidth: 3, borderTopWidth: 3, borderRadius: 6 },
  tr: { top: 10, right: 10, borderRightWidth: 3, borderTopWidth: 3, borderRadius: 6 },
  bl: { bottom: 10, left: 10, borderLeftWidth: 3, borderBottomWidth: 3, borderRadius: 6 },
  br: { bottom: 10, right: 10, borderRightWidth: 3, borderBottomWidth: 3, borderRadius: 6 },
});