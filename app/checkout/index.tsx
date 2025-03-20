import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import Checkout from "@/screens/Checkout/CheckoutScreen";

export default function CheckoutScreen() {
    const router = useRouter();

    return (
        <Checkout />
    );
}
