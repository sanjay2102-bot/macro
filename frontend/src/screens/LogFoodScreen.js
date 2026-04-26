import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { api } from "../api/client";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";
import Screen from "../components/Screen";
import { todayString } from "../utils/date";
import { colors, spacing } from "../theme";

export default function LogFoodScreen() {
  const [query, setQuery] = useState("");
  const [foods, setFoods] = useState([]);
  const [selected, setSelected] = useState(null);
  const [quantity, setQuantity] = useState("1");
  const [mealType, setMealType] = useState("lunch");
  const [manual, setManual] = useState({ name: "", calories: "", protein: "", carbs: "", fats: "" });

  useEffect(() => {
    const id = setTimeout(() => {
      api.foods(query).then(({ foods: result }) => setFoods(result)).catch(() => {});
    }, 250);
    return () => clearTimeout(id);
  }, [query]);

  async function addFood() {
    if (!selected) return;
    await api.logFood({
      source: "food",
      foodId: selected._id,
      date: todayString(),
      mealType,
      quantity: Number(quantity) || 1
    });
    Alert.alert("Logged", `${selected.name} added to ${mealType}.`);
    setSelected(null);
    setQuantity("1");
  }

  async function addManual() {
    if (!manual.name.trim()) return;
    await api.logFood({
      source: "manual",
      date: todayString(),
      mealType,
      quantity: 1,
      name: manual.name,
      macros: {
        calories: Number(manual.calories) || 0,
        protein: Number(manual.protein) || 0,
        carbs: Number(manual.carbs) || 0,
        fats: Number(manual.fats) || 0
      }
    });
    Alert.alert("Logged", `${manual.name} added to ${mealType}.`);
    setManual({ name: "", calories: "", protein: "", carbs: "", fats: "" });
  }

  return (
    <Screen title="Log Food" subtitle="Search Indian staples or add your own mess plate.">
      <TextInput style={styles.input} placeholder="Search rice, roti, dal, chicken..." value={query} onChangeText={setQuery} />
      <View style={styles.segment}>
        {["breakfast", "lunch", "dinner", "snack"].map((type) => (
          <Pressable key={type} onPress={() => setMealType(type)} style={[styles.pill, mealType === type && styles.pillActive]}>
            <Text style={[styles.pillText, mealType === type && styles.pillTextActive]}>{type}</Text>
          </Pressable>
        ))}
      </View>
      {selected ? (
        <Card>
          <Text style={styles.title}>{selected.name}</Text>
          <Text style={styles.meta}>
            {selected.serving.label}: {selected.macros.calories} kcal, {selected.macros.protein}g protein
          </Text>
          <TextInput style={styles.input} keyboardType="numeric" value={quantity} onChangeText={setQuantity} placeholder="Quantity" />
          <PrimaryButton title="Add to today" onPress={addFood} />
        </Card>
      ) : null}
      <Card>
        <Text style={styles.title}>Manual Entry</Text>
        <Text style={styles.meta}>Use this for canteen items or homemade food not in the database.</Text>
        <TextInput style={styles.input} placeholder="Food name" value={manual.name} onChangeText={(name) => setManual((current) => ({ ...current, name }))} />
        <View style={styles.grid}>
          {["calories", "protein", "carbs", "fats"].map((key) => (
            <TextInput
              key={key}
              style={styles.gridInput}
              keyboardType="numeric"
              placeholder={key}
              value={manual[key]}
              onChangeText={(value) => setManual((current) => ({ ...current, [key]: value }))}
            />
          ))}
        </View>
        <PrimaryButton title="Add manual food" tone="blue" onPress={addManual} />
      </Card>
      {foods.map((food) => (
        <Pressable key={food._id} onPress={() => setSelected(food)}>
          <Card>
            <Text style={styles.title}>{food.name}</Text>
            <Text style={styles.meta}>
              {food.serving.label} · {food.macros.calories} kcal · P {food.macros.protein}g · C {food.macros.carbs}g · F {food.macros.fats}g
            </Text>
          </Card>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: { minHeight: 48, backgroundColor: colors.surface, borderRadius: 8, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 12, marginBottom: spacing.md },
  segment: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: spacing.md },
  pill: { borderRadius: 999, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: colors.surface },
  pillActive: { backgroundColor: colors.green, borderColor: colors.green },
  pillText: { color: colors.muted, fontWeight: "800", textTransform: "capitalize" },
  pillTextActive: { color: "#fff" },
  title: { color: colors.ink, fontWeight: "800", fontSize: 16 },
  meta: { color: colors.muted, marginTop: 6, lineHeight: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: spacing.md },
  gridInput: { width: "48%", minHeight: 46, backgroundColor: colors.surface, borderRadius: 8, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 10, marginBottom: spacing.sm }
});
