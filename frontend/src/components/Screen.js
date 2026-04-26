import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../theme";

export default function Screen({ title, subtitle, children, scroll = true, refreshControl }) {
  const Container = scroll ? ScrollView : View;
  return (
    <SafeAreaView style={styles.safe}>
      <Container
        contentContainerStyle={scroll ? styles.content : null}
        refreshControl={scroll ? refreshControl : undefined}
        style={!scroll ? styles.content : null}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {children}
      </Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: 110 },
  header: { marginBottom: spacing.md },
  title: { color: colors.ink, fontSize: 28, fontWeight: "800" },
  subtitle: { color: colors.muted, marginTop: spacing.xs, fontSize: 14, lineHeight: 20 }
});
