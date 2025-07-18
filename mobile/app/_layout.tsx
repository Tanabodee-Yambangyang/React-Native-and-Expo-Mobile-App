import { Stack } from "expo-router";
import SafeScreen from "@/components/SafeScreen";

import "../global.css"

export default function RootLayout() {
  return (
    <SafeScreen>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeScreen>
  );
}
