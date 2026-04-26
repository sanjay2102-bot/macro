const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9
};

const GOAL_CALORIE_DELTA = {
  bulking: 300,
  cutting: -450,
  maintenance: 0
};

function round(value, step = 1) {
  return Math.round(value / step) * step;
}

function calculateBmr({ gender, weightKg, heightCm, age }) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === "female" ? base - 161 : base + 5;
}

function calculateTargets(profile, goal = "maintenance") {
  const activity = profile.activityLevel || "moderate";
  const bmr = calculateBmr(profile);
  const tdee = bmr * (ACTIVITY_MULTIPLIERS[activity] || ACTIVITY_MULTIPLIERS.moderate);
  const calories = Math.max(1200, round(tdee + (GOAL_CALORIE_DELTA[goal] || 0), 25));

  const proteinPerKg = goal === "cutting" ? 2.0 : goal === "bulking" ? 1.8 : 1.6;
  const fatPerKg = goal === "cutting" ? 0.7 : 0.8;
  const protein = round(profile.weightKg * proteinPerKg);
  const fats = round(profile.weightKg * fatPerKg);
  const proteinCalories = protein * 4;
  const fatCalories = fats * 9;
  const carbs = Math.max(80, round((calories - proteinCalories - fatCalories) / 4));

  return { calories, protein, carbs, fats };
}

function multiplyMacros(macros, quantity = 1) {
  return {
    calories: round(macros.calories * quantity),
    protein: Number((macros.protein * quantity).toFixed(1)),
    carbs: Number((macros.carbs * quantity).toFixed(1)),
    fats: Number((macros.fats * quantity).toFixed(1))
  };
}

function sumMacros(entries) {
  return entries.reduce(
    (total, entry) => ({
      calories: total.calories + (entry.macros?.calories || 0),
      protein: Number((total.protein + (entry.macros?.protein || 0)).toFixed(1)),
      carbs: Number((total.carbs + (entry.macros?.carbs || 0)).toFixed(1)),
      fats: Number((total.fats + (entry.macros?.fats || 0)).toFixed(1))
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );
}

function macroProgress(consumed, targets) {
  return Object.fromEntries(
    ["calories", "protein", "carbs", "fats"].map((key) => [
      key,
      {
        consumed: consumed[key] || 0,
        target: targets[key] || 0,
        percent: targets[key] ? Math.round(((consumed[key] || 0) / targets[key]) * 100) : 0
      }
    ])
  );
}

module.exports = { calculateTargets, multiplyMacros, sumMacros, macroProgress };

