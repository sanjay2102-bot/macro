import React, { useCallback, useState } from "react";
import { RefreshControl, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { api } from "../api/client";
import Card from "../components/Card";
import MacroBar from "../components/MacroBar";
import MetricTile from "../components/MetricTile";
import Screen from "../components/Screen";
import { todayString } from "../utils/date";
import { colors, spacing } from "../theme";

export default function DashboardScreen() {
  const [data, setData] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const date = todayString();
    const [daily, suggestionResult] = await Promise.all([api.daily(date), api.suggestions(date)]);
    setData(daily);
    setSuggestions(suggestionResult.suggestions);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load().catch(() => {});
    }, [load])
  );

  async function refresh() {
    setRefreshing(true);
    await load().finally(() => setRefreshing(false));
  }

  const totals = data?.totals || { calories: 0, protein: 0, carbs: 0, fats: 0 };
  const targets = data?.targets || { calories: 2200, protein: 120, carbs: 280, fats: 65 };

  return (
    <Screen
      title="Today"
      subtitle="Track your mess plate, gym fuel, and macro balance."
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
    >
      <View style={styles.tiles}>
        <MetricTile label="Calories" value={Math.round(totals.calories)} accent={colors.saffron} />
        <MetricTile label="Protein" value={`${totals.protein}g`} accent={colors.green} />
      </View>
      <Card>
        <Text style={styles.section}>Macro Progress</Text>
        <MacroBar label="Calories" consumed={Math.round(totals.calories)} target={targets.calories} color={colors.saffron} />
        <MacroBar label="Protein" consumed={totals.protein} target={targets.protein} color={colors.green} />
        <MacroBar label="Carbs" consumed={totals.carbs} target={targets.carbs} color={colors.blue} />
        <MacroBar label="Fats" consumed={totals.fats} target={targets.fats} color={colors.red} />
      </Card>
      {suggestions.map((item) => (
        <Card key={item.type} style={styles.suggestion}>
          <Text style={styles.suggestionTitle}>{item.title}</Text>
          <Text style={styles.suggestionText}>{item.message}</Text>
        </Card>
      ))}
      <Card>
        <Text style={styles.section}>Meal Timeline</Text>
        {(data?.logs || []).map((log) => (
          <View key={log._id} style={styles.logRow}>
            <Text style={styles.logName}>{log.name}</Text>
            <Text style={styles.logMeta}>
              {log.mealType} · {Math.round(log.macros.calories)} kcal · {log.macros.protein}g protein
            </Text>
          </View>
        ))}
        {!data?.logs?.length ? <Text style={styles.empty}>No meals logged yet.</Text> : null}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  tiles: { flexDirection: "row", gap: spacing.md, marginBottom: spacing.md },
  section: { color: colors.ink, fontSize: 18, fontWeight: "800", marginBottom: spacing.md },
  suggestion: { borderColor: "#CFE8D9", backgroundColor: "#F1FAF4" },
  suggestionTitle: { color: colors.ink, fontWeight: "800", marginBottom: 4 },
  suggestionText: { color: colors.muted, lineHeight: 20 },
  logRow: { paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.line },
  logName: { color: colors.ink, fontWeight: "800" },
  logMeta: { color: colors.muted, marginTop: 3 },
  empty: { color: colors.muted }
});
