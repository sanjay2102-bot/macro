import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";

import PrimaryButton from "../components/PrimaryButton";
import { useAuth } from "../context/AuthContext";
import { colors, spacing } from "../theme";

export default function AuthScreen() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { authenticate } = useAuth();

  async function submit() {
    try {
      setLoading(true);
      await authenticate(mode, { name, email, password });
    } catch (error) {
      Alert.alert("Could not continue", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
      <Text style={styles.brand}>MacroHostel India</Text>
      <Text style={styles.copy}>Macros, mess meals, and gym goals built around Indian hostel life.</Text>
      <View style={styles.form}>
        {mode === "signup" ? <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} /> : null}
        <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
        <PrimaryButton title={mode === "signup" ? "Create account" : "Log in"} loading={loading} onPress={submit} />
        <Text style={styles.switch} onPress={() => setMode(mode === "signup" ? "login" : "signup")}>
          {mode === "signup" ? "Already tracking? Log in" : "New here? Create account"}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: "center", padding: spacing.lg },
  brand: { color: colors.ink, fontSize: 34, fontWeight: "900" },
  copy: { color: colors.muted, fontSize: 16, lineHeight: 23, marginTop: spacing.sm, marginBottom: spacing.xl },
  form: { gap: spacing.md },
  input: { minHeight: 52, backgroundColor: colors.surface, borderRadius: 8, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 14 },
  switch: { color: colors.green, textAlign: "center", fontWeight: "800" }
});

