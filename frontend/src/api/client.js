import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    if (response.status === 401) {
      await AsyncStorage.removeItem("token");
    }
    throw new Error(error.message);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  signup: (payload) => request("/auth/signup", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  me: () => request("/users/me"),
  foods: (query = "") => request(`/foods${query ? `?q=${encodeURIComponent(query)}` : ""}`),
  createFood: (payload) => request("/foods", { method: "POST", body: JSON.stringify(payload) }),
  messMeals: () => request("/mess-meals"),
  logFood: (payload) => request("/logs", { method: "POST", body: JSON.stringify(payload) }),
  daily: (date) => request(`/analytics/daily/${date}`),
  weekly: (date) => request(`/analytics/weekly/${date}`),
  suggestions: (date) => request(`/suggestions/${date}`),
  saveGoal: (payload) => request("/goals", { method: "PUT", body: JSON.stringify(payload) }),
  calculateGoal: (payload) => request("/goals/calculate", { method: "POST", body: JSON.stringify(payload) }),
  assistant: (content) => request("/assistant/messages", { method: "POST", body: JSON.stringify({ content }) })
};
