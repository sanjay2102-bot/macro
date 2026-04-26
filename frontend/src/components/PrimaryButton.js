import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

import { colors } from "../theme";

export default function PrimaryButton({ title, onPress, loading, tone = "green", style }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={[styles.button, { backgroundColor: colors[tone] || colors.green }, style]}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16
  },
  text: { color: "#fff", fontSize: 16, fontWeight: "800" }
});

