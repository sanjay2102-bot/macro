import React, { useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TextInput, View } from "react-native";

import { api } from "../api/client";
import PrimaryButton from "../components/PrimaryButton";
import Screen from "../components/Screen";
import { colors, spacing } from "../theme";

export default function AssistantScreen() {
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Ask for hostel-friendly swaps, high-protein veg ideas, or a mess dinner adjustment."
    }
  ]);

  async function send() {
    if (!content.trim()) return;
    const userMessage = { role: "user", content };
    setMessages((current) => [...current, userMessage]);
    setContent("");
    try {
      const result = await api.assistant(content);
      setMessages(result.session.messages);
    } catch (error) {
      Alert.alert("Assistant unavailable", error.message);
    }
  }

  return (
    <Screen title="Diet Coach" subtitle="AI-ready chat structure for future diet suggestions." scroll={false}>
      <FlatList
        data={messages}
        keyExtractor={(_, index) => String(index)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.role === "user" ? styles.user : styles.assistant]}>
            <Text style={item.role === "user" ? styles.userText : styles.assistantText}>{item.content}</Text>
          </View>
        )}
      />
      <View style={styles.composer}>
        <TextInput style={styles.input} placeholder="Ask about today's macros..." value={content} onChangeText={setContent} />
        <PrimaryButton title="Send" onPress={send} style={styles.send} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: spacing.md },
  bubble: { borderRadius: 8, padding: spacing.md, marginBottom: spacing.sm, maxWidth: "88%" },
  user: { alignSelf: "flex-end", backgroundColor: colors.green },
  assistant: { alignSelf: "flex-start", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  userText: { color: "#fff", lineHeight: 20 },
  assistantText: { color: colors.ink, lineHeight: 20 },
  composer: { flexDirection: "row", gap: spacing.sm, paddingBottom: 100 },
  input: { flex: 1, minHeight: 48, backgroundColor: colors.surface, borderRadius: 8, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 12 },
  send: { width: 86 }
});

