import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { api } from "../api/client";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";
import Screen from "../components/Screen";
import { todayString } from "../utils/date";
import { colors, spacing } from "../theme";

const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"];

function currentDay() {
  return DAYS[new Date().getDay()];
}

export default function MessModeScreen() {
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState(currentDay());
  const [mealType, setMealType] = useState("lunch");

  useEffect(() => {
    api
      .messMeals()
      .then(({ meals: result }) => {
        setMeals(result);
        setError("");
      })
      .catch((err) => setError(err.message));
  }, []);

  async function addMeal(meal) {
    await api.logFood({
      source: "messMeal",
      messMealId: meal._id,
      date: todayString(),
      mealType: meal.mealType,
      quantity: 1
    });
    Alert.alert("Mess meal logged", meal.name);
  }

  const filtered = meals.filter((meal) => {
    const normalizedName = meal.name.toLowerCase();
    const matchesDay = meal.dayOfWeek === dayOfWeek || normalizedName.startsWith(dayOfWeek);
    return matchesDay && meal.mealType === mealType;
  });

  return (
    <Screen title="SRM Mess Mode" subtitle="Weekly hostel menu w.e.f. 23.03.2026 with one-tap macro logging.">
      <View style={styles.daySegment}>
        {DAYS.map((day) => (
          <Pressable key={day} onPress={() => setDayOfWeek(day)} style={[styles.dayPill, dayOfWeek === day && styles.pillActive]}>
            <Text style={[styles.pillText, dayOfWeek === day && styles.pillTextActive]}>{day.slice(0, 3)}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.segment}>
        {MEAL_TYPES.map((type) => (
          <Pressable key={type} onPress={() => setMealType(type)} style={[styles.pill, mealType === type && styles.pillActive]}>
            <Text style={[styles.pillText, mealType === type && styles.pillTextActive]}>{type}</Text>
          </Pressable>
        ))}
      </View>
      {error ? <Text style={styles.error}>{error}. Refresh and log in again.</Text> : null}
      {filtered.map((meal) => {
        const totals = meal.items.reduce(
          (sum, item) => ({
            calories: sum.calories + item.food.macros.calories * item.quantity,
            protein: sum.protein + item.food.macros.protein * item.quantity
          }),
          { calories: 0, protein: 0 }
        );
        return (
          <Card key={meal._id}>
            <Text style={styles.title}>{meal.name}</Text>
            <Text style={styles.meta}>{meal.description}</Text>
            <Text style={styles.items}>{meal.items.map((item) => `${item.quantity}x ${item.food.name}`).join(" | ")}</Text>
            <View style={styles.footer}>
              <Text style={styles.macro}>
                {Math.round(totals.calories)} kcal | {totals.protein.toFixed(1)}g protein
              </Text>
              <PrimaryButton title="Quick add" onPress={() => addMeal(meal)} style={styles.button} />
            </View>
          </Card>
        );
      })}
      {!filtered.length ? <Text style={styles.empty}>No SRM preset yet for this day and meal slot.</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  daySegment: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: spacing.sm },
  segment: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: spacing.md },
  dayPill: {
    minWidth: 44,
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: colors.surface
  },
  pill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.surface
  },
  pillActive: { backgroundColor: colors.green, borderColor: colors.green },
  pillText: { color: colors.muted, fontWeight: "800", textTransform: "capitalize" },
  pillTextActive: { color: "#fff" },
  title: { color: colors.ink, fontSize: 17, fontWeight: "900" },
  meta: { color: colors.muted, marginTop: 6, lineHeight: 20 },
  items: { color: colors.ink, marginTop: 12, lineHeight: 20 },
  footer: { gap: spacing.md, marginTop: spacing.md },
  macro: { color: colors.green, fontWeight: "900" },
  button: { alignSelf: "stretch" },
  empty: { color: colors.muted },
  error: { color: colors.red, fontWeight: "800", marginBottom: spacing.md }
});
