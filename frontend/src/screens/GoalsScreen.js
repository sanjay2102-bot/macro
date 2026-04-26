import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { api } from "../api/client";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";
import Screen from "../components/Screen";
import { useAuth } from "../context/AuthContext";
import { colors, spacing } from "../theme";

export default function GoalsScreen() {
  const { user, setUser } = useAuth();
  const [goal, setGoal] = useState(user?.goal || "maintenance");
  const [profile, setProfile] = useState({
    age: String(user?.profile?.age || 20),
    gender: user?.profile?.gender || "male",
    heightCm: String(user?.profile?.heightCm || 175),
    weightKg: String(user?.profile?.weightKg || 70),
    activityLevel: user?.profile?.activityLevel || "moderate",
    hostelName: user?.profile?.hostelName || "",
    isVegetarian: Boolean(user?.profile?.isVegetarian)
  });
  const [targets, setTargets] = useState(user?.macroTargets);

  function numericProfile() {
    return {
      ...profile,
      age: Number(profile.age),
      heightCm: Number(profile.heightCm),
      weightKg: Number(profile.weightKg)
    };
  }

  async function calculate() {
    const result = await api.calculateGoal({ goal, profile: numericProfile() });
    setTargets(result.targets);
  }

  async function save() {
    const result = await api.saveGoal({ goal, profile: numericProfile() });
    setUser(result.user);
    setTargets(result.user.macroTargets);
    Alert.alert("Goal saved", "Your daily macro targets are updated.");
  }

  return (
    <Screen title="Gym Goals" subtitle="Auto-calculate macros for bulking, cutting, or maintenance.">
      <View style={styles.segment}>
        {["bulking", "cutting", "maintenance"].map((item) => (
          <Pressable key={item} onPress={() => setGoal(item)} style={[styles.pill, goal === item && styles.pillActive]}>
            <Text style={[styles.pillText, goal === item && styles.pillTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </View>
      <Card>
        <View style={styles.grid}>
          {["age", "heightCm", "weightKg"].map((key) => (
            <TextInput
              key={key}
              style={styles.input}
              keyboardType="numeric"
              placeholder={key}
              value={profile[key]}
              onChangeText={(value) => setProfile((current) => ({ ...current, [key]: value }))}
            />
          ))}
        </View>
        <TextInput style={styles.input} placeholder="Hostel name" value={profile.hostelName} onChangeText={(hostelName) => setProfile((current) => ({ ...current, hostelName }))} />
        <PrimaryButton title="Calculate targets" tone="blue" onPress={calculate} />
        <PrimaryButton title="Save goal" onPress={save} style={{ marginTop: spacing.sm }} />
      </Card>
      {targets ? (
        <Card>
          <Text style={styles.title}>Daily Targets</Text>
          <Text style={styles.target}>{targets.calories} kcal</Text>
          <Text style={styles.meta}>Protein {targets.protein}g · Carbs {targets.carbs}g · Fats {targets.fats}g</Text>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  segment: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: spacing.md },
  pill: { borderRadius: 999, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: colors.surface },
  pillActive: { backgroundColor: colors.green, borderColor: colors.green },
  pillText: { color: colors.muted, fontWeight: "800", textTransform: "capitalize" },
  pillTextActive: { color: "#fff" },
  grid: { flexDirection: "row", gap: spacing.sm },
  input: { flex: 1, minHeight: 48, backgroundColor: colors.surface, borderRadius: 8, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 12, marginBottom: spacing.md },
  title: { color: colors.ink, fontWeight: "900", fontSize: 18 },
  target: { color: colors.green, fontWeight: "900", fontSize: 30, marginTop: spacing.sm },
  meta: { color: colors.muted, marginTop: spacing.xs }
});

