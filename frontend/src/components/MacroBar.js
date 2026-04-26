import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../theme";

export default function MacroBar({ label, consumed, target, color = colors.green }) {
  const percent = target ? Math.min(100, Math.round((consumed / target) * 100)) : 0;
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {consumed}/{target}
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  label: { color: colors.ink, fontWeight: "700" },
  value: { color: colors.muted, fontWeight: "600" },
  track: { height: 10, backgroundColor: "#EEF1EA", borderRadius: 999, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 999 }
});

