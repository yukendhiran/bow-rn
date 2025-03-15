import { Tabs } from "expo-router";
import { Home, User, ShoppingCart } from "lucide-react-native";

import { useEffect } from "react";
import { useRouter } from "expo-router";
import { BackHandler } from "react-native";
import { useAuthStore } from "@/store/auth/useAuthStore";

export default function TabsLayout() {
    const { token } = useAuthStore();

    useEffect(() => {
        const backAction = () => {
            if (token) {
                return true; // Prevent back navigation
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, [token]);
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => <Home color={color} />,
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    title: "Cart",
                    tabBarIcon: ({ color }) => <ShoppingCart color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color }) => <User color={color} />,
                }}
            />
        </Tabs>
    );
}
