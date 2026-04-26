import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BarChart3, Bot, Dumbbell, Home, PlusCircle, Utensils } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";

import { AuthProvider, useAuth } from "./src/context/AuthContext";
import AssistantScreen from "./src/screens/AssistantScreen";
import AuthScreen from "./src/screens/AuthScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import GoalsScreen from "./src/screens/GoalsScreen";
import LogFoodScreen from "./src/screens/LogFoodScreen";
import MessModeScreen from "./src/screens/MessModeScreen";
import AnalyticsScreen from "./src/screens/AnalyticsScreen";
import { colors } from "./src/theme";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { height: 70, paddingBottom: 12, paddingTop: 8 }
      }}
    >
      <Tab.Screen name="Home" component={DashboardScreen} options={{ tabBarIcon: ({ color }) => <Home color={color} size={22} /> }} />
      <Tab.Screen name="Log" component={LogFoodScreen} options={{ tabBarIcon: ({ color }) => <PlusCircle color={color} size={22} /> }} />
      <Tab.Screen name="Mess" component={MessModeScreen} options={{ tabBarIcon: ({ color }) => <Utensils color={color} size={22} /> }} />
      <Tab.Screen name="Goals" component={GoalsScreen} options={{ tabBarIcon: ({ color }) => <Dumbbell color={color} size={22} /> }} />
      <Tab.Screen name="Stats" component={AnalyticsScreen} options={{ tabBarIcon: ({ color }) => <BarChart3 color={color} size={22} /> }} />
      <Tab.Screen name="Coach" component={AssistantScreen} options={{ tabBarIcon: ({ color }) => <Bot color={color} size={22} /> }} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { token, booting } = useAuth();
  if (booting) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? <Stack.Screen name="Main" component={Tabs} /> : <Stack.Screen name="Auth" component={AuthScreen} />}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </AuthProvider>
  );
}

