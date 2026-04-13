import { useState, useMemo } from "react";
import { ScrollView, View, Text, TextInput, StyleSheet, useWindowDimensions, Pressable, RefreshControl } from "react-native";
import { Colors } from "@/constants/Colors";
import { useSpinnerijData } from "@/hooks/useSpinnerijData";
import { TenantCard } from "@/components/TenantCard";
import { Dropdown } from "@/components/Dropdown";
import type { Tenant } from "@/constants/types";

export default function HuurdersScreen() {
  const { data, loading, error, refresh } = useSpinnerijData();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { width } = useWindowDimensions();

  const columns = width >= 900 ? 3 : width >= 600 ? 2 : 1;
  const tenants = data?.tenants ?? [];

  const categories = useMemo(
    () => [...new Set(tenants.map((t) => t.category))].sort(),
    [tenants],
  );

  const filtered = useMemo(() => {
    return tenants.filter((t) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        t.wrdtitle.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.room.toLowerCase().includes(q);
      const matchesCategory = !selectedCategory || t.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [tenants, search, selectedCategory]);

  const rows: Array<Tenant[]> = [];
  for (let i = 0; i < filtered.length; i += columns) {
    rows.push(filtered.slice(i, i + columns));
  }

  if (error && !loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorIcon}>⚠</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={refresh}>
          <Text style={styles.retryText}>Opnieuw proberen</Text>
        </Pressable>
      </View>
    );
  }

  if (loading && tenants.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Onze Huurders</Text>
          <Text style={styles.subtitle}>Maak kennis met de ondernemers van De Spinnerij</Text>
          <View style={styles.grid}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={styles.skeletonCard} />
            ))}
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={Colors.primary} />}
    >
      <Text style={styles.title}>Onze Huurders</Text>
      <Text style={styles.subtitle}>Maak kennis met de ondernemers van De Spinnerij</Text>

      <View style={styles.filterContainer}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Zoek op naam, categorie of ruimte..."
            placeholderTextColor={Colors.textLight}
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        </View>
        <Dropdown
          value={selectedCategory}
          placeholder="Alle categorieën"
          options={[
            { label: "Alle categorieën", value: "" },
            ...categories.map((cat) => ({ label: cat, value: cat })),
          ]}
          onChange={setSelectedCategory}
        />
      </View>

      <View style={styles.grid}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((tenant) => (
              <View key={tenant.wrdid} style={{ flex: 1 }}>
                <TenantCard tenant={tenant} />
              </View>
            ))}
            {/* Fill empty spots to maintain grid alignment */}
            {row.length < columns &&
              Array.from({ length: columns - row.length }).map((_, i) => (
                <View key={`empty-${i}`} style={{ flex: 1 }} />
              ))}
          </View>
        ))}
      </View>

      {filtered.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Geen huurders gevonden</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 16,
  },
  filterContainer: {
    marginHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
  },
  grid: {
    paddingHorizontal: 16,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  empty: {
    paddingTop: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textLight,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 32,
  },
  retryButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  skeletonCard: {
    backgroundColor: Colors.skeleton,
    borderRadius: 14,
    height: 180,
    marginBottom: 12,
  },
});
