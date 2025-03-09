import { Stack, Tabs } from "expo-router";

import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

export default function RootLayout() {
  return (<
    GluestackUIProvider mode="light">
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Login' }} />
      <Stack.Screen name="otp" options={{ title: 'Otp' }} />

    </Stack >
  </GluestackUIProvider>);
}


