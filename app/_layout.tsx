import { Stack, Tabs } from "expo-router";

import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { ActivityIndicator, View } from "react-native";


export default function RootLayout() {

  const { token, loadUser } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await loadUser();
      setLoading(false);
    };
    checkAuth();
  }, []);

  // useEffect(() => {
  //   if (token) {

  //     router.replace("/(tabs)/home"); // Redirect if already logged in
  //   }
  // }, [token]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (<
    GluestackUIProvider mode="light">
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Login' }} />
      <Stack.Screen name="otp" options={{ title: 'Otp' }} />

    </Stack >
  </GluestackUIProvider>);
}


