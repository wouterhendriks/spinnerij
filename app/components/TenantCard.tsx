import { View, Text, Image, StyleSheet, Pressable, Linking } from "react-native";
import { Colors } from "@/constants/Colors";
import type { Tenant } from "@/constants/types";

interface TenantCardProps {
  tenant: Tenant;
}

function getAvatarUrl(name: string): string {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=F4A261&color=fff&size=128&font-size=0.4&bold=true`;
}

export function TenantCard({ tenant }: TenantCardProps) {
  function handleWebsite() {
    Linking.openURL(tenant.website);
  }

  return (
    <View style={styles.card}>
      <View style={styles.logoContainer}>
        <Image source={{ uri: getAvatarUrl(tenant.wrdtitle) }} style={styles.logo} />
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {tenant.wrdtitle}
      </Text>
      <Text style={styles.description} numberOfLines={1}>
        {tenant.description}
      </Text>
      <View style={styles.roomBadge}>
        <Text style={styles.roomText}>{tenant.room}</Text>
      </View>
      <Pressable
        style={({ pressed }) => [styles.websiteLink, pressed && styles.websiteLinkPressed]}
        onPress={handleWebsite}
      >
        <Text style={styles.websiteIcon}>↗</Text>
        <Text style={styles.websiteText}>Website bezoeken</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    flex: 1,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 12,
    height: 80,
    justifyContent: "center",
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: Colors.skeleton,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  roomBadge: {
    backgroundColor: Colors.surfaceWarm,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  roomText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.accent,
  },
  websiteLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: "auto",
  },
  websiteLinkPressed: {
    opacity: 0.6,
  },
  websiteIcon: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: "700",
  },
  websiteText: {
    fontSize: 13,
    color: Colors.accent,
    fontWeight: "600",
  },
});
