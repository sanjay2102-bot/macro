import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../theme";

export default function MetricTile({ label, value, accent = colors.green }) {
  return (
    <View style={styles.tile}>
      <View style={[styles.dot, { backgroundColor: accent }]} />
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    minHeight: 92,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    padding: 12
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginBottom: 10 },
  value: { color: colors.ink, fontSize: 20, fontWeight: "800" },
  label: { color: colors.muted, marginTop: 4, fontWeight: "600" }
});

