import React, { useCallback, useState } from "react";
import { Dimensions, StyleSheet, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { LineChart } from "react-native-chart-kit";

import { api } from "../api/client";
import Card from "../components/Card";
import Screen from "../components/Screen";
import { todayString } from "../utils/date";
import { colors } from "../theme";

const width = Dimensions.get("window").width - 48;

export default function AnalyticsScreen() {
  const [week, setWeek] = useState(null);

  useFocusEffect(
    useCallback(() => {
      api.weekly(todayString()).then(setWeek).catch(() => {});
    }, [])
  );

  const days = week?.days || [];
  const labels = days.map((day) => day.date.slice(5));
  const calories = days.map((day) => Math.round(day.totals.calories || 0));
  const protein = days.map((day) => Math.round(day.totals.protein || 0));

  return (
    <Screen title="Analytics" subtitle="Daily and weekly trends for calories and protein consistency.">
      <Card>
        <Text style={styles.title}>Calories This Week</Text>
        <LineChart
          data={{ labels, datasets: [{ data: calories.length ? calories : [0] }] }}
          width={width}
          height={220}
          yAxisSuffix=""
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </Card>
      <Card>
        <Text style={styles.title}>Protein Trend</Text>
        <LineChart
          data={{ labels, datasets: [{ data: protein.length ? protein : [0] }] }}
          width={width}
          height={220}
          yAxisSuffix="g"
          chartConfig={{ ...chartConfig, color: () => colors.green }}
          bezier
          style={styles.chart}
        />
      </Card>
    </Screen>
  );
}

const chartConfig = {
  backgroundGradientFrom: colors.surface,
  backgroundGradientTo: colors.surface,
  decimalPlaces: 0,
  color: () => colors.saffron,
  labelColor: () => colors.muted,
  propsForDots: { r: "4", strokeWidth: "2", stroke: colors.surface }
};

const styles = StyleSheet.create({
  title: { color: colors.ink, fontWeight: "900", fontSize: 18, marginBottom: 12 },
  chart: { borderRadius: 8 }
});
