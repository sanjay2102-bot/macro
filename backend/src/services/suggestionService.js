function buildSuggestions(progress, goal) {
  const suggestions = [];

  if (progress.protein.percent < 55) {
    suggestions.push({
      type: "low_protein",
      severity: "high",
      title: "Protein is lagging",
      message: "Add eggs, paneer, curd, chicken, soya chunks, or extra dal in your next meal."
    });
  }

  if (progress.calories.percent > 110 && goal === "cutting") {
    suggestions.push({
      type: "calorie_over",
      severity: "medium",
      title: "Cutting calories crossed",
      message: "Keep dinner lighter: dal, salad, curd, and one roti instead of rice plus roti."
    });
  }

  if (progress.fats.percent > 115) {
    suggestions.push({
      type: "high_fat",
      severity: "medium",
      title: "Fat intake is high",
      message: "Prefer grilled/boiled protein and avoid fried mess snacks today."
    });
  }

  if (progress.carbs.percent < 60 && goal === "bulking") {
    suggestions.push({
      type: "bulk_carbs",
      severity: "low",
      title: "Bulking carbs are low",
      message: "Add rice, poha, banana, or an extra roti around your workout."
    });
  }

  if (!suggestions.length) {
    suggestions.push({
      type: "balanced",
      severity: "low",
      title: "Macros look balanced",
      message: "Stay consistent and keep protein distributed across meals."
    });
  }

  return suggestions;
}

module.exports = { buildSuggestions };

